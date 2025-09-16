import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList, useListContext } from "react-admin";
import { useEffect, useMemo, useRef } from "react";
import { FetchData } from "../../data-providers/data-provider";

export const SubPlatformFilter = (props: any) => {
    const { filterValues, setFilters } = useListContext();
    const selectedPlatform = filterValues?.platform ?? "All";
    const previousPlatformRef = useRef<string>(selectedPlatform);
    const showSubPlatform = selectedPlatform === "All" || selectedPlatform === FetchData.getWebPlatformId();

    useEffect(() => {
        const previousPlatform = previousPlatformRef.current;
        if (selectedPlatform !== previousPlatform) {
            previousPlatformRef.current = selectedPlatform;
            const nextFilters = { ...filterValues, subPlatform: "All" };
            setFilters(nextFilters, {});
        }
    }, [selectedPlatform]);

    const { data, isLoading } = useGetList(
        QueryNames.GET_SUB_PLATFORM_FILTER,
        { filter: { platform: selectedPlatform } }
    );

    const choices = useMemo(() => Array.isArray(data) ? data : [], [data]);

    return showSubPlatform ? (
        <SelectInput
            source="subPlatform"
            optionText="name"
            label="Sub Platforms"
            defaultValue="All"
            emptyText="All"
            emptyValue="All"
            disabled={isLoading}
            choices={choices}
            {...props}
        />
    ) : null;
}
