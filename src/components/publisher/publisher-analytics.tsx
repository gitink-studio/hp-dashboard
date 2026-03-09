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
  Alert,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assignment,
  Warning,
  CheckCircle,
  Schedule,
  Download,
  Refresh,
  ViewList,
  BarChart,
  PieChart,
  Timeline
} from '@mui/icons-material';
import { useGetList, useNotify } from 'react-admin';
import { QueryNames } from '../../common/constants';
import { formatDecimalNumber } from '../../common/utils';

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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

interface PublisherAnalyticsProps {
  studioId?: string;
  dateRange?: string;
}

export const PublisherAnalytics: React.FC<PublisherAnalyticsProps> = ({
  studioId,
  dateRange = 'Last 30d'
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filter] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const notify = useNotify();

  // Fetch analytics data
  const { data: kpiData, isLoading: kpiLoading, error: kpiError } = useGetList(QueryNames.PUBLISHER_KPIS, {
    filter: { ...filter, studioId, dateRange }
  });

  const { data: contractsData } = useGetList(QueryNames.CONTRACTS, {
    filter: { ...filter, studioId }
  });

  const { data: payoutsData } = useGetList(QueryNames.PAYOUTS, {
    filter: { ...filter, studioId }
  });

  const { data: approvalsData } = useGetList(QueryNames.APPROVALS, {
    filter: { ...filter, studioId }
  });


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    // In real implementation, this would refresh the data
    notify('Refreshing analytics data...', { type: 'info' });
  };

  const handleExport = () => {
    // In real implementation, this would export the data
    notify('Exporting analytics data...', { type: 'info' });
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

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp color="success" />;
    if (trend < 0) return <TrendingDown color="error" />;
    return <TrendingUp color="disabled" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'success.main';
    if (trend < 0) return 'error.main';
    return 'text.secondary';
  };

  const kpis = kpiData?.[0] || {
    grossRevenue: 0,
    netRevenue: 0,
    payoutDue: 0,
    ecpm: 0,
    fillRate: 0,
    impressions: 0,
    ivtFraudRate: 0,
    compliance: 0,
    crashRate: 0,
    retentionD1: 0,
    roasD7: 0
  };

  // Mock trend data
  const trends = {
    grossRevenue: 12.5,
    netRevenue: 8.3,
    payoutDue: -5.2,
    ecpm: -15.2,
    fillRate: 3.7,
    impressions: 18.9,
    ivtFraudRate: -2.1,
    compliance: 1.5,
    crashRate: -8.4,
    retentionD1: 4.2,
    roasD7: 6.8
  };

  if (kpiLoading) return <LinearProgress />;
  if (kpiError) return <Alert severity="error">Error loading analytics data</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Publisher Analytics
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Gross Revenue
                  </Typography>
                  <Typography variant="h5">
                    ${formatDecimalNumber(kpis.grossRevenue)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.grossRevenue)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.grossRevenue)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.grossRevenue)}%
                    </Typography>
                  </Box>
                </Box>
                <AttachMoney color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Net Revenue
                  </Typography>
                  <Typography variant="h5">
                    ${formatDecimalNumber(kpis.netRevenue)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.netRevenue)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.netRevenue)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.netRevenue)}%
                    </Typography>
                  </Box>
                </Box>
                <AttachMoney color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Payout Due
                  </Typography>
                  <Typography variant="h5">
                    ${formatDecimalNumber(kpis.payoutDue)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.payoutDue)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.payoutDue)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.payoutDue)}%
                    </Typography>
                  </Box>
                </Box>
                <Schedule color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    eCPM
                  </Typography>
                  <Typography variant="h5">
                    ${formatDecimalNumber(kpis.ecpm)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.ecpm)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.ecpm)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.ecpm)}%
                    </Typography>
                  </Box>
                </Box>
                <TrendingDown color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Fill Rate
                  </Typography>
                  <Typography variant="h5">
                    {kpis.fillRate.toFixed(2)}%
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.fillRate)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.fillRate)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.fillRate)}%
                    </Typography>
                  </Box>
                </Box>
                <BarChart color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Impressions
                  </Typography>
                  <Typography variant="h5">
                    {formatDecimalNumber(kpis.impressions)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.impressions)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.impressions)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.impressions)}%
                    </Typography>
                  </Box>
                </Box>
                <Timeline color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    IVT Fraud Rate
                  </Typography>
                  <Typography variant="h5">
                    {kpis.ivtFraudRate.toFixed(2)}%
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.ivtFraudRate)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.ivtFraudRate)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.ivtFraudRate)}%
                    </Typography>
                  </Box>
                </Box>
                <Warning color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Compliance
                  </Typography>
                  <Typography variant="h5">
                    {kpis.compliance.toFixed(2)}%
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(trends.compliance)}
                    <Typography
                      variant="body2"
                      color={getTrendColor(trends.compliance)}
                      sx={{ ml: 1 }}
                    >
                      {Math.abs(trends.compliance)}%
                    </Typography>
                  </Box>
                </Box>
                <CheckCircle color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Contracts" icon={<Assignment />} />
            <Tab label="Payouts" icon={<AttachMoney />} />
            <Tab label="Approvals" icon={<CheckCircle />} />
          </Tabs>
        </Box>

        {/* Contracts Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Contract Analytics</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                startIcon={<ViewList />}
                onClick={() => setViewMode('list')}
                size="small"
              >
                List
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'contained' : 'outlined'}
                startIcon={<BarChart />}
                onClick={() => setViewMode('chart')}
                size="small"
              >
                Chart
              </Button>
            </Box>
          </Box>

          {viewMode === 'list' ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Contract Type</TableCell>
                    <TableCell>Revenue Share</TableCell>
                    <TableCell>Min Guarantee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contractsData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contract: any) => (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.contractType}</TableCell>
                      <TableCell>{contract.revenueShare}%</TableCell>
                      <TableCell>${formatDecimalNumber(contract.minimumGuarantee || 0)}</TableCell>
                      <TableCell>
                        <Chip
                          label={contract.isActive ? 'Active' : 'Inactive'}
                          color={contract.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={contractsData?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <BarChart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Contract Analytics Chart
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chart visualization would be implemented here
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Payouts Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Payout Analytics</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                startIcon={<ViewList />}
                onClick={() => setViewMode('list')}
                size="small"
              >
                List
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'contained' : 'outlined'}
                startIcon={<PieChart />}
                onClick={() => setViewMode('chart')}
                size="small"
              >
                Chart
              </Button>
            </Box>
          </Box>

          {viewMode === 'list' ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Scheduled Date</TableCell>
                    <TableCell>Paid Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payoutsData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payout: any) => (
                    <TableRow key={payout.id}>
                      <TableCell>${formatDecimalNumber(payout.amount)}</TableCell>
                      <TableCell>{payout.currency}</TableCell>
                      <TableCell>{payout.payoutType}</TableCell>
                      <TableCell>
                        <Chip
                          label={payout.status}
                          color={getStatusColor(payout.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(payout.scheduledDate).toLocaleDateString()}</TableCell>
                      <TableCell>{payout.paidDate ? new Date(payout.paidDate).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={payoutsData?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <PieChart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Payout Analytics Chart
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chart visualization would be implemented here
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Approvals Tab */}
        <TabPanel value={activeTab} index={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Approval Analytics</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                startIcon={<ViewList />}
                onClick={() => setViewMode('list')}
                size="small"
              >
                List
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'contained' : 'outlined'}
                startIcon={<BarChart />}
                onClick={() => setViewMode('chart')}
                size="small"
              >
                Chart
              </Button>
            </Box>
          </Box>

          {viewMode === 'list' ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvalsData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((approval: any) => (
                    <TableRow key={approval.id}>
                      <TableCell>{approval.itemName}</TableCell>
                      <TableCell>{approval.approvalType}</TableCell>
                      <TableCell>
                        <Chip
                          label={approval.status}
                          color={getStatusColor(approval.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approval.priority}
                          color={approval.priority === 'urgent' ? 'error' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{approval.assignedTo || 'N/A'}</TableCell>
                      <TableCell>{new Date(approval.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={approvalsData?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <BarChart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Approval Analytics Chart
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chart visualization would be implemented here
              </Typography>
            </Box>
          )}
        </TabPanel>

      </Card>
    </Box>
  );
};
