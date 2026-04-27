import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";
import { Stack } from "@mui/material";
import { AdditionalMetricsViewer } from "./additional-metrics-viewer";

export const levelDataColumns: GridColDef[] = [
    {
        field: 'levelName',
        headerName: 'Level Name',
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

export const LevelDetailedReportViewer = (props: any) => {
    let additionalMetrics = props.data?.additionalMetrics;
    additionalMetrics = {
        ...additionalMetrics,
        columns: levelDataColumns
    }

    return <>
        <Stack direction={'row'} gap={2}>
            <DetailedReportViewer data={{
                rows: props.data,
                columns: levelDataColumns
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
