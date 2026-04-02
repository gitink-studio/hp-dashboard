import React from 'react';
import { NotificationBell } from './NotificationBell';
import type { Notification } from './notification-model';

export interface PublisherDashboardNotificationsProps {
  onNotificationClick?: (notification: Notification) => void;
  /** Set false until main dashboard lists have loaded so notifications fetch runs last. */
  fetchEnabled?: boolean;
}

/**
 * Publisher dashboard bell. Uses canonical GraphQL role `publisher` so `notifications(roleName)`
 * matches `Role.name` in the DB; raw `userRole` in localStorage can be a label that does not.
 */
export const PublisherDashboardNotifications: React.FC<PublisherDashboardNotificationsProps> = ({
  fetchEnabled = true,
  ...props
}) => (
  <NotificationBell
    roleFilterName="publisher"
    queryContext="publisher-dashboard"
    menuTitle="Notifications"
    fetchEnabled={fetchEnabled}
    {...props}
  />
);
