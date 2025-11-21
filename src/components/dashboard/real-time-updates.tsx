import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Refresh, 
  Wifi, 
  WifiOff, 
  Notifications, 
  NotificationsOff,
  TrendingUp,
  TrendingDown,
  Warning
} from '@mui/icons-material';

interface RealTimeUpdate {
  id: string;
  type: 'kpi' | 'alert' | 'system';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error';
  data?: any;
}

interface RealTimeUpdatesProps {
  onDataUpdate?: (data: any) => void;
  onAlert?: (alert: RealTimeUpdate) => void;
}

export const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({
  onDataUpdate,
  onAlert
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock WebSocket connection - in real implementation, this would connect to actual WebSocket
  useEffect(() => {
    if (!isEnabled) return;

    const connectWebSocket = () => {
      try {
        // Mock WebSocket connection
        setIsConnected(true);
        
        // Simulate receiving updates
        const interval = setInterval(() => {
          if (isEnabled) {
            const mockUpdate: RealTimeUpdate = {
              id: Date.now().toString(),
              type: 'kpi',
              message: 'KPI data updated',
              timestamp: new Date(),
              severity: 'info',
              data: {
                games: Math.floor(Math.random() * 100),
                installs: Math.floor(Math.random() * 10000),
                revenue: Math.floor(Math.random() * 100000)
              }
            };

            setUpdates(prev => [mockUpdate, ...prev.slice(0, 9)]); // Keep last 10 updates
            setLastUpdate(new Date());
            
            if (onDataUpdate) {
              onDataUpdate(mockUpdate.data);
            }
          }
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      }
    };

    const cleanup = connectWebSocket();

    return () => {
      if (cleanup) cleanup();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setIsConnected(false);
    };
  }, [isEnabled, onDataUpdate]);

  const handleRefresh = () => {
    // Trigger manual refresh
    const refreshUpdate: RealTimeUpdate = {
      id: Date.now().toString(),
      type: 'system',
      message: 'Manual refresh triggered',
      timestamp: new Date(),
      severity: 'info'
    };
    setUpdates(prev => [refreshUpdate, ...prev.slice(0, 9)]);
    setLastUpdate(new Date());
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleRealTime = () => {
    setIsEnabled(!isEnabled);
    handleMenuClose();
  };

  const clearUpdates = () => {
    setUpdates([]);
    handleMenuClose();
  };

  const getUpdateIcon = (type: string, severity: string) => {
    switch (type) {
      case 'kpi':
        return severity === 'warning' ? <TrendingDown color="warning" /> : <TrendingUp color="success" />;
      case 'alert':
        return <Warning color="error" />;
      case 'system':
        return <Refresh color="info" />;
      default:
        return <Notifications color="info" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Connection Status */}
      <Tooltip title={isConnected ? 'Connected to real-time updates' : 'Disconnected from real-time updates'}>
        <Chip
          icon={isConnected ? <Wifi /> : <WifiOff />}
          label={isConnected ? 'Live' : 'Offline'}
          color={isConnected ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      </Tooltip>

      {/* Last Update Time */}
      {lastUpdate && (
        <Tooltip title={`Last update: ${lastUpdate.toLocaleTimeString()}`}>
          <Typography variant="caption" color="text.secondary">
            {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Tooltip>
      )}

      {/* Updates Badge */}
      <Tooltip title="Real-time updates">
        <IconButton onClick={handleMenuClick} size="small">
          <Badge badgeContent={updates.length} color="primary" max={9}>
            {isEnabled ? <Notifications /> : <NotificationsOff />}
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Manual Refresh */}
      <Tooltip title="Refresh data">
        <IconButton onClick={handleRefresh} size="small">
          <Refresh />
        </IconButton>
      </Tooltip>

      {/* Updates Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <MenuItem onClick={toggleRealTime}>
          <ListItemIcon>
            {isEnabled ? <NotificationsOff /> : <Notifications />}
          </ListItemIcon>
          <ListItemText 
            primary={isEnabled ? 'Disable Real-time Updates' : 'Enable Real-time Updates'}
            secondary={isEnabled ? 'Stop receiving live updates' : 'Start receiving live updates'}
          />
        </MenuItem>
        
        {updates.length > 0 && (
          <>
            <Divider />
            <MenuItem onClick={clearUpdates}>
              <ListItemText primary="Clear All Updates" />
            </MenuItem>
            <Divider />
          </>
        )}

        {updates.length === 0 ? (
          <MenuItem disabled>
            <ListItemText 
              primary="No updates yet"
              secondary="Real-time updates will appear here"
            />
          </MenuItem>
        ) : (
          updates.map((update) => (
            <MenuItem key={update.id} dense>
              <ListItemIcon>
                {getUpdateIcon(update.type, update.severity)}
              </ListItemIcon>
              <ListItemText
                primary={update.message}
                secondary={`${update.timestamp.toLocaleTimeString()} - ${update.type.toUpperCase()}`}
                primaryTypographyProps={{
                  color: getSeverityColor(update.severity) + '.main'
                }}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};




































