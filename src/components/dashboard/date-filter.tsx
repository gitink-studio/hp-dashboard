import { DateInput, SelectInput, useGetList } from "react-admin";
import { QueryNames } from "../../common/constants";

export const DateFilter = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.DASHBOARD_FILTERS, {});

    if (isLoading) return <SelectInput source="dateRange" label="Date Range" disabled />;
    if (error) console.log(error);

    const dateRanges = data?.[0]?.dateRanges || ['Today', 'Yesterday', 'Last 7d', 'Last 14d', 'Last 30d', 'Custom'];
    const choices = dateRanges.map((range: string) => ({
        id: range,
        name: range
    }));

    return (
        <>
            <SelectInput 
                source="dateRange"
                label="Date Range"
                alwaysOn
                choices={choices}
                defaultValue="Last 30d"
            />

            {
                props.dateRange === "Custom" ? (
                    <>
                        <DateInput source="startDate" label="From" />
                        <DateInput source="endDate" label="To" />
                    </>
                ) : null
            }
        </>
    )
}
