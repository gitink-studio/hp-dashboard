import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";

export const StudioFilter = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.STUDIOS, {});

    if (isLoading) return;
    if (error) console.log(error);

    // Add "All" option at the beginning
    const choices = data ? [{ id: "All", name: "All" }, ...data] : [{ id: "All", name: "All" }];

    return <SelectInput
        source="studio"
        optionText="name"
        label="Studio"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
        choices={choices}
        {...props}
    />
}
