import { Stack, Typography } from "@mui/material";
import { LevelDetailedReportViewer } from "./level-detailed-report-viewer";
import { IAPDetailedReportViewer } from "./iap-detailed-report-viewer";
import { AdDetailedReportViewer } from "./ad-detailed-report-viewer";
import { EconomyDetailedReportViewer } from "./economy-detailed-report-viewer";


export const ReportComparisonViewer = (props: any) => {
    const { data, reportType } = props.data;
    const getDetailedReportViewer = (data: any) => {
        switch (reportType) {
            case 'Level Report':
                return <LevelDetailedReportViewer data={data} />
            case 'IAP Report':
                return <IAPDetailedReportViewer data={data} />
            case 'Ad Report':
                return <AdDetailedReportViewer data={data} />
            case 'Economy Report':
                return <EconomyDetailedReportViewer data={data} />
            default:
                console.log(`Report type not found`);
        }
    }

    return (
        <Stack direction={'row'} gap={2}>
            {
                Array.isArray(data?.data) && data?.data?.map((data: any, index: any) => {
                    return (
                        Array.isArray(data?.data) && <Stack key={index} gap={2}>
                            <Typography>{data.name}</Typography>
                            {getDetailedReportViewer(data)}
                        </Stack>
                    )
                })
            }
        </Stack>
    )
}