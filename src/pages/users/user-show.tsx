import { ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

export const UserShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="isAnonymousUser" />
      <TextField source="email" />
      <TextField source="password" />
      <TextField source="updatedAt" />
      <TextField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);
