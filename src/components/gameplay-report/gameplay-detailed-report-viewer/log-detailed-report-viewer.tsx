import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const LogDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
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

    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: columns,
        }}
    />
}
