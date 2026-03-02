import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const IAPDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
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

    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: columns,
        }}
    />
}
