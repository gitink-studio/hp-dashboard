import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList, useListContext } from "react-admin";
import { useEffect, useMemo, useRef } from "react";

export const GamesFilter = (props: any) => {
    const { filterValues, setFilters } = useListContext();
    const selectedPlatform = filterValues?.platform ?? "All";
    const selectedSubPlatform = filterValues?.subPlatform ?? "All";
    const previousSubPlatformRef = useRef<string>(selectedSubPlatform);

    useEffect(() => {
        const previousSubPlatform = previousSubPlatformRef.current;
        if (selectedSubPlatform !== previousSubPlatform) {
            previousSubPlatformRef.current = selectedSubPlatform;
            const nextFilters = { ...filterValues, games: "All" };
            setFilters(nextFilters, {});
        }
    }, [selectedSubPlatform]);

    const { data, isLoading } = useGetList(
        QueryNames.GET_GAME_FILTER,
        { filter: { platform: selectedPlatform, subPlatform: selectedSubPlatform } }
    );

    const choices = useMemo(() => Array.isArray(data) ? data : [], [data]);

    return (
        <SelectInput
            source="games"
            optionText="name"
            label="Games"
            emptyText="All"
            emptyValue="All"
            disabled={isLoading}
            choices={choices}  {...props}
        />
    );
}
