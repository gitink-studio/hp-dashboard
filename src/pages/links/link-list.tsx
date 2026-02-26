import { DataTable, InfiniteList, List, ReferenceField } from "react-admin";
import { DeleteAllButton } from "../../components/DeleteAllButton";
import { ROOT_URL } from "../../common/constants";

export const LinkList = () => (
  <InfiniteList>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "1rem",
      }}
    >
      <DeleteAllButton
        url={ROOT_URL + "/links/deleteAll"}
        notification="Links"
      />
    </div>
    <DataTable>
      <DataTable.Col source="id" label="Id" />
      <DataTable.Col source="linkType" />
      <DataTable.Col source="linkData" />
      <DataTable.Col source="createdAt" />
      <DataTable.Col source="updatedAt" />
      <DataTable.Col source="deviceId" label="Device">
        <ReferenceField
          source="deviceId"
          reference="getAllDeviceData"
          link="show"
        />
      </DataTable.Col>
    </DataTable>
  </InfiniteList>
);
