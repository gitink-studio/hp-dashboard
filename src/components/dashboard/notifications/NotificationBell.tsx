import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useGetList } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { QueryNames } from '../../../common/constants';
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
  CircularProgress,
} from '@mui/material';
import {
  Notifications,
  NotificationsOff,
  Warning,
  Error as ErrorIcon,
  Info,
  CheckCircle,
  Delete,
  Settings,
} from '@mui/icons-material';
import {
  type BackendNotification,
  type Notification,
  convertNotification,
} from './notification-model';

export type NotificationBellContext = 'publisher-dashboard' | 'developer-dashboard' | 'admin-dashboard';

export interface NotificationBellProps {
  /** Passed to notifications GraphQL filter as `roleName`. */
  roleFilterName: string;
  /** Separates React Query cache per dashboard so instances do not share one subscription. */
  queryContext: NotificationBellContext;
  /** When false, the notifications query is disabled (e.g. wait for other dashboard data first). Default true. */
  fetchEnabled?: boolean;
  menuTitle?: string;
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  roleFilterName,
  queryContext,
  fetchEnabled = true,
  menuTitle = 'Notifications',
  onNotificationClick,
}) => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState<Notification | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [localReadState, setLocalReadState] = useState<Set<string>>(new Set());
  const [localDeletedState, setLocalDeletedState] = useState<Set<string>>(new Set());

  const notificationListParams = useMemo(
    () => ({
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'createdAt', order: 'DESC' as const },
      filter: { roleName: roleFilterName },
      meta: { notificationContext: queryContext },
    }),
    [roleFilterName, queryContext],
  );

  const roleOk = Boolean(roleFilterName?.trim());
  const queryEnabled = roleOk && fetchEnabled;
  const waitingForPrerequisites = roleOk && !fetchEnabled;

  const { data: backendNotifications, isPending, error, refetch } = useGetList<BackendNotification>(
    QueryNames.NOTIFICATIONS,
    notificationListParams,
    {
      staleTime: 90_000,
      refetchOnWindowFocus: false,
      enabled: queryEnabled,
    },
  );

  const loadingNotifications = queryEnabled && isPending && backendNotifications === undefined;
  const showInitialListLoading = waitingForPrerequisites || loadingNotifications;

  const notifications = useMemo(() => {
    if (!backendNotifications || !Array.isArray(backendNotifications)) {
      return [];
    }

    return backendNotifications
      .filter((notif) => {
        if (localDeletedState.has(notif.id)) return false;
        if (notif.expiresAt) {
          try {
            const expiresDate =
              notif.expiresAt instanceof Date ? notif.expiresAt : new Date(notif.expiresAt);
            if (!isNaN(expiresDate.getTime())) {
              return expiresDate >= new Date();
            }
          } catch {
            /* keep */
          }
        }
        return true;
      })
      .map((notif) => {
        try {
          const converted = convertNotification(notif);
          if (localReadState.has(notif.id)) {
            converted.read = true;
          }
          return converted;
        } catch {
          return null;
        }
      })
      .filter((notif): notif is Notification => notif !== null)
      .sort((a, b) => {
        try {
          const timeA =
            a.timestamp instanceof Date && !isNaN(a.timestamp.getTime())
              ? a.timestamp.getTime()
              : 0;
          const timeB =
            b.timestamp instanceof Date && !isNaN(b.timestamp.getTime())
              ? b.timestamp.getTime()
              : 0;
          return timeB - timeA;
        } catch {
          return 0;
        }
      });
  }, [backendNotifications, localReadState, localDeletedState]);

  const refetchRef = useRef(refetch);
  useEffect(() => {
    refetchRef.current = refetch;
  });

  useEffect(() => {
    if (!queryEnabled) return;
    const interval = setInterval(() => {
      void refetchRef.current?.();
    }, 120_000);
    return () => clearInterval(interval);
  }, [roleFilterName, queryEnabled]);

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
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
    setLocalReadState((prev) => new Set(prev).add(notificationId));
  };

  const markAllAsRead = () => {
    if (backendNotifications) {
      const allIds = backendNotifications.map((n) => n.id);
      setLocalReadState((prev) => new Set([...prev, ...allIds]));
    }
    handleMenuClose();
  };

  const deleteNotification = (notificationId: string) => {
    setLocalDeletedState((prev) => new Set(prev).add(notificationId));
  };

  const clearAllNotifications = () => {
    if (backendNotifications) {
      const allIds = backendNotifications.map((n) => n.id);
      setLocalDeletedState((prev) => new Set([...prev, ...allIds]));
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (error) {
    console.error('[NotificationBell]', queryContext, error);
  }

  if (!roleFilterName?.trim()) {
    return (
      <Button variant="outlined" startIcon={<Notifications />} size="small" disabled title="Role not set">
        {menuTitle}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={
          showInitialListLoading ? (
            <CircularProgress size={16} />
          ) : (
            <Badge badgeContent={unreadCount} color="error" max={9}>
              <Notifications />
            </Badge>
          )
        }
        onClick={handleMenuClick}
        size="small"
        disabled={showInitialListLoading}
        title={waitingForPrerequisites ? 'Waiting for dashboard data' : undefined}
      >
        {menuTitle}
      </Button>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 },
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {menuTitle} ({notifications.length})
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

        {showInitialListLoading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {waitingForPrerequisites
                ? 'Loading dashboard data…'
                : 'Loading notifications…'}
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
            <Button size="small" onClick={() => void refetch()} sx={{ mt: 1 }}>
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
                  cursor: 'pointer',
                }}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.externalUrl) {
                    window.location.href = notification.externalUrl;
                  } else if (notification.navigateTo) {
                    navigate(notification.navigateTo);
                  }
                  if (notification.navigateTo || notification.externalUrl) {
                    handleMenuClose();
                  }
                  onNotificationClick?.(notification);
                }}
              >
                <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">{notification.title}</Typography>
                      {!notification.read && <Chip label="New" size="small" color="primary" />}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.timestamp instanceof Date &&
                        !isNaN(notification.timestamp.getTime())
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

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Notification settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Configure notification preferences for this dashboard ({queryContext}).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
