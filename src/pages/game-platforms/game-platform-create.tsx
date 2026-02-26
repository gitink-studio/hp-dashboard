import { Create, SimpleForm, TextInput } from "react-admin";
import { validateValue } from "../../common/utils";

export const GamePlatformCreate = () => {
  return (
    <>
      <Create redirect="list">
        <SimpleForm>
          <TextInput
            source="name"
            label="Name"
            validate={(value) => validateValue("gamePlatform", "name", value)}
          />
        </SimpleForm>
      </Create>
    </>
  );
};
