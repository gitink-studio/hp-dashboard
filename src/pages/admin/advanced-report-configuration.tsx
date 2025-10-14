import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import {
  SDK_METRICS,
  HYPER_RABBIT_EVENTS,
  GAME_ANALYTICS_EVENTS,
  getSDKName,
  getAllSDKTypes,
  SDKType,
  PlatformType,
  SDKEvent,
  SDKMetric,
} from '../../common/sdk-report-config';
import { GameAnalyticsImportPage } from '../reports/game-analytics-import-page';

interface EventMetricMapping {
  eventName: string;
  sdkType: SDKType;
  platform: PlatformType;
  associatedMetrics: string[]; // Metric IDs
  enabled: boolean;
}

interface SDKConfiguration {
  id: string;
  sdkType: SDKType;
  platform: PlatformType;
  enabled: boolean;
  eventMetricMappings: EventMetricMapping[];
  refreshInterval: number;
  dataRetention: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`advanced-tabpanel-${index}`}
      aria-labelledby={`advanced-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const AdvancedReportConfiguration: React.FC = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSDK, setSelectedSDK] = useState<SDKType>('hyper_rabbit');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('Android');
  const [configurations, setConfigurations] = useState<SDKConfiguration[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventMetricMapping | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const sdkTypes = getAllSDKTypes();
  const platforms: PlatformType[] = ['iOS', 'Android'];

  // Check if user is admin
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole?.toLowerCase().includes('admin') || userRole?.toLowerCase().includes('administrator');

  // Read SDK from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sdkParam = searchParams.get('sdk');
    const platformParam = searchParams.get('platform');
    
    if (sdkParam && (sdkParam === 'hyper_rabbit' || sdkParam === 'game_analytics')) {
      setSelectedSDK(sdkParam as SDKType);
    }
    
    if (platformParam && (platformParam === 'Android' || platformParam === 'iOS')) {
      setSelectedPlatform(platformParam as PlatformType);
    }
  }, [location.search]);

  // Load configurations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sdkConfigurations');
    if (saved) {
      setConfigurations(JSON.parse(saved));
    } else {
      // Initialize default configurations
      initializeDefaultConfigurations();
    }
  }, []);

  const initializeDefaultConfigurations = () => {
    const defaultConfigs: SDKConfiguration[] = [];

    sdkTypes.forEach(sdkType => {
      platforms.forEach(platform => {
        const events = sdkType === 'hyper_rabbit' ? HYPER_RABBIT_EVENTS : GAME_ANALYTICS_EVENTS;
        const filteredEvents = events.filter(e => e.platforms.includes(platform));

        const eventMappings: EventMetricMapping[] = filteredEvents.map(event => ({
          eventName: event.eventName,
          sdkType,
          platform,
          associatedMetrics: getDefaultMetricsForEvent(event, sdkType),
          enabled: true
        }));

        defaultConfigs.push({
          id: `${sdkType}-${platform}`,
          sdkType,
          platform,
          enabled: true,
          eventMetricMappings: eventMappings,
          refreshInterval: 60,
          dataRetention: 365
        });
      });
    });

    setConfigurations(defaultConfigs);
    localStorage.setItem('sdkConfigurations', JSON.stringify(defaultConfigs));
  };

  const getDefaultMetricsForEvent = (event: SDKEvent, sdkType: SDKType): string[] => {
    const metrics = SDK_METRICS.filter(m => 
      m.sdkTypes.includes(sdkType) && 
      m.eventSource.toLowerCase().includes(event.eventName.toLowerCase())
    );
    return metrics.map(m => m.id);
  };

  const getCurrentConfiguration = (): SDKConfiguration | undefined => {
    return configurations.find(
      c => c.sdkType === selectedSDK && c.platform === selectedPlatform
    );
  };

  const getEventsForCurrentSDK = (): SDKEvent[] => {
    const events = selectedSDK === 'hyper_rabbit' ? HYPER_RABBIT_EVENTS : GAME_ANALYTICS_EVENTS;
    return events.filter(e => e.platforms.includes(selectedPlatform));
  };

  const getMetricsForCurrentSDK = (): SDKMetric[] => {
    return SDK_METRICS.filter(m => 
      m.sdkTypes.includes(selectedSDK) && 
      m.platforms.includes(selectedPlatform)
    );
  };

  const handleEditEventMapping = (eventMapping: EventMetricMapping) => {
    setEditingEvent(eventMapping);
    setSelectedMetrics([...eventMapping.associatedMetrics]);
    setEditDialogOpen(true);
  };

  const handleSaveEventMapping = () => {
    if (!editingEvent) return;

    const configIndex = configurations.findIndex(
      c => c.sdkType === selectedSDK && c.platform === selectedPlatform
    );

    if (configIndex === -1) return;

    const newConfigs = [...configurations];
    const eventIndex = newConfigs[configIndex].eventMetricMappings.findIndex(
      e => e.eventName === editingEvent.eventName
    );

    if (eventIndex !== -1) {
      newConfigs[configIndex].eventMetricMappings[eventIndex].associatedMetrics = [...selectedMetrics];
      setConfigurations(newConfigs);
      localStorage.setItem('sdkConfigurations', JSON.stringify(newConfigs));
    }

    setEditDialogOpen(false);
    setEditingEvent(null);
  };

  const handleToggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId)
        ? prev.filter(m => m !== metricId)
        : [...prev, metricId]
    );
  };

  const handleToggleEvent = (eventName: string, enabled: boolean) => {
    const configIndex = configurations.findIndex(
      c => c.sdkType === selectedSDK && c.platform === selectedPlatform
    );

    if (configIndex === -1) return;

    const newConfigs = [...configurations];
    const eventIndex = newConfigs[configIndex].eventMetricMappings.findIndex(
      e => e.eventName === eventName
    );

    if (eventIndex !== -1) {
      newConfigs[configIndex].eventMetricMappings[eventIndex].enabled = enabled;
      setConfigurations(newConfigs);
      localStorage.setItem('sdkConfigurations', JSON.stringify(newConfigs));
    }
  };

  const handleSaveAllConfigurations = () => {
    localStorage.setItem('sdkConfigurations', JSON.stringify(configurations));
    alert('Configurations saved successfully!');
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all configurations to defaults? This cannot be undone.')) {
      initializeDefaultConfigurations();
      alert('Configurations reset to defaults');
    }
  };

  const handleExportConfiguration = () => {
    const config = configurations.find(
      c => c.sdkType === selectedSDK && c.platform === selectedPlatform
    );

    if (config) {
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedSDK}_${selectedPlatform}_config.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const currentConfig = getCurrentConfiguration();
  const currentEvents = getEventsForCurrentSDK();
  const currentMetrics = getMetricsForCurrentSDK();

  if (!isAdmin) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Alert severity="error">
          Access Denied: This page is only available for admin users.
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
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Advanced Report Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure SDK types, events, and metrics for each platform
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleExportConfiguration}
          >
            Export Config
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleResetToDefaults}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveAllConfigurations}
          >
            Save All
          </Button>
        </Box>
      </Box>

      {/* SDK and Platform Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>SDK Type</InputLabel>
                <Select
                  value={selectedSDK}
                  label="SDK Type"
                  onChange={(e) => setSelectedSDK(e.target.value as SDKType)}
                >
                  {sdkTypes.map((sdk) => (
                    <MenuItem key={sdk} value={sdk}>
                      {getSDKName(sdk)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={selectedPlatform}
                  label="Platform"
                  onChange={(e) => setSelectedPlatform(e.target.value as PlatformType)}
                >
                  {platforms.map((platform) => (
                    <MenuItem key={platform} value={platform}>
                      {platform}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Alert severity="info" sx={{ py: 1.5 }}>
                Configuring: <strong>{getSDKName(selectedSDK)} on {selectedPlatform}</strong>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
            <Tab label="Event-Metric Mapping" />
            <Tab label="Event List" />
            <Tab label="Metric List" />
            <Tab label="Settings" />
            <Tab label="Game Analytics Import" />
          </Tabs>
        </Box>

        {/* Event-Metric Mapping Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Event to Metric Mappings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure which metrics are calculated from each event type
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="50px">
                    <Checkbox size="small" />
                  </TableCell>
                  <TableCell><strong>Event Name</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Associated Metrics</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentConfig?.eventMetricMappings.map((mapping) => {
                  const event = currentEvents.find(e => e.eventName === mapping.eventName);
                  
                  return (
                    <TableRow key={mapping.eventName} hover>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={mapping.enabled}
                          onChange={(e) => handleToggleEvent(mapping.eventName, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {mapping.eventName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={event?.category || 'unknown'} 
                          size="small"
                          color={
                            event?.category === 'monetization' ? 'success' :
                            event?.category === 'engagement' ? 'primary' :
                            event?.category === 'technical' ? 'error' :
                            'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {mapping.associatedMetrics.slice(0, 3).map(metricId => {
                            const metric = currentMetrics.find(m => m.id === metricId);
                            return metric ? (
                              <Chip
                                key={metricId}
                                label={metric.name.split(' - ').pop()?.substring(0, 20)}
                                size="small"
                                variant="outlined"
                              />
                            ) : null;
                          })}
                          {mapping.associatedMetrics.length > 3 && (
                            <Chip
                              label={`+${mapping.associatedMetrics.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mapping.enabled ? 'Enabled' : 'Disabled'}
                          size="small"
                          color={mapping.enabled ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditEventMapping(mapping)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Event List Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Available Events for {getSDKName(selectedSDK)} on {selectedPlatform}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total Events: {currentEvents.length}
          </Typography>

          {['gameplay', 'monetization', 'engagement', 'economy', 'technical'].map(category => {
            const categoryEvents = currentEvents.filter(e => e.category === category);
            if (categoryEvents.length === 0) return null;

            return (
              <Accordion key={category} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {category} Events ({categoryEvents.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {categoryEvents.map((event, index) => (
                      <React.Fragment key={event.eventName}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" fontWeight="medium">
                                  {event.eventName}
                                </Typography>
                                <Chip
                                  label={currentConfig?.eventMetricMappings.find(m => m.eventName === event.eventName)?.enabled ? 'Enabled' : 'Disabled'}
                                  size="small"
                                  color={currentConfig?.eventMetricMappings.find(m => m.eventName === event.eventName)?.enabled ? 'success' : 'default'}
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="text.secondary">
                                  {event.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  When: {event.whenItHappens} | Why: {event.whyItMatters}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        {index < categoryEvents.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </TabPanel>

        {/* Metric List Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Available Metrics for {getSDKName(selectedSDK)} on {selectedPlatform}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total Metrics: {currentMetrics.length}
          </Typography>

          {['engagement', 'monetization', 'retention', 'performance', 'technical'].map(category => {
            const categoryMetrics = currentMetrics.filter(m => m.category === category);
            if (categoryMetrics.length === 0) return null;

            return (
              <Accordion key={category} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {category} Metrics ({categoryMetrics.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Metric</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                          <TableCell><strong>Formula</strong></TableCell>
                          <TableCell><strong>Event Source</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categoryMetrics.map((metric) => (
                          <TableRow key={metric.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {metric.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {metric.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                {metric.formula || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {metric.eventSource}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={selectedTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Configuration Settings
          </Typography>

          {currentConfig && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      General Settings
                    </Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={currentConfig.enabled}
                          onChange={(e) => {
                            const newConfigs = configurations.map(c =>
                              c.id === currentConfig.id
                                ? { ...c, enabled: e.target.checked }
                                : c
                            );
                            setConfigurations(newConfigs);
                          }}
                        />
                      }
                      label="Enable SDK Tracking"
                    />

                    <TextField
                      fullWidth
                      label="Refresh Interval (minutes)"
                      type="number"
                      value={currentConfig.refreshInterval}
                      onChange={(e) => {
                        const newConfigs = configurations.map(c =>
                          c.id === currentConfig.id
                            ? { ...c, refreshInterval: parseInt(e.target.value) }
                            : c
                        );
                        setConfigurations(newConfigs);
                      }}
                      sx={{ mt: 2 }}
                    />

                    <TextField
                      fullWidth
                      label="Data Retention (days)"
                      type="number"
                      value={currentConfig.dataRetention}
                      onChange={(e) => {
                        const newConfigs = configurations.map(c =>
                          c.id === currentConfig.id
                            ? { ...c, dataRetention: parseInt(e.target.value) }
                            : c
                        );
                        setConfigurations(newConfigs);
                      }}
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Statistics
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Total Events:</strong> {currentConfig.eventMetricMappings.length}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Enabled Events:</strong> {currentConfig.eventMetricMappings.filter(e => e.enabled).length}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Total Metrics:</strong> {currentMetrics.length}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Mapped Metrics:</strong> {new Set(currentConfig.eventMetricMappings.flatMap(e => e.associatedMetrics)).size}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </TabPanel>

        {/* Game Analytics Import Tab */}
        <TabPanel value={selectedTab} index={4}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                Game Analytics Data Import
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload Excel/CSV files to import Game Analytics events into the EventLog table for tracking metrics
              </Typography>
            </Box>
          </Box>
          
          <GameAnalyticsImportPage />
        </TabPanel>
      </Card>

      {/* Edit Event-Metric Mapping Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Metric Mapping: {editingEvent?.eventName}
        </DialogTitle>
        <DialogContent>
          {editingEvent && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Select which metrics should be calculated when this event is tracked
              </Alert>

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Associated Metrics:
              </Typography>

              <FormGroup>
                {currentMetrics.map((metric) => (
                  <FormControlLabel
                    key={metric.id}
                    control={
                      <Checkbox
                        checked={selectedMetrics.includes(metric.id)}
                        onChange={() => handleToggleMetric(metric.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {metric.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {metric.description} | Source: {metric.eventSource}
                        </Typography>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Selected:</strong> {selectedMetrics.length} metrics
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEventMapping} variant="contained">
            Save Mapping
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

