import { DataTable, InfiniteList, ReferenceField } from "react-admin";

export const GameList = () => (
  <InfiniteList>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="name" />
      <DataTable.Col source="additionalGamePlatformData" />
      <DataTable.Col source="createdAt" />
      <DataTable.Col source="updatedAt" />
      <DataTable.Col source="gamePlatformId">
        <ReferenceField
          reference="getAllGamePlatformData"
          source="gamePlatformId"
          link="show"
        />
      </DataTable.Col>
    </DataTable>
  </InfiniteList>
);
