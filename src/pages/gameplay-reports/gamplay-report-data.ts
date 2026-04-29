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
        totalSessionStartEventCount = 0,
        totalSessionStopEventCount = 0,
        totalGameplayStartEventCount = 0,
        totalGameplayEndEventCount = 0,
        totalLevelStartEventCount = 0,
        totalLevelCompleteEventCount = 0,
        totalLevelFailEventCount = 0,
        totalStageStartEventCount = 0,
        totalStageCompleteEventCount = 0,
        totalStageFailEventCount = 0,
        totalSessionTime = 0,
        totalGameplayTime = 0,
        totalReviveUsed = 0,
        totalIAPInitiated = 0,
        totalIAPFailed = 0,
        totalIAPSuccessful = 0,
        totalIAPConsumed = 0,
        totalAdRequested = 0,
        totalAdFilled = 0,
        totalAdStarted = 0,
        totalAdCompleted = 0,
        totalAdSkipped = 0,
        totalAdFailed = 0,
        totalCurrencyEarned = 0,
        totalCurrencySpent = 0,
        tutorialData = {},
        levelData = {},
        stageData = {},
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
                    name: 'Ad Requested',
                    value: totalAdRequested
                },
                {
                    name: 'Ad Filled',
                    value: totalAdFilled
                },
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
                name: 'Player Event Data',
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
                        name: 'Total Session Start',
                        value: totalSessionStartEventCount
                    },
                    {
                        name: 'Total Session Stop',
                        value: totalSessionStopEventCount
                    },
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
                        name: 'Total Gameplay Start',
                        value: totalGameplayStartEventCount
                    },
                    {
                        name: 'Total Gameplay End',
                        value: totalGameplayEndEventCount
                    },
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
                name: 'Level Event Data',
                data: [
                    {
                        name: 'Total Level Start',
                        value: totalLevelStartEventCount
                    },
                    {
                        name: 'Total Level Complete',
                        value: totalLevelCompleteEventCount
                    },
                    {
                        name: 'Total Level Fail',
                        value: totalLevelFailEventCount
                    },
                ]
            },
            {
                name: 'Stage Event Data',
                data: [
                    {
                        name: 'Total Stage Start',
                        value: totalStageStartEventCount
                    },
                    {
                        name: 'Total Stage Complete',
                        value: totalStageCompleteEventCount
                    },
                    {
                        name: 'Total Stage Fail',
                        value: totalStageFailEventCount
                    },
                ]
            },
            {
                name: 'Tutorial Event Data',
                data: isObjectEmpty(tutorialData?.stepDetails) ? emptyData : tutorialData.stepDetails
            },
            {
                name: 'Level Start Event Data',
                data: levelData?.countInfo?.levelStart ?? [],
                additionalMetrics: {
                    mean: {
                        name: 'Average Level Start',
                        value: formatDecimalNumber(additionalMetricsData?.levelData?.levelStart?.mean),
                    },
                    median: {
                        name: 'Level Start Median',
                        value: additionalMetricsData?.levelData?.levelStart?.median,
                    },
                    mode: {
                        name: 'Highest Level Started',
                        value: additionalMetricsData?.levelData?.levelStart?.mode,
                    }
                }
            },
            {
                name: 'Level Complete Event Data',
                data: levelData?.countInfo?.levelComplete ?? [],
                additionalMetrics: {
                    mean: {
                        name: 'Average Level Complete',
                        value: formatDecimalNumber(additionalMetricsData?.levelData?.levelComplete?.mean)
                    },
                    median: {
                        name: 'Level Complete Median',
                        value: additionalMetricsData?.levelData?.levelComplete?.median,

                    },
                    mode: {
                        name: 'Highest Level Completed',
                        value: additionalMetricsData?.levelData?.levelComplete?.mode,

                    },
                }
            },
            {
                name: 'Level Fail Event Data',
                data: levelData?.countInfo?.levelFail ?? [],
                additionalMetrics: {
                    mean: {
                        name: 'Average Level Fail',
                        value: formatDecimalNumber(additionalMetricsData?.levelData?.levelFail?.mean)
                    },
                    median: {
                        name: 'Level Fail Median',
                        value: additionalMetricsData?.levelData?.levelFail?.median
                    },
                    mode: {
                        name: 'Highest Level Failed',
                        value: additionalMetricsData?.levelData?.levelFail?.mode
                    },
                }
            },
            {
                name: 'Stage Start Event Data',
                data: stageData?.countInfo?.stageStart ?? [],
                additionalMetrics: {
                    mean: {
                        name: 'Average Stage Start',
                        value: formatDecimalNumber(additionalMetricsData?.stageData?.stageStart?.mean)
                    },
                    median: {
                        name: 'Stage Start Median',
                        value: additionalMetricsData?.stageData?.stageStart?.median
                    },
                    mode: {
                        name: 'Highest Stage Start',
                        value: additionalMetricsData?.stageData?.stageStart?.mode
                    },
                }
            },
            {
                name: 'Stage Complete Event Data',
                data: stageData?.countInfo?.stageComplete ?? [],
                additionalMetrics: {
                    mean: {
                        name: 'Average Stage Complete',
                        value: formatDecimalNumber(additionalMetricsData?.stageData?.stageComplete?.mean)
                    },
                    median: {
                        name: 'Stage Complete Median',
                        value: additionalMetricsData?.stageData?.stageComplete?.median
                    },
                    mode: {
                        name: 'Highest Stage Complete',
                        value: additionalMetricsData?.stageData?.stageComplete?.mode
                    },
                }
            },
            {
                name: 'Stage Fail Event Data',
                data: stageData?.countInfo?.stageFail ?? [],
                additionalMetrics: {
                    mean: {
                        name: 'Average Stage Fail',
                        value: formatDecimalNumber(additionalMetricsData?.stageData?.stageFail?.mean)
                    },
                    median: {
                        name: 'Stage Fail Median',
                        value: additionalMetricsData?.stageData?.stageFail?.median
                    },
                    mode: {
                        name: 'Highest Stage Fail',
                        value: additionalMetricsData?.stageData?.stageFail?.mode
                    },
                }
            },
            {
                name: 'All Level Event Data',
                data: [
                    {
                        name: 'Level Start Event Data',
                        data: levelData?.countInfo?.levelStart ?? [],
                    },
                    {
                        name: 'Level Complete Event Data',
                        data: levelData?.countInfo?.levelComplete ?? [],
                    },
                    {
                        name: 'Level Fail Event Data',
                        data: levelData?.countInfo?.levelFail ?? [],
                    }
                ]
            },
            {
                name: 'All Stage Event Data',
                data: [
                    {
                        name: 'Stage Start Event Data',
                        data: stageData?.countInfo?.stageStart ?? [],
                    },
                    {
                        name: 'Stage Complete Event Data',
                        data: stageData?.countInfo?.stageComplete ?? [],
                    },
                    {
                        name: 'Stage Fail Event Data',
                        data: stageData?.countInfo?.stageFail ?? [],
                    }
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
                name: 'IAP Initiated Event Data',
                data: iapData.iapInitiated,
                additionalMetrics: {
                    mean: {
                        name: 'Average IAP Initiated',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapInitiated?.mean)
                    },
                    median: {
                        name: 'IAP Initiated Median',
                        value: additionalMetricsData?.iapData?.iapInitiated?.median
                    },
                    mode: {
                        name: 'Highest IAP Initiated',
                        value: additionalMetricsData?.iapData?.iapInitiated?.mode
                    },
                }
            },
            {
                name: 'IAP Successful Event Data',
                data: iapData.iapSuccessful,
                additionalMetrics: {
                    mean: {
                        name: 'Average IAP Successful',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapSuccessful?.mean)
                    },
                    median: {
                        name: 'IAP Successful Median',
                        value: additionalMetricsData?.iapData?.iapSuccessful?.median
                    },
                    mode: {
                        name: 'Highest IAP Successful',
                        value: additionalMetricsData?.iapData?.iapSuccessful?.mode
                    },
                }
            },
            {
                name: 'IAP Failed Event Data',
                data: iapData.iapFailed,
                additionalMetrics: {
                    mean: {
                        name: 'Average IAP Failed',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapFailed?.mean)
                    },
                    median: {
                        name: 'IAP Failed Median',
                        value: additionalMetricsData?.iapData?.iapFailed?.median
                    },
                    mode: {
                        name: 'Highest IAP Failed',
                        value: additionalMetricsData?.iapData?.iapFailed?.mode
                    },
                }
            },
            {
                name: 'IAP Consumed Event Data',
                data: iapData.iapConsumed,
                additionalMetrics: {
                    mean: {
                        name: 'Average IAP Consumed',
                        value: formatDecimalNumber(additionalMetricsData?.iapData?.iapConsumed?.mean)
                    },
                    median: {
                        name: 'IAP Consumed Median',
                        value: additionalMetricsData?.iapData?.iapConsumed?.median
                    },
                    mode: {
                        name: 'Highest IAP Consumed',
                        value: additionalMetricsData?.iapData?.iapConsumed?.mode
                    },
                }
            },
            {
                name: 'All IAP Event Data',
                data: [
                    {
                        name: 'IAP Initiated Event Data',
                        data: iapData.iapInitiated
                    },
                    {
                        name: 'IAP Successful Event Data',
                        data: iapData.iapSuccessful
                    },
                    {
                        name: 'IAP Consumed Event Data',
                        data: iapData.iapConsumed
                    },
                    {
                        name: 'IAP Failed Event Data',
                        data: iapData.iapFailed
                    }
                ]
            },
        ],
        adData: [
            {
                name: 'Ad Requested Event Data',
                data: adData.adRequested,
                additionalMetrics: {
                    mean: {
                        name: 'Average Ad Started',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adRequested?.mean)
                    },
                    median: {
                        name: 'Ad Started Median',
                        value: additionalMetricsData?.adData?.adRequested?.median
                    },
                    mode: {
                        name: 'Highest Ad Started',
                        value: additionalMetricsData?.adData?.adRequested?.mode
                    },
                }
            },
            {
                name: 'Ad Filled Event Data',
                data: adData.adFilled,
                additionalMetrics: {
                    mean: {
                        name: 'Average Ad Started',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adFilled?.mean)
                    },
                    median: {
                        name: 'Ad Started Median',
                        value: additionalMetricsData?.adData?.adFilled?.median
                    },
                    mode: {
                        name: 'Highest Ad Started',
                        value: additionalMetricsData?.adData?.adFilled?.mode
                    },
                }
            },
            {
                name: 'Ad Started Event Data',
                data: adData.adStarted,
                additionalMetrics: {
                    mean: {
                        name: 'Average Ad Started',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adStarted?.mean)
                    },
                    median: {
                        name: 'Ad Started Median',
                        value: additionalMetricsData?.adData?.adStarted?.median
                    },
                    mode: {
                        name: 'Highest Ad Started',
                        value: additionalMetricsData?.adData?.adStarted?.mode
                    },
                }
            },
            {
                name: 'Ad Clicked Event Data',
                data: adData.adClicked,
                additionalMetrics: {
                    mean: {
                        name: 'Average Ad Clicked',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adClicked?.mean)
                    },
                    median: {
                        name: 'Ad Clicked Median',
                        value: additionalMetricsData?.adData?.adClicked?.median
                    },
                    mode: {
                        name: 'Highest Ad Clicked',
                        value: additionalMetricsData?.adData?.adClicked?.mode
                    },

                }
            },
            {
                name: 'Ad Skipped Event Data',
                data: adData.adSkipped,
                additionalMetrics: {
                    mean: {
                        name: 'Average Ad Skipped',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adSkipped?.mean)
                    },
                    median: {
                        name: 'Ad Skipped Median',
                        value: additionalMetricsData?.adData?.adSkipped?.median
                    },
                    mode: {
                        name: 'Highest Ad Skipped',
                        value: additionalMetricsData?.adData?.adSkipped?.mode
                    },
                }
            },
            {
                name: 'Ad Completed Event Data',
                data: adData.adCompleted,
                additionalMetrics: {
                    mean: {
                        name: 'Average Ad Completed',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adCompleted?.mean)
                    },
                    median: {
                        name: 'Ad Completed Median',
                        value: additionalMetricsData?.adData?.adCompleted?.median
                    },
                    mode: {
                        name: 'Highest Ad Completed',
                        value: additionalMetricsData?.adData?.adCompleted?.mode
                    },
                }
            },
            {
                name: 'Ad Failed Event Data',
                data: adData.adFailed,
                additionalMetrics: {
                    mean: {
                        name: 'Average Ad Failed',
                        value: formatDecimalNumber(additionalMetricsData?.adData?.adFailed?.mean)
                    },
                    median: {
                        name: 'Ad Failed Median',
                        value: additionalMetricsData?.adData?.adFailed?.median
                    },
                    mode: {
                        name: 'Highest Ad Failed',
                        value: additionalMetricsData?.adData?.adFailed?.mode
                    },
                }
            },
            {
                name: 'Ad Requested & Filled Event Data',
                data: [
                    {
                        name: 'Ad Requested Event Data',
                        data: adData.adRequested
                    },
                    {
                        name: 'Ad Filled Event Data',
                        data: adData.adFilled
                    },
                ]
            },
            {
                name: 'Ad Started, Completed & Failed Event Data',
                data: [
                    {
                        name: 'Ad Started Event Data',
                        data: adData.adStarted
                    },
                    {
                        name: 'Ad Completed Event Data',
                        data: adData.adCompleted
                    },
                    {
                        name: 'Ad Failed Event Data',
                        data: adData.adFailed
                    },
                ]
            },
            {
                name: 'Ad Clicked & Skipped Event Data',
                data: [
                    {
                        name: 'Ad Clicked Event Data',
                        data: adData.adClicked
                    },
                    {
                        name: 'Ad Skipped Event Data',
                        data: adData.adSkipped
                    },
                ]
            },
        ],
        economyData: [
            {
                name: 'Currency Earned Event Data',
                data: economyData.currencyEarned,
                additionalMetrics: {
                    mean: {
                        name: 'Average Currency Earned',
                        value: formatDecimalNumber(additionalMetricsData?.economyData?.currencyEarned?.mean)
                    },
                    median: {
                        name: 'Currency Earned Median',
                        value: additionalMetricsData?.economyData?.currencyEarned?.median
                    },
                    mode: {
                        name: 'Highest Currency Earned',
                        value: additionalMetricsData?.economyData?.currencyEarned?.mode
                    },
                }
            },
            {
                name: 'Currency Spent Event Data',
                data: economyData.currencySpent,
                additionalMetrics: {
                    mean: {
                        name: 'Average Currency Spent',
                        value: formatDecimalNumber(additionalMetricsData?.economyData?.currencySpent?.mean)
                    },
                    median: {
                        name: 'Currency Spent Median',
                        value: additionalMetricsData?.economyData?.currencySpent?.median
                    },
                    mode: {
                        name: 'Highest Currency Spent',
                        value: additionalMetricsData?.economyData?.currencySpent?.mode
                    },
                }
            },
            {
                name: 'All Economy Event Data',
                data: [
                    {
                        name: 'Currency Earned Event Data',
                        data: economyData.currencyEarned
                    },
                    {
                        name: 'Currency Spent Event Data',
                        data: economyData.currencySpent
                    },
                ]
            }
        ],
        logData: [
            {
                name: 'Error Event Data',
                data: logData.error,
                additionalMetrics: {
                    mean: {
                        name: 'Average Error',
                        value: formatDecimalNumber(additionalMetricsData?.logData?.error?.mean)
                    },
                    median: {
                        name: 'Error Median',
                        value: additionalMetricsData?.logData?.error?.median
                    },
                    mode: {
                        name: 'Highest Error',
                        value: additionalMetricsData?.logData?.error?.mode
                    }
                },
            },
            {
                name: 'Warning Event Data',
                data: logData.warning,
                additionalMetrics: {
                    mean: {
                        name: 'Average Warning',
                        value: formatDecimalNumber(additionalMetricsData?.logData?.warning?.mean)
                    },
                    median: {
                        name: 'Warning Median',
                        value: additionalMetricsData?.logData?.warning?.median
                    },
                    mode: {
                        name: 'Highest Warning',
                        value: additionalMetricsData?.logData?.warning?.mode
                    },
                }
            },
            {
                name: 'Info Event Data',
                data: logData.info,
                additionalMetrics: {
                    mean: {
                        name: 'Average Info',
                        value: formatDecimalNumber(additionalMetricsData?.logData?.info?.mean)
                    },
                    median: {
                        name: 'Info Median',
                        value: additionalMetricsData?.logData?.info?.median
                    },
                    mode: {
                        name: 'Highest Info',
                        value: additionalMetricsData?.logData?.info?.mode
                    },
                }
            }
        ],
        fpsData: [
            {
                name: 'Low FPS Data',
                data: [
                    {
                        name: 'FPS',
                        value: fpsData.low.fps ?? 0
                    },
                ]
            }, {
                name: 'Average FPS Data',
                data: [
                    {
                        name: "FPS",
                        value: Math.floor(fpsData.average) ?? 0
                    }
                ]
            }, {
                name: "High FPS Data",
                data: [
                    {
                        name: "FPS",
                        value: fpsData.high.fps ?? 0
                    }
                ]
            }, {
                name: "FPS Metrics Data",
                data: [
                    {
                        name: "Median ",
                        value: additionalMetricsData.fpsData.median.fps ?? 0
                    }
                ]
            }
        ],
        memoryUsageData: [
            {
                name: 'Low Memory Usage Data',
                data: [
                    {
                        name: 'Memory Usage',
                        value: memoryUsageData.low.memoryUsage ?? 0
                    },
                ]
            }, {
                name: 'Average Memory Usage Data',
                data: [
                    {
                        name: "Memory Usage",
                        value: Math.floor(memoryUsageData.average) ?? 0
                    }
                ]
            }, {
                name: "High Memory Usage Data",
                data: [
                    {
                        name: "Memory Usage",
                        value: memoryUsageData.high.memoryUsage ?? 0
                    }
                ]
            },
            {
                name: "Memory Usage Metrics Data",
                data: [
                    {
                        name: "Median ",
                        value: additionalMetricsData.memoryUsageData.median.memoryUsage ?? 0
                    }
                ]
            }
        ],
    }

    return {
        reportData: reportData,
        detailedReportData: detailedReportData,
    }
}

export const GameplayReportData = {
    getGameplayReportData
}
