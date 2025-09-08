import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";

export const GamesFilter = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.GET_GAME_FILTER, {});

    if (isLoading) return;
    if (error) console.log(error);

    return <SelectInput
        source="games"
        optionText="name"
        label="Games"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
        choices={data}  {...props}
    />
}
