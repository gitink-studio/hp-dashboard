import React, { useState, useEffect, useRef } from 'react';
import { formatNumber } from '../../common/utils';
import { ROOT_URL, GRAPHQL_URL } from '../../common/constants';

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
  FormControl,
  Select,
  MenuItem,
  Grid,
  Button,
  Card,
  CardContent,
  Collapse,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  Assessment, 
  AttachMoney, 
  Schedule,
  Description,
  Assignment,
  Notifications,
  HealthAndSafety,
  ExpandMore,
  ExpandLess,
  GetApp,
  Visibility,
  MonetizationOn,
  TrendingUp,
  Security
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
    region: "All",
    game: "All",
    dateRange: "30d",
    currency: "USD"
  });

  // State for managing expanded games (accordion)
  const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());
  
  // State for managing expanded studios (accordion)
  const [expandedStudios, setExpandedStudios] = useState<Set<string>>(new Set());
  
  // State for revenue by geo and payout summary data
  const [revenueByGeoData, setRevenueByGeoData] = useState<any[]>([]);
  const [payoutSummaryData, setPayoutSummaryData] = useState<any>(null);
  const [loadingStudioData, setLoadingStudioData] = useState(false);
  
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
    
    const formatNumber = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num.toString();
    };
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    return [
      {
        id: 'cpi-trends',
        title: 'CPI Trends',
        type: 'CPI',
        icon: <TrendingUp />,
        color: '#1976d2',
        data: {
          kpi: {
            // Use metrics.installs which comes from backend
            installs: formatNumber(metrics.installs || 0),
            spend: `$${formatNumber((metrics.installs || 0) * (metrics.avgCpi || 0))}`,
            cpi: `$${(metrics.avgCpi || 0).toFixed(2)}`
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            // Daily installs not tracked - show sessions as approximation
            installs: formatNumber(day.sessions || 0),
            spend: `$${formatNumber((day.sessions || 0) * (day.avgCpi || 0))}`,
            cpi: `$${(day.avgCpi || 0).toFixed(2)}`
          }))
        }
      },
      {
        id: 'roas-trends',
        title: 'ROAS Trends',
        type: 'ROAS',
        icon: <TrendingUp />,
        color: '#2e7d32',
        data: {
          kpi: {
            roasD1: `${(metrics.roasD1 || 0).toFixed(0)}%`,
            roasD7: `${(metrics.roasD7 || 0).toFixed(0)}%`,
            roasD30: `${(metrics.roasD30 || 0).toFixed(0)}%`
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            spend: `$${formatNumber(day.spend || 0)}`,
            revD1: `$${formatNumber(day.revenueD1 || 0)}`,
            roas1: `${((day.revenueD1 || 0) / (day.spend || 1) * 100).toFixed(0)}%`,
            revD7: `$${formatNumber(day.revenueD7 || 0)}`,
            roas7: `${((day.revenueD7 || 0) / (day.spend || 1) * 100).toFixed(0)}%`,
            revD30: `$${formatNumber(day.revenueD30 || 0)}`,
            roas30: `${((day.revenueD30 || 0) / (day.spend || 1) * 100).toFixed(0)}%`
          }))
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
          table: (() => {
            // Use newUsers from metrics as installs (for D0 cohort)
            const totalInstalls = metrics.newUsers || 0;
            
            // Retention percentages (backend returns as percentage 0-100, convert to decimal)
            const d1Percentage = (metrics.retentionD1 || 0) / 100;
            const d7Percentage = (metrics.retentionD7 || 0) / 100;
            const d30Percentage = metrics.retentionD30 ? metrics.retentionD30 / 100 : 0;
            
            // Return a summary row with cohort-based data
            return [{
              cohort: 'Overall Period',
              installs: formatNumber(totalInstalls),
              d1Users: formatNumber(Math.round(totalInstalls * d1Percentage)),
              d1: `${(metrics.retentionD1 || 0).toFixed(1)}%`,
              d7Users: formatNumber(Math.round(totalInstalls * d7Percentage)),
              d7: `${(metrics.retentionD7 || 0).toFixed(1)}%`,
              d30Users: formatNumber(Math.round(totalInstalls * d30Percentage)),
              d30: metrics.retentionD30 ? `${metrics.retentionD30.toFixed(1)}%` : 'N/A'
            }];
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
            gross: `$${formatNumber(metrics.totalRevenue || 0)}`,
            iap: `$${formatNumber(metrics.iapRevenue || 0)}`,
            ads: `$${formatNumber(metrics.adRevenue || 0)}`
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            gross: formatNumber(day.totalRevenue || 0),
            iap: formatNumber(day.iapRevenue || 0),
            ads: formatNumber(day.adRevenue || 0)
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
            sessions: formatNumber(metrics.totalSessions || 0),
            crashes: formatNumber(metrics.totalCrashes || 0),
            crashRate: `${(((metrics.totalCrashes || 0) / (metrics.totalSessions || 1)) * 100).toFixed(2)}%`
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            sessions: formatNumber(day.sessions || 0),
            crashes: formatNumber(day.crashes || 0),
            crashRate: `${(((day.crashes || 0) / (day.sessions || 1)) * 100).toFixed(2)}%`
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
            gross: `$${formatNumber(metrics.totalRevenue || 0)}`,
            net: `$${formatNumber((metrics.totalRevenue || 0) * 0.7)}`,
            payoutDue: `$${formatNumber((metrics.totalRevenue || 0) * 0.6)}`
          },
          table: (metrics.geoBreakdown || []).map((geo: any) => ({
            country: geo.country,
            installs: formatNumber(geo.installs || 0),
            grossRev: `$${formatNumber(geo.revenue || 0)}`,
            revShare: '30%',
            netRev: `$${formatNumber((geo.revenue || 0) * 0.7)}`,
            payoutDue: `$${formatNumber((geo.revenue || 0) * 0.6)}`
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
            ecpm: `$${(metrics.avgEcpm || 0).toFixed(2)}`,
            fillRate: `${(metrics.fillRate || 0).toFixed(1)}%`,
            impressions: formatNumber(metrics.totalImpressions || 0)
          },
          table: daily.map(day => ({
            date: formatDate(day.date),
            ecpm: `$${(day.avgEcpm || 0).toFixed(2)}`,
            fillRate: `${(day.fillRate || 0).toFixed(1)}%`,
            impressions: formatNumber(day.impressions || 0)
          }))
        }
      }
    ];
  };
  
  // Handle studio accordion expansion
  const handleToggleStudioExpanded = async (studioId: string) => {
    const newExpanded = new Set(expandedStudios);
    const isExpanding = !newExpanded.has(studioId);
    
    if (isExpanding) {
      newExpanded.add(studioId);
      setExpandedStudios(newExpanded);
      
      // Fetch studio-level data
      setLoadingStudioData(true);
      try {
        // Fetch revenue by geo
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
                studio: studioId,
                game: 'All',
                dateRange: filters.dateRange,
                currency: filters.currency
              }
            }
          })
        });
        const geoResult = await geoResponse.json();
        if (geoResult.data?.revenueByGeo) {
          setRevenueByGeoData(geoResult.data.revenueByGeo);
        }
        
        // Fetch payout summary
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
                studio: studioId,
                dateRange: filters.dateRange,
                currency: filters.currency
              }
            }
          })
        });
        const payoutResult = await payoutResponse.json();
        if (payoutResult.data?.payoutSummary) {
          setPayoutSummaryData(payoutResult.data.payoutSummary);
        }
      } catch (error) {
        console.error('Error fetching studio data:', error);
      } finally {
        setLoadingStudioData(false);
      }
    } else {
      newExpanded.delete(studioId);
      setExpandedStudios(newExpanded);
    }
  };

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⚠️ Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, []);
  
  const [kpiData] = useState({
    grossRev: 125000,
    netRev: 87500,
    payoutDue: 25000,
    ecpm: 2.45,
    fillRate: 94.2,
    impressions: 125.5,
    ivtFraud: 1.2,
    compliance: 98.5,
    crashRate: 0.8,
    retentionD1: 65.4,
    roasD7: 3.2
  });

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
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              games {
                id
                name
                additionalGameData
              }
            }
          `
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching all games:', result.errors);
        setAllGames([]);
      } else {
        const games = result.data.games || [];
        // Transform games to match expected structure
        const transformedGames = games.map((game: any) => ({
          id: game.id,
          name: game.name,
          icon: game.additionalGameData?.icon || '🎮',
          dau: game.additionalGameData?.dau || 0,
          installs: game.additionalGameData?.installs || 0,
          cpi: game.additionalGameData?.cpi || 0,
          revenue: game.additionalGameData?.revenue || 0,
          studioId: game.additionalGameData?.studioId || null,
          studio: game.additionalGameData?.studio || null
        }));
        console.log('✅ All games fetched:', transformedGames.length, 'games');
        console.log(`🎯 Setting allGames state with ${transformedGames.length} games (fallback)`);
        setAllGames(transformedGames);
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
          region: undefined,
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
            const games = result.data.publisherGamesList;
            console.log('✅ Initial games loaded:', games.length);
            setGames(games);
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

  // Fetch games based on current filters for display
  const fetchGames = async (currentFilters: typeof filters) => {
    try {
      setLoading(true);
      
      // Convert "All" to undefined for backend
      const cleanedFilters = {
        studio: currentFilters.studio !== 'All' ? currentFilters.studio : undefined,
        platform: currentFilters.platform !== 'All' ? currentFilters.platform : undefined,
        subPlatform: currentFilters.subPlatform !== 'All' ? currentFilters.subPlatform : undefined,
        region: currentFilters.region !== 'All' ? currentFilters.region : undefined,
        game: currentFilters.game !== 'All' ? currentFilters.game : undefined,
        dateRange: currentFilters.dateRange,
        currency: currentFilters.currency
      };
      
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
            filters: cleanedFilters
          }
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching games:', result.errors);
        setGames([]);
        setAllGames([]);
      } else {
        const games = result.data.publisherGamesList || [];
        console.log('✅ Fetched games:', games.length);
        setGames(games);
        setAllGames(games); // Also update allGames for display
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setGames([]);
      setAllGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available games for the game filter dropdown based on current filters
  const fetchAvailableGames = async (currentFilters: typeof filters) => {
    try {
      setLoadingAvailableGames(true);
      console.log('🎮 Fetching available games with filters:', currentFilters);
      
      // Build filter object for the query
      const studioId = currentFilters.studio !== 'All' ? 
        studios.find(s => s.name === currentFilters.studio)?.id : undefined;
      
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
        region: currentFilters.region !== 'All' ? currentFilters.region : undefined,
        dateRange: currentFilters.dateRange,
        currency: currentFilters.currency
      };
      
      console.log('🎯 Studio filter mapping:', {
        studioName: currentFilters.studio,
        studioId: studioId,
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
        const games = result.data.publisherGamesList || [];
        console.log(`✅ Fetched ${games.length} available games:`, {
          games: games.map((g: any) => g.name),
          filters: queryFilters,
          studioFilter: currentFilters.studio,
          studioId: queryFilters.studio
        });
        console.log(`🎯 Setting allGames state with ${games.length} games`);
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

  // Fetch games when filters change
  useEffect(() => {
    console.log('🔄 useEffect triggered with:', {
      loadingFilters,
      platformsLength: platforms.length,
      studiosLength: studios.length,
      filters
    });
    
    if (!loadingFilters) {
      if (platforms.length > 0 && studios.length > 0) {
        console.log('🔄 Filters changed, fetching games and available games:', filters);
        fetchGames(filters);
        
        // Call fetchAvailableGames with error handling
        fetchAvailableGames(filters).catch(error => {
          console.error('❌ Error in fetchAvailableGames:', error);
        });
      } else {
        console.log('⚠️ Platforms or studios not loaded yet, setting loading to false and using fallback');
        setLoading(false);
        // Try to fetch all games as fallback
        fetchAllGames();
      }
    }
  }, [filters, loadingFilters, platforms.length, studios.length]);

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
      } else if (filterType === 'region') {
        console.log(`🔄 Region changed to: ${value}, resetting game to 'All'`);
        newFilters.game = 'All';
      }
      
      console.log(`🎯 New filters after ${filterType} change:`, newFilters);
      console.log(`🎯 About to update filters state with:`, newFilters);
      
      // Call fetchAvailableGames directly with the new filters
      if (filterType === 'studio' || filterType === 'platform' || filterType === 'subPlatform' || filterType === 'region') {
        console.log(`🎯 Calling fetchAvailableGames directly for ${filterType} change`);
        fetchAvailableGames(newFilters).catch(error => {
          console.error('❌ Error in fetchAvailableGames from handleFilterChange:', error);
        });
      }
      
      return newFilters;
    });
  };

  // Get filtered games based on current filters
  const getFilteredGames = () => {
    console.log(`🎮 getFilteredGames called with allGames: ${allGames.length} games`);
    
    // allGames is already filtered by fetchAvailableGames based on current filters
    // So we can return it directly without additional filtering
    console.log(`🎮 getFilteredGames returning ${allGames.length} games (already filtered by fetchAvailableGames)`);
    return allGames;
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

  // Reset game filter if selected game is not available in current games list
  useEffect(() => {
    if (filters.game !== 'All' && availableGames.length > 0) {
      const gameExists = availableGames.some(game => game.id === filters.game);
      if (!gameExists) {
        console.log(`🔄 Selected game '${filters.game}' not available, resetting to 'All'`);
        setFilters(prev => ({
          ...prev,
          game: 'All'
        }));
      }
    }
  }, [availableGames, filters.game]);

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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AttachMoney sx={{ mr: 1 }} />
            Publisher KPIs (Last 30 days)
          </Typography>
          
          {/* First Row of KPIs */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Gross Rev</Typography>
                <Typography variant="h6" color="primary">${formatNumber(kpiData.grossRev)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Net Rev</Typography>
                <Typography variant="h6" color="success.main">${formatNumber(kpiData.netRev)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Payout Due</Typography>
                <Typography variant="h6" color="warning.main">${formatNumber(kpiData.payoutDue)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">eCPM</Typography>
                <Typography variant="h6">${kpiData.ecpm.toFixed(2)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Fill Rate</Typography>
                <Typography variant="h6" color="success.main">{kpiData.fillRate}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Impressions</Typography>
                <Typography variant="h6">{kpiData.impressions}M</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Second Row of KPIs */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">IVT (Fraud)</Typography>
                <Typography variant="h6" color="error.main">{kpiData.ivtFraud}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Compliance</Typography>
                <Typography variant="h6" color="success.main">{kpiData.compliance}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Crash Rate</Typography>
                <Typography variant="h6" color="error.main">{kpiData.crashRate}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">Retention D1</Typography>
                <Typography variant="h6" color="success.main">{kpiData.retentionD1}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary">ROAS D7</Typography>
                <Typography variant="h6" color="primary">{kpiData.roasD7}%</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {/* Empty space for alignment */}
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<Schedule />} size="small">
              Payout Schedule
            </Button>
            <Button variant="outlined" startIcon={<Description />} size="small">
              Invoices
            </Button>
            <Button variant="outlined" startIcon={<Assignment />} size="small">
              Contracts
            </Button>
            <Button variant="outlined" startIcon={<Notifications />} size="small">
              Alerts ▼
            </Button>
            <Button variant="outlined" startIcon={<HealthAndSafety />} size="small">
              Data Health ▼
            </Button>
          </Box>
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
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                displayEmpty
              >
                <MenuItem value="All">Region [ All ▼ ]</MenuItem>
                <MenuItem value="US">US</MenuItem>
                <MenuItem value="EU">EU</MenuItem>
                <MenuItem value="APAC">APAC</MenuItem>
                <MenuItem value="Global">Global</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value={filters.game}
                onChange={(e) => handleFilterChange('game', e.target.value)}
                displayEmpty
                disabled={loadingAvailableGames}
              >
                <MenuItem value="All">
                  Game [ All ▼ ] {loadingAvailableGames ? '(Loading...)' : `(${availableGames.length} games)`}
                </MenuItem>
                {availableGames.map((game: any) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
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
                <MenuItem value="USD">Currency [ USD ▼ ]</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="JPY">JPY</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <Select
                value="Default"
                displayEmpty
              >
                <MenuItem value="Default">Saved View [ Default ▼ ]</MenuItem>
                <MenuItem value="Custom1">Custom View 1</MenuItem>
                <MenuItem value="Custom2">Custom View 2</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button variant="outlined" size="small">
              Save Current
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button variant="outlined" size="small">
              Manage Views
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body2" color="textSecondary">
              {filteredGames.length} games found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Games List by Studio */}
      <TableContainer component={Paper}>
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
          <TableBody>
            {filteredGames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={filters.platform === 'Web' ? 5 : 7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No games found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              (Object.entries(gamesByStudio) as [string, any[]][]).map(([studioName, games], index) => {
                const studioDisplayName = studioName;
                const studioId = games[0]?.studioId || studioName;
                const isStudioExpanded = expandedStudios.has(studioId);
                
                return (
                  <React.Fragment key={`studio-${studioId}-${index}`}>
                      {/* Studio Header Row - Clickable to expand studio-level data */}
                      <TableRow 
                        sx={{ 
                          backgroundColor: '#f5f5f5',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#e8e8e8' }
                        }}
                        onClick={() => handleToggleStudioExpanded(studioId)}
                      >
                        <TableCell colSpan={filters.platform === 'Web' ? 5 : 7}>
                          <Box display="flex" alignItems="center">
                            <IconButton size="small" sx={{ mr: 1 }}>
                              {isStudioExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                              {studioDisplayName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                              {isStudioExpanded ? 'Hide Studio Reports' : 'Show Studio Reports'}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                      
                      {/* Studio-Level Reports Accordion */}
                      <TableRow>
                        <TableCell colSpan={filters.platform === 'Web' ? 5 : 7} sx={{ p: 0 }}>
                          <Collapse in={isStudioExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 3, backgroundColor: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
                              {loadingStudioData ? (
                                <Typography>Loading studio reports...</Typography>
                              ) : (
                                <>
                                  {/* Revenue by Geo Section */}
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
                                                <TableCell align="right">{formatNumber(row.installs)}k</TableCell>
                                                <TableCell align="right">${formatNumber(row.grossRevenue)}</TableCell>
                                                <TableCell align="right">{row.revenueShare}%</TableCell>
                                                <TableCell align="right">${formatNumber(row.netRevenue)}</TableCell>
                                                <TableCell align="right">${formatNumber(row.payoutDue)}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </CardContent>
                                    </Card>
                                  )}
                                  
                                  {/* Payout Summary Section */}
                                  {payoutSummaryData && payoutSummaryData.studios && (
                                    <Card sx={{ mb: 2, border: '2px solid #2e7d3230' }}>
                                      <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2e7d32' }}>
                                          💰 Payout Summary - {studioDisplayName}
                                        </Typography>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                          Total Net: ${formatNumber(payoutSummaryData.totalNet)} | 
                                          Paid: ${formatNumber(payoutSummaryData.totalPaid)} | 
                                          Outstanding: ${formatNumber(payoutSummaryData.totalOutstanding)}
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
                                                <TableCell align="right">${formatNumber(studio.grossRevenue)}</TableCell>
                                                <TableCell align="right">${formatNumber(studio.netRevenue)}</TableCell>
                                                <TableCell align="right">${formatNumber(studio.paid)}</TableCell>
                                                <TableCell align="right">${formatNumber(studio.outstanding)}</TableCell>
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
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    
                    {/* Games for this studio */}
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
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {game.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  (📊) DAU: {formatNumber(game.dau || 0)}
                                  {filters.platform !== 'Web' && (
                                    <>  Installs: {formatNumber(game.installs || 0)}k  CPI: ${(game.cpi || 0).toFixed(2)}</>
                                  )}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{formatNumber(game.dau || 0)}</TableCell>
                          <TableCell>${formatNumber(game.revenue || 0)}</TableCell>
                          <TableCell>${formatNumber((game.revenue || 0) * 0.8)}</TableCell>
                          {filters.platform !== 'Web' && (
                            <TableCell>{formatNumber(game.installs || 0)}</TableCell>
                          )}
                          {filters.platform !== 'Web' && (
                            <TableCell>${formatNumber(game.cpi || 0)}</TableCell>
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

                        {/* Reports Accordion Row */}
                        <TableRow>
                          <TableCell colSpan={filters.platform === 'Web' ? 5 : 7} sx={{ p: 0 }}>
                            <Collapse in={expandedGames.has(game.id)} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, backgroundColor: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
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
                                                      {String(cell)}
                                                    </TableCell>
                                                  ))}
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
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
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
