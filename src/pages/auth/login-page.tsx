import {
  email,
  Form,
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
import { useNavigate } from "react-router";

export const LoginPage = (props: any) => {
  const [canOpenForm, setFormState] = useState(() => false);
  const login = useLogin();
  const notify = useNotify();

  const CustomToolBar = ({ login }: { login: any }) => {
    return (
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
          label="Login"
          onClick={login}
          icon={false}
          mutationOptions={{
            onSuccess: () => {
              console.log("Logged in successfully!");
            },
            onError: (error) => {
              console.error("Login failed", error);
            },
          }}
        />
        <Stack direction="row" spacing={2} sx={{ pt: 2, pb: 3 }}>
          <Button color="primary" variant="text">
            Forgot Password?
          </Button>
          <Button
            color="primary"
            variant="text"
            onClick={() => setFormState(true)}
          >
            New User? [Sign Up]
          </Button>
        </Stack>
      </Toolbar>
    );
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    const form = event.target.closest("form");
    const formData = new FormData(form);

    try {
      await login({
        username: formData.get("email"),
        password: formData.get("password"),
      });
      notify("Logged in successfully", { type: "success" });
    } catch (error) {
      notify("Invalid credentials", { type: "error" });
    }
    console.log(
      "Login button clicked!",
      formData.get("email"),
      formData.get("password"),
    );
  };

  return (
    <>
      <Login {...props} backgroundImage={false}>
        <SimpleForm toolbar={<CustomToolBar login={handleLogin} />}>
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
          {canOpenForm ? (
            <SignUpForm enable={canOpenForm} setState={setFormState} />
          ) : null}
        </SimpleForm>
      </Login>
    </>
  );
};
