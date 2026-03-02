import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const FPSDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
        {
            field: 'playerId',
            headerName: 'Player Id',
            ...columnProps
        },
        {
            field: 'fps',
            headerName: 'FPS',
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
