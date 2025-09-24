import { AuthProvider } from "react-admin";
import { FetchData } from "../data-providers/data-provider";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    let isValidCredentials = await FetchData.isValidUser(username, password);
    console.log("login...", username, password, isValidCredentials);

    if (isValidCredentials) {
      // Get user details including role information
      let userDetails = await FetchData.getUserDetails(username, password);
      console.log("User details:", userDetails);
      
      // Store user information in localStorage
      localStorage.setItem("userName", username);
      localStorage.setItem("userRole", userDetails.role?.name || '');
      localStorage.setItem("userRoleId", userDetails.roleId || '');
      localStorage.setItem("userId", userDetails.id || '');
      localStorage.setItem("userStudio", userDetails.studio || '');
      
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
