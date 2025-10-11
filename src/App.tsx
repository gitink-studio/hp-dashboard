import { Admin, Resource } from "react-admin";
import { DeviceList } from "./pages/devices/device-list";
import { dataProvider } from "./data-providers/data-provider";
import { UserList } from "./pages/users/user-list";
import { LinkList } from "./pages/links/link-list";
import { EventLogList } from "./pages/event-logs/event-log-list";
import { GamePlatformList } from "./pages/game-platforms/game-platform-list";
import { GameList } from "./pages/games/game-list";
import { GamePlatformCreate } from "./pages/game-platforms/game-platform-create";
import { GameCreate } from "./pages/games/game-create";
import { QueryNames } from "./common/constants";
import CustomLayout from "./components/layouts/CustomLayout";
import { authProvider } from "./auth-providers/auth-provider";
import { LoginPage } from "./pages/auth/login-page";
import { AdminDashboard } from "./pages/dashboard/admin-dashboard";
import { Dashboard } from "./pages/dashboard/dashboard";
import { PublisherDashboard } from "./pages/dashboard/publisher-dashboard";
import { DashboardRouter } from "./pages/dashboard/dashboard-router";
import { ReportsPage } from "./pages/reports/reports-page";
import { ReportConfigurationPage } from "./pages/admin/report-configuration-page";
import { AdminRoleSetter } from "./components/admin-role-setter";
import { TestsHub } from "./pages/tests/tests-hub";
import { DeveloperTestDetail } from "./pages/tests/developer-test-detail";
import { PublisherTestDetail } from "./pages/tests/publisher-test-detail";
import { Route } from "react-router";
import { CustomRoutes } from "react-admin";
import { SDKDetails } from "./pages/sdk/sdk-details";

export const App = () => {
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole?.toLowerCase().includes('admin') || userRole?.toLowerCase().includes('administrator');

  return (
    <Admin
      layout={CustomLayout}
      theme={{
        palette: {
          mode: 'light',
        }
      }}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={<LoginPage />}
    >
      {/* Dashboard Router - Redirects to appropriate dashboard */}
      {/* <Resource
        name={QueryNames.GET_ALL_DASHBOARD_DATA}
        list={DashboardRouter}
        options={{ label: "Dashboard" }}
      /> */}


      {/* Dashboard Resources - Always available, access controlled by components */}
      <Resource
        name={QueryNames.GET_DEVELOPER_DASHBOARD_DATA}
        list={Dashboard}
        options={{ label: "Developer Dashboard" }}
      />

      <Resource
        name={QueryNames.GET_PUBLISHER_DASHBOARD_DATA}
        list={PublisherDashboard}
        options={{ label: "Publisher Dashboard" }}
      />

      {/* Admin-only resources */}
      {/* <Resource
        name={QueryNames.GET_ALL_ADMIN_DASHBOARD_DATA}
        list={AdminDashboard}
        options={{ label: "Admin Dashboard" }}
      /> */}
      {/* <Resource
        name={QueryNames.GET_ALL_USER_DATA}
        list={UserList}
        options={{ label: "Users" }}
      /> */}

      {/* Reports - Available for all authenticated users */}
      <Resource
        name="reports"
        list={ReportsPage}
        options={{ label: "Reports" }}
      />

      {/* Tests Hub */}
      <Resource
        name="tests"
        list={TestsHub}
        options={{ label: "Tests" }}
      />

      {/* SDK Submission */}
      <Resource
        name="sdk"
        list={SDKDetails}
        options={{ label: "SDK" }}
      />

      {/* Tests detail routes */}
      <CustomRoutes>
        <Route path="tests/developer/:id" element={<DeveloperTestDetail />} />
        <Route path="tests/publisher/:id" element={<PublisherTestDetail />} />
      </CustomRoutes>

      {/* Role-based menu items
      {(userRole === 'admin' || userRole === 'publisher') && (
        <>
          <Resource
            name={QueryNames.GET_ALL_GAME_PLATFORM_DATA}
            list={GamePlatformList}
            create={GamePlatformCreate}
            options={{ label: "Game Platforms" }}
          />
          <Resource
            name={QueryNames.GET_ALL_GAME_DATA}
            list={GameList}
            create={GameCreate}
            options={{ label: "Games" }}
          />
          <Resource
            name={QueryNames.GET_ALL_DEVICE_DATA}
            list={DeviceList}
            options={{ label: "Devices" }}
          />
          <Resource
            name={QueryNames.GET_ALL_LINK_DATA}
            list={LinkList}
            options={{ label: "Links" }}
          />
        </>
      )} */}

      {/* Admin-only menu items */}
      {isAdmin && (
        <>
          <Resource
            name={QueryNames.GET_ALL_DATA_BY_USERNAME_OR_VALUE}
            list={EventLogList}
            options={{ label: "Event Logs" }}
          />
          <Resource
            name="report-configuration"
            list={ReportConfigurationPage}
            options={{ label: "Report Configuration" }}
          />
        </>
      )}

      {/* Testing component - remove in production */}
      <Resource
        name="admin-role-setter"
        list={AdminRoleSetter}
        options={{ label: "Set Admin Role (Testing)" }}
      />
    </Admin>
  );
};
