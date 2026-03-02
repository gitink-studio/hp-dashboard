import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";

export const TutorialDetailedReportViewer = (props: any) => {
    const columns: GridColDef[] = [
        {
            field: 'tutorialType',
            headerName: 'Tutorial Type',
            ...columnProps
        },
        {
            field: 'step',
            headerName: 'Step',
            ...columnProps
        },
        {
            field: 'totalCount',
            headerName: 'Total Count',
            ...columnProps
        }
    ];

    return <DetailedReportViewer
        data={{
            rows: props.data,
            columns: columns,
        }}
    />
}
