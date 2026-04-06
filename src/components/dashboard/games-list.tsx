import React, { useState, useEffect } from 'react';
import { GRAPHQL_URL, ROOT_URL } from '../../common/constants';
import {
  formatDecimalNumber,
  getDashboardQueryDateBounds,
  getHyperRabbitDailyMetricsRange,
} from '../../common/utils';
import {
  aggregateHyperRabbitDailyMetrics,
  hyperRabbitDailyRowGrossRevenue,
} from '../../common/aggregate-hyper-rabbit-daily';
import {
  heatmapRetentionCell,
  isDashboardLast30dPreset,
  retentionAsOfFromRangeEnd,
  RETENTION_HEATMAP_DAYS,
  weightedRetentionForMatureCohorts,
} from '../../common/retention-cohort';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Collapse,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  MonetizationOn,
  AttachMoney,
  HealthAndSafety,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

interface GamesListProps {
  filters: any;
  onReportsNavigation: (gameName: string) => void;
  /** Called after each games list request finishes (success or error). */
  onFetchSettled?: () => void;
}

export const GamesList: React.FC<GamesListProps> = ({
  filters,
  onReportsNavigation,
  onFetchSettled,
}) => {
  // State for games list fetched from backend
  const [gamesData, setGamesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch games list directly (bypasses ra-data-graphql for reliability)
  useEffect(() => {
    const fetchGamesList = async () => {
      // Role-based: developers see their studio's games via studioId in filters
      const studioId = localStorage.getItem("studioId") || undefined;

      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(GRAPHQL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query GamesList($filters: DashboardFiltersInput!) {
                gamesList(filters: $filters) {
                  id
                  name
                  icon
                  platform
                  subPlatform
                  dau
                  installs
                  cpi
                  revenue
                }
              }
            `,
            variables: {
              filters: {
                studioId: studioId,
                platform: filters.platform ?? 'All',
                subPlatform: filters.subPlatform ?? 'All',
                game: filters.game ?? 'All',
                dateRange: filters.dateRange ?? 'Last 30d',
                ...(() => {
                  const b = getDashboardQueryDateBounds(filters);
                  return b ? { startDate: b.startDate, endDate: b.endDate } : {};
                })(),
              },
            },
          }),
        });

        const result = await response.json();
        if (result.errors) {
          console.error('GamesList GraphQL errors:', result.errors);
          setFetchError(result.errors[0]?.message || 'Failed to load games');
          setGamesData([]);
        } else {
          const list = result.data?.gamesList || [];
          // Sort by DAU descending — highest DAU first
          list.sort((a: any, b: any) => (b.dau || 0) - (a.dau || 0));
          setGamesData(list);
        }
      } catch (err: any) {
        console.error('GamesList fetch error:', err);
        setFetchError(err.message || 'Network error');
        setGamesData([]);
      } finally {
        setIsLoading(false);
        onFetchSettled?.();
      }
    };

    fetchGamesList();
  }, [
    filters.platform,
    filters.subPlatform,
    filters.game,
    filters.dateRange,
    filters.startDate,
    filters.endDate,
    onFetchSettled,
  ]);

  // State for managing expanded games (accordion)
  const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());

  // State for game-specific metrics
  const [gameMetrics, setGameMetrics] = useState<{ [gameId: string]: any }>({});

  // State for daily metrics (for tables)
  const [dailyMetrics, setDailyMetrics] = useState<{ [gameId: string]: any[] }>({});

  // State for cohort retention data
  const [cohortRetentionData, setCohortRetentionData] = useState<{ [gameId: string]: any[] }>({});

  // State for loading indicators
  const [loadingMetrics, setLoadingMetrics] = useState<{ [gameId: string]: boolean }>({});

  // Track ongoing fetches to prevent duplicate requests
  const ongoingFetches = React.useRef<Set<string>>(new Set());
  /** Same range signature as publisher dashboard — refetch daily tables when dates change. */
  const lastFetchedMetricsRangeRef = React.useRef<Record<string, string>>({});

  // Platform / game / subPlatform: list context changed — reset expanded reports and caches
  useEffect(() => {
    setExpandedGames(new Set());
    setGameMetrics({});
    setDailyMetrics({});
    setCohortRetentionData({});
    setLoadingMetrics({});
    ongoingFetches.current.clear();
    lastFetchedMetricsRangeRef.current = {};
  }, [filters.platform, filters.subPlatform, filters.game]);

  // Date only: keep accordions open; invalidate per-game range and refetch (publisher parity)
  useEffect(() => {
    expandedGames.forEach((gameId) => {
      delete lastFetchedMetricsRangeRef.current[gameId];
      ongoingFetches.current.delete(gameId);
    });
    expandedGames.forEach((gameId) => {
      void fetchGameMetrics(gameId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchGameMetrics reads latest filters from closure
  }, [filters.dateRange, filters.startDate, filters.endDate]);

  // Debug: Log gameMetrics changes (commented out to prevent excessive logging)
  // useEffect(() => {
  //   console.log('gameMetrics state updated:', gameMetrics);
  // }, [gameMetrics]);

  // Debug: Log dailyMetrics changes (commented out to prevent excessive logging)
  // useEffect(() => {
  //   console.log('dailyMetrics state updated:', dailyMetrics);
  // }, [dailyMetrics]);

  // Returns a MUI Chip colour variant for a platform name
  const getPlatformColor = (platform?: string): 'default' | 'primary' | 'success' | 'warning' => {
    if (!platform) return 'default';
    const p = platform.toLowerCase();
    if (p === 'android') return 'success';
    if (p === 'ios') return 'primary';
    if (p === 'web') return 'warning';
    return 'default';
  };

  // Helper function to get game icon based on game name
  const getGameIcon = (gameName: string) => {
    const name = gameName.toLowerCase();
    if (name.includes('pickle') || name.includes('ball')) return '🎾';
    if (name.includes('candy') || name.includes('diy')) return '🍬';
    if (name.includes('puzzle') || name.includes('pop')) return '🧩';
    if (name.includes('fruit') || name.includes('jam')) return '🍓';
    if (name.includes('slash') || name.includes('jam')) return '⚔️';
    if (name.includes('sports') || name.includes('arena')) return '🏟️';
    if (name.includes('tower') || name.includes('merge')) return '🏗️';
    if (name.includes('pixel') || name.includes('art')) return '🎨';
    if (name.includes('craft') || name.includes('master')) return '🔨';
    if (name.includes('drift') || name.includes('city')) return '🏎️';
    if (name.includes('archer') || name.includes('rush')) return '🏹';
    if (name.includes('bake') || name.includes('break')) return '🍰';
    if (name.includes('dream') || name.includes('racing')) return '🏁';
    if (name.includes('digital') || name.includes('quest')) return '🎮';
    if (name.includes('hyperrabbit')) return '🐰';
    return '🎮'; // Default icon
  };

  /** Same Hyper Rabbit REST range as publisher daily metrics (rolling end, UTC Today/Yesterday, custom clamp). */
  const getDateRange = () => getHyperRabbitDailyMetricsRange(filters);

  // Fetch per-game reports: single DailyMetrics query (indexed) + client-side KPI rollup.
  // Skips /metrics/:gameId (many heavy EventLog aggregations) and non-existent /retention/cohort.
  const fetchGameMetrics = async (gameId: string) => {
    if (ongoingFetches.current.has(gameId)) {
      return;
    }

    const { startDate, endDate } = getHyperRabbitDailyMetricsRange(filters);
    const rangeSig = `${startDate}|${endDate}`;
    if (lastFetchedMetricsRangeRef.current[gameId] === rangeSig) {
      return;
    }

    try {
      ongoingFetches.current.add(gameId);
      setLoadingMetrics(prev => ({ ...prev, [gameId]: true }));
      const q = `startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      const dailyResponse = await fetch(
        `${ROOT_URL}/hyper-rabbit/metrics/daily/${gameId}?${q}`
      );

      let rows: any[] = [];
      if (dailyResponse.ok) {
        const dailyResult = await dailyResponse.json();
        if (dailyResult.success && Array.isArray(dailyResult.data)) {
          rows = dailyResult.data;
        }
      } else {
        console.error(
          `Daily metrics failed for ${gameId}:`,
          dailyResponse.status,
          await dailyResponse.text().catch(() => '')
        );
      }

      const rolled = aggregateHyperRabbitDailyMetrics(
        rows,
        retentionAsOfFromRangeEnd({ startDate, endDate }),
        isDashboardLast30dPreset(filters.dateRange)
          ? { d30KpiRelaxed: true }
          : undefined,
      );
      setDailyMetrics(prev => ({ ...prev, [gameId]: rows }));
      setGameMetrics(prev => ({ ...prev, [gameId]: rolled }));
      lastFetchedMetricsRangeRef.current[gameId] = rangeSig;
    } catch (error) {
      console.error(`Error fetching daily metrics for game ${gameId}:`, error);
      setDailyMetrics(prev => ({ ...prev, [gameId]: [] }));
      setGameMetrics(prev => ({ ...prev, [gameId]: {} }));
    } finally {
      ongoingFetches.current.delete(gameId);
      setLoadingMetrics(prev => {
        const updated = { ...prev };
        updated[gameId] = false;
        return updated;
      });
    }
  };

  // Developer reports data dynamically generated from backend metrics
  const getDeveloperReports = (gameId: string) => {
    const metrics = gameMetrics[gameId] || {};
    const daily = dailyMetrics[gameId] || [];
    const cohortRetention = cohortRetentionData[gameId] || [];
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Debug logging (simplified)
    const hasMetrics = Object.keys(metrics).length > 0;
    const hasDaily = daily.length > 0;
    const hasCohortRetention = cohortRetention.length > 0;
    const retentionAsOf = retentionAsOfFromRangeEnd(getDateRange());

    // Only log when expanding accordion (when data is fetched)
    if (expandedGames.has(gameId) && hasDaily) {
      console.log(`✅ Reports for ${gameId}:`, {
        metrics: hasMetrics,
        daily: hasDaily,
        cohortRetention: hasCohortRetention,
        sample: daily[0]
      });
    }

    // Format daily data for tables
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Helper function to get heatmap color based on value (0-100 percentage)
    const getHeatmapColor = (value: number, maxValue: number = 100): string => {
      if (value === 0) return '#ffffff'; // White for 0
      const normalized = Math.min(value / maxValue, 1);
      // Create gradient from light blue (#e3f2fd) to darker blue (#1976d2)
      // Using a blue color scheme similar to the image
      const red = Math.floor(227 - (normalized * 30)); // 227 -> 197
      const green = Math.floor(242 - (normalized * 65)); // 242 -> 118
      const blue = Math.floor(253 - (normalized * 55)); // 253 -> 216
      return `rgb(${red}, ${green}, ${blue})`;
    };

    // Calculate max retention value for normalization (aligned with publisher dashboard)
    const calculateMaxRetention = () => {
      if (hasDaily && daily.length > 0) {
        return Math.max(
          ...daily.map((d) =>
            Math.max(
              Number(d.retentionD1) || 0,
              Number(d.retentionD7) || 0,
              Number(d.retentionD30) || 0,
            ),
          ),
        );
      }
      if (hasCohortRetention && cohortRetention.length > 0) {
        const allValues = cohortRetention.flatMap((c: any) => [
          parseFloat(c.d1?.replace('%', '') || '0'),
          parseFloat(c.d7?.replace('%', '') || '0'),
          parseFloat(c.d30?.replace('%', '') || '0'),
        ]);
        return Math.max(...allValues, 0);
      }
      return (
        Math.max(
          Number(metrics.retentionD1) || 0,
          Number(metrics.retentionD7) || 0,
          Number(metrics.retentionD30) || 0,
        ) || 100
      );
    };

    const maxRetention = calculateMaxRetention();

    // Calculate CPI (Cost Per Install) from actual data
    // Use newUsers for installs and adSpend for spend
    const dailyInstalls = hasDaily ? daily.reduce((sum, d) => sum + (d.newUsers || 0), 0) : 0;
    const totalAdSpend = hasDaily ? daily.reduce((sum, d) => sum + (d.adSpend || 0), 0) : 0;
    const cpi = dailyInstalls > 0 ? (totalAdSpend / dailyInstalls) : 0;

    // Calculate ROAS (Return on Ad Spend) - D1/D7/D30 simplified
    const totalRevenue = hasMetrics ? metrics.totalRevenue || 0 : 0;
    const roasD1 = totalAdSpend > 0 ? ((totalRevenue * 0.62) / totalAdSpend * 100) : 0;
    const roasD7 = totalAdSpend > 0 ? ((totalRevenue * 1.28) / totalAdSpend * 100) : 0;
    const roasD30 = totalAdSpend > 0 ? ((totalRevenue * 2.12) / totalAdSpend * 100) : 0;

    return [
      {
        id: 'cpi-trends',
        title: 'CPI Trends',
        type: 'CPI',
        lastRun: today,
        status: 'Open',
        icon: <TrendingUp />,
        color: '#1976d2',
        data: {
          kpi: {
            installs: hasDaily ? formatDecimalNumber(dailyInstalls) : '0',
            spend: hasDaily ? `₹${formatDecimalNumber(totalAdSpend)}` : '₹0.00',
            cpi: hasDaily ? `₹${cpi.toFixed(2)}` : '₹0.00'
          },
          table: hasDaily ? daily.map(d => {
            const installs = d.newUsers || 0;
            const adSpend = d.adSpend || 0;
            // Calculate CPI from adSpend / installs for this day
            // If no installs, use the CPI from metrics if available, otherwise 0
            const dayCpi = installs > 0 ? (adSpend / installs) : (d.cpi || 0);
            const daySpend = adSpend > 0 ? adSpend : (installs > 0 && dayCpi > 0 ? installs * dayCpi : 0);

            return {
              date: formatDate(d.date),
              installs: formatDecimalNumber(installs),
              spend: `₹${formatDecimalNumber(daySpend)}`,
              cpi: `₹${dayCpi.toFixed(2)}`
            };
          }) : []
        }
      },
      {
        id: 'roas-trends',
        title: 'ROAS Trends',
        type: 'ROAS',
        lastRun: today,
        status: 'Open',
        icon: <MonetizationOn />,
        color: '#2e7d32',
        data: {
          kpi: {
            roasD1: hasMetrics ? `${roasD1.toFixed(0)}%` : '0%',
            roasD7: hasMetrics ? `${roasD7.toFixed(0)}%` : '0%',
            roasD30: hasMetrics ? `${roasD30.toFixed(0)}%` : '0%'
          },
          table: hasDaily ? daily.map(d => {
            const totalRevenue = hyperRabbitDailyRowGrossRevenue(d);
            const adSpend = d.adSpend || 0;
            const installs = d.newUsers || 0;
            // Calculate daily spend: use adSpend if available, otherwise calculate from installs * CPI
            const dayCpi = installs > 0 ? (adSpend / installs) : (d.cpi || 0);
            const dailySpend = adSpend > 0 ? adSpend : (installs > 0 && dayCpi > 0 ? installs * dayCpi : 0);

            return {
              date: formatDate(d.date),
              spend: `₹${formatDecimalNumber(dailySpend)}`,
              revD1: `₹${(totalRevenue * 0.62).toFixed(2)}`,
              roas1: `${(totalRevenue > 0 && dailySpend > 0 ? (totalRevenue * 0.62 / dailySpend * 100) : 0).toFixed(0)}%`,
              revD7: `₹${(totalRevenue * 1.28).toFixed(2)}`,
              roas7: `${(totalRevenue > 0 && dailySpend > 0 ? (totalRevenue * 1.28 / dailySpend * 100) : 0).toFixed(0)}%`
            };
          }) : []
        }
      },
      {
        id: 'retention',
        title: 'Retention',
        type: 'Retention',
        lastRun: today,
        status: 'Open',
        icon: <Assessment />,
        color: '#ed6c02',
        data: {
          kpi: (() => {
            if (!hasDaily) {
              return {
                d1: `${Number(metrics.retentionD1 || 0).toFixed(1)}%`,
                d7:
                  metrics.retentionD7NoMatureCohorts === true
                    ? 'N/A'
                    : `${Number(metrics.retentionD7 || 0).toFixed(1)}%`,
                d30:
                  metrics.retentionD30NoMatureCohorts === true
                    ? 'N/A'
                    : metrics.retentionD30 != null
                      ? `${Number(metrics.retentionD30).toFixed(1)}%`
                      : 'N/A',
              };
            }
            const r1 = weightedRetentionForMatureCohorts(
              daily,
              'retentionD1',
              1,
              retentionAsOf,
            );
            const r7 = weightedRetentionForMatureCohorts(
              daily,
              'retentionD7',
              7,
              retentionAsOf,
            );
            const r30 = weightedRetentionForMatureCohorts(
              daily,
              'retentionD30',
              30,
              retentionAsOf,
              isDashboardLast30dPreset(filters.dateRange)
                ? { d30KpiRelaxed: true }
                : undefined,
            );
            const d1Fallback =
              daily.reduce((s, d) => s + (Number(d.retentionD1) || 0), 0) / daily.length;
            return {
              d1: `${(r1.hasMature ? r1.avg : d1Fallback).toFixed(1)}%`,
              d7: r7.hasMature ? `${r7.avg.toFixed(1)}%` : 'N/A',
              d30: r30.hasMature ? `${r30.avg.toFixed(1)}%` : 'N/A',
            };
          })(),
          // Heatmap: prefer DailyMetrics rows (publisher parity); else cohort API; else summary row
          table: (() => {
            let retentionRows: any[] = [];

            if (hasDaily) {
              retentionRows = daily.map((d) => {
                const installs = d.newUsers || 0;
                const d1 = d.retentionD1 ?? 0;
                const d7 = d.retentionD7 ?? 0;
                const d30 = d.retentionD30 ?? 0;
                const dateStr = formatDate(d.date);
                const dayName = new Date(d.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                });

                const row: any = {
                  cohortDate: `${dayName}, ${dateStr} (${formatDecimalNumber(installs)} Users)`,
                  isMean: false,
                };

                for (const day of RETENTION_HEATMAP_DAYS) {
                  const cell = heatmapRetentionCell(day, d1, d7, d30, d.date, retentionAsOf);
                  row[`day${day}`] = {
                    value: cell.value,
                    display: cell.display,
                    pending: cell.pending,
                    color: cell.pending
                      ? '#ffffff'
                      : getHeatmapColor(cell.value ?? 0, maxRetention),
                  };
                }

                return row;
              });
            } else if (hasCohortRetention && cohortRetention.length > 0) {
              retentionRows = cohortRetention.map((cohort: any) => {
                const cohortDate = new Date(cohort.cohort).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });
                const installs = cohort.installs || 0;
                const d1 = parseFloat(cohort.d1?.replace('%', '') || '0');
                const d7 = parseFloat(cohort.d7?.replace('%', '') || '0');
                const d30 = parseFloat(cohort.d30?.replace('%', '') || '0');

                const row: any = {
                  cohortDate: `${cohortDate} (${formatDecimalNumber(installs)} Users)`,
                  isMean: false,
                };

                for (const day of RETENTION_HEATMAP_DAYS) {
                  const cell = heatmapRetentionCell(
                    day,
                    d1,
                    d7,
                    d30,
                    String(cohort.cohort),
                    retentionAsOf,
                  );
                  row[`day${day}`] = {
                    value: cell.value,
                    display: cell.display,
                    pending: cell.pending,
                    color: cell.pending
                      ? '#ffffff'
                      : getHeatmapColor(cell.value ?? 0, maxRetention),
                  };
                }

                return row;
              });
            } else if (hasMetrics) {
              const totalInstalls = metrics.newUsers || 0;
              const d1 = metrics.retentionD1 || 0;
              const d7 = metrics.retentionD7 || 0;
              const d30 = metrics.retentionD30 || 0;

              const row: any = {
                cohortDate: `Overall Period (${formatDecimalNumber(totalInstalls)} Users)`,
                isMean: false,
              };

              for (const day of RETENTION_HEATMAP_DAYS) {
                const cell = heatmapRetentionCell(day, d1, d7, d30, '', retentionAsOf);
                row[`day${day}`] = {
                  value: cell.value,
                  display: cell.display,
                  pending: cell.pending,
                  color: cell.pending
                    ? '#ffffff'
                    : getHeatmapColor(cell.value ?? 0, maxRetention),
                };
              }

              retentionRows = [row];
            }

            // Calculate Mean row if we have data
            if (retentionRows.length > 0) {
              const totalUsers = retentionRows.reduce((sum, row) => {
                const match = row.cohortDate.match(/\(([\d,]+)\s+Users\)/);
                return sum + (match ? parseFloat(match[1].replace(/,/g, '')) : 0);
              }, 0);

              const meanRow: any = {
                cohortDate: `Mean (${formatDecimalNumber(totalUsers)} Users)`,
                isMean: true
              };

              for (const day of RETENTION_HEATMAP_DAYS) {
                const vals = retentionRows
                  .filter((row: any) => !row.isMean)
                  .map((row: any) => row[`day${day}`])
                  .filter((c: any) => c && !c.pending && c.value !== null);
                const avgRetention =
                  vals.length > 0
                    ? vals.reduce((sum: number, c: any) => sum + c.value, 0) / vals.length
                    : 0;
                const allPending = vals.length === 0;

                meanRow[`day${day}`] = {
                  value: allPending ? null : avgRetention,
                  display: allPending ? '—' : `${avgRetention.toFixed(2)}%`,
                  pending: allPending,
                  color: allPending ? '#ffffff' : getHeatmapColor(avgRetention, maxRetention)
                };
              }

              // Add Mean row at the beginning
              retentionRows = [meanRow, ...retentionRows];
            }

            return retentionRows;
          })()
        }
      },
      {
        id: 'revenue-summary',
        title: 'Revenue Summary',
        type: 'Revenue',
        lastRun: today,
        status: 'Open',
        icon: <AttachMoney />,
        color: '#9c27b0',
        data: {
          kpi: {
            gross: hasMetrics ? `₹${formatDecimalNumber(metrics.totalRevenue || 0)}` : '₹0.00',
            iap: hasMetrics ? `₹${formatDecimalNumber(metrics.iapRevenue || 0)}` : '₹0.00',
            ads: hasMetrics ? `₹${formatDecimalNumber(metrics.adRevenue || 0)}` : '₹0.00'
          },
          table: hasDaily ? daily.map(d => {
            const totalRevenue = hyperRabbitDailyRowGrossRevenue(d);
            const iapRevenue = d.iapRevenue || 0;
            const adRevenue = d.adRevenue || 0;
            return {
              date: formatDate(d.date),
              gross: `₹${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              iap: `₹${iapRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              ads: `₹${adRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            };
          }) : []
        }
      },
      {
        id: 'crash-rate',
        title: 'Crash Rate',
        type: 'Crashes',
        lastRun: today,
        status: 'Open',
        icon: <HealthAndSafety />,
        color: '#d32f2f',
        data: {
          kpi: (() => {
            const daySessions = (d: any) =>
              Number(d.numSessions ?? d.sessions) || 0;
            const dayCrashes = (d: any) =>
              Number(d.errorCount ?? d.crashes) || 0;
            const totalSessions = hasDaily
              ? daily.reduce((s, d) => s + daySessions(d), 0)
              : 0;
            const totalCrashes = hasDaily
              ? daily.reduce((s, d) => s + dayCrashes(d), 0)
              : 0;
            const crashPct =
              totalSessions > 0
                ? (totalCrashes / totalSessions) * 100
                : totalCrashes > 0
                  ? null
                  : 0;
            return {
              sessions: hasDaily
                ? formatDecimalNumber(totalSessions)
                : '0',
              crashes: hasDaily
                ? formatDecimalNumber(totalCrashes)
                : '0',
              crashRate:
                crashPct == null
                  ? 'N/A'
                  : `${Number(crashPct).toFixed(2)}%`,
            };
          })(),
          table: hasDaily ? daily.map(d => ({
            date: formatDate(d.date),
            sessions: formatDecimalNumber(d.numSessions || d.sessions || 0),
            crashes: formatDecimalNumber(d.errorCount || d.crashes || 0),
            crashRate: `${(d.crashRate || 0).toFixed(2)}%`
          })) : []
        }
      }
    ];
  };

  // Handle accordion expansion
  const handleToggleExpanded = (gameId: string, event?: React.MouseEvent) => {
    // Prevent event propagation to avoid double-toggle
    if (event) {
      event.stopPropagation();
    }

    const newExpanded = new Set(expandedGames);
    if (newExpanded.has(gameId)) {
      newExpanded.delete(gameId);
    } else {
      newExpanded.add(gameId);
      // Fetch metrics when expanding accordion
      fetchGameMetrics(gameId);
    }
    setExpandedGames(newExpanded);
  };


  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Games List
        </Typography>
        <Typography>Loading games...</Typography>
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Games List
        </Typography>
        <Typography color="error">Error loading games: {fetchError}</Typography>
      </Box>
    );
  }

  if (!gamesData || gamesData.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Games List
        </Typography>
        <Typography>No games found for the selected filters.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Games List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game</TableCell>
              <TableCell>DAU</TableCell>
              {/* Installs - Only for Major Stores */}
              {filters.platform !== 'Web' && filters.platform !== 'All' && (
                <TableCell>Installs</TableCell>
              )}
              {/* CPI - Only for Major Stores */}
              {filters.platform !== 'Web' && filters.platform !== 'All' && (
                <TableCell>CPI</TableCell>
              )}
              <TableCell>Revenue</TableCell>
              <TableCell>Reports</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gamesData.map((game: any) => (
              <React.Fragment key={game.id}>
                {/* Main Game Row */}
                <TableRow
                  hover
                  onClick={() => handleToggleExpanded(game.id)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" sx={{ pl: 2 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleExpanded(game.id, e);
                        }}
                        sx={{ mr: 1 }}
                      >
                        {expandedGames.has(game.id) ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {getGameIcon(game.name)}
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {game.name}
                          </Typography>
                          {game.platform && (
                            <Chip
                              label={game.platform}
                              size="small"
                              color={getPlatformColor(game.platform)}
                              variant="outlined"
                              sx={{ height: 18, fontSize: '0.65rem', lineHeight: 1 }}
                            />
                          )}
                          {game.platform?.toLowerCase() === 'web' && game.subPlatform && (
                            <Chip
                              label={game.subPlatform}
                              size="small"
                              color="default"
                              variant="filled"
                              sx={{ height: 18, fontSize: '0.65rem', lineHeight: 1, backgroundColor: '#e3f2fd', color: '#0d47a1' }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          (📊) DAU: {formatDecimalNumber(game.dau || 0)}
                          {filters.platform !== 'Web' && (
                            <> • Installs: {formatDecimalNumber(game.installs || 0)}k • CPI: ₹{(game.cpi || 0).toFixed(2)}</>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDecimalNumber(game.dau || 0)}</TableCell>
                  {/* Installs - Only for Major Stores */}
                  {filters.platform !== 'Web' && filters.platform !== 'All' && (
                    <TableCell>{formatDecimalNumber(game.installs || 0)}</TableCell>
                  )}
                  {/* CPI - Only for Major Stores */}
                  {filters.platform !== 'Web' && filters.platform !== 'All' && (
                    <TableCell>₹{formatDecimalNumber(game.cpi || 0)}</TableCell>
                  )}
                  <TableCell>₹{formatDecimalNumber(game.revenue || 0)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" color="textSecondary">
                        {expandedGames.has(game.id) ? 'Hide Reports' : 'Show Reports'}
                      </Typography>
                      <Tooltip title="View Reports">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReportsNavigation(game.name);
                          }}
                          color="primary"
                        >
                          <Assessment fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>

                {/* Reports Accordion Row */}
                <TableRow>
                  <TableCell colSpan={filters.platform === 'Web' ? 5 : 7} sx={{ p: 0 }}>
                    <Collapse in={expandedGames.has(game.id)} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 3, backgroundColor: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
                        <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold', textAlign: 'center' }}>
                          📊 Developer Reports - {game.name}
                        </Typography>

                        {/* Loading Spinner */}
                        {loadingMetrics[game.id] && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <CircularProgress size={60} thickness={4} />
                              <Typography variant="h6" sx={{ mt: 2, color: '#666' }}>
                                Loading metrics...
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        {/* Reports with Data Tables - Only show when not loading and data is available */}
                        {!loadingMetrics[game.id] && getDeveloperReports(game.id).map((report) => (
                          <Card key={report.id} sx={{ mb: 3, border: `2px solid ${report.color}30` }}>
                            <CardContent sx={{ p: 3 }}>
                              {/* Report Header */}
                              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                <Box display="flex" alignItems="center">
                                  <Box sx={{ color: report.color, mr: 2, fontSize: '1.5rem' }}>
                                    {report.icon}
                                  </Box>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: report.color }}>
                                      {report.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      Type: {report.type} • Last Run: {report.lastRun}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={report.status}
                                  size="medium"
                                  color="success"
                                  variant="outlined"
                                />
                              </Box>

                              {/* KPI Summary */}
                              <Box sx={{ mb: 3, p: 2, backgroundColor: `${report.color}10`, borderRadius: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                  KPI Summary
                                </Typography>
                                <Box display="flex" gap={3} flexWrap="wrap">
                                  {Object.entries(report.data.kpi).map(([key, value]) => (
                                    <Box key={key} textAlign="center">
                                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: report.color }}>
                                        {value}
                                      </Typography>
                                      <Typography variant="caption" color="textSecondary">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                                {report.id === 'retention' && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 1.5, maxWidth: 720, lineHeight: 1.5 }}
                                  >
                                    The table shows days 1–7 after each cohort date. D30 is a weighted KPI from
                                    DailyMetrics (cohort day +30, UTC); it is not a column. N/A if too few installs are
                                    in D30-mature cohorts with a recorded retentionD30—backfill the full selected
                                    range. True 0% only with enough measured cohorts and a weighted average that rounds
                                    to zero.
                                  </Typography>
                                )}
                              </Box>

                              {/* Data Table */}
                              {report.data.table && report.data.table.length > 0 && (
                                <Box sx={{ overflowX: 'auto' }}>
                                  {report.id === 'retention' ? (
                                    // Heatmap format for retention table
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow sx={{ backgroundColor: `${report.color}20` }}>
                                          <TableCell sx={{ fontWeight: 'bold', position: 'sticky', left: 0, backgroundColor: `${report.color}20`, zIndex: 1 }}>
                                            Cohort Date
                                          </TableCell>
                                          {RETENTION_HEATMAP_DAYS.map((day) => (
                                            <TableCell key={day} sx={{ fontWeight: 'bold', textAlign: 'center', minWidth: '80px' }}>
                                              {day}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {report.data.table.map((row: any, index: number) => (
                                          <TableRow key={index} hover>
                                            <TableCell
                                              sx={{
                                                fontWeight: row.isMean ? 'bold' : 'normal',
                                                position: 'sticky',
                                                left: 0,
                                                backgroundColor: row.isMean ? '#f5f5f5' : '#ffffff',
                                                zIndex: 1
                                              }}
                                            >
                                              {row.cohortDate}
                                            </TableCell>
                                            {RETENTION_HEATMAP_DAYS.map((day) => {
                                              const dayData = row[`day${day}`];
                                              const localMax = Math.max(
                                                0,
                                                ...report.data.table.flatMap((r: any) =>
                                                  RETENTION_HEATMAP_DAYS.map((d) => {
                                                    const c = r[`day${d}`];
                                                    return c && !c.pending && c.value != null ? c.value : 0;
                                                  }),
                                                ),
                                              );
                                              const v = dayData?.value;
                                              return (
                                                <TableCell
                                                  key={day}
                                                  sx={{
                                                    textAlign: 'center',
                                                    backgroundColor: dayData?.color || '#ffffff',
                                                    color:
                                                      typeof v === 'number' && v > localMax * 0.5
                                                        ? '#ffffff'
                                                        : '#000000',
                                                    fontWeight: 'medium',
                                                    minWidth: '80px'
                                                  }}
                                                >
                                                  {dayData?.display ?? '—'}
                                                </TableCell>
                                              );
                                            })}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    // Generic table format for other reports
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow sx={{ backgroundColor: `${report.color}20` }}>
                                          {Object.keys(report.data.table[0]).map((header) => (
                                            <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                                              {header.charAt(0).toUpperCase() + header.slice(1)}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {report.data.table.map((row: any, index: number) => (
                                          <TableRow key={index} hover>
                                            {Object.values(row).map((cell: any, cellIndex: number) => (
                                              <TableCell key={cellIndex}>
                                                {typeof cell === 'object' && cell !== null && 'display' in cell ? cell.display : cell}
                                              </TableCell>
                                            ))}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  )}
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
