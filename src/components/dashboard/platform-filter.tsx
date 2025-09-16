import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";
import { useMemo } from "react";

export const PlatformFilter = (props: any) => {
    const { data, isLoading } = useGetList(QueryNames.GET_PLATFORM_FILTER, {});

    const choices = useMemo(() => {
        const list = Array.isArray(data) ? data : [];
        return list;
    }, [data]);

    return (
        <SelectInput
            source="platform"
            optionText="name"
            label="Platforms"
            defaultValue="All"
            emptyText="All"
            emptyValue="All"
            disabled={isLoading}
            choices={choices}
            {...props}
        />
    );
}
