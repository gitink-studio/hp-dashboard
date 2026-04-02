import React from 'react';
import { NotificationBell } from './NotificationBell';
import type { Notification } from './notification-model';

export interface DeveloperDashboardNotificationsProps {
  onNotificationClick?: (notification: Notification) => void;
  /** When false, notifications query waits (e.g. until dashboard bootstrap fetches finish). Default true. */
  fetchEnabled?: boolean;
}

/** Notifications for the developer (non-publisher) dashboard. */
export const DeveloperDashboardNotifications: React.FC<DeveloperDashboardNotificationsProps> = ({
  fetchEnabled = true,
  ...props
}) => (
  <NotificationBell
    roleFilterName="developer"
    queryContext="developer-dashboard"
    menuTitle="Notifications"
    fetchEnabled={fetchEnabled}
    {...props}
  />
);
