import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Add, ArrowCircleRight, ArrowCircleRightOutlined, ArrowForward, ArrowForwardOutlined, Close, Done, PlayArrow, Search, Visibility } from '@mui/icons-material';
import { useDataSending, useDetailedView, useOpenVideo, usePlayTestsActions, useReviewNotes, useRolePublisher, useVideoUrl } from '../../store/play-tests/play-tests-store';
import { sendGraphqlRequest, sendRequest } from '../../common/utils';
import { GameRequestStatus, GRAPHQL_URL, HttpMethod, LAUNCH_GAME_URL, Platform, QueryNames, TOTAL_WEB_GAME_SUBMISSION_STEPS, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from '../../common/constants';
import { Queries } from '../../graphql/queries';
import { GameSubmissionDetailedView } from './game-submission-detailed-view';
import { useSubmitWebGameActions, useWebGameSubmissionDetails } from '../../store/submit-web-game/submit-web-game-store';
import { VideoPlayer } from '../../components/VideoPlayer';
import { notify } from '../../components/notify';
import { customStyle } from '../../common/styles';
import { useMetaCreativesActions } from '../../store/submit-web-game/meta-creatives-store';
import { useMetadataAndRatingsActions } from '../../store/submit-web-game/metadata-and-ratings-store';
import { usePlatformRequirementsActions } from '../../store/submit-web-game/platform-requirements-store';
import { useSelectPlatformActions } from '../../store/submit-web-game/select-platform-store';
import { useUploadWebBuildsActions } from '../../store/submit-web-game/upload-web-builds-store';
import { useWebGameSubmissionActions } from '../../store/submit-web-game/web-game-submission-store';
import { localStorageData } from '../../common/localStorage';

export const WebGameSubmissionPage = () => {
    const apiRef = useGridApiRef();
    let webGameSubmissionDetails = useWebGameSubmissionDetails();
    const reviewNotes = useReviewNotes();
    const detailedView = useDetailedView();
    const isDataSending = useDataSending();
    const openVideo = useOpenVideo();
    const isRolePublisher = useRolePublisher();
    const videoUrl = useVideoUrl();
    const { resetPlayTestsStore } = usePlayTestsActions();
    const { resetSubmitWebGameStore } = useSubmitWebGameActions();
    const { resetMetaCreativesStore } = useMetaCreativesActions();
    const { resetMetadataAndRatingsStore } = useMetadataAndRatingsActions();
    const { resetPlatformRequirementsStore } = usePlatformRequirementsActions();
    const { resetSelectPlatformStore } = useSelectPlatformActions();
    const { resetUploadWebBuildsStore } = useUploadWebBuildsActions();
    const { resetWebGameSubmissionStore } = useWebGameSubmissionActions();
    const { setDetailedView, setGameRequestDetails, setOpenVideo, setDataSending, setVideoUrl } = usePlayTestsActions();
    const { setWebGameSubmissionDetails, setCurrentSetupGameDetails } = useSubmitWebGameActions();
    const [filteredRows, setFilteredRows] = useState<any[]>([]);
    const [status, setStatus] = useState('All');
    const [data, setData] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState('');
    // const [launch, setLaunch] = useState(false);

    function handleDetailedView(gameRequestDetails: any) {
        console.log('Game Request Details: ', gameRequestDetails);
        setDetailedView(true);
        setGameRequestDetails(gameRequestDetails);
    }

    const isLaunchRequest = (gameRequestDetails: any) => {
        return gameRequestDetails.currentSetupStateIndex >= TOTAL_WEB_GAME_SUBMISSION_STEPS - 1;
    }

    const handleAcceptGameRequest = async (gameRequestDetails: any) => {
        let response: any;
        setDataSending(true);

        try {
            console.log("Accept Game Request");
            setDataSending(true);

            console.log("Accept Game Request");
            gameRequestDetails.status = GameRequestStatus.LAUNCHED;

            if (isLaunchRequest(gameRequestDetails)) {
                response = await sendRequest(HttpMethod.POST, LAUNCH_GAME_URL, {
                    name: gameRequestDetails.name,
                    studioId: gameRequestDetails.studioId,
                    platformList: gameRequestDetails.selectedPlatforms.map((platform: any) => platform.id),
                    gameRequestId: gameRequestDetails.id,
                    webGameRequestId: gameRequestDetails.webGameRequest.id,
                    status: GameRequestStatus.LAUNCHED,
                    reviewNotes: reviewNotes
                });
            } else {
                response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
                    name: gameRequestDetails.name,
                    gameRequestId: gameRequestDetails.id,
                    webGameRequestId: gameRequestDetails.webGameRequest.id,
                    reviewNotes: reviewNotes,
                    status: GameRequestStatus.ACCEPTED,
                    studioId: gameRequestDetails.studioId
                });
            }

            console.log("Game Request Response: ", response);
        } catch (err) {
            console.error(err);
            notify('Something went wrong!', { type: "error" });
        }

        setDetailedView(false);
        setDataSending(false);
    }

    const handleRejectGameRequest = async (gameRequestDetails: any) => {
        try {
            setDataSending(true);
            console.log("Reject Game Request");
            gameRequestDetails.status = "Rejected";

            let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
                name: gameRequestDetails.name,
                gameRequestId: gameRequestDetails.id,
                webGameRequestId: gameRequestDetails.webGameRequest.id,
                reviewNotes: reviewNotes,
                status: "Rejected",
                studioId: gameRequestDetails.studioId
            });

            console.log("Game Request Response: ", response);
        } catch (err) {
            console.error(err);
            notify('Something went wrong!', { type: 'error' });
        }

        setDetailedView(false);
        setDataSending(false);
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;

        if (searchValue === "") {
            setFilteredRows(status === 'All' ? data : filteredRows);
        } else {
            const filterData = data.filter((row) => row.name.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredRows(filterData);
        }

        setSearchValue(searchValue);
    }

    const filterData = () => {
        setFilteredRows(data.map((row: any) => row.status === status && row.name.toLowerCase().includes(searchValue.toLowerCase())))
    }

    const handleStatusChange = (event: any) => {
        const value = event.target.value;
        console.log('Status: ', value);
        if (value === "All") {
            setFilteredRows(searchValue === '' ? data : filteredRows);
        } else {
            const filteredRows = data.filter((row: any) => row.status === value);
            setFilteredRows(filteredRows);
        }

        setStatus(value);
    }

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Game',
            flex: 1,
        },
        ...(
            isRolePublisher ?
                [{
                    field: 'studio',
                    headerName: 'Studio',
                    flex: 1,
                }] : []
        ),
        {
            field: 'playableLinkUrl',
            headerName: 'Playable Link',
            flex: 1,
            renderCell: (params) => {
                return (
                    <Button
                        href={params.value}
                        target="_blank"
                        variant="outlined"
                        sx={{ textTransform: "none", color: "primary.main" }}
                        startIcon={<PlayArrow />}
                        disabled={isDataSending}
                    >
                        Play
                    </Button >
                )
            }
        },
        {
            field: 'gameplayVideoUrl',
            headerName: 'Gameplay Video',
            flex: 1,
            renderCell: (params: any) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                setVideoUrl(params.value);
                                setOpenVideo(true);
                            }}
                            variant="outlined"
                            sx={{ textTransform: "none", color: "primary.main" }}
                            startIcon={<PlayArrow />}
                            disabled={isDataSending}
                        >
                            Watch
                        </Button >
                    </>
                )
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => {
                let gameRequestStatus = params.value;
                let status = params.value;
                const canDisable = () => {
                    if (isDataSending) return true;

                    if (!isRolePublisher) {
                        if (gameRequestStatus === GameRequestStatus.ACCEPTED && params.row.currentSetupStateIndex < TOTAL_WEB_GAME_SUBMISSION_STEPS) {
                            return false;
                        }
                    } else if (isRolePublisher && gameRequestStatus === GameRequestStatus.PENDING) {
                        return false;
                    }
                    return true;
                }

                if (!isRolePublisher) {
                    if (params.row.currentSetupStateIndex === TOTAL_WEB_GAME_SUBMISSION_STEPS && gameRequestStatus !== GameRequestStatus.LAUNCHED) {
                        console.log('Review and Launched - ', params.row.currentSetupStateIndex);
                        if (gameRequestStatus === GameRequestStatus.PENDING) {
                            status = GameRequestStatus.WAITING_FOR_APPROVAL;
                        }
                        else {
                            status = GameRequestStatus.LAUNCHED;
                        }
                    }
                    else {
                        // if (params.value === GameRequestStatus.ACCEPTED) {
                        //     status = params.row.currentSetupStateName;
                        // } else 

                        if (params.value === GameRequestStatus.PENDING) {
                            status = GameRequestStatus.WAITING_FOR_APPROVAL;
                        }
                    }
                }

                return (
                    <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        disabled={canDisable()}
                        endIcon={status === GameRequestStatus.ACCEPTED && <ArrowCircleRightOutlined />}
                        onClick={() => {
                            if (isRolePublisher) {
                                handleDetailedView(params.row);
                            }

                            if (params.value === "Accepted") {
                                console.log("params.row", params.row);
                                setCurrentSetupGameDetails(params.row);
                                window.location.href = '/#/submit-web-game';
                            }
                        }}
                    >
                        {status}
                    </Button >
                )
            }
        },
        {
            field: 'createdAt',
            headerName: 'Creation Date',
            flex: 1,
            renderCell: (params: any) => new Intl.DateTimeFormat("en-IN").format(new Date(params.value))
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (params: any) => (
                <Stack direction="row" gap={1}>
                    <IconButton onClick={() => handleDetailedView(params.row)} disabled={isDataSending}>
                        <Visibility />
                    </IconButton>

                    {
                        isRolePublisher && (
                            params.row.status === GameRequestStatus.PENDING && (
                                <>
                                    <IconButton onClick={() => handleAcceptGameRequest(params.row)} disabled={isDataSending}>
                                        <Done color="success" />
                                    </IconButton>

                                    <IconButton onClick={() => handleRejectGameRequest(params.row)} disabled={isDataSending}>
                                        <Close color="error" />
                                    </IconButton>
                                </>
                            )
                        )
                    }
                </Stack>
            )
        },
    ];

    const resetAllWebGameSubmissionStates = () => {
        resetPlayTestsStore();
        resetSubmitWebGameStore();
        resetMetaCreativesStore();
        resetMetadataAndRatingsStore();
        resetPlatformRequirementsStore();
        resetSelectPlatformStore();
        resetUploadWebBuildsStore();
        resetWebGameSubmissionStore();
    }

    useEffect(() => {
        const fetchGameSubmissionRequests = async () => {
            const queryName = isRolePublisher ? QueryNames.GET_ALL_GAME_REQUESTS : QueryNames.GET_ALL_GAME_REQUEST_BY_STUDIO_ID;

            let response = await sendGraphqlRequest(queryName, {
                query: isRolePublisher ? Queries.GetAllGameRequests : Queries.GetAllGameRequestByStudioId,
                variables: isRolePublisher ? {} : { studioId: localStorage.getItem('studioId') ?? undefined }
            });

            console.log('Web data: ', queryName, response);
            let webGameSubmissionData = response.data.filter((row: any) => row.platform === Platform.WEB)

            setWebGameSubmissionDetails(webGameSubmissionData);
            setFilteredRows(webGameSubmissionData);
            setData(webGameSubmissionData);
        }

        fetchGameSubmissionRequests();
    }, []);

    return (
        <>
            {
                isDataSending ? (
                    <Box style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <CircularProgress size={50} />
                    </Box>
                ) :
                    (
                        <Box style={{ width: '100%' }}>
                            <Stack direction={'row'} sx={{ ...customStyle.stackStyle, justifyContent: 'space-between' }}>
                                <Stack direction={'row'} gap={2}>
                                    <TextField variant="outlined" placeholder="Search Game" sx={{ mb: 2 }}
                                        onChange={handleSearch}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false, // prevents label from shrinking automatically
                                            },
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Search />
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />

                                    {isRolePublisher && (
                                        <>
                                            <FormControl variant="outlined" sx={{ width: '250px' }}>
                                                <InputLabel>Status</InputLabel>
                                                <Select value={status} onChange={handleStatusChange} label="Status">
                                                    <MenuItem value="All">All</MenuItem>
                                                    <MenuItem value="Accepted">Accepted</MenuItem>
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="Rejected">Rejected</MenuItem>
                                                    <MenuItem value="Launched">Launched</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </>
                                    )
                                    }</Stack >

                                {!isRolePublisher && <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ textTransform: "none" }}
                                    startIcon={<Add />}
                                    onClick={() => {
                                        resetAllWebGameSubmissionStates();
                                        window.location.href = '/#/submit-web-game'
                                    }}
                                >
                                    New Game
                                </Button>}
                            </Stack>

                            <DataGrid
                                apiRef={apiRef}
                                rows={filteredRows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 20 }
                                    }
                                }}
                                pageSizeOptions={[5, 10, 20, 50, 100]}
                                sx={{
                                    border: 1, borderColor: 'divider',
                                    '& .MuiDataGrid-cell:focus': {
                                        outline: 'none',
                                    },
                                    '& .MuiDataGrid-cell:focus-within': {
                                        outline: 'none',
                                    },
                                }}
                                rowSelection={false}
                            // onRowClick={(params) => {
                            //     handleDetailedView(params.row);
                            //     console.log("params: ", params);
                            // }}
                            />
                            {detailedView && <GameSubmissionDetailedView />}
                            <VideoPlayer
                                open={openVideo}
                                onClose={() => setOpenVideo(false)}
                                videoUrl={videoUrl}
                            />
                        </Box >)
            }
        </>
    );
};
