import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";

export const SubPlatformFilter = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.GET_SUB_PLATFORM_FILTER, {});

    if (isLoading) return;
    if (error) console.log(error);

    return <SelectInput
        source="subPlatform"
        optionText="name"
        label="Sub Platforms"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
        choices={data}  {...props}
    />
}
