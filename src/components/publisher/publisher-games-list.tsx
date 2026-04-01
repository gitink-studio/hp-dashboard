import React, { useState, useEffect, useRef, useMemo } from 'react';
import { formatDecimalNumber } from '../../common/utils';
import { formatPublisherMoney, formatPublisherMoneyFixed } from '../../common/currency-utils';
import { ROOT_URL, GRAPHQL_URL } from '../../common/constants';
import { PublisherKPIs } from '../dashboard/publisher-kpis';

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

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  FormControl,
  Select,
  MenuItem,
  Grid,
  Button,
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
  GetApp,
  Visibility,
  MonetizationOn,
  TrendingUp,
} from '@mui/icons-material';

interface PublisherGamesListProps {
  onReportsNavigation: (gameName: string) => void;
}

export const PublisherGamesList: React.FC<PublisherGamesListProps> = ({ onReportsNavigation }) => {
  // Provide default value if prop is undefined
  const handleReportsNavigation = onReportsNavigation || ((gameName: string) => {
    console.log('Reports navigation called for:', gameName);
  });

  const [filters, setFilters] = useState({
    studio: "All",
    platform: "All",
    subPlatform: "All",
    game: "All",
    dateRange: "30d",
    currency: "INR"
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

  // Helper function to get date range from filter
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (filters.dateRange) {
      case 'Today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'Yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'Last 7d':
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'Last 14d':
      case '14d':
        startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case 'Last 30d':
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  // Fetch game metrics from backend
  const fetchGameMetrics = async (gameId: string) => {
    console.log('🔵 fetchGameMetrics called for game:', gameId);

    // Check if already fetching
    if (ongoingFetches.current.has(gameId)) {
      console.log('⏳ Already fetching for game:', gameId);
      return;
    }

    // Only fetch if not already cached
    if (gameMetrics[gameId] && dailyMetrics[gameId]) {
      console.log('✅ Metrics already cached for game:', gameId);
      return;
    }

    try {
      ongoingFetches.current.add(gameId);
      setLoadingMetrics(prev => ({ ...prev, [gameId]: true }));

      const { startDate, endDate } = getDateRange();
      console.log(`📊 Fetching metrics for game ${gameId} (${startDate} to ${endDate})`);

      const metricsResponse = await fetch(`${ROOT_URL}/hyper-rabbit/metrics/${gameId}?startDate=${startDate}&endDate=${endDate}`);
      const dailyResponse = await fetch(`${ROOT_URL}/hyper-rabbit/metrics/daily/${gameId}?startDate=${startDate}&endDate=${endDate}`);

      if (metricsResponse.ok) {
        const result = await metricsResponse.json();
        if (result.success && result.data) {
          setGameMetrics(prev => ({
            ...prev,
            [gameId]: result.data
          }));
        }
      }

      if (dailyResponse.ok) {
        const dailyResult = await dailyResponse.json();
        if (dailyResult.success && dailyResult.data) {
          setDailyMetrics(prev => ({
            ...prev,
            [gameId]: dailyResult.data
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching metrics for game ${gameId}:`, error);
    } finally {
      ongoingFetches.current.delete(gameId);
      setLoadingMetrics(prev => ({ ...prev, [gameId]: false }));
    }
  };

  // Publisher reports data dynamically generated from backend metrics
  const getPublisherReports = (gameId: string) => {
    const metrics = gameMetrics[gameId] || {};
    const daily = dailyMetrics[gameId] || [];

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

    // Helper function to calculate retention for a specific day
    // Uses interpolation between D1, D7, D30 if needed
    const calculateDayRetention = (day: number, d1: number, d7: number, d30: number): number => {
      if (day === 1) return d1;
      if (day === 7) return d7;
      if (day === 30) return d30;

      // Interpolate between D1 and D7 for days 2-6
      if (day > 1 && day < 7) {
        const ratio = (day - 1) / 6;
        return d1 - (d1 - d7) * ratio;
      }

      // Interpolate between D7 and D30 for days 8-29
      if (day > 7 && day < 30) {
        const ratio = (day - 7) / 23;
        return d7 - (d7 - d30) * ratio;
      }

      // For days beyond 30, use D30 (or extrapolate down)
      if (day > 30) {
        const daysPast30 = day - 30;
        // Exponential decay beyond day 30
        return d30 * Math.pow(0.95, daysPast30);
      }

      return 0;
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
            const totalAdSpend = daily.reduce((sum, d) => sum + (d.adSpend || 0), 0);
            const totalRevenue = metrics.totalRevenue || 0;
            const roas = totalAdSpend > 0 ? (totalRevenue / totalAdSpend) * 100 : 0;
            return {
              totalRevenue: money(totalRevenue),
              adSpend: money(totalAdSpend),
              roas: `${roas.toFixed(0)}%`
            };
          })(),
          table: daily.map(day => {
            const adSpend = day.adSpend || 0;
            const revenue = day.totalRevenue || 0;
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
          kpi: {
            // Backend returns retention as percentage (0-100), so no multiplication needed
            d1: `${(metrics.retentionD1 || 0).toFixed(1)}%`,
            d7: `${(metrics.retentionD7 || 0).toFixed(1)}%`,
            d30: metrics.retentionD30 ? `${metrics.retentionD30.toFixed(1)}%` : 'N/A'
          },
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
                for (let day = 1; day <= 9; day++) {
                  const retention = calculateDayRetention(day, d1, d7, d30);
                  row[`day${day}`] = {
                    value: retention,
                    display: `${retention.toFixed(2)}%`,
                    color: getHeatmapColor(retention, maxRetention)
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
              for (let day = 1; day <= 9; day++) {
                const retention = calculateDayRetention(day, d1, d7, d30);
                row[`day${day}`] = {
                  value: retention,
                  display: `${retention.toFixed(2)}%`,
                  color: getHeatmapColor(retention, maxRetention)
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

              // Calculate average retention for each day
              for (let day = 1; day <= 9; day++) {
                const dayValues = retentionRows.map(row => row[`day${day}`]?.value || 0).filter(v => v > 0);
                const avgRetention = dayValues.length > 0
                  ? dayValues.reduce((sum, val) => sum + val, 0) / dayValues.length
                  : 0;

                meanRow[`day${day}`] = {
                  value: avgRetention,
                  display: `${avgRetention.toFixed(2)}%`,
                  color: getHeatmapColor(avgRetention, maxRetention)
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
            gross: money(metrics.totalRevenue || 0),
            iap: money(metrics.iapRevenue || 0),
            ads: money(metrics.adRevenue || 0)
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            gross: money(day.totalRevenue || 0),
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
          kpi: {
            crashRate: `${(metrics.crashRate || 0).toFixed(2)}%`,
            errors: formatNumber(
              daily.reduce((sum, d) => sum + (d.errorCount || 0), 0)
            ),
            usersAffected: formatNumber(metrics.usersAffectedByErrors || 0)
          },
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
            gross: money(metrics.totalRevenue || 0),
            net: money((metrics.totalRevenue || 0) * 0.7),
            payoutDue: money((metrics.totalRevenue || 0) * 0.6)
          },
          table: (metrics.geoBreakdown || []).map((geo: any) => ({
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
          kpi: {
            ecpm: moneyF(metrics.avgEcpm || 0, 2),
            fillRate: `${(metrics.fillRate || 0).toFixed(1)}%`,
            impressions: formatNumber(metrics.totalImpressions || 0)
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            ecpm: moneyF(day.avgEcpm || 0, 2),
            fillRate: `${(day.fillRate || 0).toFixed(1)}%`,
            impressions: formatNumber(day.impressions || 0)
          }))
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
              dateRange: filters.dateRange,
              currency: filters.currency
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
              dateRange: filters.dateRange,
              currency: filters.currency
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
              dateRange: filters.dateRange,
              currency: filters.currency
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
          dateRange: filters.dateRange,
          currency: filters.currency
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
        return;
      }

      const queryFilters = {
        studio: studioId,
        platform: currentFilters.platform !== 'All' ? currentFilters.platform : undefined,
        subPlatform: currentFilters.subPlatform !== 'All' ? currentFilters.subPlatform : undefined,
        dateRange: currentFilters.dateRange,
        currency: currentFilters.currency
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
  ]);

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`🎯 handleFilterChange called: ${filterType} = ${value}`);
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };

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
      {/* Publisher KPIs Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <PublisherKPIs filter={filters} />
        </CardContent>
      </Card>

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
                <MenuItem value="Today">Today</MenuItem>
                <MenuItem value="Yesterday">Yesterday</MenuItem>
                <MenuItem value="7d">Last 7d</MenuItem>
                <MenuItem value="14d">Last 14d</MenuItem>
                <MenuItem value="30d">Last 30d</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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

      {/* Studio reports: MUI Accordion outside <tbody> — nested rows/divs in one cell broke open/close */}
      <TableContainer component={Paper}>
        {filteredGames.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No games found matching the current filters
            </Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Studio & Games</TableCell>
                  <TableCell>DAU</TableCell>
                  <TableCell>Gross Revenue</TableCell>
                  <TableCell>Net Revenue</TableCell>
                  {filters.platform !== 'Web' && <TableCell>Installs</TableCell>}
                  {filters.platform !== 'Web' && <TableCell>CPI</TableCell>}
                  <TableCell>Reports</TableCell>
                </TableRow>
              </TableHead>
            </Table>
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
                      <TableHead>
                        <TableRow>
                          <TableCell>Studio & Games</TableCell>
                          <TableCell>DAU</TableCell>
                          <TableCell>Gross Revenue</TableCell>
                          <TableCell>Net Revenue</TableCell>
                          {filters.platform !== 'Web' && <TableCell>Installs</TableCell>}
                          {filters.platform !== 'Web' && <TableCell>CPI</TableCell>}
                          <TableCell>Reports</TableCell>
                        </TableRow>
                      </TableHead>
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
                                <Typography variant="caption" color="textSecondary">
                                  (📊) DAU: {formatDecimalNumber(game.dau || 0)}
                                  {filters.platform !== 'Web' && (
                                    <>  Installs: {formatDecimalNumber(game.installs || 0)}  CPI: {formatPublisherMoneyFixed(game.cpi || 0, filters.currency, 2)}</>
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{formatDecimalNumber(game.dau || 0)}</TableCell>
                          <TableCell>{formatPublisherMoney(game.revenue || 0, filters.currency)}</TableCell>
                          <TableCell>{formatPublisherMoney((game.revenue || 0) * 0.8, filters.currency)}</TableCell>
                          {filters.platform !== 'Web' && (
                            <TableCell>{formatDecimalNumber(game.installs || 0)}</TableCell>
                          )}
                          {filters.platform !== 'Web' && (
                            <TableCell>{formatPublisherMoneyFixed(game.cpi || 0, filters.currency, 2)}</TableCell>
                          )}
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
                                    handleReportsNavigation(game.name);
                                  }}
                                  color="primary"
                                >
                                  <Assessment fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
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
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => (
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
                                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => {
                                                        const dayData = row[`day${day}`];
                                                        // Calculate local max for text color
                                                        const localMax = Math.max(...report.data.table
                                                          .flatMap((r: any) =>
                                                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => r[`day${d}`]?.value || 0)
                                                          )
                                                        );
                                                        return (
                                                          <TableCell
                                                            key={day}
                                                            sx={{
                                                              textAlign: 'center',
                                                              backgroundColor: dayData?.color || '#ffffff',
                                                              color: dayData?.value > localMax * 0.5 ? '#ffffff' : '#000000',
                                                              fontWeight: 'medium',
                                                              minWidth: '80px'
                                                            }}
                                                          >
                                                            {dayData?.display || '0.00%'}
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

                                        {/* Action Buttons */}
                                        <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
                                          <Button
                                            variant="contained"
                                            startIcon={<Visibility />}
                                            sx={{ backgroundColor: report.color }}
                                            onClick={() => handleReportsNavigation(game.name)}
                                          >
                                            Open Full Report
                                          </Button>
                                          <Button
                                            variant="outlined"
                                            startIcon={<GetApp />}
                                            sx={{ borderColor: report.color, color: report.color }}
                                          >
                                            Export CSV
                                          </Button>
                                        </Box>
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
