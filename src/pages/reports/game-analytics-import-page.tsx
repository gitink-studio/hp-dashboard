import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Help as HelpIcon,
  FileUpload as FileUploadIcon,
  TableChart as TableChartIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { QueryNames, ROOT_URL } from '../../common/constants';

interface ImportResult {
  imported: number;
  errors: string[];
  filename: string;
}

interface ImportStats {
  totalEvents: number;
  eventBreakdown: { eventName: string; count: number }[];
  dateRange: { earliest: string; latest: string };
}

interface GameAnalyticsImportPageProps {
  onBack?: () => void;
}

export const GameAnalyticsImportPage: React.FC<GameAnalyticsImportPageProps> = ({ onBack }) => {
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-01-31');
  const [loading, setLoading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [showStatsDialog, setShowStatsDialog] = useState<boolean>(false);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Fetch games with platform filtering for Android and iOS only
  const { data: gamesData } = useGetList(QueryNames.GAMES_LIST, {
    filter: {
      platform: 'Android', // This will be mapped to 'Play Store (Android)' in backend
      subPlatform: 'All'
    }
  });

  // Also fetch iOS games
  const { data: iosGamesData } = useGetList(QueryNames.GAMES_LIST, {
    filter: {
      platform: 'iOS', // This will be mapped to 'App Store (Apple)' in backend
      subPlatform: 'All'
    }
  });

  // Combine Android and iOS games
  const allMobileGames = React.useMemo(() => {
    const androidGames = gamesData || [];
    const iosGames = iosGamesData || [];
    
    // Combine and deduplicate games (in case a game exists on both platforms)
    const combinedGames = [...androidGames, ...iosGames];
    const uniqueGames = combinedGames.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id)
    );
    
    return uniqueGames;
  }, [gamesData, iosGamesData]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setActiveStep(1);
    }
  };

  const handleImportEvents = async () => {
    if (!selectedGame || !selectedFile) {
      alert('Please select a game and file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(
        `${ROOT_URL}/game-analytics/import/events/${selectedGame}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setImportResult(result.data);
        setShowImportDialog(true);
        setActiveStep(2);
        // Refresh stats after import
        await fetchImportStats();
      } else {
        alert('Import failed: ' + result.error);
      }
    } catch (error) {
      console.error('Error importing events:', error);
      alert('Failed to import events');
    } finally {
      setLoading(false);
    }
  };

  const handleExportEvents = async (format: 'csv' | 'json') => {
    if (!selectedGame) {
      alert('Please select a game');
      return;
    }

    setLoading(true);
    try {
      const url = `${ROOT_URL}/game-analytics/export/events/${selectedGame}?startDate=${startDate}&endDate=${endDate}&format=${format}`;
      
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `game-analytics-events-${selectedGame}.${format === 'csv' ? 'csv' : 'json'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting events:', error);
      alert('Failed to export events');
    } finally {
      setLoading(false);
    }
  };

  const handleExportMetrics = async () => {
    if (!selectedGame) {
      alert('Please select a game');
      return;
    }

    setLoading(true);
    try {
      const url = `${ROOT_URL}/game-analytics/export/metrics/${selectedGame}?startDate=${startDate}&endDate=${endDate}`;
      
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `game-analytics-metrics-${selectedGame}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting metrics:', error);
      alert('Failed to export metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ROOT_URL}/game-analytics/import/template`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'game-analytics-import-template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template');
    } finally {
      setLoading(false);
    }
  };

  const fetchImportStats = async () => {
    if (!selectedGame) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${ROOT_URL}/game-analytics/import/stats/${selectedGame}`
      );
      const result = await response.json();

      if (result.success) {
        setImportStats(result.data);
        setShowStatsDialog(true);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setActiveStep(0);
    setImportResult(null);
  };

  const steps = [
    'Select Game & File',
    'Review & Import',
    'View Results'
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AnalyticsIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Game Analytics Data Import
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload Excel/CSV files to import Game Analytics events into the EventLog table for Android and iOS games
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Help & Documentation">
            <IconButton onClick={() => setShowHelpDialog(true)}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
          {onBack && (
            <Button variant="outlined" onClick={onBack}>
              Back to Reports
            </Button>
          )}
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Import Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FileUploadIcon sx={{ mr: 1 }} />
            Import Process
          </Typography>
          <Stepper activeStep={activeStep} orientation="horizontal">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Import Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <UploadIcon sx={{ mr: 1, color: 'primary.main' }} />
                Upload Game Analytics Data
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Import Game Analytics Events:</strong> Upload CSV or Excel files containing event data to track metrics for each game in their respective platforms.
              </Alert>

              {/* Step 1: Game Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Select Game
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <strong>Mobile Games Only:</strong> Only Android and iOS games are available for Game Analytics import.
                </Alert>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Game</InputLabel>
                  <Select
                    value={selectedGame}
                    label="Game"
                    onChange={(e) => setSelectedGame(e.target.value)}
                  >
                  <MenuItem value="">
                    <em>Select a game</em>
                  </MenuItem>
                  {allMobileGames?.map((game: any) => (
                    <MenuItem key={game.id} value={game.id}>
                      {game.name}
                    </MenuItem>
                  ))}
                  </Select>
                </FormControl>
                {allMobileGames && allMobileGames.length === 0 && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    No Android or iOS games found. Please ensure games are properly configured for mobile platforms.
                  </Alert>
                )}
              </Box>

              {/* Step 2: File Upload */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Upload File
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <input
                    accept=".csv,.xlsx,.xls,.json"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      disabled={loading || !selectedGame}
                      startIcon={<FileUploadIcon />}
                      sx={{ py: 2 }}
                    >
                      Choose Excel/CSV File
                    </Button>
                  </label>
                  {selectedFile && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
                        <strong>Selected:</strong> {selectedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadTemplate}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  Download Import Template
                </Button>
              </Box>

              {/* Step 3: Import Action */}
              {selectedFile && selectedGame && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    3. Import Data
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<UploadIcon />}
                    onClick={handleImportEvents}
                    disabled={loading}
                    sx={{ py: 2 }}
                  >
                    Import Events to EventLog Table
                  </Button>
                </Box>
              )}

              {/* Reset Button */}
              {activeStep > 0 && (
                <Button
                  variant="text"
                  onClick={resetImport}
                  disabled={loading}
                >
                  Start Over
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TableChartIcon sx={{ mr: 1, color: 'success.main' }} />
                Quick Actions
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Export Events
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => handleExportEvents('csv')}
                    disabled={!selectedGame || loading}
                  >
                    CSV
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleExportEvents('json')}
                    disabled={!selectedGame || loading}
                  >
                    JSON
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Export Metrics
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  fullWidth
                  startIcon={<AssessmentIcon />}
                  onClick={handleExportMetrics}
                  disabled={!selectedGame || loading}
                >
                  Metrics CSV
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Statistics
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<TimelineIcon />}
                  onClick={fetchImportStats}
                  disabled={!selectedGame || loading}
                >
                  View Stats
                </Button>
              </Box>

              {/* Date Range Selection */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Date Range
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Import Result Dialog */}
      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {importResult && importResult.errors.length === 0 ? (
              <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
            ) : (
              <ErrorIcon sx={{ mr: 1, color: 'warning.main' }} />
            )}
            Import Results
          </Box>
        </DialogTitle>
        <DialogContent>
          {importResult && (
            <>
              <Alert severity={importResult.errors.length === 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
                Successfully imported <strong>{importResult.imported}</strong> events to EventLog table
                {importResult.errors.length > 0 && (
                  <> with <strong>{importResult.errors.length}</strong> errors</>
                )}
              </Alert>

              <Typography variant="body2" gutterBottom>
                <strong>File:</strong> {importResult.filename}
              </Typography>

              {importResult.errors.length > 0 && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Import Errors:
                  </Typography>
                  <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p: 2 }}>
                    <List dense>
                      {importResult.errors.map((error, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={error}
                            primaryTypographyProps={{ variant: 'body2', color: 'error' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Statistics Dialog */}
      <Dialog
        open={showStatsDialog}
        onClose={() => setShowStatsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>EventLog Statistics</DialogTitle>
        <DialogContent>
          {importStats && (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h4" color="primary">
                        {importStats.totalEvents.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Events
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h4" color="success.main">
                        {importStats.eventBreakdown.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Event Types
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Date Range
                      </Typography>
                      <Typography variant="caption" display="block">
                        {importStats.dateRange.earliest ? 
                          new Date(importStats.dateRange.earliest).toLocaleDateString() : 'N/A'}
                      </Typography>
                      <Typography variant="caption" display="block">
                        to
                      </Typography>
                      <Typography variant="caption" display="block">
                        {importStats.dateRange.latest ? 
                          new Date(importStats.dateRange.latest).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Event Breakdown
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Event Name</strong></TableCell>
                      <TableCell align="right"><strong>Count</strong></TableCell>
                      <TableCell align="right"><strong>Percentage</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {importStats.eventBreakdown
                      .sort((a, b) => b.count - a.count)
                      .map((event) => (
                        <TableRow key={event.eventName} hover>
                          <TableCell>
                            <Chip label={event.eventName} size="small" />
                          </TableCell>
                          <TableCell align="right">
                            {event.count.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {((event.count / importStats.totalEvents) * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <Dialog
        open={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Game Analytics Import Help</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            📥 How to Import Game Analytics Events
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="1. Download the import template"
                secondary="Click 'Download Import Template' to get the CSV format with sample data"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Prepare your event data"
                secondary="Fill in event names, event data (JSON format), timestamps, and link IDs"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="3. Select game and upload file"
                secondary="Choose an Android or iOS game and upload your CSV/Excel file"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="4. Review import results"
                secondary="Check the import summary and any error messages"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            📱 Platform Support
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Mobile Platforms Only:</strong> Game Analytics import is specifically designed for Android and iOS games. Web games are not supported for this import functionality.
          </Alert>

          <Typography variant="h6" gutterBottom>
            📊 Supported Event Types
          </Typography>
          <Grid container spacing={1}>
            {[
              'session_start', 'session_end',
              'business_event', 'progression_event',
              'resource_event', 'error_event',
              'ad_event', 'custom_event'
            ].map((eventType) => (
              <Grid item key={eventType}>
                <Chip label={eventType} size="small" variant="outlined" />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            📤 Export Options
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Export Events (CSV/JSON)"
                secondary="Raw event data from EventLog table"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Export Metrics (CSV)"
                secondary="Calculated metrics like DAU, revenue, retention, etc."
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
