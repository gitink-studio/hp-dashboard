import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";

export const SubPlatformFilter = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.DASHBOARD_FILTERS, {});

    if (isLoading) return <SelectInput source="subPlatform" label="Sub Platforms" disabled />;
    if (error) console.log(error);

    const subPlatforms = data?.[0]?.subPlatforms || [];
    const choices = [{ id: "All", name: "All" }, ...subPlatforms];

    return <SelectInput
        source="subPlatform"
        optionText="name"
        label="Sub Platforms"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
        choices={choices}  {...props}
    />
}
