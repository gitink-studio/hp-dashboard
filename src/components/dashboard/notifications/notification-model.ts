import { QueryNames } from '../../../common/constants';

export interface BackendNotification {
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

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
  navigateTo?: string;
  externalUrl?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/** Path for react-admin's hash router (no "#" in the string — router owns the hash). */
function toHashRouterPath(hashOrPath: string): string {
  const withoutQuery = hashOrPath.split('?')[0] ?? '';
  const trimmed = withoutQuery.replace(/^\/+/, '');
  return trimmed ? `/${trimmed}` : '/';
}

export function resolveNotificationTarget(n: BackendNotification): {
  navigateTo?: string;
  externalUrl?: string;
} {
  const raw = n.actionUrl?.trim();
  if (raw) {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return { externalUrl: raw };
    }
    // Backend often stores "/#/resource" — must not pass that to navigate() or it breaks under HashRouter.
    if (raw.startsWith('/#/')) {
      return { navigateTo: toHashRouterPath(raw.slice(3)) };
    }
    if (raw.startsWith('#/')) {
      return { navigateTo: toHashRouterPath(raw.slice(2)) };
    }
    if (raw.startsWith('/')) {
      return { navigateTo: raw.split('?')[0] || '/' };
    }
    return { navigateTo: toHashRouterPath(raw) };
  }

  const blob = `${n.title} ${n.message} ${n.type}`.toLowerCase();
  if (
    blob.includes('game submission') ||
    blob.includes('game request') ||
    blob.includes('submitted for review') ||
    blob.includes('pending approval') ||
    blob.includes('play test')
  ) {
    return { navigateTo: `/${QueryNames.GET_ALL_GAME_REQUESTS}` };
  }

  return {};
}

export function mapNotificationType(
  backendType: string,
  priority?: string,
): Notification['type'] {
  const typeLower = backendType?.toLowerCase() || '';
  if (typeLower.includes('error') || typeLower.includes('failed')) return 'error';
  if (typeLower.includes('warning') || typeLower.includes('alert')) return 'warning';
  if (typeLower.includes('success') || typeLower.includes('completed')) return 'success';

  const priorityLower = priority?.toLowerCase() || '';
  if (priorityLower === 'urgent' || priorityLower === 'high') return 'error';
  if (priorityLower === 'normal') return 'info';
  if (priorityLower === 'low') return 'info';

  return 'info';
}

export function convertNotification(backendNotif: BackendNotification): Notification {
  const type = mapNotificationType(backendNotif.type, backendNotif.priority);

  let expiresAt: Date | null = null;
  if (backendNotif.expiresAt) {
    try {
      expiresAt =
        backendNotif.expiresAt instanceof Date
          ? backendNotif.expiresAt
          : new Date(backendNotif.expiresAt);
      if (isNaN(expiresAt.getTime())) {
        expiresAt = null;
      }
    } catch {
      expiresAt = null;
    }
  }

  const isExpired = expiresAt ? expiresAt < new Date() : false;

  const { navigateTo, externalUrl } = resolveNotificationTarget(backendNotif);

  let createdAt: Date;
  try {
    if (backendNotif.createdAt instanceof Date) {
      createdAt = backendNotif.createdAt;
    } else if (typeof backendNotif.createdAt === 'string') {
      createdAt = new Date(backendNotif.createdAt);
      if (isNaN(createdAt.getTime())) {
        createdAt = new Date();
      }
    } else {
      createdAt = new Date();
    }
  } catch {
    createdAt = new Date();
  }

  return {
    id: backendNotif.id,
    type,
    title: backendNotif.title,
    message: backendNotif.message,
    timestamp: createdAt,
    read: backendNotif.isRead,
    persistent: type === 'error' || type === 'warning' || isExpired,
    navigateTo,
    externalUrl,
    action:
      navigateTo || externalUrl
        ? {
            label: 'View',
            onClick: () => {
              if (externalUrl) window.location.href = externalUrl;
            },
          }
        : undefined,
  };
}
