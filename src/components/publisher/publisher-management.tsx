import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Divider
} from '@mui/material';
import {
  Business,
  AttachMoney,
  Assignment,
  Notifications,
  Add,
  MoreVert,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Schedule,
  Edit,
  Delete,
  Visibility,
  PlayArrow,
  Pause,
  Stop
} from '@mui/icons-material';
import { useGetList, useNotify, useCreate, useUpdate, useDelete } from 'react-admin';
import { QueryNames, CONTRACT_TYPES, PAYOUT_STATUSES, APPROVAL_STATUSES, CREATIVE_STATUSES, TEST_STATUSES } from '../../common/constants';
import { formatNumber } from '../../common/utils';

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
      id={`publisher-tabpanel-${index}`}
      aria-labelledby={`publisher-tab-${index}`}
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

interface PublisherManagementProps {
  studioId?: string;
  onStudioChange?: (studioId: string) => void;
}

export const PublisherManagement: React.FC<PublisherManagementProps> = ({
  studioId,
  onStudioChange
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState('');
  const [selectedStudio, setSelectedStudio] = useState(studioId || '');
  const [createStep, setCreateStep] = useState(0);
  const notify = useNotify();

  // Fetch data
  const { data: studiosData, isLoading: studiosLoading } = useGetList(QueryNames.STUDIOS, {});
  const { data: contractsData, isLoading: contractsLoading } = useGetList(QueryNames.CONTRACTS, {
    filter: selectedStudio ? { studioId: selectedStudio } : {}
  });
  const { data: payoutsData, isLoading: payoutsLoading } = useGetList(QueryNames.PAYOUTS, {
    filter: selectedStudio ? { studioId: selectedStudio } : {}
  });
  const { data: approvalsData, isLoading: approvalsLoading } = useGetList(QueryNames.APPROVALS, {
    filter: selectedStudio ? { studioId: selectedStudio } : {}
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleStudioChange = (newStudioId: string) => {
    setSelectedStudio(newStudioId);
    if (onStudioChange) {
      onStudioChange(newStudioId);
    }
  };

  const handleCreateClick = (type: string) => {
    setCreateType(type);
    setCreateDialogOpen(true);
    setCreateStep(0);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setCreateType('');
    setCreateStep(0);
  };

  const handleCreateNext = () => {
    setCreateStep(prev => prev + 1);
  };

  const handleCreateBack = () => {
    setCreateStep(prev => prev - 1);
  };

  const handleCreate = () => {
    // In real implementation, this would call the appropriate mutation
    notify(`Creating new ${createType}...`, { type: 'info' });
    handleCreateDialogClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
      case 'paid':
      case 'completed':
        return 'success';
      case 'pending':
      case 'draft':
        return 'warning';
      case 'rejected':
      case 'cancelled':
        return 'error';
      case 'hold':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
      case 'paid':
      case 'completed':
        return <CheckCircle />;
      case 'pending':
      case 'draft':
        return <Schedule />;
      case 'rejected':
      case 'cancelled':
        return <Warning />;
      default:
        return <MoreVert />;
    }
  };

  const getCreateSteps = () => {
    switch (createType) {
      case 'studio':
        return ['Basic Information', 'Contact Details', 'Review'];
      case 'contract':
        return ['Contract Type', 'Terms', 'Review'];
      case 'payout':
        return ['Payout Details', 'Schedule', 'Review'];
      case 'approval':
        return ['Item Details', 'Priority', 'Review'];
      default:
        return ['Details', 'Review'];
    }
  };

  const renderCreateForm = () => {
    const steps = getCreateSteps();
    
    return (
      <Stepper activeStep={createStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {index === 0 && (
                <Box>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  {createType === 'studio' && (
                    <TextField
                      margin="dense"
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}
                  {createType === 'contract' && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Contract Type</InputLabel>
                      <Select label="Contract Type">
                        {CONTRACT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.replace('_', ' ').toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {createType === 'payout' && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Payout Type</InputLabel>
                      <Select label="Payout Type">
                        {PAYOUT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type.replace('_', ' ').toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              )}
              {index === 1 && (
                <Box>
                  {createType === 'studio' && (
                    <>
                      <TextField
                        margin="dense"
                        label="Contact Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        margin="dense"
                        label="Contact Phone"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        margin="dense"
                        label="Country"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}
                  {createType === 'contract' && (
                    <>
                      <TextField
                        margin="dense"
                        label="Revenue Share %"
                        type="number"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        margin="dense"
                        label="Minimum Guarantee"
                        type="number"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}
                  {createType === 'payout' && (
                    <>
                      <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        margin="dense"
                        label="Currency"
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </>
                  )}
                </Box>
              )}
              {index === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Review {createType} Details
                  </Typography>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="body2">
                      Please review all the information before creating the {createType}.
                    </Typography>
                  </Paper>
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleCreate : handleCreateNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Create' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleCreateBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Studio Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Select Studio</Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Studio</InputLabel>
              <Select
                value={selectedStudio}
                label="Studio"
                onChange={(e) => handleStudioChange(e.target.value)}
              >
                {studiosData?.map((studio: any) => (
                  <MenuItem key={studio.id} value={studio.id}>
                    {studio.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="publisher management tabs">
            <Tab label="Contracts" icon={<Assignment />} />
            <Tab label="Payouts" icon={<AttachMoney />} />
            <Tab label="Approvals" icon={<CheckCircle />} />
          </Tabs>
        </Box>

        {/* Contracts Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Contracts</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleCreateClick('contract')}
            >
              Add Contract
            </Button>
          </Box>
          <Grid container spacing={2}>
            {contractsData?.map((contract: any) => (
              <Grid item xs={12} md={6} lg={4} key={contract.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{contract.contractType}</Typography>
                      <Chip
                        label={contract.isActive ? 'Active' : 'Inactive'}
                        color={contract.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography color="textSecondary" variant="body2">
                      Revenue Share: {contract.revenueShare}%
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Min Guarantee: ${formatNumber(contract.minimumGuarantee || 0)}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(contract.startDate).toLocaleDateString()}
                      </Typography>
                      <Box>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Payouts Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Payouts</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleCreateClick('payout')}
            >
              Add Payout
            </Button>
          </Box>
          <Grid container spacing={2}>
            {payoutsData?.map((payout: any) => (
              <Grid item xs={12} md={6} lg={4} key={payout.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">${formatNumber(payout.amount)}</Typography>
                      <Chip
                        label={payout.status}
                        color={getStatusColor(payout.status)}
                        size="small"
                        icon={getStatusIcon(payout.status)}
                      />
                    </Box>
                    <Typography color="textSecondary" variant="body2">
                      Type: {payout.payoutType}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Currency: {payout.currency}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(payout.scheduledDate).toLocaleDateString()}
                      </Typography>
                      <Box>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Approvals Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Approvals</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleCreateClick('approval')}
            >
              Add Approval
            </Button>
          </Box>
          <Grid container spacing={2}>
            {approvalsData?.map((approval: any) => (
              <Grid item xs={12} md={6} lg={4} key={approval.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{approval.itemName}</Typography>
                      <Chip
                        label={approval.status}
                        color={getStatusColor(approval.status)}
                        size="small"
                        icon={getStatusIcon(approval.status)}
                      />
                    </Box>
                    <Typography color="textSecondary" variant="body2">
                      Type: {approval.approvalType}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Priority: {approval.priority}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(approval.createdAt).toLocaleDateString()}
                      </Typography>
                      <Box>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New {createType}</DialogTitle>
        <DialogContent>
          {renderCreateForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
