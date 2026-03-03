import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"
import { formatTime } from "../../common/utils";
import { TutorialDetailedReportViewer } from "./gameplay-detailed-report-viewer/tutorial-detailed-report-viewer";
import { LevelDetailedReportViewer } from "./gameplay-detailed-report-viewer/level-detailed-report-viewer";
import { IAPDetailedReportViewer } from "./gameplay-detailed-report-viewer/iap-detailed-report-viewer";
import { AdDetailedReportViewer } from "./gameplay-detailed-report-viewer/ad-detailed-report-viewer";
import { EconomyDetailedReportViewer } from "./gameplay-detailed-report-viewer/economy-detailed-report-viewer";
import { LogDetailedReportViewer } from "./gameplay-detailed-report-viewer/log-detailed-report-viewer";
import { FPSDetailedReportViewer } from "./gameplay-detailed-report-viewer/fps-detailed-report-viewer";
import { MemoryUsageDetailedReportViewer } from "./gameplay-detailed-report-viewer/memory-usage-detailed-report-viewer";

export const PlayerDetailedReportViewer = (props: any) => {
    const { reportData, displayButton = false, handleButtonClick } = props.data;
    const {
        avgSessionTime,
        totalSessionTime,
        avgGameplayTime,
        totalGameplayTime,
        totalReviveUsed,
        tutorialData,
        levelData,
        iapData,
        adData,
        economyData,
        logData,
        fpsData,
        memoryUsageData,
    } = reportData;

    const detailedReportData: any = {
        gameplayData: [
            {
                name: 'Session Event Data',
                data: [
                    {
                        name: 'Average Session Time',
                        value: formatTime(avgSessionTime)
                    },
                    {
                        name: 'Total Session Time',
                        value: formatTime(totalSessionTime)
                    }
                ]
            },
            {
                name: 'Gameplay Event Data',
                data: [
                    {
                        name: 'Average Gameplay Time',
                        value: formatTime(avgGameplayTime)
                    },
                    {
                        name: 'Total Gameplay Time',
                        value: formatTime(totalGameplayTime)
                    }
                ]
            },
            {
                name: 'Tutorial Data',
                data: tutorialData?.stepDetails ?? []
            },
            {
                name: 'Level Start Data',
                data: levelData?.countInfo.levelStart,
            },
            {
                name: 'Level Complete Data',
                data: levelData?.countInfo.levelComplete,
            },
            {
                name: 'Level Fail Data',
                data: levelData?.countInfo.levelFail,
            },
            {
                name: 'Revive Used',
                data: [
                    {
                        name: 'Total Revive Used',
                        value: totalReviveUsed
                    }
                ]
            },
        ],
        iapData: [
            {
                name: 'IAP Initiated',
                data: iapData.iapInitiated,
            },
            {
                name: 'IAP Successful',
                data: iapData.iapSuccessful
            },
            {
                name: 'IAP Failed',
                data: iapData.iapFailed
            },
            {
                name: 'IAP Consumed',
                data: iapData.iapConsumed
            }
        ],
        adData: [
            {
                name: 'Ad Started',
                data: adData.adStarted
            },
            {
                name: 'Ad Clicked',
                data: adData.adClicked
            },
            {
                name: 'Ad Skipped',
                data: adData.adSkipped
            },
            {
                name: 'Ad Completed',
                data: adData.adCompleted
            },
            {
                name: 'Ad Failed',
                data: adData.adFailed
            },
        ],
        economyData: [
            {
                name: 'Currency Earned',
                data: economyData.currencyEarned
            },
            {
                name: 'Currency Spent',
                data: economyData.currencySpent
            }
        ],
        logData: [
            {
                name: 'Error Data',
                data: logData.error
            },
            {
                name: 'Warning Data',
                data: logData.warning
            },
            {
                name: 'Info Data',
                data: logData.info
            }
        ],
        fpsData: [
            {
                name: 'Low FPS Data',
                data: [fpsData.low]
            },
            {
                name: 'Average FPS Data',
                data: [{ fps: fpsData.average }]
            },
            {
                name: 'High FPS Data',
                data: [fpsData.high]
            },
        ],
        memoryUsageData: [
            {
                name: 'Low Memory Usage Data',
                data: [memoryUsageData.low]
            },
            {
                name: 'Average Memory Usage Data',
                data: [{ memoryUsage: memoryUsageData.average }]
            },
            {
                name: 'High Memory Usage Data',
                data: [memoryUsageData.high]
            },
        ]
    }

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
                {Object.entries(detailedReportData).map(([key, values]: [string, any]) => (
                    <Stack gap={2} key={key} sx={{ width: '100%', flexWrap: 'wrap' }}>
                        {
                            values?.map((data: any) => {
                                return (
                                    <Card variant="outlined" key={data.name}>
                                        <CardContent sx={{ px: 4 }} >
                                            <Stack gap={2}>
                                                <Typography variant="subtitle1" textAlign={'left'}>{data.name}</Typography>
                                                <Stack direction={'row'} gap={4} flexWrap="wrap" justifyContent="flex-start" alignItems={'center'}>
                                                    {
                                                        (Array.isArray(data?.data) ? data.data : []).length === 0
                                                            ? <DataNotFound />
                                                            :
                                                            <Box>
                                                                {getData(data.name, data?.data)}
                                                            </Box>

                                                    }
                                                </Stack>
                                                {
                                                    displayButton && (
                                                        <Box display={'flex'} justifyContent={'flex-end'}>
                                                            <Button onClick={() => handleButtonClick}>View Full Report</Button>
                                                        </Box>
                                                    )
                                                }
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                    </Stack>
                ))}
            </Box >
        </>
    )
}
