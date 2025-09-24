import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button, 
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
  InputLabel,
  TextField,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  getAvailableReports, 
  DEFAULT_CONFIGURATION
} from '../../common/report-config';
import { 
  Assessment, 
  ArrowBack, 
  FilterList, 
  GetApp, 
  Refresh,
  Search,
  Visibility
} from '@mui/icons-material';
import { exportReportData } from '../../common/export-utils';

interface ReportItem {
  id: string;
  title: string;
  type: string;
  lastRun: string;
  status: 'Open' | 'Saved';
  game?: string;
  studio?: string;
}

interface ReportsHubProps {
  gameName?: string;
  filters?: any;
  onBack?: () => void;
  onOpenReport?: (reportType: string, gameName: string, studioName?: string) => void;
}

export const ReportsHub: React.FC<ReportsHubProps> = ({
  gameName,
  filters = {},
  onBack,
  onOpenReport
}) => {
  const userRole = localStorage.getItem("userRole") as 'developer' | 'publisher';
  
  // Filter state
  const [reportFilters, setReportFilters] = useState({
    platform: filters.platform || 'All',
    subPlatform: filters.subPlatform || 'All',
    game: filters.game || gameName || 'All',
    studio: userRole === 'publisher' ? 'All' : 'Current Studio',
    region: filters.region || 'All',
    dateRange: filters.dateRange || 'Last 30d',
    currency: filters.currency || 'USD'
  });

  // Reports data
  const [openReports, setOpenReports] = useState<ReportItem[]>([]);
  const [savedReports, setSavedReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Generate reports based on configuration
  useEffect(() => {
    if (!userRole || (userRole !== 'developer' && userRole !== 'publisher')) {
      setOpenReports([]);
      setSavedReports([]);
      return;
    }

    // Load configuration from localStorage or use default
    const savedConfig = localStorage.getItem('reportConfiguration');
    const configuration = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIGURATION;

    // Get available reports based on current filters
    const availableReports = getAvailableReports(
      reportFilters.platform,
      reportFilters.subPlatform,
      userRole,
      configuration
    );

    // Convert configuration reports to ReportItem format
    const mockOpenReports: ReportItem[] = availableReports.map((report, index) => ({
      id: `${index + 1}`,
      title: report.name,
      type: report.name,
      lastRun: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'Open',
      game: gameName || 'Pickle Ball Clash',
      studio: userRole === 'publisher' ? 'Studio A' : undefined
    }));

    const mockSavedReports: ReportItem[] = [
      {
        id: 's1',
        title: 'Cohort Report',
        type: 'Retention',
        lastRun: 'Mar 25',
        status: 'Saved',
        game: gameName || 'Pickle Ball Clash',
        studio: userRole === 'publisher' ? 'Studio A' : undefined
      }
    ];

    setOpenReports(mockOpenReports);
    setSavedReports(mockSavedReports);
  }, [userRole, gameName, reportFilters.platform, reportFilters.subPlatform]);

  const handleFilterChange = (filterType: string, value: string) => {
    setReportFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleOpenReport = (report: ReportItem) => {
    console.log('Opening report:', report);
    if (onOpenReport) {
      onOpenReport(report.type, report.game || gameName || '', report.studio);
    }
  };

  const handleExportReport = (report: ReportItem) => {
    console.log('Exporting report:', report);
    const mockData = [
      { date: '2024-01-01', value: 100, metric: 'Sample Data' },
      { date: '2024-01-02', value: 150, metric: 'Sample Data' }
    ];
    
    exportReportData(
      report.type,
      mockData,
      reportFilters,
      report.game,
      report.studio
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const filteredOpenReports = openReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSavedReports = savedReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!userRole || (userRole !== 'developer' && userRole !== 'publisher')) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Alert severity="error">
          Access Denied: Reports are only available for developer and publisher users.
        </Alert>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Your role: {userRole || 'Not set'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Reports Hub
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {onBack && (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterList sx={{ mr: 1 }} />
            <Typography variant="h6">Filters</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Platform</InputLabel>
                <Select
                  value={reportFilters.platform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="iOS">iOS</MenuItem>
                  <MenuItem value="Android">Android</MenuItem>
                  <MenuItem value="Web">Web</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sub-Platform</InputLabel>
                <Select
                  value={reportFilters.subPlatform}
                  onChange={(e) => handleFilterChange('subPlatform', e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Poki">Poki</MenuItem>
                  <MenuItem value="CrazyGames">CrazyGames</MenuItem>
                  <MenuItem value="Facebook">Facebook</MenuItem>
                  <MenuItem value="Microsoft">Microsoft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {userRole === 'publisher' && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Studio</InputLabel>
                  <Select
                    value={reportFilters.studio}
                    onChange={(e) => handleFilterChange('studio', e.target.value)}
                  >
                    <MenuItem value="All">All Studios</MenuItem>
                    <MenuItem value="Studio A">Studio A</MenuItem>
                    <MenuItem value="Studio B">Studio B</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Game</InputLabel>
                <Select
                  value={reportFilters.game}
                  onChange={(e) => handleFilterChange('game', e.target.value)}
                >
                  <MenuItem value="All">All Games</MenuItem>
                  <MenuItem value="Pickle Ball Clash">Pickle Ball Clash</MenuItem>
                  <MenuItem value="Food Jam">Food Jam</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Region</InputLabel>
                <Select
                  value={reportFilters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                >
                  <MenuItem value="All">All Regions</MenuItem>
                  <MenuItem value="North America">North America</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="Asia">Asia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={reportFilters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <MenuItem value="Last 7d">Last 7 days</MenuItem>
                  <MenuItem value="Last 30d">Last 30 days</MenuItem>
                  <MenuItem value="Last 90d">Last 90 days</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      {/* Open Reports */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Open Reports ({filteredOpenReports.length})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Game</TableCell>
                  {userRole === 'publisher' && <TableCell>Studio</TableCell>}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOpenReports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" fontWeight="medium">
                          {report.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.type} 
                        size="small" 
                        color={userRole === 'developer' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>{report.lastRun}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status} 
                        size="small" 
                        color={report.status === 'Open' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{report.game}</TableCell>
                    {userRole === 'publisher' && (
                      <TableCell>{report.studio}</TableCell>
                    )}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Report">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenReport(report)}
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export Report">
                          <IconButton
                            size="small"
                            onClick={() => handleExportReport(report)}
                            color="secondary"
                          >
                            <GetApp />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Saved Reports */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Saved Reports ({filteredSavedReports.length})
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Game</TableCell>
                  {userRole === 'publisher' && <TableCell>Studio</TableCell>}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSavedReports.map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2" fontWeight="medium">
                          {report.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={report.type} 
                        size="small" 
                        color={userRole === 'developer' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>{report.lastRun}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status} 
                        size="small" 
                        color={report.status === 'Saved' ? 'info' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{report.game}</TableCell>
                    {userRole === 'publisher' && (
                      <TableCell>{report.studio}</TableCell>
                    )}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Report">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenReport(report)}
                            color="primary"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export Report">
                          <IconButton
                            size="small"
                            onClick={() => handleExportReport(report)}
                            color="secondary"
                          >
                            <GetApp />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};