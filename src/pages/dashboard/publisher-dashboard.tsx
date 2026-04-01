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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Business,
  AttachMoney,
  Assignment,
  Add,
  MoreVert,
  Warning,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useGetList, useNotify, useAuthenticated } from 'react-admin';
import { QueryNames, CONTRACT_TYPES, PAYOUT_TYPES, APPROVAL_TYPES } from '../../common/constants';
import { formatDecimalNumber } from '../../common/utils';
import { AdvancedDateFilter } from '../../components/dashboard/advanced-date-filter';
import { AdvancedExport } from '../../components/dashboard/advanced-export';
import { NotificationSystem } from '../../components/dashboard/notification-system';
import { PublisherGamesList } from '../../components/publisher/publisher-games-list';

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

export const PublisherDashboard = () => {
  useAuthenticated();
  const userRole = localStorage.getItem("userRole");

  // Normalize role for case-insensitive comparison
  const normalizedRole = userRole ? userRole.toLowerCase().trim() : '';
  const isPublisher = normalizedRole === 'publisher' || normalizedRole.includes('publisher');

  if (!localStorage.getItem("userName")) return null;

  // Redirect non-publisher users
  if (!isPublisher) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Access Denied: This dashboard is only available for publisher users.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Your role: {userRole || 'Not set'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Normalized role: {normalizedRole || 'empty'}
        </Typography>
      </Box>
    );
  }

  const [activeTab, setActiveTab] = useState(0);
  const [filter] = useState({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createType, setCreateType] = useState('');
  const notify = useNotify();

  // Fetch studios
  const { data: studiosData } = useGetList(QueryNames.STUDIOS, {});

  // Fetch contracts
  const { data: contractsData } = useGetList(QueryNames.CONTRACTS, {});

  // Fetch payouts
  const { data: payoutsData } = useGetList(QueryNames.PAYOUTS, {});

  // Fetch approvals
  const { data: approvalsData } = useGetList(QueryNames.APPROVALS, {});


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateClick = (type: string) => {
    setCreateType(type);
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setCreateType('');
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


  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Publisher Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <AdvancedDateFilter
            source="dateRange"
            label="Date Range"
            alwaysOn
          />
          <AdvancedExport filter={filter} type="publisher" />
          <NotificationSystem />
        </Box>
      </Box>



      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="publisher dashboard tabs">
            <Tab label="Games" icon={<Business />} />
            <Tab label="Studios" icon={<Business />} />
            <Tab label="Contracts" icon={<Assignment />} />
            <Tab label="Payouts" icon={<AttachMoney />} />
            <Tab label="Approvals" icon={<CheckCircle />} />
          </Tabs>
        </Box>

        {/* Games Tab */}
        <TabPanel value={activeTab} index={0}>
          <PublisherGamesList onReportsNavigation={(gameName) => {
            // Navigate to reports page with game filter
            window.location.href = `#/reports?game=${encodeURIComponent(gameName)}&platform=All&region=All&dateRange=Last 30d&currency=USD`;
          }} />
        </TabPanel>

        {/* Studios Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Studios</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleCreateClick('studio')}
            >
              Add Studio
            </Button>
          </Box>
          <Grid container spacing={2}>
            {studiosData?.map((studio: any) => (
              <Grid item xs={12} md={6} lg={4} key={studio.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{studio.name}</Typography>
                      <Chip
                        label={studio.isActive ? 'Active' : 'Inactive'}
                        color={studio.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography color="textSecondary" variant="body2">
                      {studio.description}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {studio.contactEmail}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {studio.country}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Contracts Tab */}
        <TabPanel value={activeTab} index={2}>
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
                      Min Guarantee: ${formatDecimalNumber(contract.minimumGuarantee || 0)}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Start: {new Date(contract.startDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Payouts Tab */}
        <TabPanel value={activeTab} index={3}>
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
                      <Typography variant="h6">${formatDecimalNumber(payout.amount)}</Typography>
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
                    <Typography color="textSecondary" variant="body2">
                      Scheduled: {new Date(payout.scheduledDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Approvals Tab */}
        <TabPanel value={activeTab} index={4}>
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
                    <Typography color="textSecondary" variant="body2">
                      Created: {new Date(approval.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCreateDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New {createType}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
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
          {createType === 'approval' && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Approval Type</InputLabel>
              <Select label="Approval Type">
                {APPROVAL_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateDialogClose}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
