import { Refresh } from "@mui/icons-material"
import { Box, Chip, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material"
import { Button } from "react-admin"
import { customStyle } from "../../common/styles"
import { CustomDropdown } from "../../components/dropdown"
import { useDateRangeFilterValue, useGameEventReportActions, useGameEventReportData, useGameFilterValue, useGamePlatformFilterValue, useOpenPlayersReport, useSelectedGameId, useStudioFilterValue } from "../../store/gameplay-event-report/gameplay-event-report-store"
import { useEffect, useRef, useState } from "react"
import { cloneObject, convertToUTCBoundary, formatTime, getISODateStringByDate, getISODateStringByDay, sendGraphqlRequest } from "../../common/utils"
import { QueryNames } from "../../common/constants"
import { Queries } from "../../graphql/queries"
import { CustomAccordion } from "../../components/accordion.component"
import { GameEventReport } from "./gameplay-report"
import { useDateRangeOptions, useDefaultOptions, useStudioOptions } from "../../store/common/dropdown-options-store"
import { CustomDatePicker } from "../../components/custom-date-picker"
import { useDateRangeActions, useDateRangeOpenState, useEndDate, useStartDate } from "../../store/common/date-range-store"
import { useLocation } from "react-router"

export const GameplayReportPage = () => {
    const gameEventReportData = useGameEventReportData();
    const studioOptions = useStudioOptions();
    const studioFilterValue = useStudioFilterValue();
    const gamePlatformFilterValue = useGamePlatformFilterValue();
    const gameFilterValue = useGameFilterValue();
    const dateRangeFilterValue = useDateRangeFilterValue();
    const dateRangeOptions = useDateRangeOptions();
    const dateRangeOpenState = useDateRangeOpenState();
    const startDate = useStartDate();
    const endDate = useEndDate();
    const defaultOptions = useDefaultOptions();
    const isFetched = useRef(false);
    const [gamePlatformFilteredOption, setGamePlatformFilteredOption] = useState([]);
    const [gameFilteredOption, setGameFilteredOption] = useState([]);
    const [gameEventReportFilteredData, setGameEventReportFilteredData] = useState([{}]);
    const [studioFilterData, setStudioFilterData] = useState<any>();
    const [gamePlatformFilterData, setGamePlatformFilterData] = useState<any>();
    const { setOpenState } = useDateRangeActions();
    const location = useLocation();

    const {
        setStudioFilterValue,
        setGamePlatformFilterValue,
        setGameFilterValue,
        setDateRangeFilterValue,
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

    const getStartAndEndDate = (selectedDate: string) => {
        const date: any = {};

        switch (selectedDate) {
            case '0':
            case '1':
                date.startDate = convertToUTCBoundary(getISODateStringByDay(selectedDate));
                date.endDate = convertToUTCBoundary(getISODateStringByDay(selectedDate), true);
                console.log(`selected date ${JSON.stringify(date)}`);
                return date;
            case '7':
            case '14':
            case '30':
                date.startDate = convertToUTCBoundary(getISODateStringByDay(selectedDate));
                date.endDate = convertToUTCBoundary(getISODateStringByDay('0'), true);
                console.log(`selected date ${JSON.stringify(date)}`);
                return date;
            case 'custom':
                date.startDate = convertToUTCBoundary(getISODateStringByDate(startDate));
                date.endDate = convertToUTCBoundary(getISODateStringByDate(endDate), true);
                console.log(`selected date ${JSON.stringify(date)}`);
                return date;
        }
    }

    const fetchAndSetGameEventReportByDateRange = async (selectedDate: any) => {
        const date = getStartAndEndDate(selectedDate);
        console.log(`Fetching game event report...`);

        isFetched.current = false;
        const responseData = await sendGraphqlRequest(QueryNames.GET_GAME_EVENT_REPORT_BY_DATE_RANGE, {
            query: Queries.GetGameEventReportByDateRange,
            variables: {
                startDate: date.startDate,
                endDate: date.endDate
            }
        })

        console.log(`Game event report fetched by date range ! `);
        setGameEventReportData(responseData.data);
        setGameEventReportFilteredData(responseData.data);
        isFetched.current = true;
    }

    const handleDateRangeFilter = async (selectedDate: any) => {
        console.log(`Selected date range: ${selectedDate}`);
        const isCustomDate = selectedDate === 'custom';
        setOpenState(isCustomDate);
        setDateRangeFilterValue(selectedDate);

        if (!isCustomDate) {
            fetchAndSetGameEventReportByDateRange(selectedDate);
        }
    }

    const handleClearAll = () => {
        setStudioFilterValue('All');
        setGamePlatformFilterValue('All');
        setGameFilterValue('All');
        setGameEventReportFilteredData(gameEventReportData);
        setGamePlatformFilteredOption([]);
        setGameFilteredOption([]);
        setDateRangeFilterValue(0);
    }

    const getDate = () => {
        if (dateRangeFilterValue.toString() === 'custom') {
            return `Report generated from ${startDate} to ${endDate}`;
        }

        let date = new Date();
        date.setDate(new Date().getDate() - dateRangeFilterValue);

        return `Report generated on ${date.toLocaleDateString()}`;
    }

    useEffect(() => {
        fetchAndSetGameEventReportByDateRange('0');
        handleClearAll();
    }, [location.pathname]);

    return (
        <>
            <Stack gap={3} p={3}>
                {/* Gameplay Reports Title */}
                <Stack direction={'row'} justifyContent={'space-between'}>
                    <Stack>
                        <Typography variant="h4" >Gameplay Reports</Typography>
                    </Stack>
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
                                    <CustomDropdown
                                        data={{
                                            label: "Date Range",
                                            value: dateRangeFilterValue,
                                            options: dateRangeOptions,
                                            isDateRange: true,
                                            handleChange: (e: any) => { handleDateRangeFilter(e.target.value); }
                                        }}
                                    />
                                    {(studioFilterValue !== 'All' || dateRangeFilterValue !== 0) && <Button onClick={handleClearAll}>Clear All</Button>}
                                </Stack>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>

                {isFetched.current
                    ? <Paper variant="outlined">
                        <Stack>
                            <Stack p={2}>
                                <Typography variant="subtitle2">Studio</Typography>
                                <Typography variant="caption">{getDate()}</Typography>
                            </Stack>
                            <Divider />
                            <Box>
                                {gameEventReportFilteredData?.map((studio: any) => (
                                    (studio?.gamePlatforms && studio?.gamePlatforms.length > 0) && <CustomAccordion
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
                        {dateRangeOpenState && <CustomDatePicker data={{
                            callback: () => fetchAndSetGameEventReportByDateRange(dateRangeFilterValue)
                        }} />}
                    </Paper>
                    : <CircularProgress />
                }
            </Stack >
        </>
    )
}
