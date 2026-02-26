import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  SDK_METRICS,
  SDK_REPORT_CONFIGS,
  HYPER_RABBIT_EVENTS,
  GAME_ANALYTICS_EVENTS,
  getSDKName,
  getAllSDKTypes,
  SDKType,
  PlatformType,
  getSDKMetrics,
  getSDKEvents,
  getSDKReports,
} from '../../common/sdk-report-config';

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
      id={`sdk-tabpanel-${index}`}
      aria-labelledby={`sdk-tab-${index}`}
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

export const SDKConfigurationPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSDK, setSelectedSDK] = useState<SDKType>('hyper_rabbit');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('Android');

  // Check if user is admin
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole?.toLowerCase().includes('admin') || userRole?.toLowerCase().includes('administrator');

  const sdkTypes = getAllSDKTypes();
  const platforms: PlatformType[] = ['iOS', 'Android'];

  // Get filtered data based on selection
  const filteredMetrics = getSDKMetrics(selectedSDK, selectedPlatform);
  const filteredEvents = getSDKEvents(selectedSDK, selectedPlatform);
  const filteredReports = getSDKReports(selectedSDK, selectedPlatform);

  const handleExportConfig = () => {
    const config = {
      sdk: selectedSDK,
      platform: selectedPlatform,
      metrics: filteredMetrics,
      events: filteredEvents,
      reports: filteredReports,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedSDK}_${selectedPlatform}_config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            SDK Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage Hyper Rabbit and Game Analytics SDK configurations for Android and iOS
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExportConfig}
        >
          Export Config
        </Button>
      </Box>

      {/* SDK and Platform Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
          </Grid>
        </CardContent>
      </Card>

      {/* Configuration Details */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
            <Tab label="Events" />
            <Tab label="Metrics" />
            <Tab label="Reports" />
            <Tab label="Overview" />
          </Tabs>
        </Box>

        {/* Events Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {getSDKName(selectedSDK)} Events for {selectedPlatform}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Total Events: {filteredEvents.length}
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Event Name</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>When It Happens</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.eventName} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {event.eventName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={event.category} 
                        size="small" 
                        color={
                          event.category === 'monetization' ? 'success' :
                          event.category === 'engagement' ? 'primary' :
                          event.category === 'technical' ? 'error' :
                          'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {event.whenItHappens}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Metrics Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {getSDKName(selectedSDK)} Metrics for {selectedPlatform}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Total Metrics: {filteredMetrics.length}
          </Typography>

          <Grid container spacing={2}>
            {['engagement', 'monetization', 'retention', 'performance', 'technical'].map((category) => {
              const categoryMetrics = filteredMetrics.filter(m => m.category === category);
              if (categoryMetrics.length === 0) return null;

              return (
                <Grid item xs={12} key={category}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                          {category} Metrics
                        </Typography>
                        <Chip label={categoryMetrics.length} size="small" color="primary" />
                      </Box>
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
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
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
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* Reports Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {getSDKName(selectedSDK)} Reports for {selectedPlatform}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Total Reports: {filteredReports.length}
          </Typography>

          <Grid container spacing={2}>
            {filteredReports.map((report) => (
              <Grid item xs={12} md={6} key={report.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">
                        {report.name}
                      </Typography>
                      <Chip
                        label={report.enabled ? 'Enabled' : 'Disabled'}
                        size="small"
                        color={report.enabled ? 'success' : 'default'}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {report.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Metrics ({report.metrics.length}):
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {report.metrics.slice(0, 5).map((metricId) => {
                          const metric = filteredMetrics.find(m => m.id === metricId);
                          return (
                            <Chip
                              key={metricId}
                              label={metric?.name.split(' - ').pop() || metricId}
                              size="small"
                              variant="outlined"
                            />
                          );
                        })}
                        {report.metrics.length > 5 && (
                          <Chip label={`+${report.metrics.length - 5} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`Chart: ${report.chartType}`} size="small" />
                      <Chip label={`Refresh: ${report.refreshInterval}m`} size="small" />
                      <Chip label={`Retention: ${report.dataRetention}d`} size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Overview Tab */}
        <TabPanel value={selectedTab} index={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            SDK Configuration Overview
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {filteredEvents.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tracked Events
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Events tracked by {getSDKName(selectedSDK)} on {selectedPlatform}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {filteredMetrics.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available Metrics
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Calculated metrics from tracked events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h4" color="info.main" gutterBottom>
                    {filteredReports.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configured Reports
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Pre-configured report templates
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    SDK Information
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>SDK Name:</strong> {getSDKName(selectedSDK)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Platform:</strong> {selectedPlatform}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Category Distribution:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      {['engagement', 'monetization', 'retention', 'performance', 'technical'].map((category) => {
                        const count = filteredMetrics.filter(m => m.category === category).length;
                        if (count === 0) return null;
                        return (
                          <Chip
                            key={category}
                            label={`${category}: ${count}`}
                            size="small"
                            color={
                              category === 'monetization' ? 'success' :
                              category === 'engagement' ? 'primary' :
                              category === 'technical' ? 'error' :
                              'default'
                            }
                          />
                        );
                      })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
};






