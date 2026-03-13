import React, { useState, useEffect } from 'react';
import { GRAPHQL_URL, ROOT_URL } from '../../common/constants';
import { formatDecimalNumber } from '../../common/utils';
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
  Button,
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
  Visibility,
  GetApp,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

interface GamesListProps {
  filters: any;
  onReportsNavigation: (gameName: string) => void;
}

export const GamesList: React.FC<GamesListProps> = ({ filters, onReportsNavigation }) => {
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
      }
    };

    fetchGamesList();
  }, [filters.platform, filters.subPlatform, filters.game, filters.dateRange]);

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

  // Clear cached metrics when filters change (especially date range)
  useEffect(() => {
    console.log('🔄 Filters changed, clearing cached metrics');
    // Close all expanded accordions to avoid showing stale data
    setExpandedGames(new Set());
    // Clear cached metrics
    setGameMetrics({});
    setDailyMetrics({});
    setCohortRetentionData({});
    setLoadingMetrics({});
    ongoingFetches.current.clear();

    // Debounce to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      console.log('✅ Cache cleared, ready for new data');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.dateRange, filters.platform, filters.subPlatform, filters.game]);

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

  // Helper function to get date range from filter
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (filters.dateRange) {
      case 'Today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
      case 'Last 90d':
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
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
      return; // Don't fetch if already in progress
    }

    // Only fetch if not already cached
    if (gameMetrics[gameId] && dailyMetrics[gameId]) {
      console.log('✅ Metrics already cached for game:', gameId);
      return; // Don't fetch if already loaded
    }

    try {
      // Mark as ongoing
      ongoingFetches.current.add(gameId);

      // Set loading state at the start of fetch
      setLoadingMetrics(prev => ({ ...prev, [gameId]: true }));
      const { startDate, endDate } = getDateRange();
      console.log('=====================================');
      console.log('📊 FETCHING GAME METRICS');
      console.log('=====================================');
      console.log(`Game ID: ${gameId}`);
      console.log(`Date Range: ${startDate} to ${endDate}`);
      console.log('=====================================');

      // Fetch both aggregated metrics and daily breakdown
      console.log('Making API calls...');

      // Fetch sequentially to avoid hanging
      const [metricsResponse, dailyResponse, cohortResponse] = await Promise.all([
        fetch(`${ROOT_URL}/hyper-rabbit/metrics/${gameId}?startDate=${startDate}&endDate=${endDate}`),
        fetch(`${ROOT_URL}/hyper-rabbit/metrics/daily/${gameId}?startDate=${startDate}&endDate=${endDate}`),
        fetch(`${ROOT_URL}/hyper-rabbit/retention/cohort/${gameId}?startDate=${startDate}&endDate=${endDate}`)
      ]);

      console.log('Metrics response status:', metricsResponse.status);
      console.log('Daily response status:', dailyResponse.status);
      console.log('Cohort response status:', cohortResponse.status);

      if (metricsResponse.ok) {
        const result = await metricsResponse.json();
        console.log('API Response data:', result);

        if (result.success && result.data) {
          console.log('Setting metrics for game:', gameId, result.data);
          setGameMetrics(prev => {
            const updated = {
              ...prev,
              [gameId]: result.data
            };
            console.log('Updated gameMetrics:', updated);
            return updated;
          });
        }
      }

      if (dailyResponse.ok) {
        const dailyResult = await dailyResponse.json();
        console.log('=====================================');
        console.log('📈 DAILY METRICS API RESPONSE');
        console.log('=====================================');
        console.log('Status:', dailyResponse.status);
        console.log('Success:', dailyResult.success);
        console.log('Data Array Length:', dailyResult.data?.length || 0);

        if (dailyResult.data && dailyResult.data.length > 0) {
          console.log('Sample Data (first 3 days):');
          dailyResult.data.slice(0, 3).forEach((day: any, idx: number) => {
            console.log(`  Day ${idx + 1}:`, day);
          });
        }
        console.log('=====================================');

        if (dailyResult.success && dailyResult.data) {
          console.log('✅ Setting daily metrics for game:', gameId);
          setDailyMetrics(prev => {
            const updated = {
              ...prev,
              [gameId]: dailyResult.data
            };
            console.log('✅ Updated dailyMetrics state');
            return updated;
          });
        } else {
          console.error('❌ Daily metrics missing or empty:', dailyResult);
        }
      } else {
        console.error('=====================================');
        console.error('❌ DAILY API REQUEST FAILED');
        console.error('=====================================');
        console.error('Status:', dailyResponse.status);
        console.error('Status Text:', dailyResponse.statusText);
        const errorText = await dailyResponse.text();
        console.error('Error Details:', errorText);
        console.error('=====================================');
      }

      // Fetch cohort retention data
      if (cohortResponse.ok) {
        const cohortResult = await cohortResponse.json();
        console.log('=====================================');
        console.log('👥 COHORT RETENTION API RESPONSE');
        console.log('=====================================');
        console.log('Success:', cohortResult.success);
        console.log('Cohort Data Length:', cohortResult.data?.length || 0);

        if (cohortResult.success && cohortResult.data) {
          console.log('✅ Setting cohort retention data for game:', gameId);
          setCohortRetentionData(prev => {
            const updated = {
              ...prev,
              [gameId]: cohortResult.data
            };
            console.log('✅ Updated cohortRetentionData state');
            return updated;
          });
        }
      }

    } catch (error) {
      console.error(`Error fetching metrics for game ${gameId}:`, error);
    } finally {
      // Clear ongoing fetch flag
      ongoingFetches.current.delete(gameId);

      // Always clear loading state - whether success or error
      console.log('🔵 Clearing loading state for:', gameId);
      setLoadingMetrics(prev => {
        const updated = { ...prev };
        updated[gameId] = false;
        console.log('Updated loading state:', updated);
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
      if (hasDaily && daily.length > 0) {
        return Math.max(...daily.map(d => Math.max(
          d.retentionD1 || 0,
          d.retentionD7 || 0,
          d.retentionD30 || 0
        )));
      }
      if (hasCohortRetention && cohortRetention.length > 0) {
        const allValues = cohortRetention.flatMap((c: any) => [
          parseFloat(c.d1?.replace('%', '') || '0'),
          parseFloat(c.d7?.replace('%', '') || '0'),
          parseFloat(c.d30?.replace('%', '') || '0')
        ]);
        return Math.max(...allValues, 0);
      }
      return 100; // Default max
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
            const totalRevenue = d.totalRevenue || d.grossRevenue || 0;
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
          kpi: {
            d1: hasMetrics ? `${(metrics.retentionD1 || 0).toFixed(1)}%` : '0.0%',
            d7: hasMetrics ? `${(metrics.retentionD7 || 0).toFixed(1)}%` : '0.0%',
            d30: hasMetrics ? `${(metrics.retentionD30 || 0).toFixed(1)}%` : 'N/A'
          },
          // Heatmap format: rows are cohorts/dates, columns are days 1-9
          // Use cohort-based retention data from backend, fallback to daily data
          table: (() => {
            let retentionRows: any[] = [];

            if (hasCohortRetention && cohortRetention.length > 0) {
              retentionRows = cohortRetention.map((cohort: any) => {
                const cohortDate = new Date(cohort.cohort).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const installs = cohort.installs || 0;
                const d1 = parseFloat(cohort.d1?.replace('%', '') || '0');
                const d7 = parseFloat(cohort.d7?.replace('%', '') || '0');
                const d30 = parseFloat(cohort.d30?.replace('%', '') || '0');

                // Create row with date/cohort label and retention for each day (1-9)
                const row: any = {
                  cohortDate: `${cohortDate} (${formatDecimalNumber(installs)} Users)`,
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
            } else if (hasDaily) {
              retentionRows = daily.map(d => {
                const installs = d.newUsers || 0;
                const d1 = d.retentionD1 || 0;
                const d7 = d.retentionD7 || 0;
                const d30 = d.retentionD30 || 0;
                const dateStr = formatDate(d.date);
                const dayName = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });

                // Create row with date and retention for each day (1-9)
                const row: any = {
                  cohortDate: `${dayName}, ${dateStr} (${formatDecimalNumber(installs)} Users)`,
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
            const totalRevenue = d.totalRevenue || d.grossRevenue || 0;
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
          kpi: {
            sessions: hasMetrics ? formatDecimalNumber(metrics.mau || 0) : '0',
            crashes: hasMetrics ? formatDecimalNumber(metrics.usersAffectedByErrors || 0) : '0',
            crashRate: hasMetrics ? `${(metrics.crashRate || 0).toFixed(2)}%` : '0.00%'
          },
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

                              {/* Action Buttons */}
                              <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
                                <Button
                                  variant="contained"
                                  startIcon={<Visibility />}
                                  sx={{ backgroundColor: report.color }}
                                  onClick={() => onReportsNavigation(game.name)}
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
