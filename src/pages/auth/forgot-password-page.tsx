import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton, Stack, Typography, Box, Alert } from "@mui/material";
import { email, required, SaveButton, SimpleForm, TextInput, Toolbar, useNotify, } from "react-admin";
import { useState } from "react";
import { sendRequest } from "../../common/utils";
import { FORGOT_PASSWORD_URL, HttpMethod } from "../../common/constants";

export const ForgotPasswordPage = ({ enable, setState, }: { enable: boolean; setState: any; }) => {
  const notify = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleClose = () => {
    setState(false);
    setIsSubmitted(false);
    setResetToken(null);
  };
  const CustomToolbar = () => (
    <Toolbar sx={{ backgroundColor: "transparent" }}>
      <SaveButton
        type="submit"
        size="large"
        label={isSubmitted ? "Close" : "Send Reset Link"}
        icon={false}
        sx={{ width: "100%" }}
        disabled={isLoading}
      />
    </Toolbar>
  );

  const handleForgotPassword = async (data: any) => {
    const emailAddress = data.email?.trim().toLowerCase();

    if (!emailAddress) {
      notify("Please enter a valid email address", { type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response: any = await sendRequest(
        HttpMethod.POST,
        FORGOT_PASSWORD_URL,
        { email: emailAddress },
      );

      if (response.success) {
        setIsSubmitted(true);
        // In development, show the token for testing
        if (response.data?.token) {
          setResetToken(response.data.token);
        }
        notify(
          "If an account with that email exists, a password reset link has been sent.",
          { type: "success" }
        );
      } else {
        notify(response.message || "Failed to send reset link", { type: "error" });
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      notify(
        error.message || "Failed to send reset link. Please try again.",
        { type: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={enable} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ background: "#1e1e1e", position: "relative", p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <Close />
          </IconButton>

          {isSubmitted ? (
            <Stack spacing={2} sx={{ width: "100%", pt: 2 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pb: 2,
                  color: "white",
                }}
              >
                Hyper Rabbit
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                If an account with that email exists, a password reset link has been sent.
                Please check your email for instructions.
              </Alert>
              {resetToken && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Development Mode:</strong> Use this token to reset your password:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      wordBreak: "break-all",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    {resetToken}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Reset link:{" "}
                    <a
                      href={`/#/reset-password?token=${resetToken}`}
                      style={{ color: "inherit", textDecoration: "underline" }}
                    >
                      Click here to reset password
                    </a>
                  </Typography>
                </Alert>
              )}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <button
                  onClick={handleClose}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </Box>
            </Stack>
          ) : (
            <SimpleForm
              toolbar={<CustomToolbar />}
              onSubmit={handleForgotPassword}
              sx={{ p: 0 }}
            >
              <Stack
                display="flex"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: "400px",
                  mx: "auto",
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    pt: 2,
                    pb: 2,
                    color: "white",
                  }}
                >
                  Hyper Rabbit
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ pb: 1, color: "white", textAlign: "center" }}
                >
                  Forgot your password?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ pb: 3, color: "rgba(255,255,255,0.7)", textAlign: "center" }}
                >
                  Enter your email address and we'll send you a link to reset your
                  password
                </Typography>
                <TextInput
                  source="email"
                  label="Email"
                  validate={[required(), email()]}
                  disabled={isLoading}
                />
              </Stack>
            </SimpleForm>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
