import { QueryNames } from "../../common/constants"
import { SelectInput, useGetList } from "react-admin";

export const GamesFilter = (props: any) => {
    // Get current user ID from localStorage
    const userId = localStorage.getItem("userId");
    
    const { data, isLoading, error } = useGetList(QueryNames.DASHBOARD_FILTERS, {
        filter: {
            userId: userId // Pass user ID to filter games by studio
        }
    });

    if (isLoading) return <SelectInput source="game" label="Games" disabled />;
    if (error) console.log(error);

    const games = data?.[0]?.games || [];
    const choices = [{ id: "All", name: "All" }, ...games];

    return <SelectInput
        source="game"
        optionText="name"
        label="Games"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
        choices={choices}  {...props}
    />
}
