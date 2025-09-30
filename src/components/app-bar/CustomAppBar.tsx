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
  IconButton,
  Typography,
  MenuItem,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import { CircleNotifications, ExitToApp, AdminPanelSettings } from "@mui/icons-material";

const CustomAppBar = () => {
  const resources = useResourceDefinitions();
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole?.toLowerCase().includes('admin') || userRole?.toLowerCase().includes('administrator');

  return (
    <AppBar
      position="fixed"
      color="secondary"
      sx={{
        maxHeight: "48px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left side: Title */}
        <Box display="flex" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Hyper Rabbit
          </Typography>
        </Box>

        {/* Right side: Horizontal Menu */}
        <Box display="flex" flexDirection="row" gap={2}>
          {Object.keys(resources).map((name) => (
            <MenuItemLink
              key={name}
              to={`/${name}`}
              primaryText={resources[name].options?.label || name}
              sx={{
                color: "white",
                "&.RaMenuItemLink-active": {
                  color: "white",
                  textDecoration: "underline",
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "4px",
                },
              }}
            />
          ))}
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          {/* <IconButton aria-label="notification" color="inherit">
            <CircleNotifications />
          </IconButton> */}

          {/* Admin indicator */}
          {isAdmin && (
            <Chip
              icon={<AdminPanelSettings />}
              label="Admin"
              color="warning"
              size="small"
              sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            />
          )}

          {/* User info and role */}
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

          {/* Logout button */}
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

          <ToggleThemeButton />
          {/* <RefreshButton sx={{ color: "white" }} /> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
