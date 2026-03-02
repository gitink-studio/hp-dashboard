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

    const TutorialData = (props: any) => {
        const { step, totalCount, tutorialType } = props.data;
        const name = `${tutorialType} step ${step}`;

        return <DisplayData
            key={name}
            data={{
                name: name,
                value: totalCount
            }}
        />
    }

    const LevelData = (props: any) => {
        const { levelName = "", totalCount = 0 } = props.data;

        return <DisplayData data={{
            name: levelName,
            value: totalCount
        }}
            key={levelName}
        />
    }

    const IAPData = (props: any) => {
        const { price, productId, totalCount, currencyCode } = props.data;

        return (
            <Card variant="outlined" key={productId}>
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'Product Id', value: productId }} />
                        <DisplayData data={{ name: 'Price', value: price }} />
                        <DisplayData data={{ name: 'Currency Code', value: currencyCode }} />
                        <DisplayData data={{ name: 'Count', value: totalCount }} />
                    </Stack>
                </CardContent>
            </Card>
        )

    }

    const AdData = (props: any) => {
        const { adType, duration, adSdkName, failReason, totalCount, adPlacement } = props.data;

        return (
            <Card variant="outlined" key={adPlacement}>
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'Ad Type', value: adType }} />
                        <DisplayData data={{ name: 'Ad Placement', value: adPlacement }} />
                        <DisplayData data={{ name: 'Count', value: totalCount }} />
                        <DisplayData data={{ name: 'Duration', value: formatTime(duration) }} />
                        <DisplayData data={{ name: 'Ad Sdk', value: adSdkName }} />
                        <DisplayData data={{ name: 'Fail Reason', value: failReason === "" ? "none" : failReason }} />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    const EconomyData = (props: any) => {
        const {
            itemId = 'None',
            itemName = "None",
            amount = 0,
            reason = 'None',
            totalCount = 0,
            currencyType = 'None'
        } = props.data

        return (
            <Card variant="outlined" >
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'Count', value: totalCount }} />
                        <DisplayData data={{ name: 'Item Id', value: itemId }} />
                        <DisplayData data={{ name: 'Item Name', value: itemName }} />
                        <DisplayData data={{ name: 'Amount', value: amount }} />
                        <DisplayData data={{ name: 'Currency Type', value: currencyType }} />
                        <DisplayData data={{ name: 'Reason', value: reason === "" ? "None" : reason }} />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    const LogData = (props: any) => {
        const { count, message, playerIdList } = props.data;

        return (
            <Card variant="outlined" >
                <CardContent>
                    <Stack gap={2}>
                        <DisplayData data={{ name: 'Count', value: count }} />
                        <DisplayData data={{ name: 'Message ', value: message }} />
                        <DisplayData data={{ name: 'Players Id ', value: playerIdList?.map((playerId: any) => <>{playerId},<br /> </>) }} />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    const FPSData = (props: any) => {
        const { fps, playerId } = props.data;

        return (
            <Card variant="outlined" >
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'FPS', value: Math.floor(fps) }} />
                        {/* {playerId && <DisplayData data={{ name: 'Player Id ', value: playerId }} />} */}
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    const MemoryUsageData = (props: any) => {
        const { memoryUsage, playerId } = props.data;

        return (
            <Card variant="outlined" >
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'Memory Usage', value: Math.floor(memoryUsage) }} />
                        {/* {playerId && <DisplayData data={{ name: 'Player Id ', value: playerId }} />} */}
                    </Stack>
                </CardContent>
            </Card>
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
                                                            : (Array.isArray(data?.data) ? data.data : []).map((eventData: any) => {
                                                                return (
                                                                    <>
                                                                        {getData(data.name, data?.data)}
                                                                    </>
                                                                )
                                                            })
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
