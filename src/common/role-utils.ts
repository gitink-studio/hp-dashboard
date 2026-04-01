import { useSyncExternalStore } from "react";
import { APP_AUTH_CHANGED_EVENT } from "./constants";

export function subscribeRoleRefresh(onStoreChange: () => void) {
  const run = () => onStoreChange();
  window.addEventListener("hashchange", run);
  window.addEventListener(APP_AUTH_CHANGED_EVENT, run);
  return () => {
    window.removeEventListener("hashchange", run);
    window.removeEventListener(APP_AUTH_CHANGED_EVENT, run);
  };
}

export function readUserRoleSnapshot() {
  return localStorage.getItem("userRole") ?? "";
}

export function readUserNameSnapshot() {
  return localStorage.getItem("userName") ?? "";
}

/** Re-renders when login/logout updates `userName` (same signals as `useUserRole`). */
export function useUserName() {
  return useSyncExternalStore(subscribeRoleRefresh, readUserNameSnapshot, readUserNameSnapshot);
}

/** Same rule as dashboard routing: role string contains "publisher" (e.g. DB name "Publisher"). */
export function isPublisherRole(role: string) {
  return role.toLowerCase().trim().includes("publisher");
}

/** Developer dashboard / dev-only flows (matches dashboard.tsx intent). */
export function isDeveloperRole(role: string) {
  const r = role.toLowerCase().trim();
  if (isPublisherRole(role)) return false;
  return r.includes("developer") || r === "dev" || r.includes("dev");
}

/** Admin must be checked before isDeveloperRole (e.g. "administrator" contains "dev"). */
export function isAllowedAppRole(role: string) {
  const r = role.toLowerCase().trim();
  if (!r) return false;
  if (r.includes("admin") || r.includes("administrator")) return true;
  if (isPublisherRole(role)) return true;
  if (isDeveloperRole(role)) return true;
  return false;
}

/**
 * Bucket for Reports hub + APIs: publisher vs developer.
 * Same rules as reports-page.tsx (substring match, not exact localStorage equality).
 */
export function getReportsHubRole(raw: string | null): "developer" | "publisher" | null {
  if (!raw?.trim()) return null;
  const r = raw.toLowerCase().trim();
  if (r.includes("publisher") || r.includes("pub")) return "publisher";
  if (r.includes("developer") || r.includes("dev")) return "developer";
  return null;
}

export function useUserRole() {
  return useSyncExternalStore(subscribeRoleRefresh, readUserRoleSnapshot, readUserRoleSnapshot);
}
