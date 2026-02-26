import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { formatTime, isObjectEmpty, removeWhiteSpace } from "../../common/utils";
import { Button } from "react-admin";
import { GameplayDetailedReport } from "./gameplay-detailed-report";
import { useDetailedGameplayReportData, useGameEventReportActions, useOpenDetailedReport, useSelectedGameId } from "../../store/gameplay-event-report/gameplay-event-report-store";
import { useEffect, useState } from "react";
import { GameplayEventReportType } from "../../common/constants";

export const GameEventReport = (props: any) => {
    const canOpenDetailedReport = useOpenDetailedReport();
    const selectedGameId = useSelectedGameId();
    const { setCanOpenDetailedReport } = useGameEventReportActions();
    const [reportType, setReportType] = useState('');
    const [id, setId] = useState("");
    const emptyData = [{ name: 'No data found', value: "" }];

    const {
        gameId = '',
        title,
        playerCount = 0,
        avgSessionTime = 0,
        avgGameplayTime = 0,
        tutorialsCompleted = 0,
        totalSessionTime = 0,
        totalGameplayTime = 0,
        totalReviveUsed = 0,
        totalIAPInitiated = 0,
        totalIAPFailed = 0,
        totalIAPSuccessful = 0,
        totalIAPConsumed = 0,
        totalAdStarted = 0,
        totalAdCompleted = 0,
        totalAdSkipped = 0,
        totalAdFailed = 0,
        totalCurrencyEarned = 0,
        totalCurrencySpent = 0,
        totalErrorOccurred = 0,
        tutorialData = {},
        levelData = {},
        iapData = {},
        adData = {},
        economyData = {},
        fpsData = {},
        memoryUsageData = {},
        logData = {},
    } = props.data;

    const reportData = [
        {
            name: 'Gameplay Data',
            data: [
                {
                    name: 'Average Session Time',
                    value: formatTime(avgSessionTime)
                },
                {
                    name: 'Total Session Time',
                    value: formatTime(totalSessionTime)
                },
                {
                    name: 'Average Gameplay Time',
                    value: formatTime(avgGameplayTime)
                },
                {
                    name: 'Total Gameplay Time',
                    value: formatTime(totalGameplayTime)
                },
                {
                    name: 'Tutorials Completed',
                    value: tutorialsCompleted === "" ? `${0} / ${playerCount}` : `${tutorialsCompleted} / ${playerCount}`
                },
                {
                    name: 'Revive Used',
                    value: totalReviveUsed
                },
            ]
        },
        {
            name: 'In App Purchase Data',
            data: [
                {
                    name: 'IAP Initiated',
                    value: totalIAPInitiated
                },
                {
                    name: 'IAP Failed',
                    value: totalIAPFailed
                },
                {
                    name: 'IAP Successful',
                    value: totalIAPSuccessful
                },
                {
                    name: 'IAP Consumed',
                    value: totalIAPConsumed
                },
            ]
        },
        {
            name: 'Ad Data',
            data: [
                {
                    name: 'Ad Started',
                    value: totalAdStarted
                },
                {
                    name: 'Ad Failed',
                    value: totalAdFailed
                },
                {
                    name: 'Ad Completed',
                    value: totalAdCompleted
                },
                {
                    name: 'Ad Skipped',
                    value: totalAdSkipped
                },
            ]
        },
        {
            name: 'Economy Data',
            data: [
                {
                    name: 'Total Currency Earned',
                    value: totalCurrencyEarned
                },
                {
                    name: 'Total Currency Spent',
                    value: totalCurrencySpent
                },
            ]
        },
        {
            name: 'Log Data',
            data: [
                {
                    name: 'Total Errors',
                    value: logData?.totalErrorOccurred ?? 0
                },
                {
                    name: 'Total Warnings',
                    value: logData?.totalWarningOccurred ?? 0
                },
                {
                    name: 'Total Info Logs',
                    value: logData?.totalInfoOccurred ?? 0
                }
            ]
        },
        {
            name: 'FPS Data',
            data: [
                {
                    name: 'Low FPS',
                    value: fpsData?.low?.fps ?? 0
                },
                {
                    name: 'Average FPS',
                    value: Math.floor(fpsData?.average) ?? 0
                },
                {
                    name: 'High FPS',
                    value: fpsData?.high?.fps ?? 0
                }
            ]
        },
        {
            name: 'Memory Usage Data',
            data: [
                {
                    name: 'Low Memory Usage',
                    value: memoryUsageData?.low?.memoryUsage ?? 0
                },
                {
                    name: 'Average Memory Usage',
                    value: Math.floor(memoryUsageData?.average) ?? 0
                },
                {
                    name: 'Peak Memory Usage',
                    value: memoryUsageData?.high?.memoryUsage ?? 0
                }
            ]
        }
    ]

    const detailedReportData = {
        gameplayData: [
            {
                name: 'Player Data',
                data: [
                    {
                        name: 'Total Player Count',
                        value: playerCount
                    }
                ]
            },
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
                data: isObjectEmpty(tutorialData?.stepDetails) ? emptyData : tutorialData.stepDetails
            },
            {
                name: 'Level Start Data',
                data: levelData?.countInfo?.levelStart ?? [],
            },
            {
                name: 'Level Complete Data',
                data: levelData?.countInfo?.levelComplete ?? [],
            },
            {
                name: 'Level Fail Data',
                data: levelData?.countInfo?.levelFail ?? [],
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

    const getDetailedReportData = (type: string) => {
        switch (type) {
            case GameplayEventReportType.GAMEPLAY_DATA:
                return detailedReportData.gameplayData;
            case GameplayEventReportType.IN_APP_PURCHASE_DATA:
                return detailedReportData.iapData;
            case GameplayEventReportType.AD_DATA:
                return detailedReportData.adData;
            case GameplayEventReportType.ECONOMY_DATA:
                return detailedReportData.economyData;
            case GameplayEventReportType.LOG_DATA:
                return detailedReportData.logData;
            case GameplayEventReportType.FPS_DATA:
                return detailedReportData.fpsData;
            case GameplayEventReportType.MEMORY_USAGE_DATA:
                return detailedReportData.memoryUsageData;
            default:
                console.log(`Unable to find the report type !`);
                return [];
        }
    }

    const handleViewFullReports = (type: string) => {
        console.log(`View full button report clicked for ${type} ${gameId}`);
        setId(gameId);
        setReportType(type);
        setCanOpenDetailedReport(true);
    }

    return <>
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'center',
            flexWrap: 'wrap',
            gap: 2,
        }}>
            <Typography variant='h5' fontWeight={'bold'} pt={2}>{title} Gameplay Report</Typography>
            <Stack spacing={2} sx={{ width: '100%' }}>
                {
                    reportData.map((data: any) => (
                        <Card key={data.name} variant="outlined" >
                            <CardContent sx={{ px: 4 }}>
                                <Stack spacing={2}>
                                    <Typography variant="subtitle1" fontWeight={'bold'} textAlign={'left'}>{data.name}</Typography>

                                    <Stack direction={'row'} spacing={4}>
                                        {
                                            data.data.map((eventData: any) => {
                                                return (
                                                    <Stack spacing={1} key={eventData.name}>
                                                        <Typography variant="h6">{eventData.value}</Typography>
                                                        <Typography variant="caption">{eventData.name}</Typography>
                                                    </Stack>
                                                )
                                            })
                                        }
                                    </Stack>

                                    <Box display={'flex'} justifyContent={'flex-end'}>
                                        <Button onClick={() => handleViewFullReports(data.name)}>View Full Report</Button>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                }
            </Stack>
        </Box >

        {
            canOpenDetailedReport && id !== "" && (
                <GameplayDetailedReport data={{
                    type: reportType,
                    reportData: getDetailedReportData(reportType),
                    callback: () => setCanOpenDetailedReport(false),
                }} />
            )
        }
    </>
}
