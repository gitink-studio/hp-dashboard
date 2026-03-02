import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const AdDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
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

    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: columns,
        }}
    />
}
