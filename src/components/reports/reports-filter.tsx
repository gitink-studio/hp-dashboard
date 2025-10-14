import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Divider
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
  Refresh
} from '@mui/icons-material';

interface ReportsFilterProps {
  userRole: 'developer' | 'publisher';
  filters: any;
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

export const ReportsFilter: React.FC<ReportsFilterProps> = ({
  userRole,
  filters,
  onFilterChange,
  onClearFilters,
  onRefresh
}) => {
  const [expanded, setExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filterType: string, value: string) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      platform: 'All',
      subPlatform: 'All',
      game: 'All',
      studio: userRole === 'publisher' ? 'All' : 'Current Studio',
      region: 'All',
      dateRange: 'Last 30d',
      currency: 'USD'
    };
    onFilterChange(defaultFilters);
    setSearchTerm('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.platform !== 'All') count++;
    if (filters.subPlatform !== 'All') count++;
    if (filters.game !== 'All') count++;
    if (filters.studio !== 'All' && filters.studio !== 'Current Studio') count++;
    if (filters.region !== 'All') count++;
    if (filters.dateRange !== 'Last 30d') count++;
    if (filters.currency !== 'USD') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <FilterList color="primary" />
          <Typography variant="h6">
            Filters
            {activeFiltersCount > 0 && (
              <Chip 
                label={activeFiltersCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={onRefresh} size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear All Filters">
              <IconButton onClick={handleClearFilters} size="small">
                <Clear />
              </IconButton>
            </Tooltip>
            <IconButton 
              onClick={() => setExpanded(!expanded)} 
              size="small"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <Grid container spacing={2} alignItems="center">
            {/* Platform Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Platform</InputLabel>
                <Select
                  value={filters.platform}
                  label="Platform"
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                >
                  <MenuItem value="All">All Platforms</MenuItem>
                  <MenuItem value="App Store">App Store</MenuItem>
                  <MenuItem value="Play Store">Play Store</MenuItem>
                  <MenuItem value="Web">Web</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Sub-platform Filter (only for Web) */}
            {filters.platform === 'Web' && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sub-platform</InputLabel>
                  <Select
                    value={filters.subPlatform}
                    label="Sub-platform"
                    onChange={(e) => handleFilterChange('subPlatform', e.target.value)}
                  >
                    <MenuItem value="All">All Sub-platforms</MenuItem>
                    <MenuItem value="Facebook">Facebook</MenuItem>
                    <MenuItem value="Microsoft">Microsoft</MenuItem>
                    <MenuItem value="Poki">Poki</MenuItem>
                    <MenuItem value="CrazyGames">CrazyGames</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Studio Filter (only for Publisher) */}
            {userRole === 'publisher' && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Studio</InputLabel>
                  <Select
                    value={filters.studio}
                    label="Studio"
                    onChange={(e) => handleFilterChange('studio', e.target.value)}
                  >
                    <MenuItem value="All">All Studios</MenuItem>
                    <MenuItem value="Studio A">Studio A</MenuItem>
                    <MenuItem value="Studio B">Studio B</MenuItem>
                    <MenuItem value="Studio C">Studio C</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Game Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Game</InputLabel>
                <Select
                  value={filters.game}
                  label="Game"
                  onChange={(e) => handleFilterChange('game', e.target.value)}
                >
                  <MenuItem value="All">All Games</MenuItem>
                  <MenuItem value="Pickle Ball Clash">Pickle Ball Clash</MenuItem>
                  <MenuItem value="Fruit Jam">Fruit Jam</MenuItem>
                  <MenuItem value="Slash Jam">Slash Jam</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Region Filter (only for Publisher) */}
            {userRole === 'publisher' && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={filters.region}
                    label="Region"
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                  >
                    <MenuItem value="All">All Regions</MenuItem>
                    <MenuItem value="US">United States</MenuItem>
                    <MenuItem value="IN">India</MenuItem>
                    <MenuItem value="BR">Brazil</MenuItem>
                    <MenuItem value="EU">Europe</MenuItem>
                    <MenuItem value="APAC">Asia Pacific</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Date Range Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  label="Date Range"
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  <MenuItem value="Last 7d">Last 7 days</MenuItem>
                  <MenuItem value="Last 14d">Last 14 days</MenuItem>
                  <MenuItem value="Last 30d">Last 30 days</MenuItem>
                  <MenuItem value="Last 90d">Last 90 days</MenuItem>
                  <MenuItem value="Custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Currency Filter (only for Publisher) */}
            {userRole === 'publisher' && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={filters.currency}
                    label="Currency"
                    onChange={(e) => handleFilterChange('currency', e.target.value)}
                  >
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="INR">INR (₹)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Search */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Typography variant="body2" color="text.secondary">
                  Active filters:
                </Typography>
                {filters.platform !== 'All' && (
                  <Chip
                    label={`Platform: ${filters.platform}`}
                    size="small"
                    onDelete={() => handleFilterChange('platform', 'All')}
                  />
                )}
                {filters.subPlatform !== 'All' && (
                  <Chip
                    label={`Sub-platform: ${filters.subPlatform}`}
                    size="small"
                    onDelete={() => handleFilterChange('subPlatform', 'All')}
                  />
                )}
                {filters.game !== 'All' && (
                  <Chip
                    label={`Game: ${filters.game}`}
                    size="small"
                    onDelete={() => handleFilterChange('game', 'All')}
                  />
                )}
                {userRole === 'publisher' && filters.studio !== 'All' && (
                  <Chip
                    label={`Studio: ${filters.studio}`}
                    size="small"
                    onDelete={() => handleFilterChange('studio', 'All')}
                  />
                )}
                {userRole === 'publisher' && filters.region !== 'All' && (
                  <Chip
                    label={`Region: ${filters.region}`}
                    size="small"
                    onDelete={() => handleFilterChange('region', 'All')}
                  />
                )}
                {filters.dateRange !== 'Last 30d' && (
                  <Chip
                    label={`Date: ${filters.dateRange}`}
                    size="small"
                    onDelete={() => handleFilterChange('dateRange', 'Last 30d')}
                  />
                )}
                {userRole === 'publisher' && filters.currency !== 'USD' && (
                  <Chip
                    label={`Currency: ${filters.currency}`}
                    size="small"
                    onDelete={() => handleFilterChange('currency', 'USD')}
                  />
                )}
              </Box>
            </>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};









