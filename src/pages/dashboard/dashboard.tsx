import {
  useListController,
} from "react-admin";
import { QueryNames, GRAPHQL_URL } from "../../common/constants";
import { Stack, Typography, Box, Grid, FormControl, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { PlatformFilter } from "../../components/dashboard/platform-filter";
import { SubPlatformFilter } from "../../components/dashboard/sub-platform-filter";
import { GamesFilter } from "../../components/dashboard/games-filter";
import { DateFilter } from "../../components/dashboard/date-filter";
import { AdvancedDateFilter } from "../../components/dashboard/advanced-date-filter";
import { PortfolioKPIs } from "../../components/dashboard/portfolio-kpis";
import { ExportButton } from "../../components/dashboard/export-button";
import { AdvancedExport } from "../../components/dashboard/advanced-export";
import { SavedViewsManager } from "../../components/dashboard/saved-views-manager";
import { RealTimeUpdates } from "../../components/dashboard/real-time-updates";
import { NotificationSystem } from "../../components/dashboard/notification-system";
import { FilterList } from "@mui/icons-material";
import { ReportsHub } from "../../components/reports/reports-hub";
import { GamesList } from "../../components/dashboard/games-list";

export const Dashboard = () => {
  // Check user role for access control
  const userRole = localStorage.getItem("userRole");
  
  // Redirect non-developer users
  if (userRole && userRole !== 'developer') {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Access Denied: This dashboard is only available for developer users.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Your role: {userRole}
        </Typography>
      </Box>
    );
  }

  const listController = useListController({ resource: QueryNames.GAMES_LIST, });
  const customDatePicker = "Custom";
  const getDate = (data: any) => data === "Custom"
    ? data : data === 0
      ? "Today" : data === 1
        ? "Yesterday" : `Last ${data} days`;

  const Text = ({ data, ...props }: { data: string; }) => {
    return (<Typography sx={{ p: 2, pt: 0, }} {...props}> {data} </Typography>);
  }

  // Custom filter state for grid layout
  const [filters, setFilters] = useState({
    platform: "All",
    subPlatform: "All", 
    game: "All",
    dateRange: "Last 90d"
  });

  // State for platform data from database
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [subPlatforms, setSubPlatforms] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  // Fetch platforms from database
  useEffect(() => {
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
          console.error('Error fetching platforms:', result.errors);
          // Fallback to hardcoded platforms if database fails
          setPlatforms([
            { id: '1', name: 'All' },
            { id: '2', name: 'App Store (Apple)' },
            { id: '3', name: 'Play Store (Android)' },
            { id: '4', name: 'Web' }
          ]);
          setSubPlatforms([]);
        } else {
          setPlatforms(result.data.platforms);
          setSubPlatforms(result.data.gamePlatforms || []);
        }
      } catch (error) {
        console.error('Error fetching platforms:', error);
        // Fallback to hardcoded platforms if fetch fails
        setPlatforms([
          { id: '1', name: 'All' },
          { id: '2', name: 'App Store (Apple)' },
          { id: '3', name: 'Play Store (Android)' },
          { id: '4', name: 'Web' }
        ]);
        setSubPlatforms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  // Fetch games based on current filters
  const fetchGames = async (currentFilters: typeof filters) => {
    try {
      // Get current user ID from localStorage
      const userId = localStorage.getItem("userId");
      
      const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GamesList($filters: DashboardFiltersInput!, $testUserId: String) {
              gamesList(filters: $filters, testUserId: $testUserId) {
                id
                name
                icon
                dau
                installs
                cpi
                revenue
              }
            }
          `,
          variables: {
            filters: {
              platform: currentFilters.platform,
              subPlatform: currentFilters.subPlatform,
              game: 'All', // Always fetch all games for the filter options
              dateRange: currentFilters.dateRange,
              startDate: '2024-08-15',
              endDate: '2024-09-14'
            },
            testUserId: userId // Pass user ID to filter by studio
          }
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error('Error fetching games:', result.errors);
        setGames([]);
      } else {
        setGames(result.data.gamesList || []);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      setGames([]);
    }
  };

  // Fetch games when filters change
  useEffect(() => {
    if (platforms.length > 0) { // Only fetch after platforms are loaded
      fetchGames(filters);
    }
  }, [filters.platform, filters.subPlatform, platforms.length]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: value
      };
      
      // Reset sub-platform and game to "All" when platform changes
      if (filterType === 'platform') {
        newFilters.subPlatform = 'All';
        newFilters.game = 'All';
      }
      
      return newFilters;
    });
  };

  // Reset game filter if selected game is not available in current games list
  useEffect(() => {
    if (filters.game !== 'All' && games.length > 0) {
      const gameExists = games.some(game => game.id === filters.game);
      if (!gameExists) {
        setFilters(prev => ({
          ...prev,
          game: 'All'
        }));
      }
    }
  }, [games, filters.game]);

  // Navigation functions for Reports Hub
  const handleReportsNavigation = (gameName: string) => {
    // Navigate to reports page with game filter
    window.location.href = `#/reports?game=${encodeURIComponent(gameName)}&platform=${filters.platform}&subPlatform=${filters.subPlatform}&dateRange=${filters.dateRange}`;
  };

  return (
    <>
      {/* Grid Filter Bar - Matching Publisher Dashboard */}
      <Box sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <FilterList color="primary" />
          </Grid>
          
          {/* Platform Filter */}
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={filters.platform}
                displayEmpty
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                sx={{ '& .MuiSelect-select': { py: 0.5 } }}
                disabled={loading}
              >
                <MenuItem value="All">Platform [ All ▼ ]</MenuItem>
                {platforms.map((platform) => (
                  <MenuItem key={platform.id} value={platform.name}>
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sub Platform Filter - Only show for Web platform */}
          {filters.platform === 'Web' && (
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={filters.subPlatform}
                  displayEmpty
                  onChange={(e) => handleFilterChange('subPlatform', e.target.value)}
                  sx={{ '& .MuiSelect-select': { py: 0.5 } }}
                  disabled={loading}
                >
                  {[
                    <MenuItem key="all" value="All">All Sub Platform</MenuItem>,
                    ...subPlatforms
                      .filter(subPlatform => {
                        // Find the Web platform to match platformId
                        const webPlatform = platforms.find(p => p.name === 'Web');
                        return webPlatform && subPlatform.platformId === webPlatform.id;
                      })
                      .map((subPlatform) => (
                        <MenuItem key={subPlatform.id} value={subPlatform.name}>
                          {subPlatform.name}
                        </MenuItem>
                      ))
                  ]}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Games Filter */}
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={filters.game}
                displayEmpty
                onChange={(e) => handleFilterChange('game', e.target.value)}
                sx={{ '& .MuiSelect-select': { py: 0.5 } }}
                disabled={loading}
              >
                <MenuItem value="All">Game [ All ▼ ]</MenuItem>
                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date Filter */}
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={filters.dateRange}
                displayEmpty
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                sx={{ '& .MuiSelect-select': { py: 0.5 } }}
              >
                <MenuItem value="Last 90d">Date [ 90d ▼ ]</MenuItem>
                <MenuItem value="Last 30d">30d</MenuItem>
                <MenuItem value="Last 14d">14d</MenuItem>
                <MenuItem value="Last 7d">7d</MenuItem>
                <MenuItem value="Yesterday">Yesterday</MenuItem>
                <MenuItem value="Today">Today</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item sx={{ ml: 'auto' }}>
            <Box display="flex" gap={1}>
              <RealTimeUpdates onDataUpdate={(data) => console.log('Data updated:', data)} />
              <SavedViewsManager 
                currentFilters={filters}
                onLoadView={(filters) => console.log('Load view:', filters)}
                onSaveView={(name, filters) => console.log('Save view:', name, filters)}
              />
              <AdvancedExport filter={filters} type="portfolio" />
              <NotificationSystem onNotificationClick={(notification) => console.log('Notification clicked:', notification)} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Portfolio KPIs Section - Outside InfiniteList */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">
          Portfolio KPIs
        </Typography>
      </Box>
      <Stack direction="row">
        <PortfolioKPIs filter={filters} />
      </Stack>

      {/* Games List Section - Custom Component */}
      <GamesList 
        filters={filters}
        onReportsNavigation={handleReportsNavigation}
      />
    </>
  );
};
