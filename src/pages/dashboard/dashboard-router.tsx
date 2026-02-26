import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

export const DashboardRouter: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // Wait a bit for localStorage to be properly set after login
    const timer = setTimeout(() => {
      const currentUserRole = localStorage.getItem("userRole");
      console.log("DashboardRouter - Current user role:", currentUserRole);
      
      // Redirect based on user role
      switch (currentUserRole) {
        case 'admin':
          console.log("Redirecting to Admin Dashboard");
          navigate('/getAllAdminDashboardData');
          break;
        case 'developer':
          console.log("Redirecting to Developer Dashboard");
          navigate('/getDeveloperDashboardData');
          break;
        case 'publisher':
          console.log("Redirecting to Publisher Dashboard");
          navigate('/getPublisherDashboardData');
          break;
        default:
          console.log("No role found, defaulting to Developer Dashboard");
          // Default to developer dashboard if no role or unknown role
          navigate('/getDeveloperDashboardData');
          break;
      }
    }, 100); // Small delay to ensure localStorage is set

    return () => clearTimeout(timer);
  }, [userRole, navigate]);

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="50vh"
    >
      <CircularProgress size={40} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Redirecting to your dashboard...
      </Typography>
    </Box>
  );
};
