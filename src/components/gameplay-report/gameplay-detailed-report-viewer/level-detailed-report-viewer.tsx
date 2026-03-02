import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const LevelDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
        {
            field: 'levelName',
            headerName: 'Level Name',
            ...columnProps,
        },
        {
            field: 'totalCount',
            headerName: 'Total Count',
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
