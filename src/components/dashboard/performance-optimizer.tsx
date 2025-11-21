import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Slider
} from '@mui/material';
import { 
  Speed, 
  Memory, 
  NetworkCheck, 
  Cached, 
  Refresh,
  Settings,
  Info
} from '@mui/icons-material';

interface PerformanceMetrics {
  loadTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  networkRequests: number;
  dataSize: number;
}

interface PerformanceOptimizerProps {
  onOptimize?: (settings: OptimizationSettings) => void;
}

interface OptimizationSettings {
  enableCaching: boolean;
  cacheTTL: number; // in minutes
  enableLazyLoading: boolean;
  enableDataCompression: boolean;
  batchSize: number;
  refreshInterval: number; // in seconds
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  onOptimize
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    networkRequests: 0,
    dataSize: 0
  });

  const [settings, setSettings] = useState<OptimizationSettings>({
    enableCaching: true,
    cacheTTL: 15,
    enableLazyLoading: true,
    enableDataCompression: true,
    batchSize: 50,
    refreshInterval: 30
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Mock performance monitoring
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        loadTime: Math.random() * 2000 + 500, // 500-2500ms
        cacheHitRate: Math.random() * 40 + 60, // 60-100%
        memoryUsage: Math.random() * 50 + 20, // 20-70MB
        networkRequests: Math.floor(Math.random() * 20 + 5), // 5-25 requests
        dataSize: Math.random() * 1000 + 100 // 100-1100KB
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleOptimize = useCallback(async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (onOptimize) {
      onOptimize(settings);
    }
    
    setIsOptimizing(false);
  }, [settings, onOptimize]);

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'success';
    if (value <= thresholds.warning) return 'warning';
    return 'error';
  };

  const getPerformanceLabel = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'Good';
    if (value <= thresholds.warning) return 'Fair';
    return 'Poor';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" display="flex" alignItems="center">
              <Speed sx={{ mr: 1 }} />
              Performance Monitor
            </Typography>
            <Box>
              <Tooltip title="Performance Settings">
                <IconButton onClick={() => setSettingsOpen(true)} size="small">
                  <Settings />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={isOptimizing ? <LinearProgress /> : <Refresh />}
                onClick={handleOptimize}
                disabled={isOptimizing}
                size="small"
              >
                {isOptimizing ? 'Optimizing...' : 'Optimize'}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h4" color={getPerformanceColor(metrics.loadTime, { good: 1000, warning: 2000 })}>
                  {formatTime(metrics.loadTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Load Time
                </Typography>
                <Chip
                  label={getPerformanceLabel(metrics.loadTime, { good: 1000, warning: 2000 })}
                  color={getPerformanceColor(metrics.loadTime, { good: 1000, warning: 2000 })}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h4" color={getPerformanceColor(100 - metrics.cacheHitRate, { good: 10, warning: 25 })}>
                  {metrics.cacheHitRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cache Hit Rate
                </Typography>
                <Chip
                  label={getPerformanceLabel(100 - metrics.cacheHitRate, { good: 10, warning: 25 })}
                  color={getPerformanceColor(100 - metrics.cacheHitRate, { good: 10, warning: 25 })}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h4" color={getPerformanceColor(metrics.memoryUsage, { good: 30, warning: 60 })}>
                  {metrics.memoryUsage.toFixed(0)}MB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Memory Usage
                </Typography>
                <Chip
                  label={getPerformanceLabel(metrics.memoryUsage, { good: 30, warning: 60 })}
                  color={getPerformanceColor(metrics.memoryUsage, { good: 30, warning: 60 })}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h4" color={getPerformanceColor(metrics.networkRequests, { good: 10, warning: 20 })}>
                  {metrics.networkRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Network Requests
                </Typography>
                <Chip
                  label={getPerformanceLabel(metrics.networkRequests, { good: 10, warning: 20 })}
                  color={getPerformanceColor(metrics.networkRequests, { good: 10, warning: 20 })}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2.4}>
              <Box textAlign="center">
                <Typography variant="h4" color={getPerformanceColor(metrics.dataSize, { good: 200, warning: 500 })}>
                  {formatBytes(metrics.dataSize * 1024)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data Size
                </Typography>
                <Chip
                  label={getPerformanceLabel(metrics.dataSize, { good: 200, warning: 500 })}
                  color={getPerformanceColor(metrics.dataSize, { good: 200, warning: 500 })}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          </Grid>

          {isOptimizing && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Optimizing performance settings...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Performance Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Settings sx={{ mr: 1 }} />
            Performance Settings
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableCaching}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableCaching: e.target.checked }))}
                  />
                }
                label="Enable Caching"
              />
              <Typography variant="body2" color="text.secondary">
                Cache frequently accessed data to improve performance
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Cache TTL: {settings.cacheTTL} minutes
              </Typography>
              <Slider
                value={settings.cacheTTL}
                onChange={(_, value) => setSettings(prev => ({ ...prev, cacheTTL: value as number }))}
                min={1}
                max={60}
                step={1}
                marks={[
                  { value: 1, label: '1m' },
                  { value: 15, label: '15m' },
                  { value: 30, label: '30m' },
                  { value: 60, label: '60m' }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableLazyLoading}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableLazyLoading: e.target.checked }))}
                  />
                }
                label="Enable Lazy Loading"
              />
              <Typography variant="body2" color="text.secondary">
                Load data only when needed to reduce initial load time
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableDataCompression}
                    onChange={(e) => setSettings(prev => ({ ...prev, enableDataCompression: e.target.checked }))}
                  />
                }
                label="Enable Data Compression"
              />
              <Typography variant="body2" color="text.secondary">
                Compress data to reduce network transfer size
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Batch Size: {settings.batchSize} items
              </Typography>
              <Slider
                value={settings.batchSize}
                onChange={(_, value) => setSettings(prev => ({ ...prev, batchSize: value as number }))}
                min={10}
                max={100}
                step={10}
                marks={[
                  { value: 10, label: '10' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Refresh Interval: {settings.refreshInterval} seconds
              </Typography>
              <Slider
                value={settings.refreshInterval}
                onChange={(_, value) => setSettings(prev => ({ ...prev, refreshInterval: value as number }))}
                min={10}
                max={300}
                step={10}
                marks={[
                  { value: 10, label: '10s' },
                  { value: 30, label: '30s' },
                  { value: 60, label: '1m' },
                  { value: 300, label: '5m' }
                ]}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={handleOptimize} variant="contained">
            Apply Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};




































