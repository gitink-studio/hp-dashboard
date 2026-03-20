import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

const iapDataColumns: GridColDef[] = [
    {
        field: 'productId',
        headerName: 'Product Id',
        ...columnProps
    },
    {
        field: 'price',
        headerName: 'Price',
        ...columnProps
    },
    {
        field: 'currencyCode',
        headerName: 'Currency Code',
        ...columnProps
    },
    {
        field: 'totalCount',
        headerName: 'Total Count',
        ...columnProps
    },
];

export const IAPDetailedReportViewer = (props: any) => {
    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: iapDataColumns,
        }}
    />
}
