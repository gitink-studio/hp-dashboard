import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Close, Done, PlayArrow, PlayArrowRounded, Search, Visibility } from '@mui/icons-material';
import { Styles } from '../../common/styles';
import { useDataSending, useDisplayGamePostSubmissionDetails, useDisplayGameRequestDetails, useGameRequestDetails, useGameRequests, usePlayTestsActions } from '../../store/play-tests/play-tests-store';
import { sendGraphqlRequest, sendRequest } from '../../common/utils';
import { GRAPHQL_URL, HttpMethod, LAUNCH_GAME_URL, QueryNames, ROOT_URL, TOTAL_WEB_GAME_SUBMISSION_STEPS, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from '../../common/constants';
import { Queries } from '../../graphql/queries';
import { GameRequestDetailedView } from './game-request-detailed-view';
import { localStorageData } from '../../common/localStorage';
import { GamePostSubmissionDetailedView } from './game-post-submission-detailed-view';

export const GamePostSubmission = () => {
    const apiRef = useGridApiRef();
    let gameRequests = useGameRequests();
    let displayGameRequestDetails = useDisplayGameRequestDetails();
    let displayGamePostSubmissionDetails = useDisplayGamePostSubmissionDetails();
    let isDataSending = useDataSending();
    const [filteredRows, setFilteredRows] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [status, setStatus] = useState<string>("All");
    const { setGameRequests, setGameRequestDetails, setDataSending, setDisplayGamePostSubmissionDetails } = usePlayTestsActions();

    const handleAcceptGameRequest = async (gameRequestDetails: any) => {
        setDataSending(true);
        console.log("Accept Game Request");
        gameRequestDetails.status = "Accepted";

        console.log("Studio ID: ", localStorageData.studioId);
        console.log("Game Request Details: ", gameRequestDetails);

        let response = await sendRequest(HttpMethod.POST, LAUNCH_GAME_URL, {
            name: gameRequestDetails.name,
            studioId: localStorageData.studioId,
            platformList: gameRequestDetails.selectedPlatforms,
            gameRequestId: gameRequestDetails.id,
            webGameRequestId: gameRequestDetails.webGameRequest.id,
            status: "Accepted"
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDisplayGamePostSubmissionDetails(false);
    }

    const handleRejectGameRequest = async (gameRequestDetails: any) => {
        setDataSending(true);
        console.log("Reject Game Request");
        gameRequestDetails.status = "Rejected";

        let response = await sendRequest(HttpMethod.POST, LAUNCH_GAME_URL, {
            name: gameRequestDetails.name,
            studioId: gameRequestDetails.studioId,
            platformList: gameRequestDetails.selectedPlatforms,
            gameRequestId: gameRequestDetails.id,
            webGameRequestId: gameRequestDetails.webGameRequest.id,
            status: "Rejected"
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDisplayGamePostSubmissionDetails(false);
    }

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

    const columns: GridColDef[] = [
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
            field: 'platform',
            headerName: 'Platform',
            flex: 1,
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
                    <IconButton onClick={() => handleDisplayGamePostSubmissionDetails(params.row)} disabled={isDataSending}>
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
                        )}
                </Stack>
            )
        },
    ];


    const handleDisplayGamePostSubmissionDetails = (gameRequestDetails: any) => {
        console.log("View Details: ", gameRequestDetails);
        setDisplayGamePostSubmissionDetails(true);
        setGameRequestDetails(gameRequestDetails);
    }

    useEffect(() => {
        if (gameRequests.length === 0 || data.length === 0 || filteredRows.length === 0) {
            const fetchGameSubmissionRequests = async () => {
                let response = await sendGraphqlRequest(GRAPHQL_URL, QueryNames.GET_ALL_GAME_REQUESTS, {
                    query: Queries.GetAllGameRequests,
                    variables: {}
                });

                setGameRequests(response.data);
                setData(gameRequests.filter((row) => row.currentSetupStateIndex >= TOTAL_WEB_GAME_SUBMISSION_STEPS));
                setFilteredRows(gameRequests.filter((row) => row.currentSetupStateIndex >= TOTAL_WEB_GAME_SUBMISSION_STEPS));
            }

            fetchGameSubmissionRequests();
        }
    }, []);

    return (
        <>
            {
                // gameRequests.length === 0 ? (
                //     <Typography variant="body1" color="text.secondary">No game submissions found</Typography>
                // ) :
                isDataSending ? (
                    <Box style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <CircularProgress size={50} />
                    </Box>
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
                                    paginationModel: { pageSize: 5 }
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
                        //     handleDisplayGameRequestDetails(params.row);
                        //     console.log("params: ", params);
                        // }}
                        />

                        {displayGamePostSubmissionDetails && <GamePostSubmissionDetailedView />}
                    </Box>)
            }
        </>
    );
};