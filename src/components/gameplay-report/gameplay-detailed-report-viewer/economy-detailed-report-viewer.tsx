import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const EconomyDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
        {
            field: 'itemId',
            headerName: 'Item Id',
            ...columnProps,
            valueGetter: (params: any) => params?.value ?? 'None'
        },
        {
            field: 'itemName',
            headerName: 'Item Name',
            ...columnProps,
            valueGetter: (params: any) => params?.value ?? 'None'
        },
        {
            field: 'amount',
            headerName: 'Amount',
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'currencyType',
            headerName: 'Currency Type',
            ...columnProps,
        },
        {
            field: 'reason',
            headerName: 'Reason',
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'totalCount',
            headerName: 'Total Count',
            ...columnProps,
        },
    ];

    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: columns,
        }}
    />
}
