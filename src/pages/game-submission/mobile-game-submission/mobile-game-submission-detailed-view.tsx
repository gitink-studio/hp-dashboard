import { useEffect, useMemo, useState } from "react";
import { useDataSending, useDetailedView, useGameRequestDetails, useGameSubmissionActions, useReviewNotes } from "../../../store/game-submission/game-submission-store";
import { useFacebookAppAccountId, useMobileGameSubmissionActions } from "../../../store/mobile-game-submission/sdk-details-store";
import { AuthenticationProvider } from "../../../auth-providers/auth-provider";
import { openDownloadPopupWindow, sendRequest, sendRequestForDownloadFiles } from "../../../common/utils";
import { DOWNLOAD_WEB_GAME_CREATIVES_DATA_URL, GameRequestStatus, HttpMethod, MobileGameSubmissionSetup, MOBILE_GAME_SUBMISSION_LAUNCH_URL, MOBILE_GAME_SUBMISSION_STATUS_UPDATE_URL, TOTAL_MOBILE_GAME_SUBMISSION_STEPS, UPDATE_FB_AD_ACCOUNT_ID_URL, DOWNLOAD_MOBILE_GAME_CREATIVES_DATA_URL } from "../../../common/constants";
import { notify } from "../../../components/notify";
import { Box, Button, CircularProgress, Dialog, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import { customStyle } from "../../../common/styles";
import { Edit, Close, Done, PlayArrow, Download } from "@mui/icons-material";


export const MobileGameSubmissionDetailedView = () => {
    let gameRequestDetails = useGameRequestDetails();
    let reviewNotes = useReviewNotes();
    let DetailedView = useDetailedView();
    let isDataSending = useDataSending();
    const facebookAdAccountId = useFacebookAppAccountId();
    const { setFacebookAdAccountId } = useMobileGameSubmissionActions();
    const [isEditButtonClicked, setEditButtonClicked] = useState(false);
    const [prevFBAdAccountId, setPrevFBAdAccountId] = useState('');
    const { setDetailedView: setDetailedView, setDataSending, setReviewNotes, setOpenVideo, setVideoUrl } = useGameSubmissionActions();
    const { name, studio, playableLinkUrl, status, platform, androidOrIOSGameRequest, currentSetupStateIndex } = gameRequestDetails;
    const isPublisher = AuthenticationProvider.isRolePublisher();
    const canDisplayFacebookDetails = currentSetupStateIndex > MobileGameSubmissionSetup.FACEBOOK_SETUP;

    const {
        controls,
        gameIconUrl,
        gameType,
        genre,
        mechanics,
        minOSCompatibility,
        optionalTags,
        storeStatus,
        storeUrl,
        androidOrIOSGameRequestDetails
    } = androidOrIOSGameRequest ?? {};

    const handleCloseGameRequestDetails = () => {
        if (!isDataSending) {
            setDetailedView(false);
        }
    }

    const handleDownload = async (data: any) => {
        const response = await sendRequestForDownloadFiles(DOWNLOAD_MOBILE_GAME_CREATIVES_DATA_URL, data);
        console.log(`Response: ${JSON.stringify(response)}`);
        if (!response) {
            notify(`Something went wrong`, { type: "error" });
            return;
        }

        openDownloadPopupWindow(response, 'marketings.zip')
    }

    const handleAcceptGameRequest = async () => {
        setDataSending(true);

        try {
            console.log("Accept Game Request");
            gameRequestDetails.status = "Accepted";
            console.log("Reviewer Notes: ", reviewNotes);
            let response: any;

            if (isLaunchRequest()) {
                console.log(`Launching... ${gameRequestDetails.platform}`);

                response = await sendRequest(HttpMethod.POST, MOBILE_GAME_SUBMISSION_LAUNCH_URL, {
                    gameName: gameRequestDetails.name,
                    gameRequestId: gameRequestDetails.id,
                    androidOrIOSGameRequestId: gameRequestDetails.androidOrIOSGameRequest.id,
                    reviewNotes: reviewNotes,
                    status: GameRequestStatus.LAUNCHED,
                    studioId: gameRequestDetails.studioId,
                    platform: gameRequestDetails.platform
                });
            } else {
                response = await sendRequest(HttpMethod.POST, MOBILE_GAME_SUBMISSION_STATUS_UPDATE_URL, {
                    gameName: gameRequestDetails.name,
                    gameRequestId: gameRequestDetails.id,
                    androidOrIOSGameRequestId: gameRequestDetails.androidOrIOSGameRequest.id,
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

        setDataSending(false);
        setDetailedView(false);
    }

    const handleRejectGameRequest = async (gameRequestDetails: any) => {
        try {
            setDataSending(true);
            console.log("Reject Game Request");
            gameRequestDetails.status = "Rejected";

            let response = await sendRequest(HttpMethod.POST, MOBILE_GAME_SUBMISSION_STATUS_UPDATE_URL, {
                gameRequestId: gameRequestDetails.id,
                androidOrIOSGameRequestId: gameRequestDetails.androidOrIOSGameRequest.id,
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

    const isLaunchRequest = () => {
        return gameRequestDetails.currentSetupStateIndex >= TOTAL_MOBILE_GAME_SUBMISSION_STEPS;
    }

    const handleFacebookAdAccountId = async () => {
        setEditButtonClicked(false);
        setDataSending(true);

        try {
            const response = await sendRequest(HttpMethod.POST, UPDATE_FB_AD_ACCOUNT_ID_URL, {
                facebookDetailsId: androidOrIOSGameRequestDetails.facebookDetails.id,
                facebookAdAccountId: facebookAdAccountId
            });

            console.log('FB Ad Account ID updated !', response);
        } catch (err) {
            notify('Something went wrong!', { type: 'error' });
            console.error(err);
        }

        setDataSending(false)
    }

    const getTitle = () => {
        return isLaunchRequest() ? 'Review Game for Launch' : 'Review Game';
    }

    useEffect(() => {
        if (androidOrIOSGameRequestDetails.facebookDetails?.adAccountId !== null) {
            setFacebookAdAccountId(androidOrIOSGameRequestDetails.facebookDetails?.adAccountId);
        }
    }, [])

    return (
        <>
            <Dialog open={DetailedView} fullWidth maxWidth="lg" >
                <Paper sx={{ p: 4 }}>
                    <Stack gap={4}>
                        <Stack gap={2}>
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} gap={2}>
                                <Typography variant="body1" fontWeight="bold">{isPublisher ? getTitle() : 'Review Game'} - {name}</Typography>
                                <Box component={'img'} src={`${gameIconUrl}?t=${Date.now()}`} width={50} height={50} borderRadius={2} />
                            </Stack>
                            <Typography variant="body2">Studio : {studio}</Typography>
                            <Typography variant="body2">Platform : {platform}</Typography>
                            <Typography variant="body2">Store Status : {storeStatus.name}</Typography>
                            {
                                (storeStatus.name === "Live" && minOSCompatibility) && (
                                    <Typography variant="body2">Min OS Compatibility : {minOSCompatibility}</Typography>
                                )
                            }

                            <Typography variant="body2">Genre : {genre.name}</Typography>
                            <Typography variant="body2">Control : {controls.map((data: any) => data.name).join(' ')}</Typography>
                            <Typography variant="body2">Mechanic : {mechanics.map((data: any) => data.name).join(' ')}</Typography>
                            <Typography variant="body2">Optional Tags : {optionalTags.length === 0 ? 'none' : optionalTags.map((data: any) => data.name).join(' ')}</Typography>
                            <Typography variant="body2">Game Type : {gameType.name}</Typography>
                            {(isPublisher || canDisplayFacebookDetails) && <Typography variant="body2" fontWeight={'bold'}>Facebook Details</Typography>}
                            {
                                canDisplayFacebookDetails && (
                                    <>
                                        <Typography variant="body2" >App Id : {androidOrIOSGameRequestDetails.facebookDetails.appId} </Typography>
                                        <Typography variant="body2" >Client Token : {androidOrIOSGameRequestDetails.facebookDetails.clientToken} </Typography>
                                        <Typography variant="body2" >Referrer Decryption Key : {androidOrIOSGameRequestDetails.facebookDetails.referrerDecryptionKey} </Typography>
                                    </>
                                )
                            }

                            {isPublisher && <Stack direction={'row'} gap={2}>
                                <Typography variant="body2">Ad Account ID: </Typography>
                                <TextField
                                    name="appId"
                                    variant="outlined"
                                    placeholder="Enter Facebook Ad Account ID"
                                    value={facebookAdAccountId}
                                    disabled={!isEditButtonClicked}
                                    onChange={(event) => {
                                        setFacebookAdAccountId(event.target.value);
                                    }}
                                    sx={{
                                        ...customStyle.textFieldSmallStyle,
                                        position: "relative",
                                        bottom: "5px",
                                        width: "460px",
                                    }}
                                    slotProps={{
                                        inputLabel: {
                                            shrink: false, // prevents label from shrinking automatically
                                        },
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {
                                                        !isEditButtonClicked ? (
                                                            <IconButton onClick={() => {
                                                                setPrevFBAdAccountId(facebookAdAccountId);
                                                                setEditButtonClicked(true)
                                                            }}>
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        ) : (
                                                            <>
                                                                <IconButton color="success" onClick={() => handleFacebookAdAccountId()}>
                                                                    <Done fontSize="small" />
                                                                </IconButton>
                                                                <IconButton color="error" onClick={() => {
                                                                    setFacebookAdAccountId(prevFBAdAccountId);
                                                                    setEditButtonClicked(false)
                                                                }}>
                                                                    <Close fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        )
                                                    }
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                />
                            </Stack>}

                            <Typography variant="body2">Status: {status}</Typography>
                            {
                                status === "Pending" && isPublisher &&
                                <Stack py={2}>
                                    <Typography width={150} variant="body2" fontWeight="bold" gutterBottom>Reviewer Notes</Typography>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Enter reviewer notes here"
                                        value={reviewNotes}
                                        multiline
                                        fullWidth
                                        onChange={(event) => setReviewNotes(event.target.value)}
                                    // value={storeUrl}
                                    // disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                    />
                                </Stack>
                            }

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Stack direction="row" gap={2} justifyContent="flex-start">
                                    {
                                        androidOrIOSGameRequestDetails?.creatives.length > 0 && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Download />}
                                                onClick={() => handleDownload(androidOrIOSGameRequestDetails.creatives[0].creativeUrls)}
                                                disabled={isDataSending}
                                            >
                                                Download Creatives
                                            </Button>
                                        )
                                    }
                                    {
                                        storeUrl &&
                                        <Button
                                            variant="outlined"
                                            href={storeUrl}
                                            target="_blank"
                                            size="small"
                                            startIcon={
                                                <img
                                                    src="https://img.icons8.com/?size=100&id=L1ws9zn2uD01&format=png&color=000000"
                                                    alt=""
                                                    style={{ width: 20, height: 20 }}
                                                />
                                            }
                                            disabled={isDataSending}>
                                            Go to store
                                        </Button>
                                    }

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<PlayArrow />}
                                        disabled={isDataSending}
                                        onClick={() => {
                                            setVideoUrl(gameRequestDetails.gameplayVideoUrl)
                                            setOpenVideo(true);
                                        }}
                                    >
                                        Watch Gameplay
                                    </Button>
                                </Stack>

                                <Stack direction="row" gap={2} justifyContent="flex-end">
                                    {status === "Pending" && isPublisher && (
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                size="small"
                                                startIcon={<Done />}
                                                onClick={handleAcceptGameRequest}
                                                disabled={isDataSending}
                                            >
                                                {isLaunchRequest() ? 'Launch' : 'Accept'}
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<Close />}
                                                onClick={handleRejectGameRequest}
                                                disabled={isDataSending}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCloseGameRequestDetails}
                                        disabled={isDataSending}
                                    >
                                        Close
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                        {isDataSending &&
                            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress size={50} />
                            </Box>}
                    </Stack>
                </Paper>
            </Dialog>
        </>
    )
}
