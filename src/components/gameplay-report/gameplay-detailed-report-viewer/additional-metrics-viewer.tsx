import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material"
import { CustomDatagrid } from "../../data-grid.component";


export const AdditionalMetricsViewer = (props: any) => {
    const { metrics } = props.data;

    const setDataGridId = (data: any) => {
        if (Array.isArray(data)) {
            const newData = data.map((data: any, index) => {
                return {
                    ...data,
                    id: index
                }
            })

            return newData;
        } else {
            const newData = {
                ...data,
                id: 0
            }

            return [newData];
        }
    }

    const Mean = () => {
        return (
            <Stack gap={2}>
                <Typography variant="body2">{metrics.mean.name}</Typography>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(0,0,0,0.15)",
                    height: 58
                }}>
                    <Typography variant="h6">{metrics.mean.value}</Typography>
                </Box>
            </Stack>

        )
    }

    const Median = () => {
        return (
            <Stack gap={2}>
                <Typography variant="body2">{metrics.median.name}</Typography>
                <CustomDatagrid data={{
                    rows: setDataGridId(metrics.median.value),
                    columns: metrics.columns,
                    canUseCustomPageSize: true,
                }} />
            </Stack>
        )
    }

    const Mode = () => {
        return (
            <Stack gap={2}>
                <Typography variant="body2">{metrics.mode.name}</Typography>
                <CustomDatagrid data={{
                    rows: setDataGridId(metrics.mode.value),
                    columns: metrics.columns,
                    canUseCustomPageSize: true,
                }} />
            </Stack>
        )
    }

    return (
        <Stack direction={'row'} gap={2}>
            <Mean />
            <Median />
            <Mode />
        </Stack>
    )
}
