import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const MemoryUsageDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
        {
            field: 'playerId',
            headerName: 'Player Id',
            ...columnProps
        },
        {
            field: 'memoryUsage',
            headerName: 'Memory Usage',
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
