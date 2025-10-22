import {
  email,
  Login,
  minLength,
  PasswordInput,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useLogin,
  useNotify,
} from "react-admin";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { SignUpForm } from "./signup-form";
import { ForgotPasswordPage } from "./forgot-password-page";

export const LoginPage = (props: any) => {
  const [canOpenSignUpPage, setSignUpPageState] = useState(() => false);
  const [canOpenForgotPasswordPage, setForgotPasswordPageState] = useState(
    () => false,
  );
  const login = useLogin();
  const notify = useNotify();

  const CustomToolBar = () => {
    return (
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <SaveButton size="large" fullWidth label="Login" icon={false} />
        <Stack direction="row" spacing={2} sx={{ pt: 2, pb: 3 }}>
          <Button
            color="primary"
            variant="text"
            onClick={() => setForgotPasswordPageState(true)}
          >
            Forgot Password?
          </Button>
          <Button
            color="primary"
            variant="text"
            onClick={() => setSignUpPageState(true)}
          >
            New User? [Sign Up]
          </Button>
        </Stack>
      </Toolbar>
    );
  };

  const handleLogin = async (data: any) => {
    try {
      await login({
        username: data?.email,
        password: data?.password,
      });
      notify("Logged in successfully", { type: "success" });
    } catch (error) {
      notify("Invalid credentials", { type: "error" });
    }
    console.log("Login button clicked!", data);
  };

  return (
    <>
      <Login {...props} sx={{ display: "flex", justifyContent: "center", alignItems: "center", '& .RaLogin-card': { mt: 0 } }}>
        <SimpleForm toolbar={<CustomToolBar />} onSubmit={handleLogin} >
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
              Welcome Back!
            </Typography>
            <TextInput
              source="email"
              label="Email"
              defaultValue=""
              fullWidth={false}
              validate={[required(), email()]}
            />
            <PasswordInput
              source="password"
              label="Password"
              defaultValue=""
              fullWidth={false}
              validate={[required(), minLength(8)]}
            />
          </Stack>

          {canOpenSignUpPage ? (
            <SignUpForm
              enable={canOpenSignUpPage}
              setState={setSignUpPageState}
            />
          ) : null}

          {canOpenForgotPasswordPage ? (
            <ForgotPasswordPage
              enable={canOpenForgotPasswordPage}
              setState={setForgotPasswordPageState}
            />
          ) : null}
        </SimpleForm>
      </Login>
    </>
  );
};
