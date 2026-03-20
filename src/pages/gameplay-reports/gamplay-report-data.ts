import { MEAN, MEDIAN, MODE } from "../../common/constants";
import { formatDecimalNumber, formatTime, isObjectEmpty } from "../../common/utils";
import { levelDataColumns } from "../../components/gameplay-report/gameplay-detailed-report-viewer/level-detailed-report-viewer";


const getGameplayReportData = (props: any) => {
    const emptyData = [{ name: 'No data found', value: "" }];

    const {
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
        tutorialData = {},
        levelData = {},
        iapData = {},
        adData = {},
        economyData = {},
        fpsData = {},
        memoryUsageData = {},
        logData = {},
        additionalMetricsData = {}
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
                    value: logData?.error[0]?.count ?? 0
                },
                {
                    name: 'Total Warnings',
                    value: logData?.warning[0]?.count ?? 0
                },
                {
                    name: 'Total Info Logs',
                    value: logData?.info[0]?.count ?? 0
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
                additionalMetrics: [
                    {
                        type: MEAN,
                        name: 'Average Level Start',
                        value: formatDecimalNumber(additionalMetricsData?.levelData?.levelStart?.mean),
                    },
                    {
                        type: MEDIAN,
                        name: 'Level Start Median',
                        value: additionalMetricsData?.levelData?.levelStart?.median,
                        columns: levelDataColumns,
                    },
                    {
                        type: MODE,
                        name: 'Highest Level Started',
                        value: additionalMetricsData?.levelData?.levelStart?.mode,
                        columns: levelDataColumns,
                    },
                ]
            },
            {
                name: 'Level Complete Data',
                data: levelData?.countInfo?.levelComplete ?? [],
                additionalMetrics: [
                    {
                        name: 'Average Level Complete',
                        value: formatDecimalNumber(additionalMetricsData?.levelData?.levelComplete?.mean)
                    },
                    {
                        name: 'Level Complete Median',
                        value: additionalMetricsData?.levelData?.levelComplete?.median
                    },
                    {
                        name: 'Highest Level Completed',
                        value: additionalMetricsData?.levelData?.levelComplete?.mode
                    },
                ]
            },
            {
                name: 'Level Fail Data',
                data: levelData?.countInfo?.levelFail ?? [],
                additionalMetrics: [
                    {
                        name: 'Average Level Fail',
                        value: formatDecimalNumber(additionalMetricsData?.levelData?.levelFail?.mean)
                    },
                    {
                        name: 'Level Fail Median',
                        value: additionalMetricsData?.levelData?.levelFail?.median
                    },
                    {
                        name: 'Highest Level Failed',
                        value: additionalMetricsData?.levelData?.levelFail?.mode
                    },
                ]
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
                additionalMetrics: [
                    {
                        name: 'Average IAP Initiated',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapInitiated?.mean)
                    },
                    {
                        name: 'IAP Initiated Median',
                        value: additionalMetricsData?.iapData?.iapInitiated?.median
                    },
                    {
                        name: 'Highest IAP Initiated',
                        value: additionalMetricsData?.iapData?.iapInitiated?.mode
                    },
                ]
            },
            {
                name: 'IAP Successful',
                data: iapData.iapSuccessful,
                additionalMetrics: [
                    {
                        name: 'Average IAP Successful',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapSuccessful?.mean)
                    },
                    {
                        name: 'IAP Successful Median',
                        value: additionalMetricsData?.iapData?.iapSuccessful?.median
                    },
                    {
                        name: 'Highest IAP Successful',
                        value: additionalMetricsData?.iapData?.iapSuccessful?.mode
                    },
                ]
            },
            {
                name: 'IAP Failed',
                data: iapData.iapFailed,
                additionalMetrics: [
                    {
                        name: 'Average IAP Failed',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapFailed?.mean)
                    },
                    {
                        name: 'IAP Failed Median',
                        value: additionalMetricsData?.iapData?.iapFailed?.median
                    },
                    {
                        name: 'Highest IAP Failed',
                        value: additionalMetricsData?.iapData?.iapFailed?.mode
                    },
                ]
            },
            {
                name: 'IAP Consumed',
                data: iapData.iapConsumed,
                additionalMetrics: [
                    {
                        name: 'Average IAP Consumed',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapConsumed?.mean)
                    },
                    {
                        name: 'IAP Consumed Median',
                        value: additionalMetricsData?.iapData?.iapConsumed?.median
                    },
                    {
                        name: 'Highest IAP Consumed',
                        value: additionalMetricsData?.iapData?.iapConsumed?.mode
                    },
                ]
            }
        ],
        adData: [
            {
                name: 'Ad Started',
                data: adData.adStarted,
                additionalMetrics: [
                    {
                        name: 'Average Ad Started',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adStarted?.mean)
                    },
                    {
                        name: 'Ad Started Median',
                        value: additionalMetricsData?.adData?.adStarted?.median
                    },
                    {
                        name: 'Highest Ad Started',
                        value: additionalMetricsData?.adData?.adStarted?.mode
                    },
                ]
            },
            {
                name: 'Ad Clicked',
                data: adData.adClicked,
                additionalMetrics: [
                    {
                        name: 'Average Ad Clicked',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adClicked?.mean)
                    },
                    {
                        name: 'Ad Clicked Median',
                        value: additionalMetricsData?.adData?.adClicked?.median
                    },
                    {
                        name: 'Highest Ad Clicked',
                        value: additionalMetricsData?.adData?.adClicked?.mode
                    },
                ]
            },
            {
                name: 'Ad Skipped',
                data: adData.adSkipped,
                additionalMetrics: [
                    {
                        name: 'Average Ad Skipped',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adSkipped?.mean)
                    },
                    {
                        name: 'Ad Skipped Median',
                        value: additionalMetricsData?.adData?.adSkipped?.median
                    },
                    {
                        name: 'Highest Ad Skipped',
                        value: additionalMetricsData?.adData?.adSkipped?.mode
                    },
                ]
            },
            {
                name: 'Ad Completed',
                data: adData.adCompleted,
                additionalMetrics: [
                    {
                        name: 'Average Ad Completed',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adCompleted?.mean)
                    },
                    {
                        name: 'Ad Completed Median',
                        value: additionalMetricsData?.adData?.adCompleted?.median
                    },
                    {
                        name: 'Highest Ad Completed',
                        value: additionalMetricsData?.adData?.adCompleted?.mode
                    },
                ]
            },
            {
                name: 'Ad Failed',
                data: adData.adFailed,
                additionalMetrics: [
                    {
                        name: 'Average Ad Failed',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adFailed?.mean)
                    },
                    {
                        name: 'Ad Failed Median',
                        value: additionalMetricsData?.adData?.adFailed?.median
                    },
                    {
                        name: 'Highest Ad Failed',
                        value: additionalMetricsData?.adData?.adFailed?.mode
                    },
                ]
            },
        ],
        economyData: [
            {
                name: 'Currency Earned',
                data: economyData.currencyEarned,
                additionalMetrics: [
                    {
                        name: 'Average Currency Earned',
                        value: formatDecimalNumber(additionalMetricsData?.economyData?.currencyEarned?.mean)
                    },
                    {
                        name: 'Currency Earned Median',
                        value: additionalMetricsData?.economyData?.currencyEarned?.median
                    },
                    {
                        name: 'Highest Currency Earned',
                        value: additionalMetricsData?.economyData?.currencyEarned?.mode
                    },
                ]
            },
            {
                name: 'Currency Spent',
                data: economyData.currencySpent,
                additionalMetrics: [
                    {
                        name: 'Average Currency Spent',
                        value: formatDecimalNumber(additionalMetricsData?.economyData?.currencySpent?.mean)
                    },
                    {
                        name: 'Currency Spent Median',
                        value: additionalMetricsData?.economyData?.currencySpent?.median
                    },
                    {
                        name: 'Highest Currency Spent',
                        value: additionalMetricsData?.economyData?.currencySpent?.mode
                    },
                ]
            }
        ],
        logData: [
            {
                name: 'Error Data',
                data: logData.error,
                additionalMetrics: [
                    {
                        name: 'Average Error',
                        value: formatDecimalNumber(additionalMetricsData?.logData?.error?.mean)
                    },
                    {
                        name: 'Error Median',
                        value: additionalMetricsData?.logData?.error?.median
                    },
                    {
                        name: 'Highest Error',
                        value: additionalMetricsData?.logData?.error?.mode
                    },
                ]
            },
            {
                name: 'Warning Data',
                data: logData.warning,
                additionalMetrics: [
                    {
                        name: 'Average Warning',
                        value: formatDecimalNumber(additionalMetricsData?.logData?.warning?.mean)
                    },
                    {
                        name: 'Warning Median',
                        value: additionalMetricsData?.logData?.warning?.median
                    },
                    {
                        name: 'Highest Warning',
                        value: additionalMetricsData?.logData?.warning?.mode
                    },
                ]
            },
            {
                name: 'Info Data',
                data: logData.info,
                additionalMetrics: [
                    {
                        name: 'Average Info',
                        value: formatDecimalNumber(additionalMetricsData?.logData?.info?.mean)
                    },
                    {
                        name: 'Info Median',
                        value: additionalMetricsData?.logData?.info?.median
                    },
                    {
                        name: 'Highest Info',
                        value: additionalMetricsData?.logData?.info?.mode
                    },
                ]
            }
        ],
        fpsData: [
            {
                name: 'Low FPS Data',
                data: [fpsData.low ?? 0]
            },
            {
                name: 'Average FPS Data',
                data: [{ fps: Math.floor(fpsData.average) ?? 0 }]
            },
            {
                name: 'High FPS Data',
                data: [fpsData.high ?? 0]
            },
        ],
        memoryUsageData: [
            {
                name: 'Low Memory Usage Data',
                data: [memoryUsageData.low ?? 0]
            },
            {
                name: 'Average Memory Usage Data',
                data: [{ memoryUsage: Math.floor(memoryUsageData.average) ?? 0 }]
            },
            {
                name: 'High Memory Usage Data',
                data: [memoryUsageData.high ?? 0]
            },
        ]
    }

    return {
        reportData: reportData,
        detailedReportData: detailedReportData,
    }
}


export const GameplayReportData = {
    getGameplayReportData
}
