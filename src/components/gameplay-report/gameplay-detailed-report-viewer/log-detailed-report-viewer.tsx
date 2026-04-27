import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";
import { Stack } from "@mui/material";
import { AdditionalMetricsViewer } from "./additional-metrics-viewer";

const logDataColumns: GridColDef[] = [
    {
        field: 'playerIdList',
        headerName: 'Players Id',
        ...columnProps,
    },
    {
        field: 'message',
        headerName: 'Message',
        ...columnProps
    },
    {
        field: 'count',
        headerName: 'Count',
        ...columnProps
    },
];

export const LogDetailedReportViewer = (props: any) => {
    let additionalMetrics = props.data?.additionalMetrics;
    additionalMetrics = {
        ...additionalMetrics,
        columns: logDataColumns
    }

    return <>
        <Stack direction={'row'} gap={2}>
            <DetailedReportViewer data={{
                rows: props.data,
                columns: logDataColumns
            }} />

            {
                props.data?.additionalMetrics &&
                <AdditionalMetricsViewer data={{
                    metrics: additionalMetrics
                }} />
            }
        </Stack>
    </>
}
