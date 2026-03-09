import { Box, Card, CardContent, Stack, Typography } from "@mui/material"
import { LevelDetailedReportViewer } from "./level-detailed-report-viewer";
import { IAPDetailedReportViewer } from "./iap-detailed-report-viewer";
import { AdDetailedReportViewer } from "./ad-detailed-report-viewer";
import { EconomyDetailedReportViewer } from "./economy-detailed-report-viewer";
import { LogDetailedReportViewer } from "./log-detailed-report-viewer";
import { TutorialDetailedReportViewer } from "./tutorial-detailed-report-viewer";
import { MemoryUsageDetailedReportViewer } from "./memory-usage-detailed-report-viewer";
import { FPSDetailedReportViewer } from "./fps-detailed-report-viewer";

export const GameplayDetailedReportViewer = (props: any) => {
    const { reportData } = props.data;

    const DataNotFound = () => <Typography variant="caption">Data not found</Typography>

    const DisplayData = (props: any) => {
        const { name, value } = props.data;

        return (
            <Stack key={name}>
                <Typography variant="h6">{value}</Typography>
                <Typography variant="caption">{name}</Typography>
            </Stack>
        )
    }

    const getData = (dataType: string, data: any) => {
        switch (dataType) {
            case 'Player Data':
            case 'Session Event Data':
            case 'Gameplay Event Data':
                return <DisplayData data={data} />
            case 'Tutorial Data':
                return <TutorialDetailedReportViewer data={data} />
            case 'Level Start Data':
            case 'Level Complete Data':
            case 'Level Fail Data':
                return <LevelDetailedReportViewer data={data} />
            case 'IAP Initiated':
            case 'IAP Successful':
            case 'IAP Failed':
            case 'IAP Consumed':
                return <IAPDetailedReportViewer data={data} />
            case 'Ad Started':
            case 'Ad Clicked':
            case 'Ad Skipped':
            case 'Ad Completed':
            case 'Ad Failed':
                return <AdDetailedReportViewer data={data} />
            case 'Currency Earned':
            case 'Currency Spent':
                return <EconomyDetailedReportViewer data={data} />
            case 'Error Data':
            case 'Warning Data':
            case 'Info Data':
                return <LogDetailedReportViewer data={data} />
            case 'Low FPS Data':
            case 'Average FPS Data':
            case 'High FPS Data':
                return <FPSDetailedReportViewer data={data} />;
            case 'Low Memory Usage Data':
            case 'Average Memory Usage Data':
            case 'High Memory Usage Data':
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
