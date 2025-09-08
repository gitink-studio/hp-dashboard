import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";

export const RegionFilter = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.GET_PLATFORM_FILTER, {});

    if (isLoading) return;
    if (error) console.log(error);

    return <SelectInput
        source="region"
        optionText="name"
        label="Region"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
        choices={data}  {...props}
    />
}
