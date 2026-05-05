import React, { useEffect, useState } from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { Box, Button, InputAdornment, Stack, TextField } from '@mui/material';
import { Add, Search, } from '@mui/icons-material';
import { useDetailedView, useOpenVideo, useGameSubmissionActions, useVideoUrl } from '../../../store/game-submission/game-submission-store';
import { sendGraphqlRequest } from '../../../common/utils';
import { Platform, QueryNames, } from '../../../common/constants';
import { Queries } from '../../../graphql/queries';
import { VideoPlayer } from '../../../components/VideoPlayer';
import { customStyle } from '../../../common/styles';
import { useMobileGameSubmission, useMobileGameSubmissionActions } from '../../../store/mobile-game-submission/sdk-details-store';
import { useFacebookSetupActions } from '../../../store/mobile-game-submission/facebook-setup-store';
import { useSDKIntegrationActions } from '../../../store/mobile-game-submission/sdk-integration-store';
import { useStoreStepActions } from '../../../store/mobile-game-submission/store-step-store';
import { useTestSetupActions } from '../../../store/mobile-game-submission/test-setup-store';
import { useTestingTermActions } from '../../../store/mobile-game-submission/testing-terms-store';
import { useAuthActions } from '../../../store/auth/auth-store';
import { mobileGameSubmissionDatagridColumns } from './mobile-game-submission-datagrid-columns';
import { useMobileGameSubmissionFormActions } from '../../../store/mobile-game-submission/mobile-game-submission-form-store';
import { MobileGameSubmissionDetailedView } from './mobile-game-submission-detailed-view';

export const MobileGameSubmissionPage = () => {
    const apiRef = useGridApiRef();
    const mobileGameSubmissionDetails = useMobileGameSubmission();
    const detailedView = useDetailedView();
    const openVideo = useOpenVideo();
    const videoUrl = useVideoUrl();
    const { isRolePublisher } = useAuthActions();
    const { resetPlayTestsStore } = useGameSubmissionActions();
    const { resetFacebookSetupData } = useFacebookSetupActions();
    const { resetGameSubmissionData } = useMobileGameSubmissionFormActions();
    const { resetSDKIntegrationData } = useSDKIntegrationActions();
    const { resetStoreStepData } = useStoreStepActions();
    const { resetTestSetupData } = useTestSetupActions();
    const { resetTestingTermsData } = useTestingTermActions();
    const { resetSDKDetailsData, setMobileGameSubmissionDetails } = useMobileGameSubmissionActions();
    const { setOpenVideo, } = useGameSubmissionActions();
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
            const queryName = isRolePublisher() ? QueryNames.GET_ALL_GAME_REQUESTS : QueryNames.GET_ALL_GAME_REQUEST_BY_STUDIO_ID;

            let response = await sendGraphqlRequest(queryName, {
                query: isRolePublisher() ? Queries.GetAllGameRequests : Queries.GetAllGameRequestByStudioId,
                variables: isRolePublisher() ? {} : { studioId: localStorage.getItem('studioId') ?? undefined }
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
                <Stack direction={'row'} sx={{ ...customStyle.stackStyle, justifyContent: 'space-between' }}>
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

                    {!isRolePublisher() && <Button
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
                    columns={mobileGameSubmissionDatagridColumns}
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
                {detailedView && <MobileGameSubmissionDetailedView />}
                <VideoPlayer
                    open={openVideo}
                    onClose={() => setOpenVideo(false)}
                    videoUrl={videoUrl}
                />
            </Box >
        </>
    );
};
