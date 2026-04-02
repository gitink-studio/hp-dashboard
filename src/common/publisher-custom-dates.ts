/** Latest complete daily metrics day — UTC calendar yesterday (today has no finalized data). */
export function getPublisherCustomMaxEndDate(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  return new Date(Date.UTC(y, m, d - 1, 0, 0, 0, 0)).toISOString().split('T')[0];
}

export function clampPublisherCustomRange(start: string, end: string): { start: string; end: string } {
  const maxEnd = getPublisherCustomMaxEndDate();
  let e = end > maxEnd ? maxEnd : end;
  let s = start;
  if (s > e) s = e;
  return { start: s, end: e };
}
