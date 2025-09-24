import React, { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  ReportConfiguration,
  DEFAULT_REPORT_CONFIGS,
  DEFAULT_CONFIGURATION,
  PLATFORM_SUBPLATFORM_COMBINATIONS,
  getAvailableReports
} from '../../common/report-config';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

export const ReportConfigurationPage: React.FC = () => {
  const [configuration, setConfiguration] = useState<ReportConfiguration>(DEFAULT_CONFIGURATION);
  const [selectedTab, setSelectedTab] = useState(0);
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [editingGlobal, setEditingGlobal] = useState(false);
  const [newRule, setNewRule] = useState({
    platform: '',
    subPlatform: '',
    availableReports: [] as string[],
    disabledReports: [] as string[]
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [globalSettings, setGlobalSettings] = useState(DEFAULT_CONFIGURATION.globalSettings);

  // Check if user is admin
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole?.toLowerCase().includes('admin') || userRole?.toLowerCase().includes('administrator');
  
  // Debug logging for admin role detection
  console.log('🔍 Admin Role Check:', {
    userRole,
    isAdmin,
    roleLower: userRole?.toLowerCase(),
    includesAdmin: userRole?.toLowerCase().includes('admin'),
    includesAdministrator: userRole?.toLowerCase().includes('administrator')
  });

  useEffect(() => {
    // Load configuration from localStorage or API
    const savedConfig = localStorage.getItem('reportConfiguration');
    if (savedConfig) {
      setConfiguration(JSON.parse(savedConfig));
    }
  }, []);

  const handleSaveConfiguration = () => {
    localStorage.setItem('reportConfiguration', JSON.stringify(configuration));
    // In production, this would save to the backend API
    console.log('Configuration saved:', configuration);
  };

  const handleRuleChange = (index: number, field: string, value: any) => {
    const newRules = [...configuration.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setConfiguration({ ...configuration, rules: newRules });
  };

  const handleAddRule = () => {
    if (newRule.platform && newRule.subPlatform) {
      const newRules = [...configuration.rules, { ...newRule }];
      setConfiguration({ ...configuration, rules: newRules });
      setNewRule({
        platform: '',
        subPlatform: '',
        availableReports: [],
        disabledReports: []
      });
      setShowAddDialog(false);
    }
  };

  const handleDeleteRule = (index: number) => {
    const newRules = configuration.rules.filter((_, i) => i !== index);
    setConfiguration({ ...configuration, rules: newRules });
  };

  const handleGlobalSettingsChange = (field: string, value: any) => {
    setGlobalSettings({ ...globalSettings, [field]: value });
  };

  const handleSaveGlobalSettings = () => {
    setConfiguration({ ...configuration, globalSettings });
    setEditingGlobal(false);
  };

  const getReportName = (reportId: string): string => {
    const report = DEFAULT_REPORT_CONFIGS.find(r => r.id === reportId);
    return report ? report.name : reportId;
  };

  const getReportCategory = (reportId: string): 'developer' | 'publisher' => {
    const report = DEFAULT_REPORT_CONFIGS.find(r => r.id === reportId);
    return report ? report.category : 'developer';
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
        <Typography variant="h4" component="h1">
          Report Configuration
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setEditingGlobal(true)}
            sx={{ mr: 2 }}
          >
            Global Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveConfiguration}
          >
            Save Configuration
          </Button>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
            <Tab label="Platform Rules" />
            <Tab label="Report Definitions" />
            <Tab label="Preview" />
          </Tabs>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Platform-Specific Report Rules</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddDialog(true)}
            >
              Add Rule
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Platform</TableCell>
                  <TableCell>Sub-Platform</TableCell>
                  <TableCell>Available Reports</TableCell>
                  <TableCell>Disabled Reports</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {configuration.rules.map((rule, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {editingRule === index ? (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={rule.platform}
                            onChange={(e) => handleRuleChange(index, 'platform', e.target.value)}
                          >
                            <MenuItem value="iOS">iOS</MenuItem>
                            <MenuItem value="Android">Android</MenuItem>
                            <MenuItem value="Web">Web</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip label={rule.platform} color="primary" />
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRule === index ? (
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={rule.subPlatform}
                            onChange={(e) => handleRuleChange(index, 'subPlatform', e.target.value)}
                          >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Poki">Poki</MenuItem>
                            <MenuItem value="CrazyGames">CrazyGames</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Chip label={rule.subPlatform} color="secondary" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {rule.availableReports.map((reportId) => (
                          <Chip
                            key={reportId}
                            label={getReportName(reportId)}
                            size="small"
                            color={getReportCategory(reportId) === 'developer' ? 'success' : 'info'}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {rule.disabledReports.map((reportId) => (
                          <Chip
                            key={reportId}
                            label={getReportName(reportId)}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {editingRule === index ? (
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => setEditingRule(null)}
                            color="primary"
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setEditingRule(null)}
                            color="error"
                          >
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => setEditingRule(index)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRule(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Typography variant="h6" sx={{ mb: 2 }}>Report Definitions</Typography>
          <Grid container spacing={2}>
            {DEFAULT_REPORT_CONFIGS.map((report) => (
              <Grid item xs={12} md={6} key={report.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{report.name}</Typography>
                      <Chip
                        label={report.category}
                        color={report.category === 'developer' ? 'success' : 'info'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {report.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {report.platforms.map((platform) => (
                        <Chip key={platform} label={platform} size="small" />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {report.subPlatforms.map((subPlatform) => (
                        <Chip key={subPlatform} label={subPlatform} size="small" color="secondary" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>Configuration Preview</Typography>
          <Grid container spacing={2}>
            {PLATFORM_SUBPLATFORM_COMBINATIONS.map((combo) => (
              <Grid item xs={12} md={6} key={`${combo.platform}-${combo.subPlatform}`}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {combo.platform} - {combo.subPlatform}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                        Developer Reports:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getAvailableReports(combo.platform, combo.subPlatform, 'developer', configuration)
                          .map((report) => (
                            <Chip key={report.id} label={report.name} size="small" color="success" />
                          ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="info.main" sx={{ mb: 1 }}>
                        Publisher Reports:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getAvailableReports(combo.platform, combo.subPlatform, 'publisher', configuration)
                          .map((report) => (
                            <Chip key={report.id} label={report.name} size="small" color="info" />
                          ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Rule</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={newRule.platform}
                  onChange={(e) => setNewRule({ ...newRule, platform: e.target.value as string })}
                >
                  <MenuItem value="iOS">iOS</MenuItem>
                  <MenuItem value="Android">Android</MenuItem>
                  <MenuItem value="Web">Web</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Sub-Platform</InputLabel>
                <Select
                  value={newRule.subPlatform}
                  onChange={(e) => setNewRule({ ...newRule, subPlatform: e.target.value as string })}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Poki">Poki</MenuItem>
                  <MenuItem value="CrazyGames">CrazyGames</MenuItem>
                  <MenuItem value="Facebook">Facebook</MenuItem>
                  <MenuItem value="Microsoft">Microsoft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRule} variant="contained">Add Rule</Button>
        </DialogActions>
      </Dialog>

      {/* Global Settings Dialog */}
      <Dialog open={editingGlobal} onClose={() => setEditingGlobal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Global Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Default Refresh Interval (minutes)"
              type="number"
              value={globalSettings.defaultRefreshInterval}
              onChange={(e) => handleGlobalSettingsChange('defaultRefreshInterval', parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Default Data Retention (days)"
              type="number"
              value={globalSettings.defaultDataRetention}
              onChange={(e) => handleGlobalSettingsChange('defaultDataRetention', parseInt(e.target.value))}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={globalSettings.enableRealTimeData}
                  onChange={(e) => handleGlobalSettingsChange('enableRealTimeData', e.target.checked)}
                />
              }
              label="Enable Real-Time Data"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={globalSettings.enableScheduledReports}
                  onChange={(e) => handleGlobalSettingsChange('enableScheduledReports', e.target.checked)}
                />
              }
              label="Enable Scheduled Reports"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingGlobal(false)}>Cancel</Button>
          <Button onClick={handleSaveGlobalSettings} variant="contained">Save Settings</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
