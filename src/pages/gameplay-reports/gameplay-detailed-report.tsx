import { CustomDialog } from "../../components/dialog.component";
import { CustomGameplayReportViewer } from "../../components/gameplay-report/gameplay-report-viewer";

export const GameplayDetailedReport = (props: any) => {
    const { type, reportData, callback } = props.data;
    // console.log(`Detailed Report opened! ${type}`);
    return (
        <>
            <CustomDialog
                data={{
                    title: type,
                    component: <CustomGameplayReportViewer data={{ reportData: reportData }} />,
                    callback: callback
                }}
            />
        </>
    )
}
