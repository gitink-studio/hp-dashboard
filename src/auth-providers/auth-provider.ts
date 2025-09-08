import { AuthProvider } from "react-admin";
import { FetchData } from "../data-providers/data-provider";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    let isValidCredentials = await FetchData.isValidUser(username, password);
    console.log("login...", username, password, isValidCredentials);

    if (isValidCredentials) {
      localStorage.setItem("userName", username);
      return Promise.resolve();
    }

    return Promise.reject();
  },
  logout: () => {
    removeLocalData("userName");
    return Promise.resolve();
  },
  checkError: ({ status }: { status: number }) => {
    if (status === 401 || status === 403) {
      removeLocalData("userName");
      return Promise.reject();
    }

    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem("userName")
      ? Promise.resolve()
      : Promise.reject();
  },
  getPermissions: () => Promise.resolve(),
};

function removeLocalData(key: string) {
  localStorage.removeItem(key);
}
