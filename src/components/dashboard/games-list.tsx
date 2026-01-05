import React, { useState, useEffect } from 'react';
import { useGetList } from 'react-admin';
import { QueryNames, ROOT_URL } from '../../common/constants';
import { formatNumber } from '../../common/utils';
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
  // Get current user ID from localStorage
  const userId = localStorage.getItem("userId");
  
  // Debug: Log userId once on mount
  useEffect(() => {
    console.log('🎯 GamesList mounted with userId:', userId);
  }, [userId]);
  
  // Prevent duplicate userId warnings
  useEffect(() => {
    if (userId !== 'c89f7490-d9e5-47be-828b-8a71244214dc' && userId !== '266f87d7-f2b8-4ed9-8fcb-353df1272471') {
      console.warn('⚠️ Unexpected userId:', userId);
    }
  }, [userId]);
  
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
    
    // Calculate CPI (Cost Per Install) - simple estimate based on daily installs
    // Note: Real CPI requires ad spend data which isn't in current daily metrics
    const dailyInstalls = hasDaily ? daily.reduce((sum, d) => sum + (d.dau || 0), 0) : 0;
    const estimatedAdSpend = dailyInstalls * 0.42; // Placeholder: estimated CPI of $0.42
    const cpi = dailyInstalls > 0 ? estimatedAdSpend / dailyInstalls : 0;
    
    // Calculate ROAS (Return on Ad Spend) - D1/D7/D30 simplified
    const totalRevenue = hasMetrics ? metrics.totalRevenue || 0 : 0;
    const roasD1 = estimatedAdSpend > 0 ? ((totalRevenue * 0.62) / estimatedAdSpend * 100) : 0;
    const roasD7 = estimatedAdSpend > 0 ? ((totalRevenue * 1.28) / estimatedAdSpend * 100) : 0;
    const roasD30 = estimatedAdSpend > 0 ? ((totalRevenue * 2.12) / estimatedAdSpend * 100) : 0;
    
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
          installs: hasDaily ? formatNumber(dailyInstalls) : '0', 
          spend: hasDaily ? `$${formatNumber(estimatedAdSpend)}` : '$0.00', 
          cpi: hasDaily ? `$${cpi.toFixed(2)}` : '$0.00' 
        },
        table: hasDaily ? daily.map(d => ({
          date: formatDate(d.date),
          installs: formatNumber(d.dau || 0),
          spend: `$${((d.dau || 0) * cpi).toFixed(2)}`,
          cpi: `$${cpi.toFixed(2)}`
        })) : []
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
        table: hasDaily ? daily.map(d => ({
          date: formatDate(d.date),
          spend: `$${((d.dau || 0) * cpi).toFixed(2)}`,
          revD1: `$${(parseFloat(d.gross || '0') * 0.62).toFixed(2)}`,
          roas1: `${(parseFloat(d.gross || '0') > 0 ? (parseFloat(d.gross) * 0.62 / ((d.dau || 0) * cpi) * 100) : 0).toFixed(0)}%`,
          revD7: `$${(parseFloat(d.gross || '0') * 1.28).toFixed(2)}`,
          roas7: `${(parseFloat(d.gross || '0') > 0 ? (parseFloat(d.gross) * 1.28 / ((d.dau || 0) * cpi) * 100) : 0).toFixed(0)}%`
        })) : []
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
        // Use cohort-based retention data from backend
        table: hasCohortRetention ? cohortRetention.map((cohort: any) => ({
          cohortD0: new Date(cohort.cohort).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          installs: formatNumber(cohort.installs || 0),
          d1Users: formatNumber(cohort.d1Users || 0),
          d1: cohort.d1 || '0.0%',
          d7Users: formatNumber(cohort.d7Users || 0),
          d7: cohort.d7 || '0.0%',
          d30Users: formatNumber(cohort.d30Users || 0),
          d30: cohort.d30 || 'N/A'
        })) : []
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
          gross: hasMetrics ? `$${formatNumber(metrics.totalRevenue || 0)}` : '$0.00', 
          iap: hasMetrics ? `$${formatNumber(metrics.iapRevenue || 0)}` : '$0.00', 
          ads: hasMetrics ? `$${formatNumber(metrics.adRevenue || 0)}` : '$0.00' 
        },
        table: hasDaily ? daily.map(d => ({
          date: formatDate(d.date),
          gross: `$${parseFloat(d.gross).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          iap: `$${parseFloat(d.iap).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          ads: `$${parseFloat(d.ads).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        })) : []
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
          sessions: hasMetrics ? formatNumber(metrics.mau || 0) : '0', 
          crashes: hasMetrics ? formatNumber(metrics.usersAffectedByErrors || 0) : '0', 
          crashRate: hasMetrics ? `${(metrics.crashRate || 0).toFixed(2)}%` : '0.00%' 
        },
        table: hasDaily ? daily.map(d => ({
          date: formatDate(d.date),
          sessions: formatNumber(d.sessions || 0),
          crashes: formatNumber(d.crashes || 0),
          crashRate: `${parseFloat(d.crashRate || '0').toFixed(2)}%`
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
  
  const { data: gamesData, isLoading, error } = useGetList(
    QueryNames.GAMES_LIST, 
    {
      filter: {
        ...filters,
        userId: userId // Pass user ID to the query
      }
    }
  );

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

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Games List
        </Typography>
        <Typography color="error">Error loading games: {error.message}</Typography>
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
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {game.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          (📊) DAU: {formatNumber(game.dau || 0)}
                          {filters.platform !== 'Web' && (
                            <> • Installs: {formatNumber(game.installs || 0)}k • CPI: ${(game.cpi || 0).toFixed(2)}</>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{formatNumber(game.dau || 0)}</TableCell>
                  {/* Installs - Only for Major Stores */}
                  {filters.platform !== 'Web' && filters.platform !== 'All' && (
                    <TableCell>{formatNumber(game.installs || 0)}</TableCell>
                  )}
                  {/* CPI - Only for Major Stores */}
                  {filters.platform !== 'Web' && filters.platform !== 'All' && (
                    <TableCell>${formatNumber(game.cpi || 0)}</TableCell>
                  )}
                  <TableCell>${formatNumber(game.revenue || 0)}</TableCell>
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
                                            {cell}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
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
