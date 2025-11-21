import React, { useState, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertTitle,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Notifications, 
  NotificationsOff,
  Close,
  Warning,
  Error,
  Info,
  CheckCircle,
  Delete,
  MarkEmailRead,
  Settings
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  onNotificationClick
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState<Notification | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mock notification generation - in real implementation, this would come from backend
  useEffect(() => {
    const generateMockNotification = () => {
      const types: Notification['type'][] = ['success', 'error', 'warning', 'info'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const notificationTemplates = {
        success: [
          { title: 'Export Completed', message: 'Your dashboard data has been successfully exported.' },
          { title: 'Data Updated', message: 'KPI data has been refreshed with latest information.' },
          { title: 'View Saved', message: 'Your dashboard view has been saved successfully.' }
        ],
        error: [
          { title: 'Export Failed', message: 'Failed to export data. Please try again.' },
          { title: 'Connection Lost', message: 'Lost connection to real-time updates.' },
          { title: 'Data Error', message: 'Unable to load some dashboard data.' }
        ],
        warning: [
          { title: 'High CPI Alert', message: 'Cost per install is above threshold for some games.' },
          { title: 'Low Retention', message: 'Day 1 retention is below target for recent campaigns.' },
          { title: 'Data Delay', message: 'Some data may be delayed due to processing issues.' }
        ],
        info: [
          { title: 'New Feature', message: 'Advanced filtering options are now available.' },
          { title: 'Maintenance', message: 'Scheduled maintenance will occur tonight at 2 AM.' },
          { title: 'Update Available', message: 'A new version of the dashboard is available.' }
        ]
      };

      const templates = notificationTemplates[type];
      const template = templates[Math.floor(Math.random() * templates.length)];

      return {
        id: Date.now().toString(),
        type,
        title: template.title,
        message: template.message,
        timestamp: new Date(),
        read: false,
        persistent: type === 'error' || type === 'warning'
      };
    };

    // Generate notifications periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        const notification = generateMockNotification();
        setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
        
        // Show snackbar for non-persistent notifications
        if (!notification.persistent) {
          setCurrentSnackbar(notification);
          setSnackbarOpen(true);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
    setCurrentSnackbar(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    handleMenuClose();
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    handleMenuClose();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'warning': return <Warning color="warning" />;
      case 'info': return <Info color="info" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={
          <Badge badgeContent={unreadCount} color="error" max={9}>
            <Notifications />
          </Badge>
        }
        onClick={handleMenuClick}
        size="small"
      >
        Notifications
      </Button>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Notifications ({notifications.length})
            </Typography>
            <Box>
              <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                <Settings />
              </IconButton>
              {unreadCount > 0 && (
                <Button size="small" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button size="small" onClick={clearAllNotifications} color="error">
                  Clear all
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsOff sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                divider
                sx={{
                  backgroundColor: notification.read ? 'transparent' : 'action.hover',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  markAsRead(notification.id);
                  if (onNotificationClick) {
                    onNotificationClick(notification);
                  }
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Chip label="New" size="small" color="primary" />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Menu>

      {/* Snackbar for temporary notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={currentSnackbar?.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <AlertTitle>{currentSnackbar?.title}</AlertTitle>
          {currentSnackbar?.message}
        </Alert>
      </Snackbar>

      {/* Notification Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Configure your notification preferences here. In a real implementation, 
            this would allow users to customize which types of notifications they receive.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};




































