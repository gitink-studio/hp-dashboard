import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";

export const PlatformFilter = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.DASHBOARD_FILTERS, {});

    if (isLoading) return <SelectInput source="platform" label="Platforms" disabled />;
    if (error) console.log(error);

    const platforms = data?.[0]?.platforms || [];
    const choices = [{ id: "All", name: "All" }, ...platforms];

    return <SelectInput
        source="platform"
        optionText="name"
        label="Platforms"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
        choices={choices}  {...props}
    />
}
