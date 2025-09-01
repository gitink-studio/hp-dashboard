import { AutocompleteInput, ReferenceInput, SelectInput } from "react-admin";
import { IDropdownList } from "../common/interfaces";

export const DropdownList = ({
  source,
  reference,
  optionText,
  optionLabel,
  ...props
}: IDropdownList & any) => {
  return (
    <ReferenceInput source={source} reference={reference} {...props}>
      {props.selectInput ? (
        <SelectInput optionText={optionText} label={optionLabel} />
      ) : (
        <AutocompleteInput
          optionText={optionText}
          label={optionLabel}
          alwaysOn
        />
      )}
    </ReferenceInput>
  );
};
