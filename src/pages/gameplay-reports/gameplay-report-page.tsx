import { Refresh } from "@mui/icons-material"
import { Box, Divider, Paper, Stack, Typography } from "@mui/material"
import { Button } from "react-admin"
import { customStyle } from "../../common/styles"
import { CustomDropdown } from "../../components/dropdown"
import { CustomSearch } from "../../components/search"
import { useGameEventReportActions, useGameEventReportData, useGameFilterValue, useGamePlatformFilterValue, useOpenPlayersReport, useSelectedGameId, useStudioFilterValue } from "../../store/gameplay-event-report/gameplay-event-report-store"
import { useEffect, useRef, useState } from "react"
import { cloneObject, formatTime, sendGraphqlRequest } from "../../common/utils"
import { QueryNames } from "../../common/constants"
import { Queries } from "../../graphql/queries"
import { CustomAccordion } from "../../components/accordion.component"
import { GameEventReport } from "./gameplay-report"
import { PlayerReport } from "./player-report"
import { useDefaultOptions, useGameOptions, useGamePlatformOptions, useStudioOptions } from "../../store/common/dropdown-options-store"

export const GameplayReportPage = () => {
    const gameEventReportData = useGameEventReportData();
    const studioOptions = useStudioOptions();
    const gamePlatformOptions = useGamePlatformOptions();
    const gameOptions = useGameOptions();
    const studioFilterValue = useStudioFilterValue();
    const gamePlatformFilterValue = useGamePlatformFilterValue();
    const gameFilterValue = useGameFilterValue();
    const defaultOptions = useDefaultOptions();
    const isFetched = useRef(false);
    const [gamePlatformFilteredOption, setGamePlatformFilteredOption] = useState([]);
    const [gameFilteredOption, setGameFilteredOption] = useState([]);
    const [gameEventReportFilteredData, setGameEventReportFilteredData] = useState([{}]);
    const [studioFilterData, setStudioFilterData] = useState<any>();
    const [gamePlatformFilterData, setGamePlatformFilterData] = useState<any>();

    const {
        setStudioFilterValue,
        setGamePlatformFilterValue,
        setGameFilterValue,
        setGameEventReportData,
        setCanOpenPlayersReport,
        setSelectedGameId
    } = useGameEventReportActions();

    const handleStudioFilter = (selectedStudio: string) => {
        if (selectedStudio === 'All') {
            setGameEventReportFilteredData(gameEventReportData);
            setStudioFilterData(gameEventReportData);
            setGamePlatformFilteredOption([]);
        } else {
            const eventData: any = [];
            const filteredEventData: any = gameEventReportData.find((data: any) => selectedStudio === data.name);
            const newOption = filteredEventData?.gamePlatforms
                ?.filter((data: any) => Array.isArray(data.games) && data.games.length > 0)
                ?.map((data: any) => ({
                    id: data.id,
                    name: data.name,
                })) ?? [];
            eventData.push(filteredEventData);
            setGamePlatformFilteredOption(newOption);
            setGameEventReportFilteredData(eventData);
            setStudioFilterData(filteredEventData);
        }

        setStudioFilterValue(selectedStudio);
    }

    const handleGamePlatformFilter = (selectedGamePlatform: string) => {
        console.log(`Selected game platform - ${selectedGamePlatform}`);

        if (selectedGamePlatform === 'All') {
            setGamePlatformFilterValue('All');
            setGameEventReportFilteredData([studioFilterData]);
            setGamePlatformFilterData(studioFilterData);
            setGameFilteredOption([]);
        } else {
            const eventData: any = [];
            const filteredEventData: any = studioFilterData.gamePlatforms?.find((data: any) => selectedGamePlatform === data.name);
            const newStudioFilterData: any = cloneObject(studioFilterData);
            newStudioFilterData.gamePlatforms = [filteredEventData];
            const newOption: any = filteredEventData?.games?.map((data: any) => {
                return {
                    id: data.id,
                    name: data.name
                }
            });
            eventData.push(newStudioFilterData);
            setGameFilteredOption(newOption);
            setGameEventReportFilteredData(eventData);
            setGamePlatformFilterData(newStudioFilterData);
        }

        setGamePlatformFilterValue(selectedGamePlatform);
    }

    const handleGameFilter = (selectedGame: string) => {
        console.log(`Selected game - ${selectedGame}`);

        if (selectedGame === 'All') {
            setGameFilterValue('All');
            setGameFilteredOption(defaultOptions);
            setGameEventReportFilteredData([gamePlatformFilterData]);
        } else {
            const eventData: any = [];
            console.log(`Game filtered data: ${JSON.stringify(gamePlatformFilterData.gamePlatforms[0].games.length)}`);
            const filteredEventData: any = gamePlatformFilterData.gamePlatforms[0].games?.find((data: any) => selectedGame === data.name);
            const newGamePlatformFilterData: any = cloneObject(gamePlatformFilterData);
            newGamePlatformFilterData.gamePlatforms[0].games = [filteredEventData];
            eventData.push(newGamePlatformFilterData);
            setGameEventReportFilteredData(eventData);
        }

        setGameFilterValue(selectedGame);
    }

    const handleClearAll = () => {
        setStudioFilterValue('All');
        setGamePlatformFilterValue('All');
        setGameFilterValue('All');
        setGameEventReportFilteredData(gameEventReportData);
        setGamePlatformFilteredOption([]);
        setGameFilteredOption([]);
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
                                            handleChange: (e: any) => { handleGamePlatformFilter(e.target.value); }
                                        }}
                                    />
                                    <CustomDropdown
                                        data={{
                                            label: "Games",
                                            value: gameFilterValue,
                                            options: gameFilteredOption,
                                            handleChange: (e: any) => { handleGameFilter(e.target.value); }
                                        }}
                                    />

                                    {studioFilterValue !== 'All' && <Button onClick={handleClearAll}>Clear All</Button>}
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
                                                                                        value: game.gameEventReport?.playerCount ?? 0
                                                                                    },
                                                                                    {
                                                                                        name: 'Average Session Time',
                                                                                        value: formatTime(game?.gameEventReport?.avgSessionTime)
                                                                                    },
                                                                                    {
                                                                                        name: 'Tutorial Completed Players',
                                                                                        value: game.gameEventReport?.tutorialCompletedPlayerCount
                                                                                    },
                                                                                    {
                                                                                        name: 'IAP Purchased',
                                                                                        value: game.gameEventReport?.totalIAPCompleted ?? 0
                                                                                    },
                                                                                    {
                                                                                        name: 'Ad Watched',
                                                                                        value: game.gameEventReport?.totalAdCompleted ?? 0
                                                                                    },
                                                                                    {
                                                                                        name: 'Error Occurred',
                                                                                        value: game.gameEventReport?.logData?.totalErrorOccurred ?? 0
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
                                                                                            window.location.href = '/#/gameplay-reports/player-details';
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
