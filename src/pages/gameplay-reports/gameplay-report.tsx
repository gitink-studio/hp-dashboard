import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { formatDecimalNumber, formatTime, isObjectEmpty, removeWhiteSpace } from "../../common/utils";
import { Button } from "react-admin";
import { GameplayDetailedReport } from "./gameplay-detailed-report";
import { useDetailedGameplayReportData, useGameEventReportActions } from "../../store/gameplay-event-report/gameplay-event-report-store";
import { useEffect, useState } from "react";
import { GameplayEventReportType } from "../../common/constants";
import { GameplayReportData } from "./gamplay-report-data";

export const GameEventReport = (props: any) => {
    const { setSelectedGameId } = useGameEventReportActions();
    const [reportType, setReportType] = useState('');
    const [detailedReportState, setDetailedReportState] = useState(false);
    const { gameId, title } = props.data;
    const { detailedReportData, reportData } = GameplayReportData.getGameplayReportData(props);

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
        setSelectedGameId(gameId);
        setReportType(type);
        setDetailedReportState(true);
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
            <Stack gap={2} sx={{ width: '100%' }}>
                {
                    reportData.map((data: any) => (
                        <Card key={data.name} variant="outlined" >
                            <CardContent sx={{ px: 4 }}>
                                <Stack gap={2}>
                                    <Typography variant="subtitle1" fontWeight={'bold'} textAlign={'left'}>{data.name}</Typography>

                                    <Stack direction={'row'} gap={4}>
                                        {
                                            data.data.map((eventData: any) => {
                                                return (
                                                    <Stack gap={1} key={eventData.name}>
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
            detailedReportState && (
                <GameplayDetailedReport
                    key={gameId}
                    data={{
                        type: reportType,
                        reportData: getDetailedReportData(reportType),
                        callback: () => setDetailedReportState(false),
                    }} />
            )
        }
    </>
}
