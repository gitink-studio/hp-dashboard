import {
  AutocompleteInput,
  DataTable,
  FunctionField,
  InfiniteList,
  ReferenceField,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { DeleteAllButton } from "../../components/DeleteAllButton";
import { QueryNames, ROOT_URL } from "../../common/constants";

export const EventLogList = () => {
  const eventFilters = [
    <ReferenceInput
      label="Username"
      source="name"
      reference={QueryNames.GET_ALL_DATA_SUGGESTION}
      defaultValue=""
      alwaysOn
    >
      <AutocompleteInput optionText="name" />
    </ReferenceInput>,
    <SelectInput
      label="EventType"
      source={QueryNames.GET_ALL_DATA_BY_USERNAME_OR_VALUE}
      choices={[
        { id: "SessionStart", name: "SessionStart" },
        { id: "SessionEnd", name: "SessionEnd" },
        { id: "GameplayStart", name: "GameplayStart" },
        { id: "GameplayEnd", name: "GameplayEnd" },
        { id: "TutorialStep", name: "TutorialStep" },
        { id: "MenuNavigated", name: "MenuNavigated" },
        { id: "EconomyEvents", name: "EconomyEvents" },
      ]}
      alwaysOn
    />,
  ];

  return (
    <InfiniteList filters={eventFilters}>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "1rem",
        }}
      >
        <DeleteAllButton
          url={ROOT_URL + "/events/deleteAll"}
          notification="EventLogs"
        />
      </div>
      <DataTable>
        <DataTable.Col source="id" label="Id" />
        <DataTable.Col source="eventType" label="Event Type" />
        <DataTable.Col source="eventData" />
        <DataTable.Col source="createdAt" />
        <DataTable.Col source="linkId" label="Link Id">
          <ReferenceField
            source="linkId"
            reference="getAllLinkData"
            link="show"
          />
        </DataTable.Col>
        <DataTable.Col label="User">
          <FunctionField
            source="name"
            render={(record) => `${record.link?.device?.user?.name}`}
          />
        </DataTable.Col>
      </DataTable> */}
    </InfiniteList>
  );
};
