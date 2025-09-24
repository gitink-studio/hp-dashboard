import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
  Button,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  GetApp,
  BookmarkBorder,
  ArrowBack,
  Refresh,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { exportReportData } from '../../common/export-utils';

interface PublisherReportsProps {
  reportType: 'Revenue by Geo' | 'Payout Summary' | 'eCPM & Fill Rate' | 'Compliance & IVT';
  gameName: string;
  studioName: string;
  filters: any;
  onBack: () => void;
}

interface ReportData {
  date: string;
  value: number;
  country?: string;
  grossRev?: number;
  netRev?: number;
  payoutDue?: number;
  requests?: number;
  filled?: number;
  impressions?: number;
  revenue?: number;
  eCPM?: number;
  fillRate?: number;
  compliance?: number;
  ivt?: number;
  revShare?: number;
  studio?: string;
  paid?: number;
  outstanding?: number;
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
      id={`publisher-tabpanel-${index}`}
      aria-labelledby={`publisher-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const PublisherReports: React.FC<PublisherReportsProps> = ({
  reportType,
  gameName,
  studioName,
  filters,
  onBack
}) => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [kpiSummary, setKpiSummary] = useState<any>({});
  const [activeTab, setActiveTab] = useState(0);

  // Mock data generation based on report type
  useEffect(() => {
    generateMockData();
  }, [reportType, gameName, studioName]);

  const generateMockData = () => {
    setLoading(true);
    
    try {
      const data: ReportData[] = [];
      const days = 30;
      const baseDate = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      let value = 0;
      let grossRev = 0;
      let netRev = 0;
      let payoutDue = 0;
      let requests = 0;
      let filled = 0;
      let impressions = 0;
      let revenue = 0;
      let eCPM = 0;
      let fillRate = 0;
      let compliance = 0;
      let ivt = 0;
      let country = '';
      let revShare = 0;

      switch (reportType) {
        case 'Revenue by Geo':
          // Revenue by Geo: Gross = Σ(IAP + Ads) by geo
          // Net = Gross × (1 − RevShare%)
          // Payout Due = Net − Σ Paid − Holds + Adjustments
          const countries = ['US', 'IN', 'BR', 'DE', 'FR', 'UK', 'CA', 'AU'];
          country = countries[Math.floor(Math.random() * countries.length)];
          grossRev = Math.floor(Math.random() * 5000 + 1000);
          revShare = country === 'US' ? 0.30 : country === 'IN' ? 0.25 : 0.30; // Different rev share by country
          netRev = grossRev * (1 - revShare);
          payoutDue = netRev * 0.9; // 10% hold
          value = grossRev;
          break;
        case 'Payout Summary':
          // Payout Summary: Outstanding = Net − Paid (± Holds/Adjustments)
          grossRev = Math.floor(Math.random() * 3000 + 1000);
          netRev = grossRev * 0.7; // 30% rev share
          payoutDue = netRev * 0.9; // 10% hold
          value = payoutDue;
          break;
        case 'eCPM & Fill Rate':
          // Fill Rate = (Filled Requests ÷ Total Requests) × 100
          // eCPM = (Revenue ÷ Impressions) × 1000
          requests = Math.floor(Math.random() * 1000000 + 500000);
          filled = Math.floor(requests * (0.85 + Math.random() * 0.1)); // 85-95% fill rate
          impressions = filled;
          revenue = Math.floor(Math.random() * 2000 + 500);
          eCPM = impressions > 0 ? (revenue / impressions) * 1000 : 0;
          fillRate = requests > 0 ? (filled / requests) * 100 : 0;
          value = eCPM;
          break;
        case 'Compliance & IVT':
          // Compliance % = (Passed Checks ÷ Total Checks) × 100
          // IVT % = (Invalid Impressions ÷ Total Impressions) × 100
          compliance = 95 + Math.random() * 4; // 95-99%
          ivt = Math.random() * 3; // 0-3%
          value = compliance;
          break;
      }

      data.push({
        date: date.toISOString().split('T')[0],
        value: Number(value.toFixed(2)),
        country,
        grossRev,
        netRev,
        payoutDue,
        requests,
        filled,
        impressions,
        revenue,
        eCPM,
        fillRate,
        compliance,
        ivt,
        revShare
      });
    }

      console.log('Generated data for', reportType, ':', data);
      setReportData(data);
      calculateKpiSummary(data);
    } catch (error) {
      console.error('Error generating mock data:', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateKpiSummary = (data: ReportData[]) => {
    switch (reportType) {
      case 'Revenue by Geo':
        const totalGross = data.reduce((sum, item) => sum + (item.grossRev || 0), 0);
        const totalNet = data.reduce((sum, item) => sum + (item.netRev || 0), 0);
        const totalPayout = data.reduce((sum, item) => sum + (item.payoutDue || 0), 0);
        setKpiSummary({
          gross: `$${totalGross.toLocaleString()}`,
          net: `$${totalNet.toLocaleString()}`,
          payoutDue: `$${totalPayout.toLocaleString()}`
        });
        break;
      case 'Payout Summary':
        const totalNetPayout = data.reduce((sum, item) => sum + (item.netRev || 0), 0);
        const totalPaid = totalNetPayout * 0.8; // 80% paid
        const outstanding = totalNetPayout - totalPaid;
        setKpiSummary({
          totalNet: `$${totalNetPayout.toLocaleString()}`,
          paid: `$${totalPaid.toLocaleString()}`,
          outstanding: `$${outstanding.toLocaleString()}`
        });
        break;
      case 'eCPM & Fill Rate':
        // Fill Rate = (Filled Requests ÷ Total Requests) × 100
        // eCPM = (Revenue ÷ Impressions) × 1000
        const totalRequests = data.reduce((sum, item) => sum + (item.requests || 0), 0);
        const totalFilled = data.reduce((sum, item) => sum + (item.filled || 0), 0);
        const totalImpressions = data.reduce((sum, item) => sum + (item.impressions || 0), 0);
        const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
        const avgECPM = totalImpressions > 0 ? (totalRevenue / totalImpressions) * 1000 : 0;
        const avgFillRate = totalRequests > 0 ? (totalFilled / totalRequests) * 100 : 0;
        setKpiSummary({
          eCPM: `$${avgECPM.toFixed(2)}`,
          fill: `${avgFillRate.toFixed(1)}%`,
          impressions: `${(totalImpressions / 1000000).toFixed(1)}M`
        });
        break;
      case 'Compliance & IVT':
        const avgCompliance = data.reduce((sum, item) => sum + (item.compliance || 0), 0) / data.length;
        const avgIVT = data.reduce((sum, item) => sum + (item.ivt || 0), 0) / data.length;
        setKpiSummary({
          compliance: `${avgCompliance.toFixed(1)}%`,
          ivt: `${avgIVT.toFixed(1)}%`
        });
        break;
    }
  };

  const renderChart = () => {
    if (loading) return <LinearProgress />;
    
    if (!reportData || reportData.length === 0) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No data available for this report
          </Typography>
        </Box>
      );
    }

    const chartData = reportData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item.value,
      grossRev: item.grossRev,
      netRev: item.netRev,
      payoutDue: item.payoutDue,
      requests: item.requests,
      filled: item.filled,
      impressions: item.impressions,
      revenue: item.revenue,
      eCPM: item.eCPM,
      fillRate: item.fillRate,
      compliance: item.compliance,
      ivt: item.ivt
    }));

    switch (reportType) {
      case 'Revenue by Geo':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'Payout Summary':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'eCPM & Fill Rate':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <RechartsTooltip />
              <Line yAxisId="left" type="monotone" dataKey="eCPM" stroke="#8884d8" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="fillRate" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Compliance & IVT':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="compliance" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="ivt" stroke="#ff7300" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderKpiSummary = () => {
    const kpiItems = Object.entries(kpiSummary).map(([key, value]) => (
      <Grid item xs={12} sm={4} key={key}>
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {key.toUpperCase()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpiItems}
      </Grid>
    );
  };

  const renderDataTable = () => {
    if (loading) return <LinearProgress />;

    if (reportType === 'Revenue by Geo') {
      // Mock country data
      const countryData = [
        { country: 'US', installs: '210k', grossRev: 6400, revShare: '30%', netRev: 4480, payoutDue: 4000 },
        { country: 'IN', installs: '150k', grossRev: 2700, revShare: '25%', netRev: 2025, payoutDue: 1850 },
        { country: 'BR', installs: '95k', grossRev: 1300, revShare: '30%', netRev: 910, payoutDue: 800 }
      ];

      return (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Country</TableCell>
                <TableCell align="right">Installs</TableCell>
                <TableCell align="right">Gross Rev</TableCell>
                <TableCell align="right">Rev-Share %</TableCell>
                <TableCell align="right">Net Rev</TableCell>
                <TableCell align="right">Payout Due</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {countryData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.country}</TableCell>
                  <TableCell align="right">{row.installs}</TableCell>
                  <TableCell align="right">${row.grossRev.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.revShare}</TableCell>
                  <TableCell align="right">${row.netRev.toLocaleString()}</TableCell>
                  <TableCell align="right">${row.payoutDue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    if (reportType === 'Compliance & IVT') {
      const complianceData = [
        { check: 'SDK Version >= v2.0', status: 'Pass', notes: '' },
        { check: 'ATT Prompt (iOS) copy present', status: 'Fail', notes: 'Missing disclosure in v1.4 build' },
        { check: 'COPPA flag in child mode', status: 'Pass', notes: '' }
      ];

      return (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Check</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complianceData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.check}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.status}
                      color={row.status === 'Pass' ? 'success' : 'error'}
                      size="small"
                      icon={row.status === 'Pass' ? <CheckCircle /> : <Error />}
                    />
                  </TableCell>
                  <TableCell>{row.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    // Default table for other report types
    return (
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              {reportType === 'Payout Summary' && (
                <>
                  <TableCell align="right">Gross Rev</TableCell>
                  <TableCell align="right">Net Rev</TableCell>
                  <TableCell align="right">Paid</TableCell>
                  <TableCell align="right">Outstanding</TableCell>
                </>
              )}
              {reportType === 'eCPM & Fill Rate' && (
                <>
                  <TableCell align="right">Requests</TableCell>
                  <TableCell align="right">Filled</TableCell>
                  <TableCell align="right">Fill Rate %</TableCell>
                  <TableCell align="right">Impressions</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">eCPM</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.slice(-10).map((row, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                {reportType === 'Payout Summary' && (
                  <>
                    <TableCell align="right">${row.grossRev?.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.netRev?.toLocaleString()}</TableCell>
                    <TableCell align="right">${((row.netRev || 0) * 0.8).toLocaleString()}</TableCell>
                    <TableCell align="right">${((row.netRev || 0) * 0.2).toLocaleString()}</TableCell>
                  </>
                )}
                {reportType === 'eCPM & Fill Rate' && (
                  <>
                    <TableCell align="right">{(row.requests || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">{(row.filled || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">{(row.fillRate || 0).toFixed(1)}%</TableCell>
                    <TableCell align="right">{(row.impressions || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">${(row.revenue || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">${(row.eCPM || 0).toFixed(2)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'Revenue by Geo': return 'Revenue by Geo';
      case 'Payout Summary': return 'Payout Summary';
      case 'eCPM & Fill Rate': return 'eCPM & Fill Rate';
      case 'Compliance & IVT': return 'Compliance & IVT (Fraud)';
      default: return 'Report';
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case 'Revenue by Geo': return 'Revenue breakdown by geographical region';
      case 'Payout Summary': return 'Studio-level payout tracking and outstanding amounts';
      case 'eCPM & Fill Rate': return 'Ad monetization performance metrics';
      case 'Compliance & IVT': return 'Policy compliance and fraud detection metrics';
      default: return 'Detailed analytics report';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={onBack} size="small">
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1">
            Report: {getReportTitle()} – {gameName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getReportDescription()} • Studio: {studioName}
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<BookmarkBorder />}
            sx={{ mr: 1 }}
          >
            Save Report
          </Button>
          <IconButton onClick={generateMockData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Filters Display */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Filters
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip label={`Studio: ${studioName}`} size="small" />
            <Chip label={`Game: ${gameName}`} size="small" />
            <Chip label={`Platform: ${filters.platform || 'All'}`} size="small" />
            <Chip label={`Region: ${filters.region || 'All'}`} size="small" />
            <Chip label={`Date Range: ${filters.dateRange || 'Last 30d'}`} size="small" />
            <Chip label={`Currency: ${filters.currency || 'USD'}`} size="small" />
          </Box>
        </CardContent>
      </Card>

      {/* KPI Summary */}
      {renderKpiSummary()}

      {/* Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {getReportTitle()} Over Time
          </Typography>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {reportType === 'Revenue by Geo' ? 'Country Breakdown' : 
             reportType === 'Compliance & IVT' ? 'Policy Checks (latest)' : 
             'Daily Breakdown'}
          </Typography>
          {renderDataTable()}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box display="flex" gap={2} mt={3} justifyContent="center">
        <Button
          variant="contained"
          startIcon={<GetApp />}
          onClick={() => {
            const exportData = reportData.map(item => ({
              date: item.date,
              value: item.value,
              grossRev: item.grossRev,
              netRev: item.netRev,
              payoutDue: item.payoutDue,
              requests: item.requests,
              filled: item.filled,
              impressions: item.impressions,
              revenue: item.revenue,
              eCPM: item.eCPM,
              fillRate: item.fillRate,
              compliance: item.compliance,
              ivt: item.ivt
            }));
            
            exportReportData(
              reportType,
              exportData,
              filters,
              gameName,
              studioName
            );
          }}
        >
          Export CSV
        </Button>
        <Button
          variant="outlined"
          startIcon={<BookmarkBorder />}
          onClick={() => console.log('Save Report')}
        >
          Save Report
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
        >
          Back to Reports
        </Button>
      </Box>
    </Box>
  );
};
