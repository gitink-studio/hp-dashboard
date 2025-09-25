import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  email,
  minLength,
  PasswordInput,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
  useNotify,
} from "react-admin";
import { isUserAlreadyExist, sendRequest } from "../../common/utils";
import { CREATE_USER_URL, HTTP_METHODS } from "../../common/constants";

export const SignUpForm = ({
  enable,
  setState,
}: {
  enable: boolean;
  setState: any;
}) => {
  const notify = useNotify();
  const handleClose = () => {
    setState(false);
  };

  const CustomToolbar = () => (
    <Toolbar sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
      <SaveButton
        fullWidth
        type="submit"
        size="large"
        label="Sign Up"
        icon={false}
      />
    </Toolbar>
  );

  const createAccount = async (data: any) => {
    console.log(data);
    try {
      let response: any = await sendRequest(HTTP_METHODS.POST, CREATE_USER_URL, data);

      if (response.data.status !== 200) {
        notify("Something went wrong!", { type: "error" });
        return;
      }

      console.log("Account created successfully!");
      notify("Account created successfully!", { type: "success" });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = async (data: any) => {
    let email: any = data.email;
    console.log(data);
    if (await isUserAlreadyExist(email)) {
      return notify("User already exist!", { type: "error" });
    }

    createAccount({
      name: data.name,
      studio: data.studio,
      email: email,
      password: data.password,
    });
    console.log("Signup button clicked");
  };

  return (
    <>
      <Dialog open={enable}>
        <DialogContent sx={{ background: "#1e1e1e" }}>
          <SimpleForm toolbar={<CustomToolbar />} onSubmit={handleSignUp}>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
            <Stack display="flex" sx={{ width: "325px" }} gap={-1}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pt: 2,
                  pb: 2,
                }}
              >
                Hyper Rabbit
              </Typography>
              <Typography
                sx={{ display: "flex", justifyContent: "center", pb: 2 }}
              >
                Create Account
              </Typography>
              <TextInput
                source="name"
                label="Name"
                validate={[required(), minLength(3)]}
              />
              <TextInput
                source="studio"
                label="Studio"
                validate={[required(), minLength(3)]}
              />
              <TextInput
                source="email"
                label="Email"
                validate={[required(), email()]}
              />
              <PasswordInput
                source="password"
                label="Password"
                validate={[required(), minLength(8)]}
              />
            </Stack>
          </SimpleForm>
        </DialogContent>
      </Dialog>
    </>
  );
};
