import React from 'react';
import { Typography, Box, Card, CardContent, Alert } from '@mui/material';
import { AdminDashboard } from './admin-dashboard';
import { PublisherDashboard } from './publisher-dashboard';
import { Dashboard } from './dashboard';

interface RoleBasedDashboardProps {
  filter?: any;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ filter }) => {
  const userRoleId = localStorage.getItem("userRoleId");
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");

  // Debug information
  console.log("RoleBasedDashboard - User Role ID:", userRoleId);
  console.log("RoleBasedDashboard - User Role:", userRole);
  console.log("RoleBasedDashboard - User Name:", userName);

  const renderDashboard = () => {
    // Use role name instead of role ID for better reliability
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'developer':
        return <Dashboard filter={filter} />;
      case 'publisher':
        return <PublisherDashboard />;
      default:
        // If no role is set, default to Developer Dashboard for now
        console.log("No role detected, defaulting to Developer Dashboard");
        return <Dashboard filter={filter} />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {userRole === 'admin' && 'Admin Dashboard'}
          {userRole === 'developer' && 'Developer Dashboard'}
          {userRole === 'publisher' && 'Publisher Dashboard'}
          {!userRole && 'Developer Dashboard'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome, {userName || 'User'} ({userRole || 'Developer'})
        </Typography>
      </Box>
      {renderDashboard()}
    </Box>
  );
};
