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
} from "@mui/material";
import { CircleNotifications } from "@mui/icons-material";

const CustomAppBar = () => {
  const resources = useResourceDefinitions();
  const userName = localStorage.getItem("userName");

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
        <Box display="flex" gap={2}>
          <IconButton aria-label="notification" color="inherit">
            <CircleNotifications />
          </IconButton>
          <UserMenu label={"User"}>
            <MenuItem disabled>
              <ListItemText primary={userName || "Guest"} />
            </MenuItem>
            <Logout />
          </UserMenu>
          <ToggleThemeButton />
          <RefreshButton sx={{ color: "white" }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
