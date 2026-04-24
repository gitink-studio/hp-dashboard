import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

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
    console.log(`Stage detailed report: ${JSON.stringify(props)}`);
    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: stageDataColumns,
        }}
    />
} 