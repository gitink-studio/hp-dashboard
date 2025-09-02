import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Button,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";

export const SignUpForm = ({ canOpen }: { canOpen: boolean }) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const CustomToolbar = ({ onCancel }: { onCancel: any }) => (
    <Toolbar>
      <SaveButton alwaysEnable />
      <Button onClick={onCancel}>Cancel</Button>
    </Toolbar>
  );

  useEffect(() => {
    setOpen(canOpen);
  }, [canOpen]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <SimpleForm toolbar={false} sx={{ p: 0, m: 0 }}>
            <Stack display="flex" sx={{ width: "325px" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ display: "flex", justifyContent: "center", pt: 2, pb: 2 }}
              >
                Hyper Rabbit
              </Typography>
              <Typography
                sx={{ display: "flex", justifyContent: "center", pb: 2 }}
              >
                Create Account
              </Typography>
              <TextInput source="name" label="Name" validate={[required()]} />
              <TextInput
                source="studio"
                label="Studio"
                validate={[required()]}
              />
              <TextInput source="email" label="Email" validate={[required()]} />
              <TextInput
                source="password"
                label="Password"
                validate={[required()]}
              />
              <Button
                variant="text"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: "#90caf9",
                  color: "black",
                  p: 1,
                }}
              >
                Sign Up
              </Button>
            </Stack>
          </SimpleForm>
        </DialogContent>
      </Dialog>
    </>
  );
};
