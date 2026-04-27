import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";
import { Stack } from "@mui/material";
import { AdditionalMetricsViewer } from "./additional-metrics-viewer";

export const stageDataColumns: GridColDef[] = [
    {
        field: 'levelName',
        headerName: 'Level Name',
        ...columnProps,
    },
    {
        field: 'stageName',
        headerName: 'Stage Name',
        ...columnProps,
    },
    {
        field: 'totalPlayerCount',
        headerName: 'Total Player Count',
        ...columnProps
    },
    {
        field: 'totalCount',
        headerName: 'Total Event Count',
        ...columnProps
    },
];

export const StageDetailedReportViewer = (props: any) => {
    let additionalMetrics = props.data?.additionalMetrics;
    additionalMetrics = {
        ...additionalMetrics,
        columns: stageDataColumns
    }

    return <>
        <Stack direction={'row'} gap={2}>
            <DetailedReportViewer data={{
                rows: props.data,
                columns: stageDataColumns
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
