import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Add, Close, Done, PlayArrow, Search, Visibility } from '@mui/icons-material';
import { useDataSending, useDetailedView, useOpenVideo, usePlayTestsActions, useReviewNotes, useRolePublisher, useVideoUrl } from '../../store/play-tests/play-tests-store';
import { sendGraphqlRequest, sendRequest } from '../../common/utils';
import { GameRequestStatus, GRAPHQL_URL, HttpMethod, LAUNCH_GAME_URL, Platform, QueryNames, SDK_STATUS_UPDATE_URL, TOTAL_MOBILE_GAME_SUBMISSION_STEPS, TOTAL_WEB_GAME_SUBMISSION_STEPS, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from '../../common/constants';
import { Queries } from '../../graphql/queries';
import { GameSubmissionDetailedView } from './game-submission-detailed-view';
import { VideoPlayer } from '../../components/VideoPlayer';
import { notify } from '../../components/notify';
import { Styles } from '../../common/styles';
import { useMobileGameSubmissionDetails, useSDKDetailActions } from '../../store/sdk/sdk-details-store';
import { useFacebookSetupActions } from '../../store/sdk/facebook-setup-store';
import { useGameSubmissionActions } from '../../store/sdk/game-submission-store';
import { useSDKIntegrationActions } from '../../store/sdk/sdk-integration-store';
import { useStoreStepActions } from '../../store/sdk/store-step-store';
import { useTestSetupActions } from '../../store/sdk/test-setup-store';
import { useTestingTermActions } from '../../store/sdk/testing-terms-store';
import { platform } from 'os';

export const MobileGameSubmissionPage = () => {
    const apiRef = useGridApiRef();
    const mobileGameSubmissionDetails = useMobileGameSubmissionDetails();
    const reviewNotes = useReviewNotes();
    const detailedView = useDetailedView();
    const isDataSending = useDataSending();
    const openVideo = useOpenVideo();
    const isRolePublisher = useRolePublisher();
    const videoUrl = useVideoUrl();
    const { resetPlayTestsStore } = usePlayTestsActions();
    const { resetFacebookSetupData } = useFacebookSetupActions();
    const { resetGameSubmissionData } = useGameSubmissionActions();
    const { resetSDKIntegrationData } = useSDKIntegrationActions();
    const { resetStoreStepData } = useStoreStepActions();
    const { resetTestSetupData } = useTestSetupActions();
    const { resetTestingTermsData } = useTestingTermActions();
    const { resetSDKDetailsData, setMobileGameSubmissionDetails, setCurrentGameSetupDetails } = useSDKDetailActions();

    const { setDetailedView, setGameRequestDetails, setOpenVideo, setDataSending, setVideoUrl } = usePlayTestsActions();
    const [filteredRows, setFilteredRows] = useState<any[]>([]);

    const resetAllGameSubmissionStates = () => {
        resetSDKDetailsData();
        resetFacebookSetupData();
        resetGameSubmissionData();
        resetSDKIntegrationData();
        resetStoreStepData();
        resetTestSetupData();
        resetTestingTermsData();
        resetPlayTestsStore();
    }

    const isLaunchRequest = (gameRequestDetails: any) => {
        return gameRequestDetails.currentSetupStateIndex >= TOTAL_MOBILE_GAME_SUBMISSION_STEPS - 1;
    }

    const handleDetailedView = (gameRequestDetails: any) => {
        console.log('Game Request Details: ', gameRequestDetails);
        setDetailedView(true);
        setGameRequestDetails(gameRequestDetails);
    }

    const handleAcceptGameRequest = async (gameRequestDetails: any) => {
        setDataSending(true);
        console.log('Mobile game request: ', gameRequestDetails);
        try {
            console.log("Accept Game Request");
            setDataSending(true);

            if (isLaunchRequest(gameRequestDetails)) {
                let response = await sendRequest(HttpMethod.POST, LAUNCH_GAME_URL, {
                    name: gameRequestDetails.name,
                    studioId: gameRequestDetails.studioId,
                    platformList: gameRequestDetails.selectedPlatforms.map((platform: any) => platform.id),
                    gameRequestId: gameRequestDetails.id,
                    webGameRequestId: gameRequestDetails.webGameRequest.id,
                    status: GameRequestStatus.LAUNCHED,
                    reviewNotes: reviewNotes
                });

                console.log("Game Request Response: ", response);
            } else {
                console.log("Accept Game Request");
                gameRequestDetails.status = "Accepted";
                let response = await sendRequest(HttpMethod.POST, SDK_STATUS_UPDATE_URL, {
                    gameName: gameRequestDetails.name,
                    gameRequestId: gameRequestDetails.id,
                    androidOrIOSGameRequestId: gameRequestDetails.androidOrIOSGameRequest.id,
                    reviewNotes: reviewNotes,
                    status: GameRequestStatus.ACCEPTED,
                    studioId: gameRequestDetails.studioId,
                    currentSetupIndex: gameRequestDetails.currentSetupStateIndex
                });
                console.log("Game Request Response: ", response);
            }
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
                gameRequestId: gameRequestDetails.id,
                webGameRequestId: gameRequestDetails.webGameRequest.id,
                reviewNotes: reviewNotes,
                status: "Rejected"
            });

            console.log("Game Request Response: ", response);
        } catch (err) {
            console.error(err);
            notify('Something went wrong!', { type: 'error' });
        }

        setDetailedView(false);
        setDataSending(false);
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
                const totalSteps = params.row.platform === Platform.WEB ? TOTAL_WEB_GAME_SUBMISSION_STEPS : TOTAL_MOBILE_GAME_SUBMISSION_STEPS;

                const canDisable = () => {
                    if (isDataSending) return true;

                    if (!isRolePublisher) {
                        if (gameRequestStatus === GameRequestStatus.ACCEPTED && params.row.currentSetupStateIndex < totalSteps) {
                            return false;
                        }
                    } else if (isRolePublisher && gameRequestStatus === GameRequestStatus.PENDING) {
                        return false;
                    }

                    return true;
                }

                if (!isRolePublisher) {
                    if (params.row.currentSetupStateIndex === totalSteps) {
                        status = GameRequestStatus.WAITING_FOR_APPROVAL;
                    }
                    else {
                        if (params.value === GameRequestStatus.ACCEPTED) {
                            status = params.row.currentSetupStateName;
                        } else if (params.value === GameRequestStatus.PENDING) {
                            status = GameRequestStatus.WAITING_FOR_APPROVAL;
                        }
                    }
                }

                return (
                    <Button
                        variant="text"
                        sx={{ textTransform: "none" }}
                        disabled={canDisable()}
                        onClick={() => {
                            if (isRolePublisher) {
                                handleDetailedView(params.row);
                            }

                            if (params.value === "Accepted") {
                                console.log("params.row", params.row);
                                setCurrentGameSetupDetails(params.row);
                                window.location.href = '/#/sdk';
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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;

        if (searchValue === "") {
            setFilteredRows(mobileGameSubmissionDetails);
        } else {
            const filteredRows = mobileGameSubmissionDetails.filter((row) => row.name.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredRows(filteredRows);
        }
    }

    useEffect(() => {
        const fetchGameSubmissionRequests = async () => {
            const queryName = isRolePublisher ? QueryNames.GET_ALL_GAME_REQUESTS : QueryNames.GET_ALL_GAME_REQUEST_BY_STUDIO_ID;

            let response = await sendGraphqlRequest(GRAPHQL_URL, queryName, {
                query: isRolePublisher ? Queries.GetAllGameRequests : Queries.GetAllGameRequestByStudioId,
                variables: isRolePublisher ? {} : { studioId: localStorage.getItem('studioId') ?? undefined }
            });

            let mobileGameSubmissionData = response.data.filter((row: any) => row.platform === Platform.ANDROID || row.platform === Platform.IOS)
            console.log('Mobile data: ', queryName, mobileGameSubmissionData);

            setMobileGameSubmissionDetails(mobileGameSubmissionData);
            setFilteredRows(mobileGameSubmissionData);
        }

        fetchGameSubmissionRequests();
    }, []);

    return (
        <>
            <Box style={{ width: '100%' }}>
                <Stack direction={'row'} sx={{ ...Styles.stackStyle, justifyContent: 'space-between' }}>
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

                    {!isRolePublisher && <Button
                        variant="outlined"
                        color="primary"
                        sx={{ textTransform: "none" }}
                        startIcon={<Add />}
                        onClick={() => {
                            resetAllGameSubmissionStates();
                            window.location.href = '/#/sdk'
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
            </Box >
        </>
    );
};
