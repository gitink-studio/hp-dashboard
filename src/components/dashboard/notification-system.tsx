import React, { useState, useEffect, useMemo } from 'react';
import { useGetList } from 'react-admin';
import { QueryNames } from '../../common/constants';
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
  MenuItem,
  CircularProgress
} from '@mui/material';
import { 
  Notifications, 
  NotificationsOff,
  Close,
  Warning,
  Error as ErrorIcon,
  Info,
  CheckCircle,
  Delete,
  MarkEmailRead,
  Settings
} from '@mui/icons-material';

interface BackendNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: string;
  actionUrl?: string;
  actionData?: any;
  expiresAt?: string;
  additionalData?: any;
  createdAt: string;
  updatedAt: string;
}

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

// Map backend notification type/priority to frontend type
const mapNotificationType = (backendType: string, priority?: string): Notification['type'] => {
  // Map based on type first
  const typeLower = backendType?.toLowerCase() || '';
  if (typeLower.includes('error') || typeLower.includes('failed')) return 'error';
  if (typeLower.includes('warning') || typeLower.includes('alert')) return 'warning';
  if (typeLower.includes('success') || typeLower.includes('completed')) return 'success';
  
  // Map based on priority if type doesn't match
  const priorityLower = priority?.toLowerCase() || '';
  if (priorityLower === 'urgent' || priorityLower === 'high') return 'error';
  if (priorityLower === 'normal') return 'info';
  if (priorityLower === 'low') return 'info';
  
  return 'info'; // Default to info
};

// Convert backend notification to frontend format
const convertNotification = (backendNotif: BackendNotification): Notification => {
  const type = mapNotificationType(backendNotif.type, backendNotif.priority);
  
  // Safely parse dates
  let expiresAt: Date | null = null;
  if (backendNotif.expiresAt) {
    try {
      expiresAt = backendNotif.expiresAt instanceof Date 
        ? backendNotif.expiresAt 
        : new Date(backendNotif.expiresAt);
      if (isNaN(expiresAt.getTime())) {
        console.warn('Invalid expiresAt date:', backendNotif.expiresAt);
        expiresAt = null;
      }
    } catch (e) {
      console.warn('Error parsing expiresAt:', e);
      expiresAt = null;
    }
  }
  
  const isExpired = expiresAt ? expiresAt < new Date() : false;
  
  // Safely parse createdAt
  let createdAt: Date;
  try {
    if (backendNotif.createdAt instanceof Date) {
      createdAt = backendNotif.createdAt;
    } else if (typeof backendNotif.createdAt === 'string') {
      createdAt = new Date(backendNotif.createdAt);
      if (isNaN(createdAt.getTime())) {
        console.warn('Invalid createdAt date:', backendNotif.createdAt);
        createdAt = new Date(); // Fallback to current date
      }
    } else {
      createdAt = new Date(); // Fallback to current date
    }
  } catch (e) {
    console.warn('Error parsing createdAt:', e);
    createdAt = new Date(); // Fallback to current date
  }
  
  return {
    id: backendNotif.id,
    type,
    title: backendNotif.title,
    message: backendNotif.message,
    timestamp: createdAt,
    read: backendNotif.isRead,
    persistent: type === 'error' || type === 'warning' || isExpired,
    action: backendNotif.actionUrl ? {
      label: 'View',
      onClick: () => {
        if (backendNotif.actionUrl) {
          window.location.href = backendNotif.actionUrl;
        }
      }
    } : undefined
  };
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  onNotificationClick
}) => {
  // Use state to track role changes and trigger re-renders
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState<Notification | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [localReadState, setLocalReadState] = useState<Set<string>>(new Set());
  const [localDeletedState, setLocalDeletedState] = useState<Set<string>>(new Set());

  // Listen for role changes (when role is changed via admin-role-setter)
  useEffect(() => {
    const handleRoleChange = (e: CustomEvent | StorageEvent) => {
      const newRole = e instanceof CustomEvent ? e.detail?.newRole : e.newValue;
      if (newRole !== userRole) {
        console.log('🔄 Role changed detected:', newRole);
        setUserRole(newRole);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userRole') {
        handleRoleChange(e);
      }
    };

    // Listen for custom roleChanged event (same tab)
    window.addEventListener('roleChanged', handleRoleChange as EventListener);

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for changes (fallback)
    const checkRoleInterval = setInterval(() => {
      const currentRole = localStorage.getItem('userRole');
      if (currentRole !== userRole) {
        console.log('🔄 Role changed detected via polling:', currentRole);
        setUserRole(currentRole);
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('roleChanged', handleRoleChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkRoleInterval);
    };
  }, [userRole]);

  // Fetch notifications from backend - based on user role
  // Use key prop to force refetch when role changes
  const { data: backendNotifications, isLoading, error, refetch } = useGetList<BackendNotification>(
    QueryNames.NOTIFICATIONS,
    userRole ? {
      filter: { roleName: userRole }
    } : {
      filter: {}
    }
  );

  // Convert backend notifications to frontend format
  const notifications = useMemo(() => {
    if (!backendNotifications || !Array.isArray(backendNotifications)) {
      console.warn('⚠️ backendNotifications is not an array:', backendNotifications);
      return [];
    }
    
    console.log(`📋 Processing ${backendNotifications.length} notifications`);
    
    return backendNotifications
      .filter(notif => {
        // Filter out deleted notifications
        if (localDeletedState.has(notif.id)) return false;
        // Filter out expired notifications
        if (notif.expiresAt) {
          try {
            const expiresDate = notif.expiresAt instanceof Date 
              ? notif.expiresAt 
              : new Date(notif.expiresAt);
            if (!isNaN(expiresDate.getTime())) {
              return expiresDate >= new Date();
            }
          } catch (e) {
            console.warn('Error parsing expiresAt:', e);
          }
        }
        return true;
      })
      .map(notif => {
        try {
          const converted = convertNotification(notif);
          // Apply local read state
          if (localReadState.has(notif.id)) {
            converted.read = true;
          }
          return converted;
        } catch (e) {
          console.error('Error converting notification:', e, notif);
          return null;
        }
      })
      .filter((notif): notif is Notification => notif !== null) // Remove nulls
      .sort((a, b) => {
        // Safe sorting with fallback
        try {
          const timeA = a.timestamp instanceof Date && !isNaN(a.timestamp.getTime()) 
            ? a.timestamp.getTime() 
            : 0;
          const timeB = b.timestamp instanceof Date && !isNaN(b.timestamp.getTime()) 
            ? b.timestamp.getTime() 
            : 0;
          return timeB - timeA; // Sort by newest first
        } catch (e) {
          return 0;
        }
      });
  }, [backendNotifications, localReadState, localDeletedState]);

  // Refetch notifications when role changes
  useEffect(() => {
    if (userRole && refetch) {
      console.log('🔄 Refetching notifications for role:', userRole);
      refetch();
    }
  }, [userRole, refetch]);

  // Refresh notifications periodically
  useEffect(() => {
    if (!userRole) return;
    
    const interval = setInterval(() => {
      if (refetch) {
        refetch();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [userRole, refetch]);

  // Debug: Log notifications data and errors
  useEffect(() => {
    console.log('🔍 Notification System Debug:', {
      userRole,
      hasBackendNotifications: !!backendNotifications,
      backendNotificationsCount: backendNotifications?.length || 0,
      isLoading,
      error: error ? (error instanceof Error ? error.message : String(error)) : null,
      backendNotifications: backendNotifications
    });
    
    if (backendNotifications) {
      console.log('📬 Notifications fetched:', backendNotifications);
      console.log('👤 User Role:', userRole);
      console.log('📊 Notification count:', backendNotifications.length);
      
      // Log each notification
      backendNotifications.forEach((notif, index) => {
        console.log(`📌 Notification ${index + 1}:`, {
          id: notif.id,
          userId: notif.userId,
          type: notif.type,
          title: notif.title,
          isRead: notif.isRead,
          expiresAt: notif.expiresAt,
          createdAt: notif.createdAt
        });
      });
    }
    
    if (error) {
      console.error('❌ Notification fetch error:', error);
      console.error('👤 User Role when error occurred:', userRole);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
    
    if (!userRole) {
      console.warn('⚠️ No userRole found in localStorage. Available keys:', Object.keys(localStorage));
    }
  }, [backendNotifications, error, userRole, isLoading]);

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
    setLocalReadState(prev => new Set(prev).add(notificationId));
    // TODO: Call backend API to mark as read
  };

  const markAllAsRead = () => {
    if (backendNotifications) {
      const allIds = backendNotifications.map(n => n.id);
      setLocalReadState(prev => new Set([...prev, ...allIds]));
      // TODO: Call backend API to mark all as read
    }
    handleMenuClose();
  };

  const deleteNotification = (notificationId: string) => {
    setLocalDeletedState(prev => new Set(prev).add(notificationId));
    // TODO: Call backend API to delete notification
  };

  const clearAllNotifications = () => {
    if (backendNotifications) {
      const allIds = backendNotifications.map(n => n.id);
      setLocalDeletedState(prev => new Set([...prev, ...allIds]));
      // TODO: Call backend API to clear all notifications
    }
    handleMenuClose();
  };

  const getNotificationIcon = (type: Notification['type']): React.ReactElement => {
    switch (type) {
      case 'success': 
        return <CheckCircle color="success" />;
      case 'error': 
        return <ErrorIcon color="error" />;
      case 'warning': 
        return <Warning color="warning" />;
      case 'info': 
      default:
        return <Info color="info" />;
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

  if (error) {
    console.error('Error fetching notifications:', error);
  }

  if (!userRole) {
    return (
      <Button
        variant="outlined"
        startIcon={<Notifications />}
        size="small"
        disabled
        title="User role not found"
      >
        Notifications
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={
          isLoading ? (
            <CircularProgress size={16} />
          ) : (
            <Badge badgeContent={unreadCount} color="error" max={9}>
              <Notifications />
            </Badge>
          )
        }
        onClick={handleMenuClick}
        size="small"
        disabled={isLoading}
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

        {isLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading notifications...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="body2" color="error">
              Error loading notifications
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </Typography>
            {userRole && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                User Role: {userRole}
              </Typography>
            )}
            <Button size="small" onClick={() => {
              console.log('Retrying notifications fetch...');
              if (refetch) refetch();
            }} sx={{ mt: 1 }}>
              Retry
            </Button>
          </Box>
        ) : notifications.length === 0 ? (
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
                        {notification.timestamp instanceof Date && !isNaN(notification.timestamp.getTime())
                          ? notification.timestamp.toLocaleTimeString()
                          : 'Just now'}
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




































