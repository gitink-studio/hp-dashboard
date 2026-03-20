import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const adDataColumns: GridColDef[] = [
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

export const AdDetailedReportViewer = (props: any) => {
    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: adDataColumns,
        }}
    />
}
