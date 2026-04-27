import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";
import { Stack } from "@mui/material";
import { AdditionalMetricsViewer } from "./additional-metrics-viewer";

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
    let additionalMetrics = props.data?.additionalMetrics;
    additionalMetrics = {
        ...additionalMetrics,
        columns: iapDataColumns
    }

    return <>
        <Stack direction={'row'} gap={2}>
            <DetailedReportViewer data={{
                rows: props.data,
                columns: iapDataColumns
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
