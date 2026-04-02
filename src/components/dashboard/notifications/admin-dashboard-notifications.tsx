import React from 'react';
import { NotificationBell } from './NotificationBell';
import type { Notification } from './notification-model';

export interface AdminDashboardNotificationsProps {
  onNotificationClick?: (notification: Notification) => void;
}

/** Notifications for the admin dashboard (separate cache from dev/publisher). */
export const AdminDashboardNotifications: React.FC<AdminDashboardNotificationsProps> = (props) => {
  return (
    <NotificationBell
      roleFilterName="admin"
      queryContext="admin-dashboard"
      menuTitle="Notifications"
      {...props}
    />
  );
};
