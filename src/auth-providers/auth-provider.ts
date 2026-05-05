import { AuthProvider } from "react-admin";
import { FetchData } from "../data-providers/data-provider";
import { STUDIO_ID, QueryNames, APP_AUTH_CHANGED_EVENT } from "../common/constants";
import { isAllowedAppRole } from "../common/role-utils";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    let isValidUser = await FetchData.isValidUser(username, password);
    console.log("login...", username, password, isValidUser);

    if (isValidUser) {
      console.log("login successful...");

      // Get user details including role information
      let userDetails = await FetchData.getUserDetails(username, password);
      console.log("User details:", userDetails);

      if (!userDetails) {
        console.error("Failed to retrieve user details after successful login");
        return Promise.reject(new Error("Unable to retrieve user details. Please try again."));
      }

      // Store user information in localStorage
      // Normalize role name to lowercase for consistent checking
      const roleName = userDetails.role?.name || '';
      const normalizedRole = roleName.toLowerCase().trim();

      localStorage.setItem("userName", username);
      localStorage.setItem("userRole", normalizedRole);
      localStorage.setItem("userRoleId", userDetails.roleId || '');
      localStorage.setItem("userId", userDetails.id || '');
      localStorage.setItem("userStudio", userDetails.studio || '');
      localStorage.setItem(STUDIO_ID, userDetails.studioId || '');

      console.log("Stored user role (normalized):", normalizedRole);

      // SPA hash-only navigation does not remount <App />; notify so Resources re-register from localStorage.
      window.dispatchEvent(new Event(APP_AUTH_CHANGED_EVENT));

      // Match App.tsx: one dashboard route per role (resource name = path segment)
      const dashboardPath =
        normalizedRole.includes('publisher') ? QueryNames.GET_PUBLISHER_DASHBOARD_DATA : QueryNames.GET_DEVELOPER_DASHBOARD_DATA;
      window.location.href = `/#/${dashboardPath}`;

      return Promise.resolve();
    }

    return Promise.reject();
  },
  logout: () => {
    removeLocalData("userName");
    removeLocalData("userRole");
    removeLocalData("userRoleId");
    removeLocalData("userId");
    removeLocalData("userStudio");
    removeLocalData(STUDIO_ID);
    window.dispatchEvent(new Event(APP_AUTH_CHANGED_EVENT));
    return Promise.resolve('/login');
  },
  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      removeLocalData("userName");
      removeLocalData("userRole");
      removeLocalData("userRoleId");
      removeLocalData("userId");
      removeLocalData("userStudio");
      removeLocalData(STUDIO_ID);
      window.dispatchEvent(new Event(APP_AUTH_CHANGED_EVENT));
      return Promise.reject({ redirectTo: '/login' });
    }

    return Promise.resolve();
  },
  checkAuth: () => {
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole") || "";
    if (!userName?.trim() || !isAllowedAppRole(userRole)) {
      return Promise.reject({ redirectTo: "/login" });
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    const userRole = localStorage.getItem("userRole") || '';
    return Promise.resolve(userRole);
  },
  getIdentity: () => {
    const userName = localStorage.getItem("userName");
    if (!userName) {
      return Promise.reject(new Error("Not authenticated"));
    }
    // Omit fullName so UserMenu shows icon-only in the app bar; profile text stays in the menu (CustomAppBar).
    return Promise.resolve({
      id: localStorage.getItem("userId") || userName,
      avatar: undefined,
    });
  },
};

function removeLocalData(key: string) {
  localStorage.removeItem(key);
}

const checkRoleIsPublisher = () => {
  const userRole = localStorage.getItem('userRole');

  if (!userRole) return false;

  const normalizedRole = userRole.toLowerCase().trim();
  const isRolePublisher = normalizedRole === 'publisher' || normalizedRole.includes('publisher');

  return isRolePublisher;
};

export const AuthenticationProvider = {
  isRolePublisher: () => checkRoleIsPublisher()
}
