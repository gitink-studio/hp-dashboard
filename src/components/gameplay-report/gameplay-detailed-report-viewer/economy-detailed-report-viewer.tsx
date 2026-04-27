import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";
import { Stack } from "@mui/material";
import { AdditionalMetricsViewer } from "./additional-metrics-viewer";

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
    let additionalMetrics = props.data?.additionalMetrics;
    additionalMetrics = {
        ...additionalMetrics,
        columns: economyDataColumns
    }

    return <>
        <Stack direction={'row'} gap={2}>
            <DetailedReportViewer data={{
                rows: props.data,
                columns: economyDataColumns
            }} />

            {
                props.data?.additionalMetrics &&
                <AdditionalMetricsViewer data={{
                    metrics: additionalMetrics
                }} />
            }
        </Stack>
    </>
}
