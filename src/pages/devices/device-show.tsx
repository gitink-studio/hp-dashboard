import { ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

export const DeviceShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="deviceId">
        <ReferenceField source="deviceId" reference="devices" link="show" />
      </TextField>
      <TextField source="name" />
      <TextField source="platformType" />
      <TextField source="processor" />
      <TextField source="memory" />
      <TextField source="os" />
      <TextField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);
