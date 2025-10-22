import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { email, required, SaveButton, SimpleForm, TextInput, Toolbar, useNotify, } from "react-admin";
import { isUserAlreadyExist, sendRequest } from "../../common/utils";
import { CREATE_USER_URL, HttpMethod } from "../../common/constants";

export const ForgotPasswordPage = ({ enable, setState, }: { enable: boolean; setState: any; }) => {
  const notify = useNotify();
  const handleClose = () => { setState(false); };
  const theme = useTheme();
  const CustomToolbar = () => (
    <Toolbar sx={{ backgroundColor: "transparent" }}>
      <SaveButton
        type="submit"
        size="large"
        label="Reset my password"
        icon={false}
        sx={{ width: "100%" }}
      />
    </Toolbar>
  );

  const sendMail = async (data: any) => {
    console.log(data);

    try {
      let response = await sendRequest(
        HttpMethod.POST,
        CREATE_USER_URL,
        data,
      );

      if (response.status !== 200) {
        console.log("Something went wrong!");
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

  const handleForgotPassword = async (data: any) => {
    try {
      let email: any = data.email;
      console.log(data);
      if (await isUserAlreadyExist(email)) {
        return notify("User already exist!", { type: "error" });
      }

      sendMail({ email: email });
      console.log("Signup button clicked");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog
        open={enable}
      >
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <SimpleForm
            toolbar={<CustomToolbar />}
            onSubmit={handleForgotPassword}
            sx={{ p: 0 }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
            <Stack
              display="flex"
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "325px",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  pt: 2,
                  pb: 4,
                }}
              >
                Hyper Rabbit
              </Typography>
              <Typography variant="h5" sx={{ pb: 2 }}>
                Forgot your password ?
              </Typography>
              <Typography sx={{ pb: 3 }}>
                Enter your email address and we'll send you a link to reset your
                password
              </Typography>
              <TextInput
                source="email"
                label="Email"
                validate={[required(), email()]}
              />
            </Stack>
          </SimpleForm>
        </DialogContent>
      </Dialog>
    </>
  );
};
