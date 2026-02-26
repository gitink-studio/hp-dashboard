import { AuthProvider } from "react-admin";
import { FetchData } from "../data-providers/data-provider";
import { STUDIO_ID } from "../common/constants";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    let isValidUser = await FetchData.isValidUser(username, password);
    console.log("login...", username, password, isValidUser);

    if (isValidUser) {
      console.log("login successful...");

      // Get user details including role information
      let userDetails = await FetchData.getUserDetails(username, password);
      console.log("User details:", userDetails);

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

      // Redirect to dashboard router after successful login
      window.location.href = '/#/getAllDashboardData';

      return Promise.resolve();
    }

    return Promise.reject();
  },
  logout: () => {
    // Clear all user data from localStorage
    removeLocalData("userName");
    removeLocalData("userRole");
    removeLocalData("userRoleId");
    removeLocalData("userId");
    removeLocalData("userStudio");

    // Redirect to login page and resolve the promise
    window.location.href = '/#/login';
    return Promise.resolve();
  },
  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      removeLocalData("userName");
      removeLocalData("userRole");
      removeLocalData("userRoleId");
      removeLocalData("userId");
      removeLocalData("userStudio");
      return Promise.reject();
    }

    return Promise.resolve();
  },
  checkAuth: () => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      return Promise.resolve();
    }
    // If no user name, redirect to login page
    window.location.href = '/#/login';
    return Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
};

function removeLocalData(key: string) {
  localStorage.removeItem(key);
}
