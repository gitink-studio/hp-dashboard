import { Refresh } from "@mui/icons-material"
import { Box, Divider, Paper, Stack, Typography } from "@mui/material"
import { Button } from "react-admin"
import { customStyle } from "../../common/styles"
import { CustomDropdown } from "../../components/dropdown"
import { CustomSearch } from "../../components/search"
import { useGameEventReportActions, useGameEventReportData, useGameFilterValue, useGamePlatformFilterValue, useOpenPlayersReport, useSelectedGameId, useStudioFilterValue } from "../../store/gameplay-event-report/gameplay-event-report-store"
import { useEffect, useRef, useState } from "react"
import { formatTime, sendGraphqlRequest } from "../../common/utils"
import { QueryNames } from "../../common/constants"
import { Queries } from "../../graphql/queries"
import { CustomAccordion } from "../../components/accordion.component"
import { GameEventReport } from "./gameplay-report"
import { PlayerReport } from "./player-report"
import { useGameOptions, useGamePlatformOptions, useStudioOptions } from "../../store/common/dropdown-options-store"

export const GameplayReportPage = () => {
    const gameEventReportData = useGameEventReportData();
    const studioOptions = useStudioOptions();
    const gamePlatformOptions = useGamePlatformOptions();
    const gameOptions = useGameOptions();
    const studioFilterValue = useStudioFilterValue();
    const gamePlatformFilterValue = useGamePlatformFilterValue();
    const gameFilterValue = useGameFilterValue();
    const selectedGameId = useSelectedGameId();
    const {
        setStudioFilterValue,
        setGamePlatformFilterValue,
        setGameFilterValue,
        setGameEventReportData,
        setCanOpenPlayersReport,
        setSelectedGameId
    } = useGameEventReportActions();
    const isFetched = useRef(false);
    const [gamePlatformFilteredOption, setGamePlatformFilteredOption] = useState([]);
    const [gameFilteredOption, setGameFilteredOption] = useState([]);
    const [gameEventReportFilteredData, setGameEventReportFilteredData] = useState([]);

    const setGamePlatformOptions = () => {
        let filterValue = studioFilterValue;

        if (filterValue === 'All') {
            setGamePlatformFilteredOption(gamePlatformOptions);
        }

        const filteredOptions = gameEventReportData.reduce((acc: any, item: any) => {
            if (filterValue === item.name) {
                const gamePlatformFilteredOptions = item.gamePlatforms.map((gamePlatform: any) => {
                    return {
                        id: gamePlatform.id,
                        name: gamePlatform.name
                    }
                })

                return gamePlatformFilteredOptions;
            }
        })

        setGamePlatformFilteredOption(filteredOptions);
    }

    const handleStudioFilter = (selectedStudio: string) => {
        console.log(`Selected ${selectedStudio}`);
        if (selectedStudio === 'All') {
            setGamePlatformFilteredOption(gamePlatformOptions);
            setGameEventReportFilteredData(gameEventReportData);
        } else {
            console.log(`Selected specific studio`);
            const eventData: any = [];
            const filteredEventData = gameEventReportData.find((reportData: any) => selectedStudio === reportData.name);
            const newOption: any = filteredEventData.gamePlatforms.map((eventData: any) => {
                return {
                    id: eventData.id,
                    name: eventData.name
                }
            });
            eventData.push(filteredEventData);
            console.log(`Game platform list: ${JSON.stringify(newOption)}`);
            setGamePlatformFilteredOption(newOption);
            setGameEventReportFilteredData(eventData);
        }

        setStudioFilterValue(selectedStudio);
        console.log(`Selected specific studio value added`);
    }

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;

        sendGraphqlRequest(QueryNames.GET_GAME_EVENT_REPORT, {
            query: Queries.GetGameEventReport,
            variables: {}
        }).then((responseData: any) => {
            // console.log(`Use effect fired!`);
            setGameEventReportData(responseData.data);
            setGameEventReportFilteredData(responseData.data);
        })
    }, []);

    return (
        <>
            <Stack gap={3} p={3}>
                {/* Gameplay Reports Title */}
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography variant="h4" gutterBottom>
                        Gameplay Reports
                    </Typography>
                    <Button variant="outlined" startIcon={<Refresh />} label="Refresh" sx={{ height: customStyle.button.height }} />
                </Stack>

                {/* Filters  */}
                <Stack gap={2}>
                    <Paper variant="outlined" sx={{ p: customStyle.filterPaper.padding }}>
                        <Stack gap={2}>
                            <Typography variant="h6">
                                Filters
                            </Typography>

                            <Stack direction={'row'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Stack direction={'row'} gap={2}>
                                    <CustomDropdown
                                        data={{
                                            label: "Studio",
                                            value: studioFilterValue,
                                            options: studioOptions,
                                            handleChange: (e: any) => { handleStudioFilter(e.target.value) }
                                        }}
                                    />
                                    <CustomDropdown
                                        data={{
                                            label: "Game Platforms",
                                            value: gamePlatformFilterValue,
                                            options: gamePlatformFilteredOption,
                                            handleChange: (e: any) => { setGamePlatformFilterValue(e.target.value); }
                                        }}
                                    />
                                    <CustomDropdown
                                        data={{
                                            label: "Games",
                                            value: gameFilterValue,
                                            options: gameOptions,
                                            handleChange: (e: any) => { setGameFilterValue(e.target.value); }
                                        }}
                                    />
                                </Stack>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>

                {/* Reports Table */}
                <Paper variant="outlined">
                    <Stack>
                        <Typography variant="subtitle2" p={2}>Studio</Typography>
                        <Divider />
                        <Box>
                            {gameEventReportFilteredData?.map((studio: any) => (
                                <CustomAccordion
                                    key={studio.id}
                                    data={{
                                        summary: studio.name,
                                        summaryProps: { variant: "h6", fontWeight: "bold" },
                                        details: (
                                            <>
                                                {studio?.gamePlatforms?.map((platform: any) => (
                                                    platform.games &&
                                                    <CustomAccordion
                                                        key={platform.id}
                                                        data={{
                                                            summary: platform.name,
                                                            summaryProps: { variant: "subtitle1", fontWeight: "medium" },
                                                            details: (
                                                                <>
                                                                    {platform?.games?.map((game: any, index: any) => (
                                                                        <CustomAccordion
                                                                            key={game.id}
                                                                            data={{
                                                                                summary: game.name,
                                                                                summaryProps: { variant: "subtitle2" },
                                                                                tableProps: [
                                                                                    {
                                                                                        name: 'Game',
                                                                                        value: game.name
                                                                                    },
                                                                                    {
                                                                                        name: 'Total Player',
                                                                                        value: game.gameEventReport.playerCount
                                                                                    },
                                                                                    {
                                                                                        name: 'Average Session Time',
                                                                                        value: formatTime(game.gameEventReport.avgSessionTime)
                                                                                    },
                                                                                    {
                                                                                        name: 'Tutorial Completed Players',
                                                                                        value: game.gameEventReport.tutorialCompletedPlayerCount
                                                                                    },
                                                                                    {
                                                                                        name: 'IAP Purchased',
                                                                                        value: game.gameEventReport.totalIAPCompleted ?? 0
                                                                                    },
                                                                                    {
                                                                                        name: 'Ad Watched',
                                                                                        value: game.gameEventReport.totalAdCompleted ?? 0
                                                                                    },
                                                                                    {
                                                                                        name: 'Error Occurred',
                                                                                        value: game.gameEventReport.logData?.totalErrorOccurred ?? 0
                                                                                    },
                                                                                ],
                                                                                details: <GameEventReport
                                                                                    data={{
                                                                                        ...game.gameEventReport,
                                                                                        title: game.name,
                                                                                        gameId: game.id
                                                                                    }} />,
                                                                                buttons: [
                                                                                    {
                                                                                        name: "Open Players Report",
                                                                                        onClick: () => {
                                                                                            setSelectedGameId(game.id);
                                                                                            window.location.href = '/#/gameplay-reports/player-details'
                                                                                            setCanOpenPlayersReport(true);
                                                                                            console.log(`Button clicked for opening the player report`);
                                                                                        }
                                                                                    },
                                                                                ]
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                ))}
                                            </>
                                        ),
                                    }}
                                />
                            ))}
                        </Box>
                    </Stack>
                </Paper>
            </Stack >
        </>
    )
}
