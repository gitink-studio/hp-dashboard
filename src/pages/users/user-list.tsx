import { DataTable, InfiniteList, List, ReferenceField } from "react-admin";
import { DeleteAllButton } from "../../components/DeleteAllButton";
import { ROOT_URL } from "../../common/constants";

export const UserList = () => (
  <InfiniteList>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "1rem",
      }}
    >
      <DeleteAllButton
        url={ROOT_URL + "/users/deleteAll"}
        notification="Users"
      />
    </div>
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="name" />
      <DataTable.Col source="email" />
      <DataTable.Col source="password" />
      <DataTable.Col source="isAnonymousUser" label="Is Anonymous User" />
      <DataTable.Col source="additionalUserData" />
      <DataTable.Col source="updatedAt" />
      <DataTable.Col source="createdAt" />
      <DataTable.Col source="gameId" label="Game">
        <ReferenceField
          source="gameId"
          reference="getAllGameData"
          link="show"
        />
      </DataTable.Col>
    </DataTable>
  </InfiniteList>
);
