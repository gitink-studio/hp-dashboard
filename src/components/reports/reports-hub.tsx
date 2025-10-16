import React, { useState, useEffect, useCallback } from 'react';
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
  ArrowBack, 
  GetApp, 
  Refresh,
  Search,
  Visibility,
  Upload
} from '@mui/icons-material';
import { exportReportData } from '../../common/export-utils';
import { reportsService } from '../../services/reports.service';

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
  onOpenGameAnalyticsImport?: () => void;
}

export const ReportsHub: React.FC<ReportsHubProps> = ({
  gameName,
  filters = {},
  onBack,
  onOpenReport,
  onOpenGameAnalyticsImport
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

  // Generate reports from configuration (fallback)
  const generateReportsFromConfig = useCallback(() => {
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

    const mockOpenReports: ReportItem[] = availableReports.map((report, index) => ({
      id: `report-${index}`,
      title: report.name,
      type: report.category,
      lastRun: new Date().toISOString().split('T')[0],
      status: 'Open' as const,
      game: gameName || 'Pickle Ball Clash',
      studio: userRole === 'publisher' ? 'Studio A' : undefined
    }));

    const mockSavedReports: ReportItem[] = [
      {
        id: 'saved-1',
        title: 'Cohort Report',
        type: 'Retention',
        lastRun: '2024-03-25',
        status: 'Saved',
        game: gameName || 'Pickle Ball Clash',
        studio: userRole === 'publisher' ? 'Studio A' : undefined
      },
      {
        id: 'saved-2',
        title: 'Creative Performance',
        type: 'Ads',
        lastRun: '2024-03-20',
        status: 'Saved',
        game: gameName || 'Pickle Ball Clash',
        studio: userRole === 'publisher' ? 'Studio A' : undefined
      }
    ];

    setOpenReports(mockOpenReports);
    setSavedReports(mockSavedReports);
  }, [userRole, gameName, reportFilters.platform, reportFilters.subPlatform]);

  // Fetch reports data from backend
  const fetchReportsData = useCallback(async () => {
    if (!userRole || (userRole !== 'developer' && userRole !== 'publisher')) {
      setOpenReports([]);
      setSavedReports([]);
      return;
    }

    // Only fetch reports when a specific game is selected
    if (!reportFilters.game || reportFilters.game === 'All') {
      setOpenReports([]);
      setSavedReports([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching reports with filters:', reportFilters, 'userRole:', userRole);
      const result = await reportsService.getReportsHub(reportFilters, userRole);
      console.log('Reports API response:', result);
      setOpenReports(result.openReports || []);
      setSavedReports(result.savedReports || []);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      // Fallback to configuration-based reports
      generateReportsFromConfig();
    } finally {
      setLoading(false);
    }
  }, [userRole, reportFilters]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  const handleFilterChange = (filterType: string, value: string) => {
    setReportFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleOpenReport = (report: ReportItem) => {
    if (onOpenReport) {
      onOpenReport(report.type, report.game || gameName || '', report.studio);
    }
  };

  const handleExportReport = async (report: ReportItem) => {
    try {
      const reportTypeMap: { [key: string]: string } = {
        'CPI Trends': 'cpi-trends',
        'ROAS Trends': 'roas-trends',
        'Retention': 'retention',
        'Revenue Summary': 'revenue-summary',
        'Crash Rate': 'crash-rate',
        'Revenue by Geo': 'revenue-by-geo',
        'Payout Summary': 'payout-summary',
        'eCPM & Fill Rate': 'ecpm-fill-rate',
        'Compliance & IVT': 'compliance-ivt'
      };

      const apiEndpoint = reportTypeMap[report.title];
      if (apiEndpoint) {
        await reportsService.exportReportToCSV(apiEndpoint, reportFilters);
      } else {
        // Fallback to client-side export
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
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const filteredOpenReports = openReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.game && report.game.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSavedReports = savedReports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.game && report.game.toLowerCase().includes(searchTerm.toLowerCase()))
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
            variant="outlined"
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
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Platform</InputLabel>
                <Select
                  value={reportFilters.platform}
                  label="Platform"
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="App Store">App Store</MenuItem>
                  <MenuItem value="Play Store">Play Store</MenuItem>
                  <MenuItem value="Web">Web</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sub-platform</InputLabel>
                <Select
                  value={reportFilters.subPlatform}
                  label="Sub-platform"
                  onChange={(e) => handleFilterChange('subPlatform', e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Facebook">Facebook</MenuItem>
                  <MenuItem value="Microsoft">Microsoft</MenuItem>
                  <MenuItem value="Poki">Poki</MenuItem>
                  <MenuItem value="CrazyGames">CrazyGames</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Game</InputLabel>
                <Select
                  value={reportFilters.game}
                  label="Game"
                  onChange={(e) => handleFilterChange('game', e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pickle Ball Clash">Pickle Ball Clash</MenuItem>
                  <MenuItem value="Fruit Jam">Fruit Jam</MenuItem>
                  <MenuItem value="Slash Jam">Slash Jam</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {userRole === 'publisher' && (
              <>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Studio</InputLabel>
                    <Select
                      value={reportFilters.studio}
                      label="Studio"
                      onChange={(e) => handleFilterChange('studio', e.target.value)}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="Studio A">Studio A</MenuItem>
                      <MenuItem value="Studio B">Studio B</MenuItem>
                      <MenuItem value="Studio C">Studio C</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Region</InputLabel>
                    <Select
                      value={reportFilters.region}
                      label="Region"
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                    >
                      <MenuItem value="All">All</MenuItem>
                      <MenuItem value="US">US</MenuItem>
                      <MenuItem value="IN">IN</MenuItem>
                      <MenuItem value="BR">BR</MenuItem>
                      <MenuItem value="EU">EU</MenuItem>
                      <MenuItem value="APAC">APAC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={reportFilters.dateRange}
                  label="Date Range"
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Yesterday">Yesterday</MenuItem>
                  <MenuItem value="Last 7d">Last 7d</MenuItem>
                  <MenuItem value="Last 14d">Last 14d</MenuItem>
                  <MenuItem value="Last 30d">Last 30d</MenuItem>
                  <MenuItem value="Last 90d">Last 90d</MenuItem>
                  <MenuItem value="Custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {userRole === 'publisher' && (
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={reportFilters.currency}
                    label="Currency"
                    onChange={(e) => handleFilterChange('currency', e.target.value)}
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="INR">INR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Search */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        {onOpenGameAnalyticsImport && (
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={onOpenGameAnalyticsImport}
          >
            Import Game Analytics Data
          </Button>
        )}
      </Box>

      {/* Open Reports */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Open Reports
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  {userRole === 'publisher' && <TableCell>Studio</TableCell>}
                  <TableCell>Game</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOpenReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {report.title}
                      </Typography>
                    </TableCell>
                    {userRole === 'publisher' && (
                      <TableCell>{report.studio || '—'}</TableCell>
                    )}
                    <TableCell>{report.game}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.lastRun}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        size="small"
                        color={report.status === 'Open' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Open Report">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenReport(report)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export CSV">
                          <IconButton
                            size="small"
                            onClick={() => handleExportReport(report)}
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
            Saved Reports (Bookmarks)
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  {userRole === 'publisher' && <TableCell>Studio</TableCell>}
                  <TableCell>Game</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Last Run</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSavedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {report.title}
                      </Typography>
                    </TableCell>
                    {userRole === 'publisher' && (
                      <TableCell>{report.studio || '—'}</TableCell>
                    )}
                    <TableCell>{report.game}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{report.lastRun}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        size="small"
                        color={report.status === 'Open' ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Open Report">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenReport(report)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Export CSV">
                          <IconButton
                            size="small"
                            onClick={() => handleExportReport(report)}
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
