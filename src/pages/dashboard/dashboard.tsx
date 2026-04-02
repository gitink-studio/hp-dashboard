import { QueryNames, GRAPHQL_URL } from "../../common/constants";
import { getDashboardQueryDateBounds, getDefaultCustomDashboardRange, getLatestDashboardDataDateYmd } from "../../common/utils";
import { useAuthenticated } from "react-admin";
import { Stack, Typography, Box, Grid, FormControl, Select, MenuItem, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PortfolioKPIs } from "../../components/dashboard/portfolio-kpis";
import { DeveloperDashboardNotifications } from "../../components/dashboard/notification-system";
import { FilterList } from "@mui/icons-material";
import { GamesList } from "../../components/dashboard/games-list";

/** When platform filter is "All", disambiguate games with platform and sub-platform when present. */
function getDeveloperGameOptionLabel(game: { name?: string; platform?: string; subPlatform?: string }, platformFilterIsAll: boolean): string {
  const base = game.name || "Untitled";
  if (!platformFilterIsAll) {
    return base;
  }
  const plat = game.platform || "—";
  const sub =
    game.subPlatform && String(game.subPlatform).trim() !== "" && game.subPlatform !== "All"
      ? ` · ${game.subPlatform}`
      : "";
  return `${base} (${plat}${sub})`;
}

export const Dashboard = () => {
  useAuthenticated();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const normalizedRole = userRole ? userRole.toLowerCase().trim() : '';
  const isPublisher = normalizedRole.includes('publisher');

  if (!localStorage.getItem("userName")) return null;

  // Publishers belong on the publisher dashboard (e.g. wrong URL or stale route after login)
  useEffect(() => {
    if (isPublisher) {
      navigate(`/${QueryNames.GET_PUBLISHER_DASHBOARD_DATA}`, { replace: true });
    }
  }, [isPublisher, navigate]);

  if (isPublisher) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Custom filter state for grid layout
  const [filters, setFilters] = useState({
    platform: "All",
    subPlatform: "All",
    game: "All",
    dateRange: "Last 30d",
    startDate: "",
    endDate: "",
  });

  // State for platform data from database
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [subPlatforms, setSubPlatforms] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /** Gate notifications until first-load fetches for this page finish (parity with publisher dashboard). */
  const [initialLoadGates, setInitialLoadGates] = useState({
    platforms: false,
    dashboardGames: false,
    portfolioKpis: false,
    gamesList: false,
  });
  const dashboardGamesFirstFetchDone = useRef(false);
  const portfolioKpisFirstFetchDone = useRef(false);
  const gamesListFirstFetchDone = useRef(false);

  const onPortfolioKpisFetchSettled = useCallback(() => {
    if (portfolioKpisFirstFetchDone.current) return;
    portfolioKpisFirstFetchDone.current = true;
    setInitialLoadGates((g) => ({ ...g, portfolioKpis: true }));
  }, []);

  const onGamesListFetchSettled = useCallback(() => {
    if (gamesListFirstFetchDone.current) return;
    gamesListFirstFetchDone.current = true;
    setInitialLoadGates((g) => ({ ...g, gamesList: true }));
  }, []);

  const developerMainDataReady = useMemo(
    () =>
      initialLoadGates.platforms &&
      initialLoadGates.dashboardGames &&
      initialLoadGates.portfolioKpis &&
      initialLoadGates.gamesList,
    [initialLoadGates],
  );

  useEffect(() => {
    if (!loading) {
      setInitialLoadGates((g) => (g.platforms ? g : { ...g, platforms: true }));
    }
  }, [loading]);

  // If platforms never load (empty), do not block notifications forever on dashboard games fetch.
  useEffect(() => {
    if (!loading && platforms.length === 0 && !dashboardGamesFirstFetchDone.current) {
      dashboardGamesFirstFetchDone.current = true;
      setInitialLoadGates((g) => ({ ...g, dashboardGames: true }));
    }
  }, [loading, platforms.length]);

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

  // Fetch games based on current filters (role-based: studioId passed in filters)
  const fetchGames = async (currentFilters: typeof filters) => {
    try {
      const studioId = localStorage.getItem("studioId") || undefined;
      const dateBounds = getDashboardQueryDateBounds(currentFilters);

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
              studioId,
              platform: currentFilters.platform,
              subPlatform: currentFilters.subPlatform,
              game: 'All',
              dateRange: currentFilters.dateRange,
              ...(dateBounds ? { startDate: dateBounds.startDate, endDate: dateBounds.endDate } : {}),
            },
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
    } finally {
      if (!dashboardGamesFirstFetchDone.current) {
        dashboardGamesFirstFetchDone.current = true;
        setInitialLoadGates((g) => ({ ...g, dashboardGames: true }));
      }
    }
  };

  // Fetch games when filters change
  useEffect(() => {
    if (platforms.length > 0) { // Only fetch after platforms are loaded
      fetchGames(filters);
    }
  }, [filters.platform, filters.subPlatform, filters.dateRange, filters.startDate, filters.endDate, platforms.length]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => {
      let next: typeof prev = { ...prev, [filterType]: value } as typeof prev;

      if (filterType === "dateRange") {
        if (value === "Custom") {
          const b = getDefaultCustomDashboardRange();
          next = {
            ...next,
            startDate: b.startDate,
            endDate: b.endDate,
          };
        } else {
          next = { ...next, startDate: "", endDate: "" };
        }
      }

      if (filterType === "platform") {
        next.subPlatform = "All";
        next.game = "All";
      }

      return next;
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

  const customDateMaxYmd = getLatestDashboardDataDateYmd();

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
            <FormControl size="small" sx={{ minWidth: filters.platform === "All" ? 280 : 120 }}>
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
                    {getDeveloperGameOptionLabel(game, filters.platform === "All")}
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
                <MenuItem value="Last 30d">Date [ 30d ▼ ]</MenuItem>
                <MenuItem value="Last 14d">14d</MenuItem>
                <MenuItem value="Last 7d">7d</MenuItem>
                <MenuItem value="Yesterday">Yesterday</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {filters.dateRange === "Custom" && (
            <>
              <Grid item>
                <TextField
                  type="date"
                  size="small"
                  label="From"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: customDateMaxYmd }}
                  value={filters.startDate}
                  onChange={(e) => {
                    let v = e.target.value;
                    if (v > customDateMaxYmd) v = customDateMaxYmd;
                    setFilters((prev) => {
                      const next = { ...prev, startDate: v };
                      if (next.endDate && next.endDate < v) next.endDate = v;
                      return next;
                    });
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  type="date"
                  size="small"
                  label="To"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: customDateMaxYmd }}
                  value={filters.endDate}
                  onChange={(e) => {
                    let v = e.target.value;
                    if (v > customDateMaxYmd) v = customDateMaxYmd;
                    setFilters((prev) => {
                      const next = { ...prev, endDate: v };
                      if (next.startDate && next.startDate > v) next.startDate = v;
                      return next;
                    });
                  }}
                />
              </Grid>
            </>
          )}

          {/* Action Buttons */}
          <Grid item sx={{ ml: 'auto' }}>
            <Box display="flex" gap={1}>
              <DeveloperDashboardNotifications fetchEnabled={developerMainDataReady} />
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
        <PortfolioKPIs filter={filters} onFetchSettled={onPortfolioKpisFetchSettled} />
      </Stack>

      {/* Games List Section - Custom Component */}
      <GamesList
        filters={filters}
        onReportsNavigation={handleReportsNavigation}
        onFetchSettled={onGamesListFetchSettled}
      />
    </>
  );
};
