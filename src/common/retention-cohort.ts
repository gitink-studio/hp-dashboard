/**
 * Cohort retention helpers: only treat D7/D30 as defined once enough calendar
 * time has passed (UTC). Dashboards were averaging immature rows (zeros),
 * which made KPIs and heatmaps look broken.
 */

/** Heatmap columns = days 1–7 (D1–D7). D30 is KPI-only from DailyMetrics. */
export const RETENTION_HEATMAP_DAYS: readonly number[] = [1, 2, 3, 4, 5, 6, 7];

/**
 * End of the selected reporting window (UTC), for cohort maturity vs filter — not always "today".
 */
export function retentionAsOfFromRangeEnd(range: { startDate: string; endDate: string }): Date {
  const { endDate } = range;
  if (endDate.includes('T')) {
    return new Date(endDate);
  }
  const key = endDate.split('T')[0];
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return new Date();
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
}

export function cohortDateKey(dateStr: string): string {
  if (!dateStr) return '';
  return String(dateStr).split('T')[0];
}

/** UTC midnight for the cohort calendar day */
export function parseCohortUtc(dateStr: string): Date {
  const key = cohortDateKey(dateStr);
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}

/**
 * True if `asOf` (calendar UTC) is on or after the cohort's D{lagDays} day.
 * Example: lag 7 for cohort 2026-03-30 → measurable on/after 2026-04-06 UTC.
 */
export function isCohortMatureForLag(
  cohortDateStr: string,
  lagDays: number,
  asOf: Date = new Date(),
): boolean {
  const cohort = parseCohortUtc(cohortDateStr);
  if (Number.isNaN(cohort.getTime())) return false;
  const target = new Date(cohort);
  target.setUTCDate(target.getUTCDate() + lagDays);
  const asDay = Date.UTC(
    asOf.getUTCFullYear(),
    asOf.getUTCMonth(),
    asOf.getUTCDate(),
  );
  const needDay = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  );
  return asDay >= needDay;
}

export type MatureRetentionResult = {
  avg: number;
  hasMature: boolean;
  weight: number;
};

/** Options for {@link weightedRetentionForMatureCohorts}. */
export type WeightedRetentionForMatureOptions = {
  /**
   * When true (e.g. Last 30d / 30d preset): skip the 5% D30 recorded-coverage gate,
   * and if D30-mature cohorts exist but none have non-null retentionD30, show 0% instead of N/A.
   */
  d30KpiRelaxed?: boolean;
};

/** Developer/publisher dashboard presets that use the ~31-day rolling window. */
export function isDashboardLast30dPreset(dateRange: string | undefined): boolean {
  const dr = dateRange ?? '';
  return dr === 'Last 30d' || dr === '30d';
}

function matureCohortInstallWeight(
  daily: { date: string; newUsers?: number }[],
  lagDays: number,
  asOf: Date,
): number {
  let total = 0;
  for (const row of daily) {
    const ds = cohortDateKey(row.date);
    if (!ds || !isCohortMatureForLag(ds, lagDays, asOf)) continue;
    total += Number(row.newUsers) || 0;
  }
  return total;
}

function fieldRecorded(
  row: { [key: string]: unknown },
  field: 'retentionD1' | 'retentionD7' | 'retentionD30',
): boolean {
  const v = row[field];
  return v !== null && v !== undefined;
}

/**
 * Weighted average of `field` over cohorts where D{lagDays} is observable.
 * Falls back to unweighted mean over contributing rows if all newUsers are 0.
 *
 * For D7/D30: rows where the metric was never written (null/undefined in DailyMetrics)
 * are skipped — treating them as 0 was making the KPI show 0.0% after adding D30
 * even when values were simply not backfilled yet.
 */
export function weightedRetentionForMatureCohorts(
  daily: { date: string; newUsers?: number; [key: string]: unknown }[],
  field: 'retentionD1' | 'retentionD7' | 'retentionD30',
  lagDays: number,
  asOf: Date = new Date(),
  options?: WeightedRetentionForMatureOptions,
): MatureRetentionResult {
  let w = 0;
  let s = 0;
  const contributing: typeof daily = [];

  const skipIfMissing = field === 'retentionD7' || field === 'retentionD30';

  for (const row of daily) {
    const ds = cohortDateKey(row.date);
    if (!ds || !isCohortMatureForLag(ds, lagDays, asOf)) continue;

    if (skipIfMissing && !fieldRecorded(row, field)) continue;

    const nu = Number(row.newUsers) || 0;
    const val = Number(row[field]);
    const num = Number.isFinite(val) ? val : 0;
    contributing.push(row);
    s += num * nu;
    w += nu;
  }

  if (contributing.length === 0) {
    if (
      field === 'retentionD30' &&
      lagDays === 30 &&
      options?.d30KpiRelaxed &&
      matureCohortInstallWeight(daily, 30, asOf) > 0
    ) {
      return { avg: 0, hasMature: true, weight: 0 };
    }
    return { avg: 0, hasMature: false, weight: 0 };
  }

  /**
   * D30 KPI: if only a tiny share of *D30-mature* cohort installs have a non-null
   * retentionD30 in DailyMetrics, a weighted average over those rows is misleading
   * (often all zeros from small/noisy cohorts while large cohorts are still null).
   * Treat as "not enough data" → N/A in the UI (hasMature false).
   * Skipped when {@link WeightedRetentionForMatureOptions.d30KpiRelaxed} is true (Last 30d preset).
   */
  if (
    field === 'retentionD30' &&
    lagDays === 30 &&
    !options?.d30KpiRelaxed
  ) {
    const matureInstallWeight = matureCohortInstallWeight(daily, 30, asOf);
    const MIN_RECORDED_SHARE = 0.05;
    if (
      matureInstallWeight > 0 &&
      w < matureInstallWeight * MIN_RECORDED_SHARE
    ) {
      return { avg: 0, hasMature: false, weight: w };
    }
  }

  if (w > 0) {
    return { avg: s / w, hasMature: true, weight: w };
  }
  const simpleAvg =
    contributing.reduce((acc, row) => {
      const v = Number(row[field]);
      return acc + (Number.isFinite(v) ? v : 0);
    }, 0) / contributing.length;
  return { avg: simpleAvg, hasMature: true, weight: 0 };
}

function interpolateD1ToD7(day: number, d1: number, d7: number): number {
  const ratio = (day - 1) / 6;
  return d1 - (d1 - d7) * ratio;
}

function interpolateD7ToD30(day: number, d7: number, d30: number): number {
  const ratio = (day - 7) / 23;
  return d7 - (d7 - d30) * ratio;
}

export type HeatmapCell = {
  value: number | null;
  display: string;
  pending: boolean;
};

/** One heatmap cell: show "—" until that calendar lag has finished (UTC). */
export function heatmapRetentionCell(
  lagDay: number,
  d1: number,
  d7: number,
  d30: number,
  cohortDateStr: string,
  asOf: Date = new Date(),
): HeatmapCell {
  const ds = cohortDateKey(cohortDateStr);
  if (!ds) return { value: null, display: '—', pending: true };

  const mature1 = isCohortMatureForLag(ds, 1, asOf);
  const mature7 = isCohortMatureForLag(ds, 7, asOf);
  const mature30 = isCohortMatureForLag(ds, 30, asOf);

  if (lagDay === 1) {
    if (!mature1) return { value: null, display: '—', pending: true };
    return { value: d1, display: `${d1.toFixed(2)}%`, pending: false };
  }
  if (lagDay === 7) {
    if (!isCohortMatureForLag(ds, 7, asOf)) return { value: null, display: '—', pending: true };
    return { value: d7, display: `${d7.toFixed(2)}%`, pending: false };
  }
  // Days 2–6: show once that day has passed; interpolate D1→D7 using stored D7 when D7 is mature, else 0 as provisional tail (classic UI curve).
  if (lagDay >= 2 && lagDay <= 6) {
    if (!mature1 || !isCohortMatureForLag(ds, lagDay, asOf)) {
      return { value: null, display: '—', pending: true };
    }
    const d7Anchor = mature7 ? d7 : 0;
    const v = interpolateD1ToD7(lagDay, d1, d7Anchor);
    return { value: v, display: `${v.toFixed(2)}%`, pending: false };
  }
  // Days 8–9: need that lag and D7 observed; D30 uses stored value when mature else 0 for interpolation.
  if (lagDay >= 8 && lagDay <= 9) {
    if (!isCohortMatureForLag(ds, lagDay, asOf) || !mature7) {
      return { value: null, display: '—', pending: true };
    }
    const d30Anchor = mature30 ? d30 : 0;
    const v = interpolateD7ToD30(lagDay, d7, d30Anchor);
    return { value: v, display: `${v.toFixed(2)}%`, pending: false };
  }
  return { value: null, display: '—', pending: true };
}
