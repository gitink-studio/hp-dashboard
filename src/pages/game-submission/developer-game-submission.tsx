import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { PlayArrow, Search, Visibility } from '@mui/icons-material';
import { useDataSending, useDetailedView, useOpenVideo, useGameSubmissionActions } from '../../store/game-submission/game-submission-store';
import { sendGraphqlRequest } from '../../common/utils';
import { GRAPHQL_URL, QueryNames, } from '../../common/constants';
import { Queries } from '../../graphql/queries';
import { GameSubmissionDetailedView } from './game-submission-detailed-view';
import { useSubmitWebGameActions, useWebGameSubmissionDetails } from '../../store/submit-web-game/submit-web-game-store';
import { VideoPlayer } from '../../components/VideoPlayer';

export const DeveloperGameSubmission = () => {
    const apiRef = useGridApiRef();
    let webGameSubmissionDetails = useWebGameSubmissionDetails();
    let DetailedView = useDetailedView();
    let isDataSending = useDataSending();
    const openVideo = useOpenVideo();
    const { setDetailedView: setDetailedView, setGameRequestDetails, setOpenVideo } = useGameSubmissionActions();
    const { setWebGameSubmissionDetails, setCurrentSetupGameDetails } = useSubmitWebGameActions();
    const [data, setData] = useState<any[]>([]);
    const [platform, setPlatform] = useState('All');
    const [filteredRows, setFilteredRows] = useState<any[]>([]);

    const handleDetailedView = (gameRequestDetails: any) => {
        console.log('Game Request Details: ', gameRequestDetails);
        setDetailedView(true);
        setGameRequestDetails(gameRequestDetails);
    }

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Game',
            flex: 1,
        },
        {
            field: 'platform',
            headerName: 'Platform',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Button
                    variant="text"
                    sx={{ textTransform: "none" }}
                    disabled={isDataSending || params.value !== "Accepted" || params.row.currentSetupStateIndex === 7}
                    onClick={() => {
                        if (params.value === "Accepted") {
                            console.log("params.row", params.row);
                            setCurrentSetupGameDetails(params.row);
                            window.location.href = '/#/submit-web-game';
                        }
                    }}
                >
                    {params.row.currentSetupStateIndex === 7 ? "Waiting for Approval" : params.value === "Accepted" ? params.row.currentSetupStateName : params.value === "Pending" ? "Waiting for Approval" : params.value}
                </Button >
            )
        },
        {
            field: 'gamePlayVideoUrl',
            headerName: 'Gameplay Video',
            flex: 1,
            renderCell: (params: any) => {
                const getVideoUrl = () => params.row.webGameRequest !== null ? params.row.webGameRequest.shortGameplayVideoUrl : params.row.androidOrIOSGameRequest.gamePlayVideoUrl;
                const gameplayVideoUrl = getVideoUrl();
                return (
                    <>
                        <Button
                            onClick={() => {
                                console.log("Url: ", gameplayVideoUrl);
                                setOpenVideo(true);
                            }}
                            variant="outlined"
                            sx={{ textTransform: "none", color: "primary.main" }}
                            startIcon={<PlayArrow />}
                            disabled={isDataSending}
                        >
                            Watch
                        </Button >
                        {openVideo &&
                            <VideoPlayer
                                open={true}
                                onClose={() => setOpenVideo(false)}
                                videoUrl={gameplayVideoUrl}
                            />}
                    </>
                )
            }
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
                </Stack>
            )
        },
    ];

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;

        if (searchValue === "") {
            setFilteredRows(webGameSubmissionDetails);
        } else {
            const filteredRows = webGameSubmissionDetails.filter((row) => row.name.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredRows(filteredRows);
        }
    }

    const handlePlatformChange = (event: any) => {
        let platform = event.target.value;
        setPlatform(platform);
    }

    useEffect(() => {
        const fetchGameSubmissionRequests = async () => {
            let response = await sendGraphqlRequest(QueryNames.GET_ALL_GAME_REQUEST_BY_STUDIO_ID, {
                query: Queries.GetAllGameRequestByStudioId,
                variables: { studioId: localStorage.getItem('studioId') ?? undefined }
            });

            setWebGameSubmissionDetails(response.data);
            setFilteredRows(response.data);
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
                            {DetailedView && <GameSubmissionDetailedView />}
                        </Box >)
            }
        </>
    );
};
