import { DataTable, InfiniteList, ReferenceField } from "react-admin";
import { ROOT_URL } from "../../common/constants";
import { DeleteAllButton } from "../../components/DeleteAllButton";

export const DeviceList = () => (
  <InfiniteList>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "1rem",
      }}
    >
      <DeleteAllButton
        url={ROOT_URL + "/devices/deleteAll"}
        notification="Devices"
      />
    </div>
    <DataTable>
      <DataTable.Col source="id" label="Id" />
      <DataTable.Col source="deviceId" label="Device Id" />
      <DataTable.Col source="name" />
      <DataTable.Col source="platformType" label="Platform Type" />
      <DataTable.Col source="processor" />
      <DataTable.Col source="memory" />
      <DataTable.Col source="os" />
      <DataTable.Col source="additionalDeviceData" />
      <DataTable.Col source="createdAt" />
      <DataTable.Col source="userId">
        <ReferenceField
          source="userId"
          reference="getAllUserData"
          link="true"
        />
      </DataTable.Col>
    </DataTable>
  </InfiniteList>
);
