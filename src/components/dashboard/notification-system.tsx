/**
 * Barrel exports for dashboard notification bells.
 * Prefer importing the dashboard-specific component from here or from `./notifications/*`.
 */
export { PublisherDashboardNotifications } from './notifications/publisher-dashboard-notifications';
export { DeveloperDashboardNotifications } from './notifications/developer-dashboard-notifications';
export { AdminDashboardNotifications } from './notifications/admin-dashboard-notifications';
export type { Notification } from './notifications/notification-model';
export { NotificationBell } from './notifications/NotificationBell';

/** Legacy name — same as developer dashboard bell. */
export { DeveloperDashboardNotifications as NotificationSystem } from './notifications/developer-dashboard-notifications';
