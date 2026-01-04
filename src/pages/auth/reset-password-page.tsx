import {
  Login,
  minLength,
  PasswordInput,
  required,
  SaveButton,
  SimpleForm,
  Toolbar,
  useNotify,
} from "react-admin";
import { Stack, Typography, Alert, CircularProgress, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../common/utils";
import { RESET_PASSWORD_URL, HTTP_METHODS } from "../../common/constants";

export const ResetPasswordPage = () => {
  const notify = useNotify();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get("token");
    
    if (!tokenFromUrl) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    } else {
      setToken(tokenFromUrl);
    }
  }, [location]);

  const CustomToolbar = () => (
    <Toolbar
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <SaveButton
        size="large"
        fullWidth
        label="Reset Password"
        icon={false}
        disabled={isLoading || !token}
      />
    </Toolbar>
  );

  // Custom validator for password confirmation
  const validatePasswordMatch = (value: any, allValues: any) => {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== allValues.password) {
      return "Passwords do not match";
    }
    return undefined;
  };

  const handleResetPassword = async (data: any) => {
    if (!token) {
      notify("Invalid reset token", { type: "error" });
      return;
    }

    const newPassword = data?.password;
    const confirmPassword = data?.confirmPassword;

    if (!newPassword || !confirmPassword) {
      notify("Please fill in all fields", { type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      notify("Passwords do not match", { type: "error" });
      return;
    }

    if (newPassword.length < 8) {
      notify("Password must be at least 8 characters long", { type: "error" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: any = await sendRequest(
        HTTP_METHODS.POST,
        RESET_PASSWORD_URL,
        {
          token: token,
          newPassword: newPassword,
        }
      );

      if (response.success) {
        setIsSuccess(true);
        notify("Password has been reset successfully!", { type: "success" });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.message || "Failed to reset password. The token may be invalid or expired.");
        notify(response.message || "Failed to reset password", { type: "error" });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      notify(errorMessage, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Login backgroundImage={false}>
        <Stack
          sx={{
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ display: "flex", justifyContent: "center", pb: 2 }}
          >
            Hyper Rabbit
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your password has been reset successfully!
          </Alert>
          <Typography sx={{ mb: 2 }}>
            Redirecting to login page...
          </Typography>
          <CircularProgress size={24} />
        </Stack>
      </Login>
    );
  }

  if (error && !token) {
    return (
      <Login backgroundImage={false}>
        <Stack
          sx={{
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ display: "flex", justifyContent: "center", pb: 2 }}
          >
            Hyper Rabbit
          </Typography>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box sx={{ mt: 2 }}>
            <a
              href="/#/login"
              style={{
                color: "#1976d2",
                textDecoration: "underline",
              }}
            >
              Go to Login
            </a>
          </Box>
        </Stack>
      </Login>
    );
  }

  return (
    <Login backgroundImage={false}>
      <SimpleForm toolbar={<CustomToolbar />} onSubmit={handleResetPassword}>
        <Stack sx={{ width: "100%", pl: 1, pr: 1 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ display: "flex", justifyContent: "center", pb: 2 }}
          >
            Hyper Rabbit
          </Typography>
          <Typography
            sx={{ display: "flex", justifyContent: "center", pb: 2 }}
          >
            Reset Your Password
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <PasswordInput
            source="password"
            label="New Password"
            defaultValue=""
            fullWidth={false}
            validate={[required(), minLength(8)]}
            disabled={isLoading}
          />
          <PasswordInput
            source="confirmPassword"
            label="Confirm New Password"
            defaultValue=""
            fullWidth={false}
            validate={[required(), validatePasswordMatch]}
            disabled={isLoading}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              mb: 2,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            Password must be at least 8 characters long
          </Typography>
        </Stack>
      </SimpleForm>
    </Login>
  );
};

