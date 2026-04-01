import {
  useResourceDefinitions,
  MenuItemLink,
  UserMenu,
  Logout,
  ToggleThemeButton,
  RefreshButton,
} from "react-admin";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Avatar,
  MenuList,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { ExitToApp, AdminPanelSettings, LogoutRounded, LogoutSharp, PeopleOutline, VerifiedUserRounded, Person } from "@mui/icons-material";
import { isPublisherRole, useUserName, useUserRole } from "../../common/role-utils";
import { APP_AUTH_CHANGED_EVENT, STUDIO_ID } from "../../common/constants";

const CustomAppBar = () => {
  const resources = useResourceDefinitions();
  const userName = useUserName();
  const userRole = useUserRole();
  const isAdmin = userRole?.toLowerCase().includes('admin') || userRole?.toLowerCase().includes('administrator');

  const navResourceNames = Object.keys(resources).filter((name) => {
    // Hidden from navbar only; <Resource name="reports" /> stays in App.tsx
    if (name === "reports") return false;
    if (name === "gameplay-reports") return isPublisherRole(userRole);
    return true;
  });

  return (
    <AppBar position="fixed">
      <Toolbar variant="dense">
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%' }}>
          <Typography variant="subtitle1" fontWeight="bold">Hyper Rabbit</Typography>

          <Stack direction={'row'} gap={3}>
            {navResourceNames.map((name) => (
              <MenuItemLink
                key={name}
                to={`/${name}`}
                primaryText={resources[name].options?.label || name}
                sx={{
                  color: "white",
                  fontSize: 14,
                  width: 'auto',
                  px: 0,
                  "&.RaMenuItemLink-active": {
                    color: "white",
                    textDecoration: "underline",
                    textDecorationThickness: "1px",
                    textUnderlineOffset: "5px",
                  },
                }}
              />
            ))}
          </Stack>

          <UserMenu>
            <MenuItemLink
              key={`profile-${userName}-${userRole}`}
              to="/"
              primaryText={`${userName || "Guest"} (${userRole})`}
              leftIcon={<Person />}
              disabled
            />
            <Divider />
            <MenuItemLink
              to="/login"
              primaryText="Logout"
              leftIcon={<ExitToApp />}
              onClick={() => {
                localStorage.removeItem("userName");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userRoleId");
                localStorage.removeItem("userId");
                localStorage.removeItem("userStudio");
                localStorage.removeItem(STUDIO_ID);
                window.dispatchEvent(new Event(APP_AUTH_CHANGED_EVENT));
                window.location.href = '/#/login';
              }}
            />
          </UserMenu>

          {/* <Box display="flex" gap={2} alignItems="center">
            {isAdmin && (
              <Chip
                icon={<AdminPanelSettings />}
                label="Admin"
                color="warning"
                size="small"
                sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              />
            )}

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {userName || "Guest"}
              </Typography>
              {userRole && (
                <Chip
                  label={userRole}
                  size="small"
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '0.7rem'
                  }}
                />
              )}
            </Box>

            <Button
              variant="outlined"
              startIcon={<ExitToApp />}
              onClick={() => {
                // Clear all user data from localStorage
                localStorage.removeItem("userName");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userRoleId");
                localStorage.removeItem("userId");
                localStorage.removeItem("userStudio");
                // Redirect to login page
                window.location.href = '/#/login';
              }}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box> */}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
