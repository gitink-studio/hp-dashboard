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
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useGetList } from 'react-admin';
import { QueryNames } from '../../common/constants';

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

export const GameAnalyticsImportExport: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-01-31');
  const [loading, setLoading] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [showStatsDialog, setShowStatsDialog] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch games
  const { data: gamesData } = useGetList(QueryNames.GAMES_LIST, {});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
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
        `http://localhost:3000/game-analytics/import/events/${selectedGame}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setImportResult(result.data);
        setShowImportDialog(true);
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
      setSelectedFile(null);
    }
  };

  const handleExportEvents = async (format: 'csv' | 'json') => {
    if (!selectedGame) {
      alert('Please select a game');
      return;
    }

    setLoading(true);
    try {
      const url = `http://localhost:3000/game-analytics/export/events/${selectedGame}?startDate=${startDate}&endDate=${endDate}&format=${format}`;
      
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
      const url = `http://localhost:3000/game-analytics/export/metrics/${selectedGame}?startDate=${startDate}&endDate=${endDate}`;
      
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
      const response = await fetch('http://localhost:3000/game-analytics/import/template');
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
        `http://localhost:3000/game-analytics/import/stats/${selectedGame}`
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

  const handleDeleteEvents = async () => {
    if (!selectedGame) {
      alert('Please select a game');
      return;
    }

    if (!confirm('Are you sure you want to delete events for this game in the selected date range? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const url = `http://localhost:3000/game-analytics/events/${selectedGame}?startDate=${startDate}&endDate=${endDate}`;
      
      const response = await fetch(url, { method: 'DELETE' });
      const result = await response.json();

      if (result.success) {
        alert(`Successfully deleted ${result.data.deletedCount} events`);
        await fetchImportStats();
      } else {
        alert('Delete failed: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting events:', error);
      alert('Failed to delete events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Game Analytics - Import/Export Manager
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Import events from Excel/CSV files or export events and metrics for analysis
      </Typography>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Selection Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Selection Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Game</InputLabel>
                <Select
                  value={selectedGame}
                  label="Game"
                  onChange={(e) => setSelectedGame(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select a game</em>
                  </MenuItem>
                  {gamesData?.map((game: any) => (
                    <MenuItem key={game.id} value={game.id}>
                      {game.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Import Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UploadIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Import Events</Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 2 }}>
                Upload a CSV or Excel file containing Game Analytics events to import into the database.
              </Alert>

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
                    disabled={loading}
                  >
                    Choose File
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {selectedFile.name}
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                fullWidth
                startIcon={<UploadIcon />}
                onClick={handleImportEvents}
                disabled={!selectedGame || !selectedFile || loading}
                sx={{ mb: 1 }}
              >
                Import Events
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                disabled={loading}
              >
                Download Import Template
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Export Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DownloadIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Export Data</Typography>
              </Box>

              <Alert severity="success" sx={{ mb: 2 }}>
                Export events or calculated metrics to Excel/CSV for analysis.
              </Alert>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Export Events
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleExportEvents('csv')}
                  disabled={!selectedGame || loading}
                >
                  Export as CSV
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleExportEvents('json')}
                  disabled={!selectedGame || loading}
                >
                  Export as JSON
                </Button>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Export Metrics
              </Typography>

              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<AssessmentIcon />}
                onClick={handleExportMetrics}
                disabled={!selectedGame || loading}
              >
                Export Metrics to CSV
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">Statistics</Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<InfoIcon />}
                onClick={fetchImportStats}
                disabled={!selectedGame || loading}
                sx={{ mb: 2 }}
              >
                View Import Statistics
              </Button>

              {importStats && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total Events:</strong> {importStats.totalEvents.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Date Range:</strong> {' '}
                    {importStats.dateRange.earliest ? 
                      new Date(importStats.dateRange.earliest).toLocaleDateString() : 'N/A'} - {' '}
                    {importStats.dateRange.latest ? 
                      new Date(importStats.dateRange.latest).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Maintenance</Typography>
              </Box>

              <Alert severity="warning" sx={{ mb: 2 }}>
                <strong>Danger Zone:</strong> Delete events for re-import. This cannot be undone.
              </Alert>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={handleDeleteEvents}
                disabled={!selectedGame || loading}
              >
                Delete Events in Date Range
              </Button>
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
                Successfully imported <strong>{importResult.imported}</strong> events
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
        <DialogTitle>Import Statistics</DialogTitle>
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

      {/* Help Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Guide
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                📥 How to Import Events:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="1. Download the import template"
                    secondary="Click 'Download Import Template' to get the CSV format"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="2. Fill in your event data"
                    secondary="Add event names, data (JSON), and timestamps"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="3. Select game and upload file"
                    secondary="Choose the game and upload your CSV file"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                📤 How to Export Data:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="1. Select game and date range"
                    secondary="Choose the game and time period"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="2. Choose export type"
                    secondary="Events (raw data) or Metrics (calculated)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="3. Download file"
                    secondary="Opens in Excel for analysis"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};





