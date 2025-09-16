import { DateInput, required, SelectInput, useGetList } from "react-admin";
import { useWatch } from "react-hook-form";
import { Stack } from "@mui/material";
import { DEFAULT_CUSTOM_START_DATE, QueryNames } from "../../common/constants";
import { FetchData } from "../../data-providers/data-provider";
import { useEffect, useState } from "react";

export const DateFilter = (props: any) => {
    const selectedDateRange = useWatch({ name: "dateRange" });
    const { data, isLoading } = useGetList(QueryNames.GET_ALL_DATE_OPTION_DATA, {});

    return (
        <Stack direction="row" gap={2}>
            <SelectInput
                key="dateRange"
                source="dateRange"
                label="Date Range"
                validate={required()}
                optionValue="name"
                {...props}
                choices={data}
                disabled={isLoading}
            />
            {
                selectedDateRange === "Custom" ? (
                    <>
                        <DateInput source="startDate" key="startDate" label="From" alwaysOn />
                        <DateInput source="endDate" key="endDate" label="To" alwaysOn />
                    </>
                ) : null
            }
        </Stack>
    )
}