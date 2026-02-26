import React, { useState } from 'react';
import { Box, Button, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { STUDIO_ID } from '../common/constants';

export const AdminRoleSetter: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem("userRole") || 'publisher');
  const [message, setMessage] = useState('');

  const handleSetRole = () => {
    const oldRole = localStorage.getItem('userRole');
    localStorage.setItem("userRole", selectedRole);

    // Dispatch a custom event to notify other components in the same tab
    window.dispatchEvent(new CustomEvent('roleChanged', {
      detail: {
        newRole: selectedRole,
        oldRole: oldRole
      }
    }));

    // Also dispatch storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'userRole',
      newValue: selectedRole,
      oldValue: oldRole
    }));

    setMessage(`Role set to: ${selectedRole}. Notifications will update automatically.`);
  };

  const handleClearRole = () => {
    localStorage.removeItem("userRole");
    setSelectedRole('');
    setMessage('Role cleared. Please refresh the page.');
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userRoleId");
    localStorage.removeItem("userId");
    localStorage.removeItem("userStudio");
    localStorage.removeItem(STUDIO_ID);
    setMessage('Logged out successfully. Redirecting to login...');
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = '/#/login';
    }, 1000);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Admin Role Setter (Testing Only)
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Role</InputLabel>
        <Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="administrator">Administrator</MenuItem>
          <MenuItem value="developer">Developer</MenuItem>
          <MenuItem value="publisher">Publisher</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSetRole}
          disabled={!selectedRole}
        >
          Set Role
        </Button>
        <Button
          variant="outlined"
          onClick={handleClearRole}
        >
          Clear Role
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        Current role: {localStorage.getItem("userRole") || 'Not set'}
      </Typography>
    </Box>
  );
};
