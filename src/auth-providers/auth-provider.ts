import { AuthProvider } from "react-admin";
import { isValidUser, sendRequest } from "../common/utils";
import { HTTP_METHODS } from "../common/constants";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    let isValidCredentials = await isValidUser(username, password);

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
