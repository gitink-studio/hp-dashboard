import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    if (username === "demo" && password === "demo") {
      localStorage.setItem("userName", username);
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
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
