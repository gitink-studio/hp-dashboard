import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

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
    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: logDataColumns,
        }}
    />
}
