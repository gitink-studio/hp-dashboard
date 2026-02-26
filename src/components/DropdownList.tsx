import { ReferenceInput, SelectInput } from "react-admin";
import { IDropdownList } from "../common/interfaces";

export const DropdownList = ({
  source,
  reference,
  optionText,
  optionLabel,
  defaultDisplayValue,
  ...props
}: IDropdownList & any) => {
  return (
    <ReferenceInput source={source} reference={reference}>
      <SelectInput optionText={optionText} label={optionLabel} {...props} />
    </ReferenceInput>
  );
};
