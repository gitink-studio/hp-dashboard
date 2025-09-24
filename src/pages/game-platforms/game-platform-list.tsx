import { DataTable, InfiniteList } from "react-admin";

export const GamePlatformList = () => (
  <InfiniteList>
    {/* <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "1rem",
      }}
    >
      <DeleteAllButton
        url={ROOT_URL + "/gamePlatforms/deleteAll"}
        notification="GamePlatforms"
      />
    </div> */}
    <DataTable>
      <DataTable.Col source="id" label="Id" />
      <DataTable.Col source="name" label="Name" />
      <DataTable.Col source="additionalGamePlatformData" />
      <DataTable.Col source="createdAt" />
      <DataTable.Col source="updatedAt" />
    </DataTable>
  </InfiniteList>
);
