import { Form, Login, PasswordInput, required, TextInput } from "react-admin";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { SignUpForm } from "./signup-form";

export const LoginPage = (props: any) => {
  const [canOpenForm, setFormState] = useState(false);

  return (
    <>
      <Login {...props} backgroundImage={false}>
        <Form>
          <Stack p={2}>
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
              label="Username"
              defaultValue=""
              fullWidth={false}
              validate={[required()]}
            />
            <PasswordInput
              source="password"
              label="Password"
              defaultValue=""
              fullWidth={false}
              validate={[required()]}
            />
            <Button
              variant="text"
              sx={{
                display: "flex",
                alignItems: "center",
                background: "#90caf9",
                color: "black",
              }}
            >
              Login In
            </Button>
            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
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
          </Stack>
          {canOpenForm ? <SignUpForm canOpen={true} /> : null}
        </Form>
      </Login>
    </>
  );
};
