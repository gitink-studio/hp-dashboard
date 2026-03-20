import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

const economyDataColumns: GridColDef[] = [
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

export const EconomyDetailedReportViewer = (props: any) => {


    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: economyDataColumns,
        }}
    />
}
