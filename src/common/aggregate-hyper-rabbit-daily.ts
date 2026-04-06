import {
  type WeightedRetentionForMatureOptions,
  weightedRetentionForMatureCohorts,
} from './retention-cohort';

export type AggregateHyperRabbitDailyOptions = Pick<
  WeightedRetentionForMatureOptions,
  'd30KpiRelaxed'
>;

/**
 * Gross revenue for a single daily row, aligned with developer/publisher revenue tables:
 * prefer `totalRevenue`, fall back to `grossRevenue` when the former is missing.
 */
export function hyperRabbitDailyRowGrossRevenue(d: any): number {
  return Number(d?.totalRevenue ?? d?.grossRevenue) || 0;
}

/**
 * Roll up Hyper Rabbit `DailyMetrics` rows for per-game KPIs (developer + publisher dashboards).
 * Matches weighted D1/D7/D30 maturity rules and publisher crash/fill/ecpm fields.
 */
export function aggregateHyperRabbitDailyMetrics(
  daily: any[],
  retentionAsOf: Date,
  options?: AggregateHyperRabbitDailyOptions,
): Record<string, any> {
  if (!daily.length) return {};
  const asOf = retentionAsOf;
  const d30Opts: WeightedRetentionForMatureOptions | undefined = options?.d30KpiRelaxed
    ? { d30KpiRelaxed: true }
    : undefined;
  const sum = (pick: (d: any) => number) =>
    daily.reduce((s, d) => s + (Number(pick(d)) || 0), 0);
  const last = daily[daily.length - 1];
  const totalSessions = sum(
    (d) => Number(d.numSessions ?? d.sessions) || 0,
  );
  const totalErrors = sum(
    (d) => Number(d.errorCount ?? d.crashes) || 0,
  );
  const totalImp = sum((d) => d.impressions || 0);
  const totalAdRev = sum((d) => d.adRevenue || 0);
  const totalReq = sum((d) => d.adRequested || 0);
  const totalStarted = sum((d) => d.adStarted || 0);

  const r1 = weightedRetentionForMatureCohorts(daily, 'retentionD1', 1, asOf);
  const r7 = weightedRetentionForMatureCohorts(daily, 'retentionD7', 7, asOf);
  const r30 = weightedRetentionForMatureCohorts(
    daily,
    'retentionD30',
    30,
    asOf,
    d30Opts,
  );
  const fallbackD1 =
    daily.reduce((s, d) => s + (Number(d.retentionD1) || 0), 0) / daily.length;

  return {
    dau: Number(last.dau) || 0,
    mau: Number(last.mau) || 0,
    avgSessionLength: sum((d) => d.avgSessionLength || 0) / daily.length,
    levelAttempts: sum((d) => d.levelAttempts || 0),
    winRate: Number(last.winRate) || 0,
    newUsers: sum((d) => d.newUsers || 0),
    iapRevenue: sum((d) => d.iapRevenue || 0),
    adRevenue: totalAdRev,
    totalRevenue: sum((d) => hyperRabbitDailyRowGrossRevenue(d)),
    grossRevenue: sum((d) => hyperRabbitDailyRowGrossRevenue(d)),
    crashRate:
      totalSessions > 0 ? (totalErrors / totalSessions) * 100 : Number(last.crashRate) || 0,
    retentionD1: r1.hasMature ? r1.avg : fallbackD1,
    retentionD7: r7.hasMature ? r7.avg : 0,
    retentionD30: r30.hasMature ? r30.avg : 0,
    retentionD7NoMatureCohorts: !r7.hasMature,
    retentionD30NoMatureCohorts: !r30.hasMature,
    usersAffectedByErrors: sum((d) => d.usersAffectedByErrors || 0),
    geoBreakdown: [],
    totalImpressions: totalImp,
    avgEcpm: totalImp > 0 ? (totalAdRev / totalImp) * 1000 : 0,
    fillRate: totalReq > 0 ? (totalStarted / totalReq) * 100 : 0,
  };
}
