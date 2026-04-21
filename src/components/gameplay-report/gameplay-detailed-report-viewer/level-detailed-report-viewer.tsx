import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

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
    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: levelDataColumns,
        }}
    />
}
