import { useCallback, useEffect, useLayoutEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Admin, defaultDarkTheme, defaultLightTheme, Resource, useAuthProvider } from "react-admin";
import { DeviceList } from "./pages/devices/device-list";
import { dataProvider } from "./data-providers/data-provider";
import { UserList } from "./pages/users/user-list";
import { LinkList } from "./pages/links/link-list";
import { EventLogList } from "./pages/event-logs/event-log-list";
import { GamePlatformList } from "./pages/game-platforms/game-platform-list";
import { GameList } from "./pages/games/game-list";
import { GamePlatformCreate } from "./pages/game-platforms/game-platform-create";
import { GameCreate } from "./pages/games/game-create";
import { APP_AUTH_CHANGED_EVENT, QueryNames } from "./common/constants";
import { isPublisherRole, useUserRole } from "./common/role-utils";
import CustomLayout from "./components/layouts/CustomLayout";
import { authProvider } from "./auth-providers/auth-provider";
import { LoginPage } from "./pages/auth/login-page";
import { AdminDashboard } from "./pages/dashboard/admin-dashboard";
import { Dashboard } from "./pages/dashboard/dashboard";
import { PublisherDashboard } from "./pages/dashboard/publisher-dashboard";
import { ReportsPage } from "./pages/reports/reports-page";
import { ReportConfigurationPage } from "./pages/admin/report-configuration-page";
import { AdvancedReportConfiguration } from "./pages/admin/advanced-report-configuration";
import { SDKConfigurationPage } from "./pages/admin/sdk-configuration-page";
import { GameAnalyticsImportExport } from "./components/admin/game-analytics-import-export";
import { TestsHub } from "./pages/tests/tests-hub";
import { DeveloperTestDetail } from "./pages/tests/developer-test-detail";
import { PublisherTestDetail } from "./pages/tests/publisher-test-detail";
import { Route } from "react-router";
import { CustomRoutes } from "react-admin";
import { SDKDetails } from "./pages/sdk/sdk-details";
import { SubmitWebGameDetails } from "./pages/submit-web-game/submit-web-game-details";
import { PlayTests } from "./pages/play-tests/play-tests";
import { PlayerReport } from "./pages/gameplay-reports/player-report";
import { PublisherGameplayReportsPage } from "./components/routes/publisher-gameplay-reports-page";
import { createTheme } from "@mui/material";
import { customStyle } from "./common/styles";
import { light } from "@mui/material/styles/createPalette";
// import { ResetPasswordPage } from "./pages/auth/reset-password-page";

/**
 * UserMenu reads identity from react-query (5m stale). Login only changes the hash, so the SPA keeps a stale cache.
 * `APP_AUTH_CHANGED_EVENT` can fire while the login route is shown (CoreAdminRoutes not mounted), so we also push
 * fresh identity from authProvider on layout mount via setQueryData.
 */
function AuthIdentityQuerySync() {
  const queryClient = useQueryClient();
  const authProvider = useAuthProvider();

  const pushIdentityToCache = useCallback(async () => {
    if (!authProvider?.getIdentity) return;
    try {
      const identity = await authProvider.getIdentity();
      queryClient.setQueryData(["auth", "getIdentity"], identity);
    } catch {
      queryClient.removeQueries({ queryKey: ["auth", "getIdentity"] });
    }
  }, [authProvider, queryClient]);

  useLayoutEffect(() => {
    void pushIdentityToCache();
  }, [pushIdentityToCache]);

  useEffect(() => {
    const onAuth = () => void pushIdentityToCache();
    window.addEventListener(APP_AUTH_CHANGED_EVENT, onAuth);
    return () => window.removeEventListener(APP_AUTH_CHANGED_EVENT, onAuth);
  }, [pushIdentityToCache]);

  return null;
}

export const App = () => {
  const userRole = useUserRole();
  const lower = userRole.toLowerCase();
  const isAdmin = lower.includes("admin") || lower.includes("administrator");
  const isPublisher = isPublisherRole(userRole);

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
      requireAuth
    >
      <AuthIdentityQuerySync />
      {/* Single "Dashboard" nav item: publisher vs developer (non-publishers use developer dashboard, incl. admin) */}
      {isPublisher ? (
        <Resource
          key="dashboard-publisher"
          name={QueryNames.GET_PUBLISHER_DASHBOARD_DATA}
          list={PublisherDashboard}
          options={{ label: "Dashboard" }}
        />
      ) : (
        <Resource
          key="dashboard-developer"
          name={QueryNames.GET_DEVELOPER_DASHBOARD_DATA}
          list={Dashboard}
          options={{ label: "Dashboard" }}
        />
      )}

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


      <Resource
        name="gameplay-reports"
        list={PublisherGameplayReportsPage}
        options={{ label: "Gameplay Reports" }}
      />


      {/* Tests Hub */}
      <Resource
        name="tests"
        list={TestsHub}
        options={{ label: "Tests" }}
      />

      <Resource
        name={QueryNames.GET_ALL_GAME_REQUESTS}
        list={PlayTests}
        options={{ label: "Play Tests" }}
      />

      {
        // isDeveloper && (
        //   <>
        //     < Resource
        //       name="sdk"
        //       list={SDKDetails}
        //       options={{ label: "Submit Android Game", hasShow: false }}
        //     />

        //     <Resource
        //       name="submit-web-game"
        //       list={SubmitWebGameDetails}
        //       options={{ label: "Submit Web Game" }}
        //     />
        //   </>
        // )
      }

      {/* Tests detail routes */}
      <CustomRoutes>
        <Route path="sdk" element={<SDKDetails />} />
        <Route path="submit-web-game" element={<SubmitWebGameDetails />} />
        <Route path="tests/developer/:id" element={<DeveloperTestDetail />} />
        <Route path="tests/publisher/:id" element={<PublisherTestDetail />} />
        <Route path="gameplay-reports/player-details" element={<PlayerReport />} />

        {/* <Route path="reset-password" element={<ResetPasswordPage />} /> */}
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
          <Resource
            name="advanced-report-configuration"
            list={AdvancedReportConfiguration}
            options={{ label: "Advanced Config" }}
          />
          <Resource
            name="sdk-configuration"
            list={SDKConfigurationPage}
            options={{ label: "SDK Configuration" }}
          />
          <Resource
            name="game-analytics-import"
            list={GameAnalyticsImportExport}
            options={{ label: "GA Import/Export" }}
          />
        </>
      )}
    </Admin>
  );
};
