import { Admin, Resource } from "react-admin";
import { DeviceList } from "./pages/devices/device-list";
import { dataProvider } from "./data-providers/data-provider";
import { UserList } from "./pages/users/user-list";
import { LinkList } from "./pages/links/link-list";
import { EventLogList } from "./pages/event-logs/event-log-list";
import { Dashboard } from "./pages/dashboard/dashboard";
import { GamePlatformList } from "./pages/game-platforms/game-platform-list";
import { GameList } from "./pages/games/game-list";
import { GamePlatformCreate } from "./pages/game-platforms/game-platform-create";
import { GameCreate } from "./pages/games/game-create";
import { QueryNames } from "./common/constants";
import CustomLayout from "./components/layouts/CustomLayout";
import { authProvider } from "./auth-providers/auth-provider";
import { LoginPage } from "./pages/auth/login-page";

export const App = () => (
  <Admin
    layout={CustomLayout}
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={<LoginPage />}
  >
    <Resource
      name={QueryNames.GET_ALL_DASHBOARD_DATA}
      list={Dashboard}
      options={{ label: "Dashboard" }}
    />
    <Resource
      name={QueryNames.GET_ALL_GAME_PLATFORM_DATA}
      list={GamePlatformList}
      create={GamePlatformCreate}
      options={{ label: "Reports" }}
    />
    <Resource
      name={QueryNames.GET_ALL_GAME_DATA}
      list={GameList}
      create={GameCreate}
      options={{ label: "Tests" }}
    />
    <Resource
      name={QueryNames.GET_ALL_USER_DATA}
      list={UserList}
      options={{ label: "Creatives" }}
    />
    <Resource
      name={QueryNames.GET_ALL_DEVICE_DATA}
      list={DeviceList}
      options={{ label: "Tier List" }}
    />
    <Resource
      name={QueryNames.GET_ALL_LINK_DATA}
      list={LinkList}
      options={{ label: "SDK" }}
    />
    <Resource
      name={QueryNames.GET_ALL_DATA_BY_USERNAME_OR_VALUE}
      list={EventLogList}
      options={{ label: "Settings" }}
    />
  </Admin>
);
