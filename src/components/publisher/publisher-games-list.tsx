import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../common/utils';

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
  CardContent
} from '@mui/material';
import { 
  Assessment, 
  AttachMoney, 
  Schedule,
  Description,
  Assignment,
  Notifications,
  HealthAndSafety
} from '@mui/icons-material';

interface PublisherGamesListProps {
  onReportsNavigation: (gameName: string) => void;
}

export const PublisherGamesList: React.FC<PublisherGamesListProps> = ({ onReportsNavigation }) => {
  const [filters, setFilters] = useState({
    studio: "All",
    platform: "All",
    subPlatform: "All",
    region: "All",
    game: "All",
    dateRange: "30d",
    currency: "USD"
  });

  const [, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      const response = await fetch('http://localhost:3000/graphql', {
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
      const response = await fetch('http://localhost:3000/graphql', {
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
      const response = await fetch('http://localhost:3000/graphql', {
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
      const response = await fetch('http://localhost:3000/graphql', {
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
        
        // Load all games initially (with default filters)
        try {
          await fetchAvailableGames(filters);
        } catch (error) {
          console.log('⚠️ Filtered games fetch failed, using fallback method');
          await fetchAllGames();
        }
        
        console.log('✅ All filter data loaded successfully');
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
      const response = await fetch('http://localhost:3000/graphql', {
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
            filters: currentFilters
          }
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching games:', result.errors);
        setGames([]);
      } else {
        setGames(result.data.publisherGamesList || []);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setGames([]);
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

      const response = await fetch('http://localhost:3000/graphql', {
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
    
    if (!loadingFilters && platforms.length > 0 && studios.length > 0) {
      console.log('🔄 Filters changed, fetching games and available games:', filters);
      fetchGames(filters);
      
      // Call fetchAvailableGames with error handling
      fetchAvailableGames(filters).catch(error => {
        console.error('❌ Error in fetchAvailableGames:', error);
      });
    } else {
      console.log('⚠️ useEffect conditions not met:', {
        loadingFilters,
        platformsLength: platforms.length,
        studiosLength: studios.length
      });
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
              <TableCell>Payout Due</TableCell>
              {filters.platform !== 'Web' && <TableCell>Installs</TableCell>}
              {filters.platform !== 'Web' && <TableCell>CPI</TableCell>}
              <TableCell>Reports</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGames.length === 0 ? (
              <TableRow>
                <TableCell colSpan={filters.platform === 'Web' ? 6 : 8} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No games found matching the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              (() => {
                // Group games by studio
                const gamesByStudio = filteredGames.reduce((acc, game) => {
                  const studioName = game.studio?.name || 'Unknown Studio';
                  if (!acc[studioName]) {
                    acc[studioName] = [];
                  }
                  acc[studioName].push(game);
                  return acc;
                }, {} as Record<string, any[]>);

                return (Object.entries(gamesByStudio) as [string, any[]][]).map(([studioName, games]) => (
                  <React.Fragment key={studioName}>
                    {/* Studio Header Row */}
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell colSpan={filters.platform === 'Web' ? 6 : 8}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {studioName}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    
                    {/* Games for this studio */}
                    {games.map((game: any) => (
                      <TableRow key={game.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" sx={{ pl: 2 }}>
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
                        <TableCell>${formatNumber((game.revenue || 0) * 0.6)}</TableCell>
                        {filters.platform !== 'Web' && (
                          <TableCell>{formatNumber(game.installs || 0)}</TableCell>
                        )}
                        {filters.platform !== 'Web' && (
                          <TableCell>${formatNumber(game.cpi || 0)}</TableCell>
                        )}
                        <TableCell>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body2" color="textSecondary">
                              •••
                            </Typography>
                            <Tooltip title="View Reports">
                              <IconButton
                                size="small"
                                onClick={() => onReportsNavigation(game.name)}
                                color="primary"
                              >
                                <Assessment fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ));
              })()
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
