import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";
import { Stack } from "@mui/material";
import { AdditionalMetricsViewer } from "./additional-metrics-viewer";

export const adDataColumns: GridColDef[] = [
    {
        field: 'adType',
        headerName: 'Ad Type',
        ...columnProps
    },
    {
        field: 'adPlacement',
        headerName: 'Ad Placement',
        ...columnProps
    },
    {
        field: 'duration',
        headerName: 'Duration',
        ...columnProps
    },
    {
        field: 'adSdkName',
        headerName: 'Ad Sdk',
        ...columnProps
    },
    {
        field: 'failReason',
        headerName: 'Fail Reason',
        ...columnProps
    },
    {
        field: 'totalCount',
        headerName: 'Total Count',
        ...columnProps
    },
];

export const AdDetailedReportViewer = (props: any) => {
    let additionalMetrics = props.data?.additionalMetrics;
    additionalMetrics = {
        ...additionalMetrics,
        columns: adDataColumns
    }

    return <>
        <Stack direction={'row'} gap={2}>
            <DetailedReportViewer data={{
                rows: props.data,
                columns: adDataColumns
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
