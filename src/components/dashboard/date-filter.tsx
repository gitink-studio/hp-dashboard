import { DateInput, SelectInput } from "react-admin";
import { DATE_RANGE_NAMES } from "../../common/constants";


export const DateFilter = (props: any) => {
    const getDate = (data: any) => data === "Custom"
        ? data : data === 0
            ? "Today" : data === 1
                ? "Yesterday" : `Last ${data} days`;

    return (
        <>
            <SelectInput source="dateRange"
                label="Date Range"
                alwaysOn
                choices={DATE_RANGE_NAMES.map((data: any) => ({
                    id: data, name: getDate(data),
                }))}
            />

            {
                props.dateRange === "Custom" ? (
                    <>
                        <DateInput source="startDate" label="From" />
                        <DateInput source="endDate" label="to" />
                    </>
                ) : null
            }
        </>
    )
}
