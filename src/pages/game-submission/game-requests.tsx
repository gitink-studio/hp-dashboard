import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Android, Close, Done, PlayArrow, PlayArrowRounded, Search, Visibility } from '@mui/icons-material';
import { customStyle } from '../../common/styles';
import { useDataSending, useDetailedView, useGameRequestDetails, useGameRequests, useOpenVideo, useGameSubmissionActions } from '../../store/game-submission/game-submission-store';
import { sendGraphqlRequest, sendRequest } from '../../common/utils';
import { GRAPHQL_URL, HttpMethod, QueryNames, ROOT_URL, TOTAL_WEB_GAME_SUBMISSION_STEPS, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from '../../common/constants';
import { Queries } from '../../graphql/queries';
import { GameSubmissionDetailedView } from './game-submission-detailed-view';
import { VideoPlayer } from '../../components/VideoPlayer';

export const GameRequests = () => {
    const apiRef = useGridApiRef();
    let gameRequests = useGameRequests();
    let gameRequestDetails = useGameRequestDetails();
    let DetailedView = useDetailedView();
    let isDataSending = useDataSending();
    const openVideo = useOpenVideo();
    const [data, setData] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [status, setStatus] = useState<string>("All");
    const [filteredRows, setFilteredRows] = useState<any[]>([]);
    const { setGameRequests, setDetailedView: setDetailedView, setGameRequestDetails, setDataSending, setOpenVideo } = useGameSubmissionActions();
    let isPublisher = localStorage.getItem("userRole")?.toLowerCase().includes("publisher");

    const handleAcceptGameRequest = async (gameRequestDetails: any) => {
        setDataSending(true);
        console.log("Accept Game Request");
        gameRequestDetails.status = "Accepted";

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
            gameRequestId: gameRequestDetails.id,
            webGameRequestId: gameRequestDetails.webGameRequest.id,
            status: "Accepted",
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDetailedView(false);
    }

    const handleRejectGameRequest = async (gameRequestDetails: any) => {
        setDataSending(true);
        console.log("Reject Game Request");
        gameRequestDetails.status = "Rejected";

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
            gameRequestId: gameRequestDetails.id,
            webGameRequestId: gameRequestDetails.webGameRequest.id,
            status: "Rejected"
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDetailedView(false);
    }

    const columns: GridColDef[] = [
        {
            field: 'platform',
            headerName: 'Platform',
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Game',
            flex: 1,
        },
        {
            field: 'studio',
            headerName: 'Studio',
            flex: 1,
        },
        {
            field: 'playableLinkUrl',
            headerName: 'Link',
            flex: 1,
            renderCell: (params) => {
                const isWebPlatform = params.row.webGameRequest !== null;
                const androidOrIOSGameRequestDetails = params.row.androidOrIOSGameRequest;
                return (
                    <>
                        {isWebPlatform ? (
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
                        ) :
                            (androidOrIOSGameRequestDetails.storeUrl !== '' && <Button
                                href={androidOrIOSGameRequestDetails.storeUrl}
                                target="_blank"
                                variant="outlined"
                                sx={{ textTransform: "none", color: "primary.main" }}
                                startIcon={
                                    <img
                                        src="https://img.icons8.com/?size=100&id=L1ws9zn2uD01&format=png&color=000000"
                                        alt=""
                                        style={{ width: 20, height: 20 }}
                                    />
                                }
                                disabled={isDataSending}
                            >
                                Go to Store
                            </Button >)
                        }

                    </>
                )
            }
        },
        {
            field: 'gamePlayVideoUrl',
            headerName: 'Gameplay Video',
            flex: 1,
            renderCell: (params) => {
                const getVideoUrl = () => params.row.webGameRequest !== null ? params.row.webGameRequest.shortGameplayVideoUrl : params.row.androidOrIOSGameRequest.gamePlayVideoUrl;
                return (
                    <>
                        <Button
                            onClick={() => {
                                console.log("Url: ", getVideoUrl());
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
                                videoUrl={getVideoUrl()}
                            />
                        }
                    </>
                )
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
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
                        params.row.status === "Pending" && (
                            <>
                                <IconButton onClick={() => handleAcceptGameRequest(params.row)} disabled={isDataSending}>
                                    <Done color="success" />
                                </IconButton>

                                <IconButton onClick={() => handleRejectGameRequest(params.row)} disabled={isDataSending}>
                                    <Close color="error" />
                                </IconButton>
                            </>
                        )
                    }
                </Stack>
            )
        },
    ];

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;

        if (searchValue === "") {
            setFilteredRows(data);
        } else {
            const filteredRows = data.filter((row) => row.name.toLowerCase().includes(searchValue.toLowerCase()));
            setFilteredRows(filteredRows);
        }

        setSearchValue(searchValue);
    }

    const handleStatusChange = (event: any) => {
        const value = event.target.value;

        if (value === "All") {
            setFilteredRows(searchValue === '' ? data : filteredRows);
        } else {
            const filteredRows = data.filter((row) => row.status === value);
            setFilteredRows(filteredRows);
        }

        setStatus(value);
    }

    const handleDetailedView = (gameRequestDetails: any) => {
        setDetailedView(true);
        setGameRequestDetails(gameRequestDetails);
    }

    useEffect(() => {
        const fetchGameSubmissionRequests = async () => {
            let response = await sendGraphqlRequest(QueryNames.GET_ALL_GAME_REQUESTS, {
                query: Queries.GetAllGameRequests,
                variables: {}
            });

            setGameRequests(response.data);
            setData(response.data.filter((row: any) => row.currentSetupStateIndex < TOTAL_WEB_GAME_SUBMISSION_STEPS));
            setFilteredRows(response.data.filter((row: any) => row.currentSetupStateIndex < TOTAL_WEB_GAME_SUBMISSION_STEPS));
        }

        fetchGameSubmissionRequests();
    }, []);

    return (
        <>
            {
                isDataSending ? (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    }}>
                        <CircularProgress size={50} />
                    </div>
                ) :
                    (<Box style={{ width: '100%' }}>
                        <Stack direction="row" gap={2}>
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
                            <FormControl variant="outlined" sx={{ width: '250px' }}>
                                <InputLabel>Status</InputLabel>
                                <Select value={status} onChange={handleStatusChange} label="Status">
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Accepted">Accepted</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
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

                        {DetailedView && <GameSubmissionDetailedView />}
                    </Box >)
            }
        </>
    );
};
