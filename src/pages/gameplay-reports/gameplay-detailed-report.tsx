import { CustomDialog } from "../../components/dialog.component";
import { GameplayDetailedReportViewer } from "../../components/gameplay-report/gameplay-detailed-report-viewer/gameplay-detailed-report-viewer";

export const GameplayDetailedReport = (props: any) => {
    const { type, reportData, callback } = props.data;
    // console.log(`Detailed Report opened! ${type}`);
    return (
        <>
            <CustomDialog
                data={{
                    title: type,
                    component: <GameplayDetailedReportViewer data={{ reportData: reportData }} />,
                    callback: callback
                }}
            />
        </>
    )
}
