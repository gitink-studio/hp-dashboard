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

  // Normalize role for case-insensitive comparison
  const normalizedRole = userRole ? userRole.toLowerCase().trim() : '';

  // Debug information
  console.log("RoleBasedDashboard - User Role ID:", userRoleId);
  console.log("RoleBasedDashboard - User Role (raw):", userRole);
  console.log("RoleBasedDashboard - User Role (normalized):", normalizedRole);
  console.log("RoleBasedDashboard - User Name:", userName);

  const renderDashboard = () => {
    // Use normalized role name for case-insensitive matching
    if (normalizedRole === 'admin' || normalizedRole.includes('admin')) {
      return <AdminDashboard />;
    } else if (normalizedRole === 'developer' || normalizedRole.includes('developer')) {
      return <Dashboard filter={filter} />;
    } else if (normalizedRole === 'publisher' || normalizedRole.includes('publisher')) {
      return <PublisherDashboard />;
    } else {
      // If no role is set, default to Developer Dashboard for now
      console.log("No valid role detected, defaulting to Developer Dashboard");
      return <Dashboard filter={filter} />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {normalizedRole === 'admin' && 'Admin Dashboard'}
          {normalizedRole === 'developer' && 'Developer Dashboard'}
          {normalizedRole === 'publisher' && 'Publisher Dashboard'}
          {!normalizedRole && 'Developer Dashboard'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome, {userName || 'User'} ({userRole || 'Developer'})
        </Typography>
      </Box>
      {renderDashboard()}
    </Box>
  );
};
