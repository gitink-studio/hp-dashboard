import React, { useState, useEffect, useRef, useMemo } from 'react';
import { formatDecimalNumber, getHyperRabbitDailyMetricsRange } from '../../common/utils';
import { formatPublisherMoney, formatPublisherMoneyFixed } from '../../common/currency-utils';
import { ROOT_URL, GRAPHQL_URL } from '../../common/constants';
import {
  clampPublisherCustomRange,
  getPublisherCustomMaxEndDate,
} from '../../common/publisher-custom-dates';
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
import { PublisherKPIs } from '../dashboard/publisher-kpis';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Grid,
  TextField,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Collapse,
} from '@mui/material';
import {
  Assessment,
  AttachMoney,
  HealthAndSafety,
  ExpandMore,
  ExpandLess,
  MonetizationOn,
  TrendingUp,
} from '@mui/icons-material';

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
  if (name.includes('neon') || name.includes('runner')) return '💫';
  if (name.includes('hyper') || name.includes('rabbit')) return '🐰';
  if (name.includes('space') || name.includes('runner')) return '🚀';
  if (name.includes('action') || name.includes('hero')) return '🦸';
  if (name.includes('adventure')) return '🗺️';
  if (name.includes('racing') || name.includes('elite')) return '🏎️';
  return '🎮'; // Default game icon
};

const getPlatformColor = (platform?: string): 'default' | 'primary' | 'success' | 'warning' => {
  if (!platform) return 'default';
  const p = platform.toLowerCase();
  if (p === 'android') return 'success';
  if (p === 'ios') return 'primary';
  if (p === 'web') return 'warning';
  return 'default';
};

const normalizeGameNameKey = (name: string | undefined) => (name || '').trim().toLowerCase();

/** One row per game id; same display name on different platforms gets a disambiguated label. */
const getPublisherGameFilterOptions = (games: any[]): { game: any; label: string }[] => {
  const byId = new Map<string, any>();
  for (const g of games || []) {
    if (g?.id != null && g.id !== '' && !byId.has(g.id)) {
      byId.set(g.id, g);
    }
  }
  const unique = Array.from(byId.values());
  const nameCounts = new Map<string, number>();
  for (const g of unique) {
    const k = normalizeGameNameKey(g.name);
    nameCounts.set(k, (nameCounts.get(k) || 0) + 1);
  }
  return unique.map((g) => {
    const ambiguousName = (nameCounts.get(normalizeGameNameKey(g.name)) || 0) > 1;
    const base = g.name || 'Untitled';
    if (!ambiguousName) {
      return { game: g, label: base };
    }
    const plat = g.platform || 'Unknown';
    const sub =
      g.subPlatform && String(g.platform || '').toLowerCase() === 'web'
        ? ` · ${g.subPlatform}`
        : '';
    return { game: g, label: `${base} (${plat}${sub})` };
  });
};

/** Shared date fields for publisher GraphQL (matches backend getDateRange custom branch). */
function buildPublisherDateFilters(f: {
  dateRange: string;
  customStartDate?: string;
  customEndDate?: string;
}): { dateRange: string; startDate?: string; endDate?: string } {
  const out: { dateRange: string; startDate?: string; endDate?: string } = {
    dateRange: f.dateRange,
  };
  if (f.dateRange === 'Custom' && f.customStartDate && f.customEndDate) {
    const { start, end } = clampPublisherCustomRange(f.customStartDate, f.customEndDate);
    out.startDate = start;
    out.endDate = `${end}T23:59:59.999Z`;
  }
  return out;
}

export const PublisherGamesList: React.FC = () => {
  const [filters, setFilters] = useState({
    studio: "All",
    platform: "All",
    subPlatform: "All",
    game: "All",
    dateRange: "30d",
    currency: "INR",
    customStartDate: "",
    customEndDate: "",
  });

  // State for managing expanded games (accordion)
  const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());

  // State for managing expanded studios (accordion)
  const [expandedStudios, setExpandedStudios] = useState<Set<string>>(new Set());

  // Per-studio report data (global state caused wrong data when multiple studios)
  const [studioGeoByKey, setStudioGeoByKey] = useState<Record<string, any[]>>({});
  const [studioPayoutByKey, setStudioPayoutByKey] = useState<Record<string, any>>({});
  const [loadingStudioKey, setLoadingStudioKey] = useState<string | null>(null);

  // State for game-specific metrics (live data from Hyper Rabbit SDK)
  const [gameMetrics, setGameMetrics] = useState<{ [gameId: string]: any }>({});
  const [dailyMetrics, setDailyMetrics] = useState<{ [gameId: string]: any[] }>({});
  const [loadingMetrics, setLoadingMetrics] = useState<{ [gameId: string]: boolean }>({});

  // Track ongoing fetches to prevent duplicate requests
  const ongoingFetches = useRef<Set<string>>(new Set());
  /** Skip refetch only when we already loaded this game for the same start/end range (date filter changes must reload). */
  const lastFetchedMetricsRangeRef = useRef<Record<string, string>>({});

  const handleToggleExpanded = async (gameId: string) => {
    const newExpanded = new Set(expandedGames);
    const isExpanding = !newExpanded.has(gameId);

    if (isExpanding) {
      newExpanded.add(gameId);
      setExpandedGames(newExpanded);

      // Fetch metrics when expanding
      await fetchGameMetrics(gameId);
    } else {
      newExpanded.delete(gameId);
      setExpandedGames(newExpanded);
    }
  };

  /** Shared with developer dashboard — Hyper Rabbit daily/metrics REST query bounds. */
  const getDateRange = () =>
    getHyperRabbitDailyMetricsRange({
      dateRange: filters.dateRange,
      customStartDate: filters.customStartDate,
      customEndDate: filters.customEndDate,
    });

  // Fetch game metrics from backend
  const fetchGameMetrics = async (gameId: string) => {
    if (ongoingFetches.current.has(gameId)) {
      return;
    }

    const { startDate, endDate } = getDateRange();
    const rangeSig = `${startDate}|${endDate}`;
    if (lastFetchedMetricsRangeRef.current[gameId] === rangeSig) {
      return;
    }

    try {
      ongoingFetches.current.add(gameId);
      setLoadingMetrics(prev => ({ ...prev, [gameId]: true }));

      const q = (v: string) => encodeURIComponent(v);
      const dailyUrl = `${ROOT_URL}/hyper-rabbit/metrics/daily/${gameId}?startDate=${q(startDate)}&endDate=${q(endDate)}`;
      const metricsUrl = `${ROOT_URL}/hyper-rabbit/metrics/${gameId}?startDate=${q(startDate)}&endDate=${q(endDate)}`;

      const dailyResponse = await fetch(dailyUrl);
      let dailyRows: any[] = [];
      if (dailyResponse.ok) {
        const dailyResult = await dailyResponse.json();
        if (dailyResult.success && Array.isArray(dailyResult.data)) {
          dailyRows = dailyResult.data;
        }
      }

      if (dailyRows.length > 0) {
        const retentionAsOf = retentionAsOfFromRangeEnd({ startDate, endDate });
        setDailyMetrics(prev => ({ ...prev, [gameId]: dailyRows }));
        setGameMetrics(prev => ({
          ...prev,
          [gameId]: aggregateHyperRabbitDailyMetrics(
            dailyRows,
            retentionAsOf,
            isDashboardLast30dPreset(filters.dateRange)
              ? { d30KpiRelaxed: true }
              : undefined,
          ),
        }));
        lastFetchedMetricsRangeRef.current[gameId] = rangeSig;
        return;
      }

      const metricsResponse = await fetch(metricsUrl);
      let metricsOk = false;
      if (metricsResponse.ok) {
        const result = await metricsResponse.json();
        if (result.success && result.data) {
          metricsOk = true;
          setGameMetrics(prev => ({
            ...prev,
            [gameId]: result.data,
          }));
        }
      }

      if (metricsOk) {
        lastFetchedMetricsRangeRef.current[gameId] = rangeSig;
      }
    } catch (error) {
      console.error(`Error fetching metrics for game ${gameId}:`, error);
    } finally {
      ongoingFetches.current.delete(gameId);
      setLoadingMetrics(prev => ({ ...prev, [gameId]: false }));
    }
  };

  // Reload per-game report tables when date range changes (expanded rows were stuck on old multi-day cache).
  useEffect(() => {
    expandedGames.forEach((gameId) => {
      delete lastFetchedMetricsRangeRef.current[gameId];
      ongoingFetches.current.delete(gameId);
    });
    expandedGames.forEach((gameId) => {
      void fetchGameMetrics(gameId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- expand path calls fetchGameMetrics directly
  }, [filters.dateRange, filters.customStartDate, filters.customEndDate]);

  // Publisher reports data dynamically generated from backend metrics
  const getPublisherReports = (gameId: string) => {
    const metrics = gameMetrics[gameId] || {};
    const daily = dailyMetrics[gameId] || [];
    const hasDaily = daily.length > 0;
    const retentionAsOf = retentionAsOfFromRangeEnd(getDateRange());
    const sumDaily = (pick: (d: any) => number) =>
      daily.reduce((sum, d) => sum + (Number(pick(d)) || 0), 0);
    const geoBreakdown = metrics.geoBreakdown || [];
    const geoGrossSum = geoBreakdown.reduce(
      (s: number, g: any) => s + (Number(g.revenue) || 0),
      0,
    );

    const formatNumber = (num: number) => formatDecimalNumber(num);
    const cur = filters.currency;
    const money = (n: number) => formatPublisherMoney(Number(n) || 0, cur);
    const moneyF = (n: number, digits = 2) => formatPublisherMoneyFixed(Number(n) || 0, cur, digits);

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Helper function to get heatmap color based on value (0-100 percentage)
    const getHeatmapColor = (value: number, maxValue: number = 100): string => {
      if (value === 0) return '#ffffff'; // White for 0
      const normalized = Math.min(value / maxValue, 1);
      // Create gradient from light blue (#e3f2fd) to darker blue (#1976d2)
      const red = Math.floor(227 - (normalized * 30)); // 227 -> 197
      const green = Math.floor(242 - (normalized * 65)); // 242 -> 118
      const blue = Math.floor(253 - (normalized * 55)); // 253 -> 216
      return `rgb(${red}, ${green}, ${blue})`;
    };

    // Calculate max retention value for normalization
    const calculateMaxRetention = () => {
      if (daily.length > 0) {
        return Math.max(...daily.map(d => Math.max(
          d.retentionD1 || 0,
          d.retentionD7 || 0,
          d.retentionD30 || 0
        )));
      }
      return Math.max(
        metrics.retentionD1 || 0,
        metrics.retentionD7 || 0,
        metrics.retentionD30 || 0
      ) || 100;
    };

    const maxRetention = calculateMaxRetention();

    return [
      {
        id: 'cpi-trends',
        title: 'CPI Trends',
        type: 'CPI',
        icon: <TrendingUp />,
        color: '#1976d2',
        data: {
          kpi: {
            // Calculate totals from daily data
            installs: formatNumber(daily.reduce((sum, day) => sum + (day.newUsers || 0), 0)),
            spend: money(daily.reduce((sum, day) => sum + (day.adSpend || 0), 0)),
            cpi: (() => {
              const totalInstalls = daily.reduce((sum, day) => sum + (day.newUsers || 0), 0);
              const totalSpend = daily.reduce((sum, day) => sum + (day.adSpend || 0), 0);
              const avgCpi = totalInstalls > 0 ? totalSpend / totalInstalls : 0;
              return moneyF(avgCpi, 2);
            })()
          },
          table: daily.map(day => {
            const installs = day.newUsers || 0;
            const adSpend = day.adSpend || 0;
            // Calculate CPI: if we have installs and adSpend, use adSpend/installs
            // Otherwise, if we have CPI from metrics, use that. Otherwise, 0
            let cpi = 0;
            if (installs > 0 && adSpend > 0) {
              cpi = adSpend / installs;
            } else if (day.cpi && day.cpi > 0) {
              cpi = day.cpi;
            }

            // Spend should be adSpend if available, otherwise calculate from installs * cpi, otherwise 0
            const spend = adSpend > 0 ? adSpend : (installs > 0 && cpi > 0 ? installs * cpi : 0);

            return {
              date: formatDate(day.date),
              installs: formatNumber(installs),
              spend: money(spend),
              cpi: moneyF(cpi, 2)
            };
          })
        }
      },
      {
        id: 'roas-trends',
        title: 'ROAS Trends',
        type: 'ROAS',
        icon: <TrendingUp />,
        color: '#2e7d32',
        data: {
          kpi: (() => {
            const totalAdSpend = sumDaily(d => d.adSpend || 0);
            const totalRevenue = hasDaily
              ? sumDaily(d => hyperRabbitDailyRowGrossRevenue(d))
              : Number(metrics.totalRevenue) || 0;
            const roas = totalAdSpend > 0 ? (totalRevenue / totalAdSpend) * 100 : 0;
            return {
              totalRevenue: money(totalRevenue),
              adSpend: money(totalAdSpend),
              roas: `${roas.toFixed(0)}%`
            };
          })(),
          table: daily.map(day => {
            const adSpend = day.adSpend || 0;
            const revenue = hyperRabbitDailyRowGrossRevenue(day);
            const roas = adSpend > 0 ? (revenue / adSpend) * 100 : 0;
            return {
              date: formatDate(day.date),
              adSpend: money(adSpend),
              revenue: money(revenue),
              roas: `${roas.toFixed(0)}%`
            };
          })
        }
      },
      {
        id: 'retention',
        title: 'Retention',
        type: 'Retention',
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
            const r1 = weightedRetentionForMatureCohorts(daily, 'retentionD1', 1, retentionAsOf);
            const r7 = weightedRetentionForMatureCohorts(daily, 'retentionD7', 7, retentionAsOf);
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
          // Heatmap format: rows are cohorts/dates, columns are days 1-9
          table: (() => {
            let retentionRows: any[] = [];

            if (daily.length > 0) {
              retentionRows = daily.map(d => {
                const installs = d.newUsers || 0;
                const d1 = d.retentionD1 || 0;
                const d7 = d.retentionD7 || 0;
                const d30 = d.retentionD30 || 0;
                const dateStr = formatDate(d.date);
                const dayName = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });

                // Create row with date and retention for each day (1-9)
                const row: any = {
                  cohortDate: `${dayName}, ${dateStr} (${formatNumber(installs)} Users)`,
                  isMean: false
                };

                // Calculate retention for days 1-9
                for (const day of RETENTION_HEATMAP_DAYS) {
                  const cell = heatmapRetentionCell(day, d1, d7, d30, d.date, retentionAsOf);
                  row[`day${day}`] = {
                    value: cell.value,
                    display: cell.display,
                    pending: cell.pending,
                    color: cell.pending ? '#ffffff' : getHeatmapColor(cell.value ?? 0, maxRetention)
                  };
                }

                return row;
              });
            } else {
              // Fallback to summary data if no daily data
              const totalInstalls = metrics.newUsers || 0;
              const d1 = metrics.retentionD1 || 0;
              const d7 = metrics.retentionD7 || 0;
              const d30 = metrics.retentionD30 || 0;

              const row: any = {
                cohortDate: `Overall Period (${formatNumber(totalInstalls)} Users)`,
                isMean: false
              };

              // Calculate retention for days 1-9
              for (const day of RETENTION_HEATMAP_DAYS) {
                const cell = heatmapRetentionCell(day, d1, d7, d30, '', retentionAsOf);
                row[`day${day}`] = {
                  value: cell.value,
                  display: cell.display,
                  pending: cell.pending,
                  color: cell.pending ? '#ffffff' : getHeatmapColor(cell.value ?? 0, maxRetention)
                };
              }

              retentionRows = [row];
            }

            // Calculate Mean row if we have data
            if (retentionRows.length > 0) {
              const totalUsers = retentionRows.reduce((sum, row) => {
                const match = row.cohortDate.match(/\(([\d,]+)\s+Users\)/);
                if (match) {
                  const userCount = parseFloat(match[1].replace(/,/g, '')) || 0;
                  return sum + userCount;
                }
                return sum;
              }, 0);

              const meanRow: any = {
                cohortDate: `Mean (${formatNumber(totalUsers)} Users)`,
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
        icon: <AttachMoney />,
        color: '#9c27b0',
        data: {
          kpi: {
            gross: money(
              hasDaily
                ? sumDaily(d => hyperRabbitDailyRowGrossRevenue(d))
                : Number(metrics.totalRevenue) || 0,
            ),
            iap: money(
              hasDaily
                ? sumDaily(d => d.iapRevenue || 0)
                : Number(metrics.iapRevenue) || 0,
            ),
            ads: money(
              hasDaily
                ? sumDaily(d => d.adRevenue || 0)
                : Number(metrics.adRevenue) || 0,
            ),
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            gross: money(hyperRabbitDailyRowGrossRevenue(day)),
            iap: money(day.iapRevenue || 0),
            ads: money(day.adRevenue || 0)
          }))
        }
      },
      {
        id: 'crash-rate',
        title: 'Crash Rate',
        type: 'Crashes',
        icon: <HealthAndSafety />,
        color: '#d32f2f',
        data: {
          kpi: (() => {
            const totalSessions = hasDaily
              ? sumDaily(d => d.numSessions || 0)
              : 0;
            const totalErrors = hasDaily
              ? sumDaily(d => d.errorCount || 0)
              : 0;
            const totalUsersAff = hasDaily
              ? sumDaily(d => d.usersAffectedByErrors || 0)
              : 0;
            const crashPct =
              hasDaily && totalSessions > 0
                ? (totalErrors / totalSessions) * 100
                : Number(metrics.crashRate) || 0;
            return {
              crashRate: `${crashPct.toFixed(2)}%`,
              errors: formatNumber(totalErrors),
              usersAffected: formatNumber(
                hasDaily ? totalUsersAff : metrics.usersAffectedByErrors || 0,
              ),
            };
          })(),
          table: daily.map(day => ({
            date: formatDate(day.date),
            sessions: formatNumber(day.numSessions || 0),
            errors: formatNumber(day.errorCount || 0),
            usersAffected: formatNumber(day.usersAffectedByErrors || 0),
            crashRate: `${(day.crashRate || 0).toFixed(2)}%`
          }))
        }
      },
      {
        id: 'revenue-by-geo',
        title: 'Revenue by Geo',
        type: 'Financial',
        icon: <AttachMoney />,
        color: '#1976d2',
        data: {
          kpi: {
            gross: money(
              geoBreakdown.length > 0
                ? geoGrossSum
                : Number(metrics.totalRevenue) || 0,
            ),
            net: money(
              (geoBreakdown.length > 0 ? geoGrossSum : Number(metrics.totalRevenue) || 0) *
                0.7,
            ),
            payoutDue: money(
              (geoBreakdown.length > 0 ? geoGrossSum : Number(metrics.totalRevenue) || 0) *
                0.6,
            ),
          },
          table: geoBreakdown.map((geo: any) => ({
            country: geo.country,
            installs: formatNumber(geo.installs || 0),
            grossRev: money(geo.revenue || 0),
            revShare: '30%',
            netRev: money((geo.revenue || 0) * 0.7),
            payoutDue: money((geo.revenue || 0) * 0.6)
          }))
        }
      },
      {
        id: 'ecpm-fill-rate',
        title: 'eCPM & Fill Rate',
        type: 'Monetization',
        icon: <MonetizationOn />,
        color: '#673ab7',
        data: {
          kpi: (() => {
            const totalImp = hasDaily
              ? sumDaily(d => d.impressions || 0)
              : Number(metrics.totalImpressions) || 0;
            const totalAdRev = hasDaily
              ? sumDaily(d => d.adRevenue || 0)
              : Number(metrics.adRevenue) || 0;
            const ecpmVal =
              totalImp > 0
                ? (totalAdRev / totalImp) * 1000
                : Number(metrics.avgEcpm) || 0;
            const totalReq = hasDaily ? sumDaily(d => d.adRequested || 0) : 0;
            const totalStarted = hasDaily
              ? sumDaily(d => d.adStarted || 0)
              : 0;
            // Period fill rate = Σ starts / Σ requests (matches summing the underlying events)
            const fillVal =
              hasDaily && totalReq > 0
                ? (totalStarted / totalReq) * 100
                : Number(metrics.fillRate) || 0;
            return {
              ecpm: moneyF(ecpmVal, 2),
              fillRate: `${fillVal.toFixed(1)}%`,
              impressions: formatNumber(
                hasDaily ? totalImp : Number(metrics.totalImpressions) || 0,
              ),
            };
          })(),
          table: daily.map(day => {
            const imp = Number(day.impressions) || 0;
            const adv = Number(day.adRevenue) || 0;
            const rowEcpm =
              day.avgEcpm != null && Number(day.avgEcpm) > 0
                ? Number(day.avgEcpm)
                : imp > 0
                  ? (adv / imp) * 1000
                  : 0;
            const req = Number(day.adRequested) || 0;
            const started = Number(day.adStarted) || 0;
            const rowFill =
              req > 0 ? (started / req) * 100 : Number(day.fillRate) || 0;
            return {
              date: formatDate(day.date),
              ecpm: moneyF(rowEcpm, 2),
              fillRate: `${rowFill.toFixed(1)}%`,
              impressions: formatNumber(imp),
            };
          }),
        }
      }
    ];
  };

  const loadStudioReports = async (studioKey: string, studioFilter: string) => {
    setLoadingStudioKey(studioKey);
    try {
      const geoResponse = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query RevenueByGeo($filters: PublisherFiltersInput!) {
              revenueByGeo(filters: $filters) {
                country
                installs
                grossRevenue
                revenueShare
                netRevenue
                payoutDue
              }
            }
          `,
          variables: {
            filters: {
              studio: studioFilter,
              game: 'All',
              currency: filters.currency,
              ...buildPublisherDateFilters(filters),
            }
          }
        })
      });
      const geoResult = await geoResponse.json();
      const geo = geoResult.data?.revenueByGeo ?? [];
      setStudioGeoByKey(prev => ({ ...prev, [studioKey]: geo }));

      const payoutResponse = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query PayoutSummary($filters: PublisherFiltersInput!) {
              payoutSummary(filters: $filters) {
                totalNet
                totalPaid
                totalOutstanding
                currency
                studios {
                  studioId
                  studioName
                  grossRevenue
                  netRevenue
                  paid
                  outstanding
                }
              }
            }
          `,
          variables: {
            filters: {
              studio: studioFilter,
              currency: filters.currency,
              ...buildPublisherDateFilters(filters),
            }
          }
        })
      });
      const payoutResult = await payoutResponse.json();
      const payout = payoutResult.data?.payoutSummary ?? null;
      setStudioPayoutByKey(prev => ({ ...prev, [studioKey]: payout }));
    } catch (error) {
      console.error('Error fetching studio data:', error);
    } finally {
      setLoadingStudioKey(null);
    }
  };

  /** MUI Accordion passes the target `expanded` state — avoids toggle races with nested <table> rows */
  const onStudioAccordionChange =
    (studioKey: string, studioFilter: string) => (_event: React.SyntheticEvent, expanded: boolean) => {
      setExpandedStudios(prev => {
        const next = new Set(prev);
        if (expanded) {
          next.add(studioKey);
        } else {
          next.delete(studioKey);
        }
        return next;
      });
      if (expanded) {
        void loadStudioReports(studioKey, studioFilter);
      }
    };

  const [loading, setLoading] = useState(true);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⚠️ Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, []);


  // State for filter data from database
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [subPlatforms, setSubPlatforms] = useState<any[]>([]);
  const [studios, setStudios] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingAvailableGames, setLoadingAvailableGames] = useState(false);
  /** Hide games Stack while publisherGamesList refetches after a date-range change */
  const [gameTableAwaitingDateStats, setGameTableAwaitingDateStats] = useState(false);

  // Simple GraphQL fetch for sub-platforms
  const fetchSubPlatforms = async () => {
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              gamePlatforms {
                id
                name
                platformId
                additionalGamePlatformData
              }
            }
          `
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching sub-platforms:', result.errors);
        setSubPlatforms([]);
      } else {
        console.log('✅ Sub-platforms fetched:', result.data.gamePlatforms);
        setSubPlatforms(result.data.gamePlatforms || []);
      }
    } catch (error) {
      console.error('Error fetching sub-platforms:', error);
      setSubPlatforms([]);
    }
  };

  // Simple GraphQL fetch for platforms
  const fetchPlatforms = async () => {
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              platforms {
                id
                name
                additionalPlatformData
              }
            }
          `
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching platforms:', result.errors);
        setPlatforms([]);
      } else {
        console.log('✅ Platforms fetched:', result.data.platforms);
        setPlatforms(result.data.platforms || []);
      }
    } catch (error) {
      console.error('Error fetching platforms:', error);
      setPlatforms([]);
    }
  };

  // Simple GraphQL fetch for studios
  const fetchStudios = async () => {
    try {
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              studios {
                id
                name
                description
                contactEmail
                country
                isActive
              }
            }
          `
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching studios:', result.errors);
        setStudios([]);
      } else {
        console.log('✅ Studios fetched:', result.data.studios);
        setStudios(result.data.studios || []);
      }
    } catch (error) {
      console.error('Error fetching studios:', error);
      setStudios([]);
    }
  };

  // Simple GraphQL fetch for all games (fallback method)
  const fetchAllGames = async () => {
    try {
      // Use publisherGamesList (no filters) so DAU comes from DailyMetrics
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query PublisherGamesList($filters: PublisherFiltersInput!) {
              publisherGamesList(filters: $filters) {
                id
                name
                icon
                platform
                subPlatform
                dau
                installs
                cpi
                revenue
                studioId
                studio {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            filters: {
              currency: filters.currency,
              ...buildPublisherDateFilters(filters),
            }
          }
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching all games (fallback):', result.errors);
        setAllGames([]);
      } else {
        const games = [...(result.data.publisherGamesList || [])].sort(
          (a: any, b: any) => (b.dau || 0) - (a.dau || 0)
        );
        console.log('✅ All games fetched (fallback):', games.length, 'games');
        setAllGames(games);
      }
    } catch (error) {
      console.error('Error fetching all games:', error);
      setAllGames([]);
    } finally {
      setGameTableAwaitingDateStats(false);
    }
  };

  // Load filter data on component mount
  useEffect(() => {
    const loadFilterData = async () => {
      console.log('=== Loading Filter Data with Simple GraphQL Fetches ===');
      setLoadingFilters(true);

      try {
        // Fetch all filter data in parallel
        await Promise.all([
          fetchPlatforms(),
          fetchSubPlatforms(),
          fetchStudios()
        ]);

        console.log('✅ Filter data (platforms, studios, sub-platforms) loaded');

        // Fetch all games initially with empty filters to show everything
        const initialFilters = {
          studio: undefined,
          platform: undefined,
          subPlatform: undefined,
          game: undefined,
          currency: filters.currency,
          ...buildPublisherDateFilters(filters),
        };

        try {
          const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                query PublisherGamesList($filters: PublisherFiltersInput!) {
                  publisherGamesList(filters: $filters) {
                    id
                    name
                    icon
                    platform
                    subPlatform
                    dau
                    installs
                    cpi
                    revenue
                    studioId
                    studio {
                      id
                      name
                    }
                  }
                }
              `,
              variables: { filters: initialFilters }
            })
          });
          const result = await response.json();
          if (result.data?.publisherGamesList) {
            const games = [...result.data.publisherGamesList].sort(
              (a: any, b: any) => (b.dau || 0) - (a.dau || 0)
            );
            console.log('✅ Initial games loaded:', games.length);
            setAllGames(games);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error loading initial games:', error);
        }

      } catch (error) {
        console.error('❌ Error loading filter data:', error);
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilterData();
  }, []);

  // Games for dropdown + table: scoped by studio / platform / subPlatform (never by selected game).
  // Selected game only narrows the table client-side so options stay in sync with scope.
  const fetchAvailableGames = async (currentFilters: typeof filters) => {
    try {
      setLoadingAvailableGames(true);
      console.log('🎮 Fetching available games with filters:', currentFilters);

      // Studio dropdown uses studio.id as value — must pass id through, not lookup by name
      const studioId =
        currentFilters.studio !== 'All' && currentFilters.studio
          ? currentFilters.studio
          : undefined;

      // If we need a studio filter but studios array is empty, skip this fetch
      if (currentFilters.studio !== 'All' && studios.length === 0) {
        console.log('⚠️ Studios array is empty, skipping fetchAvailableGames');
        setLoadingAvailableGames(false);
        setGameTableAwaitingDateStats(false);
        return;
      }

      const queryFilters = {
        studio: studioId,
        platform: currentFilters.platform !== 'All' ? currentFilters.platform : undefined,
        subPlatform: currentFilters.subPlatform !== 'All' ? currentFilters.subPlatform : undefined,
        currency: currentFilters.currency,
        ...buildPublisherDateFilters(currentFilters),
      };

      console.log('🎯 Studio filter mapping:', {
        studioFilterValue: currentFilters.studio,
        studioIdSentToApi: studioId,
        availableStudios: studios.map(s => ({ name: s.name, id: s.id })),
        allFilters: currentFilters
      });

      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query PublisherGamesList($filters: PublisherFiltersInput!) {
              publisherGamesList(filters: $filters) {
                id
                name
                icon
                platform
                subPlatform
                dau
                installs
                cpi
                revenue
                studioId
                studio {
                  id
                  name
                }
              }
            }
          `,
          variables: {
            filters: queryFilters
          }
        })
      });

      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching available games:', result.errors);
        console.log('⚠️ Trying fallback method to fetch all games');
        // Fallback to simple games query
        await fetchAllGames();
      } else {
        const games = [...(result.data.publisherGamesList || [])].sort(
          (a: any, b: any) => (b.dau || 0) - (a.dau || 0)
        );
        console.log(`✅ Fetched ${games.length} available games`);
        setAllGames(games);
      }
    } catch (error) {
      console.error('Error fetching available games:', error);
      console.log('⚠️ Trying fallback method to fetch all games');
      // Fallback to simple games query
      await fetchAllGames();
    } finally {
      setLoadingAvailableGames(false);
      setGameTableAwaitingDateStats(false);
    }
  };

  // Refetch scoped game list when studio / platform / sub-platform / date / currency change — not when only `game` changes.
  useEffect(() => {
    console.log('🔄 useEffect triggered with:', {
      loadingFilters,
      platformsLength: platforms.length,
      studiosLength: studios.length,
      filters
    });

    if (!loadingFilters) {
      if (platforms.length > 0 && studios.length > 0) {
        console.log('🔄 Scope filters changed, fetching games for dropdown + table:', filters);
        fetchAvailableGames(filters).catch(error => {
          console.error('❌ Error in fetchAvailableGames:', error);
        });
      } else {
        console.log('⚠️ Platforms or studios not loaded yet, setting loading to false and using fallback');
        setLoading(false);
        fetchAllGames();
      }
    }
  }, [
    loadingFilters,
    platforms.length,
    studios.length,
    filters.studio,
    filters.platform,
    filters.subPlatform,
    filters.dateRange,
    filters.currency,
    filters.customStartDate,
    filters.customEndDate,
  ]);

  const handleCustomRangeChange = (field: 'customStartDate' | 'customEndDate', value: string) => {
    setGameTableAwaitingDateStats(true);
    const maxEnd = getPublisherCustomMaxEndDate();
    setFilters(prev => {
      if (field === 'customEndDate') {
        const end = !value || value > maxEnd ? maxEnd : value;
        let start = prev.customStartDate;
        if (start && start > end) start = end;
        return { ...prev, customEndDate: end, customStartDate: start };
      }
      let start = !value || value > maxEnd ? maxEnd : value;
      const cap = prev.customEndDate && prev.customEndDate < maxEnd ? prev.customEndDate : maxEnd;
      if (start > cap) start = cap;
      return { ...prev, customStartDate: start };
    });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`🎯 handleFilterChange called: ${filterType} = ${value}`);
    if (filterType === 'dateRange') {
      setGameTableAwaitingDateStats(true);
    }
    setFilters(prev => {
      const newFilters: typeof prev = {
        ...prev,
        [filterType]: value,
      };

      if (filterType === 'dateRange' && value === 'Custom') {
        const maxEnd = getPublisherCustomMaxEndDate();
        const [ey, em, ed] = maxEnd.split('-').map(Number);
        const defaultStart = new Date(Date.UTC(ey, em - 1, ed - 6)).toISOString().split('T')[0];
        let end =
          prev.customEndDate && prev.customEndDate <= maxEnd ? prev.customEndDate : maxEnd;
        let start = prev.customStartDate;
        if (!start || start > end) start = defaultStart;
        if (start > end) start = end;
        newFilters.customStartDate = start;
        newFilters.customEndDate = end;
      }

      // Reset dependent filters with cascading effect
      if (filterType === 'platform') {
        console.log(`🔄 Platform changed to: ${value}, resetting sub-platform and game to 'All'`);
        newFilters.subPlatform = 'All';
        newFilters.game = 'All';
      } else if (filterType === 'studio') {
        console.log(`🔄 Studio changed to: ${value}, resetting game to 'All'`);
        newFilters.game = 'All';
      } else if (filterType === 'subPlatform') {
        console.log(`🔄 Sub-platform changed to: ${value}, resetting game to 'All'`);
        newFilters.game = 'All';
      }

      console.log(`🎯 New filters after ${filterType} change:`, newFilters);
      console.log(`🎯 About to update filters state with:`, newFilters);

      return newFilters;
    });
  };

  // Table rows: same scope as dropdown (studio / platform / subPlatform), then optional single-game filter
  const getFilteredGames = () => {
    if (filters.game === 'All') {
      return allGames;
    }
    return allGames.filter((g) => g.id === filters.game);
  };

  // Get available games for the game filter dropdown
  const getAvailableGames = () => {
    // allGames is already filtered by the current studio, platform, and sub-platform
    // from the fetchAvailableGames function, so we can return it directly
    console.log(`🎮 Available games for dropdown: ${allGames.length} games`, {
      currentFilters: filters,
      allGames: allGames.map(g => g.name),
      loadingAvailableGames
    });
    return allGames;
  };

  // Get available sub-platforms based on selected platform
  const getAvailableSubPlatforms = () => {
    // Only show sub-platforms when Web platform is selected
    if (filters.platform === 'Web') {
      // Find the Web platform to match platformId
      const webPlatform = platforms.find(p => p.name === 'Web');
      if (webPlatform) {
        return subPlatforms.filter(subPlatform =>
          subPlatform.platformId === webPlatform.id
        );
      }
    }

    // Return empty array for non-Web platforms or when no Web platform found
    return [];
  };

  // Get filtered games for display
  const filteredGames = getFilteredGames();
  const availableGames = getAvailableGames();
  const gameFilterOptions = useMemo(
    () => getPublisherGameFilterOptions(availableGames),
    [allGames]
  );
  const availableSubPlatforms = getAvailableSubPlatforms();

  // Group games by studio
  const gamesByStudio = filteredGames.reduce((acc, game) => {
    const studioName = game.studio?.name || 'Unknown Studio';
    if (!acc[studioName]) {
      acc[studioName] = [];
    }
    acc[studioName].push(game);
    return acc;
  }, {} as Record<string, any[]>);

  // Debug logging
  console.log('=== Publisher Games List Debug Info ===');
  console.log('Current studios state:', studios);
  console.log('Current platforms state:', platforms);
  console.log('Current allGames state:', allGames);
  console.log('Current subPlatforms state:', subPlatforms);
  console.log('Available sub-platforms:', availableSubPlatforms);
  console.log('Current platform filter:', filters.platform);
  console.log('Filters loading:', loadingFilters);
  console.log('Sub-platforms count:', subPlatforms.length);
  console.log('Available sub-platforms count:', availableSubPlatforms.length);
  console.log('Web platform found:', platforms.find(p => p.name === 'Web'));

  // Additional debugging for sub-platforms
  if (subPlatforms.length > 0) {
    console.log('Sub-platforms details:');
    subPlatforms.forEach((sp, index) => {
      console.log(`  ${index + 1}. ${sp.name} (PlatformID: ${sp.platformId})`);
    });
  } else {
    console.log('⚠️  No sub-platforms loaded from database');
  }

  if (availableSubPlatforms.length > 0) {
    console.log('Available sub-platforms details:');
    availableSubPlatforms.forEach((sp, index) => {
      console.log(`  ${index + 1}. ${sp.name} (PlatformID: ${sp.platformId})`);
    });
  } else {
    console.log('⚠️  No available sub-platforms (check platform filter)');
  }

  console.log('========================================');

  // Reset game filter if selected game is not available in current games list
  useEffect(() => {
    if (filters.game !== 'All' && availableGames.length > 0) {
      const gameExists = availableGames.some(game => game.id === filters.game);
      if (!gameExists) {
        setFilters(prev => ({
          ...prev,
          game: 'All'
        }));
      }
    }
  }, [availableGames, filters.game]);

  // Reset sub-platform filter when platform changes
  useEffect(() => {
    // Always reset sub-platform to 'All' when platform changes
    if (filters.subPlatform !== 'All') {
      console.log(`🔄 Platform changed to: ${filters.platform}, resetting sub-platform from '${filters.subPlatform}' to 'All'`);
      setFilters(prev => ({
        ...prev,
        subPlatform: 'All'
      }));
    }
  }, [filters.platform]);

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Publisher Games List
        </Typography>
        <Typography>Loading games...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 2 }}>
        {loadingFilters && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Loading filter data...
            </Typography>
          </Box>
        )}
        {/* First Row of Filters */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={filters.studio}
                onChange={(e) => handleFilterChange('studio', e.target.value)}
                displayEmpty
                disabled={loadingFilters}
              >
                <MenuItem value="All">
                  Studio [ All ▼ ] {loadingFilters ? '(Loading...)' : `(${studios.length} studios)`}
                </MenuItem>
                {studios.map((studio: any) => (
                  <MenuItem key={studio.id} value={studio.id}>
                    {studio.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                displayEmpty
              >
                <MenuItem value="All">Platform [ All ▼ ]</MenuItem>
                {platforms.map((platform: any) => (
                  <MenuItem key={platform.id} value={platform.name}>
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {filters.platform === 'Web' && (
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={filters.subPlatform}
                  onChange={(e) => handleFilterChange('subPlatform', e.target.value)}
                  displayEmpty
                  disabled={loadingFilters}
                >
                  <MenuItem value="All">
                    Sub Platform [ All ▼ ]
                    {loadingFilters ? '(Loading...)' : `(${availableSubPlatforms.length} options)`}
                  </MenuItem>
                  {availableSubPlatforms.map((subPlatform: any) => (
                    <MenuItem key={subPlatform.id} value={subPlatform.name}>
                      {subPlatform.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={filters.game}
                onChange={(e) => handleFilterChange('game', e.target.value)}
                displayEmpty
                disabled={loadingAvailableGames}
              >
                <MenuItem value="All">
                  Game [ All ▼ ] {loadingAvailableGames ? '(Loading...)' : `(${gameFilterOptions.length} games)`}
                </MenuItem>
                {gameFilterOptions.map(({ game, label }) => (
                  <MenuItem key={game.id} value={game.id}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                displayEmpty
              >
                <MenuItem value="30d">Date [ 30d ▼ ]</MenuItem>
                <MenuItem value="Yesterday">Yesterday</MenuItem>
                <MenuItem value="7d">Last 7d</MenuItem>
                <MenuItem value="14d">Last 14d</MenuItem>
                <MenuItem value="30d">Last 30d</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {filters.dateRange === 'Custom' && (() => {
            const customMaxEnd = getPublisherCustomMaxEndDate();
            const fromMax =
              filters.customEndDate && filters.customEndDate < customMaxEnd
                ? filters.customEndDate
                : customMaxEnd;
            return (
            <>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: fromMax }}
                  value={filters.customStartDate}
                  onChange={(e) => handleCustomRangeChange('customStartDate', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: customMaxEnd }}
                  value={filters.customEndDate}
                  onChange={(e) => handleCustomRangeChange('customEndDate', e.target.value)}
                />
              </Grid>
            </>
            );
          })()}
        </Grid>

        {/* Second Row of Filters */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={filters.currency}
                onChange={(e) => handleFilterChange('currency', e.target.value)}
                displayEmpty
              >
                <MenuItem value="INR">Currency [ INR ▼ ]</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={10}>
            <Typography variant="body2" color="textSecondary">
              {filteredGames.length} games found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Publisher KPIs — below filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <PublisherKPIs filter={filters} hideActionButtons />
        </CardContent>
      </Card>

      {/* Studio reports: MUI Accordion outside <tbody> — nested rows/divs in one cell broke open/close */}
      <TableContainer component={Paper}>
        {gameTableAwaitingDateStats ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              p: 6,
              minHeight: 220,
            }}
          >
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body2" color="text.secondary">
              Updating game stats…
            </Typography>
          </Box>
        ) : filteredGames.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No games found matching the current filters
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={2} sx={{ p: 2, pt: 1 }}>
              {(Object.entries(gamesByStudio) as [string, any[]][]).map(([studioName, games], index) => {
                const studioDisplayName = studioName;
                const studioKey = games[0]?.studio?.id || games[0]?.studioId || `name:${studioName}`;
                const studioFilter = games[0]?.studio?.name || studioName;
                const isStudioExpanded = expandedStudios.has(studioKey);
                const revenueByGeoData = studioGeoByKey[studioKey] ?? [];
                const payoutSummaryData = studioPayoutByKey[studioKey];
                const studioLoading = loadingStudioKey === studioKey;

                return (
                  <Paper key={`studio-${studioKey}-${index}`} variant="outlined" sx={{ overflow: 'hidden' }}>
                    <Accordion
                      expanded={isStudioExpanded}
                      onChange={onStudioAccordionChange(studioKey, studioFilter)}
                      disableGutters
                      elevation={0}
                      sx={{ '&:before': { display: 'none' } }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                          px: 2,
                          bgcolor: 'grey.100',
                          '&:hover': { bgcolor: 'grey.200' },
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {studioDisplayName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                          {isStudioExpanded ? 'Hide studio reports & games' : 'Show studio reports & games'}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0, bgcolor: 'grey.50' }}>
                        <Box sx={{ p: 3 }}>
                          {studioLoading ? (
                            <Typography>Loading studio reports...</Typography>
                          ) : (
                            <>
                              {revenueByGeoData.length > 0 && (
                                <Card sx={{ mb: 2, border: '2px solid #1976d230' }}>
                                  <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
                                      🌍 Revenue by Geo - {studioDisplayName}
                                    </Typography>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell><strong>Country</strong></TableCell>
                                          <TableCell align="right"><strong>Installs</strong></TableCell>
                                          <TableCell align="right"><strong>Gross Rev</strong></TableCell>
                                          <TableCell align="right"><strong>Rev-Share %</strong></TableCell>
                                          <TableCell align="right"><strong>Net Rev</strong></TableCell>
                                          <TableCell align="right"><strong>Payout Due</strong></TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {revenueByGeoData.map((row: any) => (
                                          <TableRow key={row.country}>
                                            <TableCell>{row.country}</TableCell>
                                            <TableCell align="right">{formatDecimalNumber(row.installs)}</TableCell>
                                            <TableCell align="right">{formatPublisherMoney(row.grossRevenue ?? 0, filters.currency)}</TableCell>
                                            <TableCell align="right">{row.revenueShare}%</TableCell>
                                            <TableCell align="right">{formatPublisherMoney(row.netRevenue ?? 0, filters.currency)}</TableCell>
                                            <TableCell align="right">{formatPublisherMoney(row.payoutDue ?? 0, filters.currency)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                              )}

                              {payoutSummaryData && payoutSummaryData.studios && (
                                <Card sx={{ mb: 2, border: '2px solid #2e7d3230' }}>
                                  <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2e7d32' }}>
                                      💰 Payout Summary - {studioDisplayName}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                      Total Net: {formatPublisherMoney(payoutSummaryData.totalNet ?? 0, filters.currency)} |
                                      Paid: {formatPublisherMoney(payoutSummaryData.totalPaid ?? 0, filters.currency)} |
                                      Outstanding: {formatPublisherMoney(payoutSummaryData.totalOutstanding ?? 0, filters.currency)}
                                    </Typography>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell><strong>Studio</strong></TableCell>
                                          <TableCell align="right"><strong>Gross Rev</strong></TableCell>
                                          <TableCell align="right"><strong>Net Rev</strong></TableCell>
                                          <TableCell align="right"><strong>Paid</strong></TableCell>
                                          <TableCell align="right"><strong>Outstanding</strong></TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {payoutSummaryData.studios.map((studio: any) => (
                                          <TableRow key={studio.studioId}>
                                            <TableCell>{studio.studioName}</TableCell>
                                            <TableCell align="right">{formatPublisherMoney(studio.grossRevenue ?? 0, filters.currency)}</TableCell>
                                            <TableCell align="right">{formatPublisherMoney(studio.netRevenue ?? 0, filters.currency)}</TableCell>
                                            <TableCell align="right">{formatPublisherMoney(studio.paid ?? 0, filters.currency)}</TableCell>
                                            <TableCell align="right">{formatPublisherMoney(studio.outstanding ?? 0, filters.currency)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                              )}
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    <Collapse in={isStudioExpanded} timeout="auto" unmountOnExit>
                    <Table size="small">
                      <TableBody>
                    {games.map((game: any) => (
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
                                  handleToggleExpanded(game.id);
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
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                            <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.25, fontWeight: 600 }}>
                              DAU
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDecimalNumber(game.dau || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                            <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.25, fontWeight: 600 }}>
                              Gross Revenue
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {formatPublisherMoney(game.revenue || 0, filters.currency)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                            <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.25, fontWeight: 600 }}>
                              Net Revenue
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {formatPublisherMoney((game.revenue || 0) * 0.8, filters.currency)}
                            </Typography>
                          </TableCell>
                          {filters.platform !== 'Web' && (
                            <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.25, fontWeight: 600 }}>
                                Installs
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {formatDecimalNumber(game.installs || 0)}
                              </Typography>
                            </TableCell>
                          )}
                          {filters.platform !== 'Web' && (
                            <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                              <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.25, fontWeight: 600 }}>
                                CPI
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {formatPublisherMoneyFixed(game.cpi || 0, filters.currency, 2)}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell align="right" sx={{ verticalAlign: 'middle' }}>
                            <Typography variant="body2" color="textSecondary">
                              {expandedGames.has(game.id) ? 'Hide Reports' : 'Show Reports'}
                            </Typography>
                          </TableCell>
                        </TableRow>

                        {/* Reports row — only when expanded (reliable hide in table layout) */}
                        {expandedGames.has(game.id) && (
                        <TableRow>
                          <TableCell colSpan={filters.platform === 'Web' ? 5 : 7} sx={{ p: 0, borderTop: '1px solid #e0e0e0' }}>
                              <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
                                <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold', textAlign: 'center' }}>
                                  📊 Publisher Reports - {game.name}
                                </Typography>

                                {/* Loading State */}
                                {loadingMetrics[game.id] ? (
                                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                                    <CircularProgress />
                                    <Typography sx={{ ml: 2 }}>Loading live data from Hyper Rabbit SDK...</Typography>
                                  </Box>
                                ) : (
                                  /* Reports with Data Tables */
                                  getPublisherReports(game.id).map((report) => (
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
                                                Type: {report.type}
                                              </Typography>
                                            </Box>
                                          </Box>
                                          <Chip
                                            label="Live Data"
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
                                              The table shows days 1–7 after each cohort date. D30 is a weighted KPI
                                              from DailyMetrics (cohort day +30, UTC); it is not a column. N/A if too
                                              few installs are in D30-mature cohorts with a recorded retentionD30—
                                              backfill the full selected range. True 0% only with enough measured
                                              cohorts and a weighted average that rounds to zero.
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
                                                              return c && !c.pending && c.value != null
                                                                ? c.value
                                                                : 0;
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
                                                    {Object.keys(report.data.table[0] || {}).map((header) => (
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
                                                          {typeof cell === 'object' && cell !== null && 'display' in cell ? cell.display : String(cell)}
                                                        </TableCell>
                                                      ))}
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            )}
                                          </Box>
                                        )}
                                        {(!report.data.table || report.data.table.length === 0) && (
                                          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', p: 3 }}>
                                            No data available for this period
                                          </Typography>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))
                                )}
                              </Box>
                          </TableCell>
                        </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                      </TableBody>
                    </Table>
                    </Collapse>
                  </Paper>
                );
              })}
            </Stack>
          </>
        )}
      </TableContainer>
    </Box>
  );
};
