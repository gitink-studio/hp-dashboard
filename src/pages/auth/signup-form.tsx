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
  SelectInput,
  TextInput,
  Toolbar,
  useNotify,
} from "react-admin";

const studioNameValidator = (studios: Array<{ id: string; name: string }>) => (value: string) => {
  if (!value || !value.trim()) return undefined;
  if (studios.length === 0) return undefined; // skip while studios are loading
  const match = studios.find(
    (s) => s.name.toLowerCase().trim() === value.toLowerCase().trim()
  );
  if (!match) {
    return "Please enter a valid studio name from the list";
  }
  return undefined;
};
import { isUserAlreadyExist, sendRequest, sendGraphqlRequest } from "../../common/utils";
import { CREATE_USER_URL, HttpMethod } from "../../common/constants";
import { Queries } from "../../graphql/queries";
import { useState, useEffect } from "react";

export const SignUpForm = ({
  enable,
  setState,
}: {
  enable: boolean;
  setState: any;
}) => {
  const notify = useNotify();
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [studios, setStudios] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingStudios, setLoadingStudios] = useState(false);

  const handleClose = () => {
    setState(false);
  };

  useEffect(() => {
    if (enable) {
      fetchRoles();
      fetchStudios();
    }
  }, [enable]);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await sendGraphqlRequest('roles', {
        query: Queries.Roles,
        variables: {}
      });

      if (response && Array.isArray(response)) {
        setRoles(response);
      } else {
        console.error('Invalid roles response:', response);
        notify('Failed to load roles', { type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      notify('Failed to load roles', { type: 'error' });
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchStudios = async () => {
    try {
      setLoadingStudios(true);
      const response = await sendGraphqlRequest('studios', {
        query: Queries.GetStudioList,
        variables: {}
      });

      if (response && Array.isArray(response)) {
        setStudios(response);
      } else {
        console.error('Invalid studios response:', response);
        notify('Failed to load studios', { type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching studios:', error);
      notify('Failed to load studios', { type: 'error' });
    } finally {
      setLoadingStudios(false);
    }
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
      let response: any = await sendRequest(HttpMethod.POST, CREATE_USER_URL, data);

      // Check if the response contains user data (successful creation)
      if (response.data && response.data.id) {
        console.log("Account created successfully!");
        notify("Account created successfully!", { type: "success" });
        handleClose();
      } else {
        notify("Something went wrong!", { type: "error" });
      }
    } catch (error) {
      console.log(error);
      notify("Failed to create account. Please try again.", { type: "error" });
    }
  };

  const handleSignUp = async (data: any) => {
    let email: any = data.email;
    console.log(data);

    if (!data.role) {
      return notify("Please select a role", { type: "error" });
    }

    if (!data.studio || !String(data.studio).trim()) {
      return notify("Please enter a studio name", { type: "error" });
    }

    const selectedStudio = studios.find(
      (s) => s.name.toLowerCase().trim() === String(data.studio).toLowerCase().trim()
    );
    if (!selectedStudio) {
      return notify("Please enter a valid studio name from the list", { type: "error" });
    }
    const studioName = selectedStudio.name;

    if (await isUserAlreadyExist(email)) {
      return notify("User already exist!", { type: "error" });
    }

    createAccount({
      name: data.name,
      studio: studioName,
      email: email,
      password: data.password,
      role: data.role,
    });
    console.log("Signup button clicked");
  };

  return (
    <>
      <Dialog open={enable}>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                placeholder={loadingStudios ? "Loading studios..." : "Enter studio name (must match exactly)"}
                validate={[required(), studioNameValidator(studios)]}
                disabled={loadingStudios}
                fullWidth
              />
              <SelectInput
                source="role"
                label="Role"
                choices={roles.map(role => ({ id: role.name, name: role.name.charAt(0).toUpperCase() + role.name.slice(1) }))}
                validate={[required()]}
                disabled={loadingRoles}
                emptyText={loadingRoles ? "Loading roles..." : "Select a role"}
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
