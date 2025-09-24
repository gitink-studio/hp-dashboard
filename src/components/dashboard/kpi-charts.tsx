import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { TrendingUp, TrendingDown, ShowChart } from '@mui/icons-material';

// Mock chart component - in real implementation, you would use a charting library like Chart.js, Recharts, or D3
const MockChart: React.FC<{ data: any[], type: 'line' | 'bar' | 'area' }> = ({ data, type }) => {
  return (
    <Box
      sx={{
        height: 200,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 1,
        border: '1px dashed #ccc'
      }}
    >
      <Box textAlign="center">
        <ShowChart sx={{ fontSize: 40, color: '#666', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {type.toUpperCase()} Chart
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.length} data points
        </Typography>
      </Box>
    </Box>
  );
};

interface KPIChartProps {
  title: string;
  data: any[];
  type: 'line' | 'bar' | 'area';
  period: string;
  onPeriodChange: (period: string) => void;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

const KPIChart: React.FC<KPIChartProps> = ({ 
  title, 
  data, 
  type, 
  period, 
  onPeriodChange, 
  trend 
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => onPeriodChange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {trend && (
          <Box display="flex" alignItems="center" mb={2}>
            {trend.direction === 'up' ? (
              <TrendingUp color="success" sx={{ mr: 1 }} />
            ) : (
              <TrendingDown color="error" sx={{ mr: 1 }} />
            )}
            <Typography 
              variant="body2" 
              color={trend.direction === 'up' ? 'success.main' : 'error.main'}
            >
              {trend.direction === 'up' ? '+' : '-'}{Math.abs(trend.value)}% vs previous period
            </Typography>
          </Box>
        )}

        <MockChart data={data} type={type} />
      </CardContent>
    </Card>
  );
};

interface KPICChartsProps {
  filter?: any;
}

export const KPICCharts: React.FC<KPICChartsProps> = ({ filter }) => {
  const [periods, setPeriods] = React.useState({
    installs: '30d',
    revenue: '30d',
    dau: '30d',
    cpi: '30d'
  });

  // Mock data - in real implementation, this would come from the backend
  const mockData = {
    installs: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 1000) + 500
    })),
    revenue: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 10000) + 1000
    })),
    dau: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * 5000) + 1000
    })),
    cpi: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.random() * 5 + 0.5
    }))
  };

  const trends = {
    installs: { value: 12.5, direction: 'up' as const },
    revenue: { value: 8.3, direction: 'up' as const },
    dau: { value: 5.7, direction: 'down' as const },
    cpi: { value: 15.2, direction: 'down' as const }
  };

  const handlePeriodChange = (metric: string, period: string) => {
    setPeriods(prev => ({ ...prev, [metric]: period }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Performance Trends
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <KPIChart
            title="Installs"
            data={mockData.installs}
            type="line"
            period={periods.installs}
            onPeriodChange={(period) => handlePeriodChange('installs', period)}
            trend={trends.installs}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <KPIChart
            title="Revenue"
            data={mockData.revenue}
            type="area"
            period={periods.revenue}
            onPeriodChange={(period) => handlePeriodChange('revenue', period)}
            trend={trends.revenue}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <KPIChart
            title="Daily Active Users"
            data={mockData.dau}
            type="bar"
            period={periods.dau}
            onPeriodChange={(period) => handlePeriodChange('dau', period)}
            trend={trends.dau}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <KPIChart
            title="Cost Per Install"
            data={mockData.cpi}
            type="line"
            period={periods.cpi}
            onPeriodChange={(period) => handlePeriodChange('cpi', period)}
            trend={trends.cpi}
          />
        </Grid>
      </Grid>
    </Box>
  );
};









