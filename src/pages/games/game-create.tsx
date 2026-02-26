import {
  Create,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";
import { QueryNames } from "../../common/constants";

export const GameCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput
          source="gameName"
          label="Name"
          // validate={(value) => validateValue("game", "name", value)}
        />
        <ReferenceInput
          label="Game Platform"
          source="name"
          reference={QueryNames.GET_ALL_GAME_PLATFORM_DATA}
        >
          <SelectInput optionText="name" label="Game Platform" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
