import { Box, Card, CardContent, Stack, Typography } from "@mui/material"
import { LevelDetailedReportViewer } from "./level-detailed-report-viewer";
import { IAPDetailedReportViewer } from "./iap-detailed-report-viewer";
import { AdDetailedReportViewer } from "./ad-detailed-report-viewer";
import { EconomyDetailedReportViewer } from "./economy-detailed-report-viewer";
import { LogDetailedReportViewer } from "./log-detailed-report-viewer";
import { TutorialDetailedReportViewer } from "./tutorial-detailed-report-viewer";
import { MemoryUsageDetailedReportViewer } from "./memory-usage-detailed-report-viewer";
import { FPSDetailedReportViewer } from "./fps-detailed-report-viewer";
import { ReportComparisonViewer } from "./report-comparison-viewer";
import { StageDetailedReportViewer } from "./stage-detailed-report-viewer";

export const GameplayDetailedReportViewer = (props: any) => {
    const { reportData } = props.data;
    const DataNotFound = () => <Typography variant="caption">Data not found</Typography>

    const DisplayData = (props: any) => {
        const { name, data } = props.data;
        // console.log(`Props.data: ${JSON.stringify(props.data)}`);
        return (
            <Stack direction={'row'} gap={4}>
                {
                    data?.map((data: any, index: any) => (
                        <Stack key={index}>
                            <Typography variant="h6">{data.value}</Typography>
                            <Typography variant="caption">{data.name}</Typography>
                        </Stack>
                    ))
                }
            </Stack>
        )
    }

    const getData = (dataType: string, data: any) => {
        switch (dataType) {
            case 'Player Event Data':
            case 'Session Event Data':
            case 'Gameplay Event Data':
            case 'Level Event Data':
                return <DisplayData data={data} />
            case 'Stage Event Data':
                return <DisplayData data={data} />
            case 'Tutorial Event Data':
                return <TutorialDetailedReportViewer data={data} />
            case 'Level Start Event Data':
            case 'Level Complete Event Data':
            case 'Level Fail Event Data':
                return <LevelDetailedReportViewer data={data} />
            case 'All Level Event Data':
                return <ReportComparisonViewer data={{
                    data: data,
                    reportType: 'Level Report',
                }} />
            case 'Stage Start Event Data':
            case 'Stage Complete Event Data':
            case 'Stage Fail Event Data':
                return <StageDetailedReportViewer data={data} />
            case 'All Stage Event Data':
                return <ReportComparisonViewer data={{
                    data: data,
                    reportType: 'Stage Report',
                }} />
            case 'IAP Initiated Event Data':
            case 'IAP Successful Event Data':
            case 'IAP Failed Event Data':
            case 'IAP Consumed Event Data':
                return <IAPDetailedReportViewer data={data} />
            case 'All IAP Event Data':
                return <ReportComparisonViewer data={{
                    data: data,
                    reportType: 'IAP Report'
                }} />
            case 'Ad Requested Event Data':
            case 'Ad Filled Event Data':
            case 'Ad Started Event Data':
            case 'Ad Clicked Event Data':
            case 'Ad Skipped Event Data':
            case 'Ad Completed Event Data':
            case 'Ad Failed Event Data':
                return <AdDetailedReportViewer data={data} />
            case 'Ad Requested & Filled Event Data':
            case 'Ad Started, Completed & Failed Event Data':
            case 'Ad Clicked & Skipped Event Data':
                return <ReportComparisonViewer data={{
                    data: data,
                    reportType: 'Ad Report'
                }} />
            case 'Currency Earned Event Data':
            case 'Currency Spent Event Data':
                return <EconomyDetailedReportViewer data={data} />
            case 'All Economy Event Data':
                return <ReportComparisonViewer data={{
                    data: data,
                    reportType: 'Economy Report'
                }} />
            case 'Error Event Data':
            case 'Warning Event Data':
            case 'Info Event Data':
                return <LogDetailedReportViewer data={data} />
            case 'Low FPS Event Data':
            case 'Average FPS Event Data':
            case 'High FPS Event Data':
                return <FPSDetailedReportViewer data={data} />;
            case 'Low Memory Usage Event Data':
            case 'Average Memory Usage Event Data':
            case 'High Memory Usage Event Data':
                return <MemoryUsageDetailedReportViewer data={data} />;
            default:
                return <DataNotFound />
        }
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
                flexWrap: 'wrap',
                gap: 2,
            }}>
                <Stack gap={2} sx={{ width: '100%', flexWrap: 'wrap' }}>
                    {
                        reportData.map((data: any) => (
                            <Card variant="outlined" key={data.name}>
                                <CardContent sx={{ px: 4 }} >
                                    <Stack gap={2}>
                                        <Typography variant="subtitle1" textAlign={'left'}>{data.name}</Typography>
                                        <Stack direction={'row'} gap={4} flexWrap="wrap" justifyContent="flex-start" alignItems={'center'}>
                                            {
                                                (!Array.isArray(data?.data) || data?.data?.length === 0) ? <DataNotFound /> :
                                                    <Stack direction={'row'} gap={2}>
                                                        <Box>{getData(data.name, data)}</Box>
                                                    </Stack>
                                            }
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    }
                </Stack>
            </Box >
        </>
    )
}
