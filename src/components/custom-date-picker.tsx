import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material"
import { CustomDialog } from "./dialog.component"
import { customStyle } from "../common/styles"
import { useDateRangeActions, useEndDate, useStartDate } from "../store/common/date-range-store"
import { useEffect } from "react"

export const CustomDatePicker = (props: any) => {
    const { callback } = props.data;
    const startDate = useStartDate();
    const endDate = useEndDate();
    const { setStartDate, setEndDate, setOpenState } = useDateRangeActions();

    const DatePicker = () => {
        const handleStartDateChange = (date: any) => {
            setStartDate(date);
        }

        const handleEndDateChange = (date: any) => {
            setEndDate(date);
        }

        return (
            <Stack gap={4}>
                <Stack direction={'row'} justifyContent={'space-between'} gap={2}>
                    <TextField
                        type="date"
                        label="Start Date"
                        value={startDate}
                        sx={customStyle.textField}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <TextField
                        type="date"
                        label="End Date"
                        value={endDate}
                        sx={customStyle.textField}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />
                </Stack>
            </Stack>
        )
    }

    return (
        <>
            <CustomDialog data={{
                title: 'Custom Date Range',
                component: <DatePicker />,
                size: "sm",
                callback: () => {
                    callback();
                    setOpenState(false);
                }
            }} />
        </>
    )
}
