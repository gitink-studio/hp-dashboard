import { GridColDef } from "@mui/x-data-grid";
import { columnProps, DetailedReportViewer } from "./detailed-report-viewer";
import { DetailedReportViewerType } from "../../../common/constants";

export const FPSDetailedReportViewer = (props: any) => {
    return <DetailedReportViewer
        data={{
            detailedReportViewerType: DetailedReportViewerType.CARD,
            data: props.data
        }}
    />
}
