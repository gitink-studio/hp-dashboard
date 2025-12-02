import { Box, Button, CircularProgress, Dialog, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material"
import { useDataSending, useDetailedView, useGameRequestDetails, usePlayTestsActions, useReviewNotes, useRolePublisher } from "../../store/play-tests/play-tests-store";
import { Close, Done, Download, Edit, PlayArrow } from "@mui/icons-material";
import { GameRequestStatus, HttpMethod, LAUNCH_GAME_URL, MobileGameSubmissionSetup, Platform, SDK_LAUNCH_URL, SDK_STATUS_UPDATE_URL, TOTAL_MOBILE_GAME_SUBMISSION_STEPS, TOTAL_WEB_GAME_SUBMISSION_STEPS, UPDATE_FB_AD_ACCOUNT_ID_URL, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from "../../common/constants";
import { sendRequest } from "../../common/utils";
import { notify } from "../../components/notify";
import { customStyle } from "../../common/styles";
import { useFacebookAppAccountId, useSDKDetailActions } from "../../store/sdk/sdk-details-store";
import { useEffect, useState } from "react";

export const GameSubmissionDetailedView = () => {
    let gameRequestDetails = useGameRequestDetails();
    let reviewNotes = useReviewNotes();
    let DetailedView = useDetailedView();
    let isDataSending = useDataSending();
    const facebookAdAccountId = useFacebookAppAccountId();
    const { setFacebookAdAccountId } = useSDKDetailActions();
    const [isEditButtonClicked, setEditButtonClicked] = useState(false);
    const [prevFBAdAccountId, setPrevFBAdAccountId] = useState('');
    const { setDetailedView: setDetailedView, setDataSending, setReviewNotes, setOpenVideo, setVideoUrl } = usePlayTestsActions();
    const { name, studio, playableLinkUrl, selectedPlatforms, status, platform, webGameRequest, androidOrIOSGameRequest, currentSetupStateIndex } = gameRequestDetails;
    let isPublisher = useRolePublisher();

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
    } = androidOrIOSGameRequest ?? {};

    const {
        facebookDetails,
    } = androidOrIOSGameRequest?.androidOrIOSGameRequestDetails ?? {}

    const {
        metaDataAndRatings,
    } = webGameRequest?.webGameRequestDetails ?? {};

    const handleCloseGameRequestDetails = () => {
        if (!isDataSending) {
            setDetailedView(false);
        }
    }

    const handleAcceptGameRequest = async () => {
        setDataSending(true);

        try {
            console.log("Accept Game Request");
            gameRequestDetails.status = "Accepted";
            console.log("Reviewer Notes: ", reviewNotes);
            let response: any;

            if (gameRequestDetails.platform === Platform.WEB) {
                if (isLaunchRequest()) {
                    response = await sendRequest(HttpMethod.POST, LAUNCH_GAME_URL, {
                        name: gameRequestDetails.name,
                        studioId: gameRequestDetails.studioId,
                        platformList: gameRequestDetails.selectedPlatforms,
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
                        status: GameRequestStatus.ACCEPTED,
                        reviewNotes: reviewNotes,
                    });
                }
            } else {
                if (isLaunchRequest()) {
                    response = await sendRequest(HttpMethod.POST, SDK_LAUNCH_URL, {
                        gameName: gameRequestDetails.name,
                        gameRequestId: gameRequestDetails.id,
                        androidOrIOSGameRequestId: gameRequestDetails.androidOrIOSGameRequest.id,
                        reviewNotes: reviewNotes,
                        status: GameRequestStatus.LAUNCHED,
                        studioId: gameRequestDetails.studioId,
                        platform: gameRequestDetails.platform
                    });
                } else {
                    response = await sendRequest(HttpMethod.POST, SDK_STATUS_UPDATE_URL, {
                        gameName: gameRequestDetails.name,
                        gameRequestId: gameRequestDetails.id,
                        androidOrIOSGameRequestId: gameRequestDetails.androidOrIOSGameRequest.id,
                        reviewNotes: reviewNotes,
                        status: GameRequestStatus.ACCEPTED,
                        studioId: gameRequestDetails.studioId
                    });

                }
            }

            console.log("Game Request Response: ", response);
        } catch (err) {
            console.error(err);
            notify('Something went wrong!', { type: "error" });
        }

        setDataSending(false);
        setDetailedView(false);
    }

    const handleRejectGameRequest = async () => {
        setDataSending(true);
        console.log("Reject Game Request");
        gameRequestDetails.status = "Rejected";
        console.log("Reviewer Notes: ", reviewNotes);

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
            gameRequestId: gameRequestDetails.id,
            webGameRequestId: gameRequestDetails.webGameRequest.id,
            status: "Rejected",
            reviewNotes: reviewNotes,
            studioId: gameRequestDetails.studioId
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDetailedView(false);
    }

    const isLaunchRequest = () => {
        if (webGameRequest !== null) {
            return gameRequestDetails.currentSetupStateIndex >= TOTAL_WEB_GAME_SUBMISSION_STEPS - 1;
        } else {
            return gameRequestDetails.currentSetupIndex >= TOTAL_MOBILE_GAME_SUBMISSION_STEPS - 1;
        }
    }

    const handleFacebookAdAccountId = async () => {
        setEditButtonClicked(false);
        setDataSending(true);

        try {
            const response = await sendRequest(HttpMethod.POST, UPDATE_FB_AD_ACCOUNT_ID_URL, {
                facebookDetailsId: facebookDetails.id,
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

    const getBuildName = (buildUrl: string) => {
        const platformIdIndex = -3;
        const splitUrl = buildUrl.split('/');
        let buildName: string = splitUrl.at(platformIdIndex) ?? '';

        selectedPlatforms.forEach((platform: any) => {
            if (platform.id === buildName) {
                buildName = platform.name + ' Build';
            }
        })

        return buildName;
    }

    const isWebPlatform = platform === 'Web';
    const canDisplayFacebookDetails = !isWebPlatform ? currentSetupStateIndex > MobileGameSubmissionSetup.FACEBOOK_SETUP : false;

    useEffect(() => {
        if (!isWebPlatform && facebookDetails?.adAccountId !== null) {
            setFacebookAdAccountId(facebookDetails.adAccountId);
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
                                {!isWebPlatform && <Box component={'img'} src={gameIconUrl} width={50} height={50} borderRadius={2} />}
                            </Stack>
                            <Typography variant="body2">Studio : {studio}</Typography>
                            <Typography variant="body2">Platform : {platform}</Typography>
                            {
                                isWebPlatform ? (
                                    <>
                                        <Typography variant="body2">Control Description : {webGameRequest.controlDescription}</Typography>
                                        {webGameRequest.additionalNotes && <Typography variant="body2">Additional Notes : {webGameRequest.additionalNotes}</Typography>}
                                        {
                                            isLaunchRequest() && (
                                                <>
                                                    <Typography variant="body2" >Selected Platforms : {gameRequestDetails.selectedPlatforms.map((platform: any) => platform.name).join(', ')}</Typography>
                                                    <Typography variant="body2" fontWeight={'bold'}>Builds </Typography>

                                                    <Stack direction={'row'} gap={2} sx={{ ...customStyle.stackStyle, mb: 2 }}>
                                                        {
                                                            webGameRequest.webGameRequestDetails.buildUrls.map((build: any) => {
                                                                return (
                                                                    <Button startIcon={<Download />} variant="outlined" size="small" href={build} sx={{ textTransform: 'none' }}>
                                                                        {getBuildName(build)}
                                                                    </Button>)
                                                            })
                                                        }
                                                    </Stack>

                                                    <Typography variant="body2" fontWeight={'bold'}>Metadata And Ratings</Typography>
                                                    <Typography variant="body2">Game Title: {metaDataAndRatings.name}</Typography>
                                                    <Typography variant="body2">Short Description: {metaDataAndRatings.shortDescription}</Typography>
                                                    <Typography variant="body2">Long Description: {metaDataAndRatings.longDescription}</Typography>
                                                    <Typography variant="body2">Genre: {metaDataAndRatings.genre.name}</Typography>
                                                    <Typography variant="body2">Sub Genre: {metaDataAndRatings.subGenre.name}</Typography>
                                                    <Typography variant="body2">Languages: {metaDataAndRatings.languages.map((language: any) => language.name).join(', ')}</Typography>
                                                    <Typography variant="body2">Age Ratings: {metaDataAndRatings.ageRatings}</Typography>
                                                    <Typography variant="body2">Regional Availability: {metaDataAndRatings.regionalAvailability.map((region: any) => region.name).join(', ')}</Typography>
                                                    <Typography variant="body2" component={'div'}>Privacy Policy Url: <a href={metaDataAndRatings.privacyPolicyUrl}>{metaDataAndRatings.privacyPolicyUrl}</a ></Typography>
                                                    <Typography variant="body2" component={'div'}>Support Url: <a href={metaDataAndRatings.privacyPolicyUrl}>{metaDataAndRatings.privacyPolicyUrl}</a ></Typography>
                                                </>
                                            )
                                        }

                                        <Typography variant="body2" >Status: {status}</Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body2">Store Status : {storeStatus.name}</Typography>
                                        {
                                            storeStatus.name === "Live" && (
                                                <>
                                                    {minOSCompatibility && <Typography variant="body2">Min OS Compatibility : {minOSCompatibility}</Typography>}
                                                </>
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
                                                    <Typography variant="body2" >App Id : {facebookDetails.appId} </Typography>
                                                    <Typography variant="body2" >Client Token : {facebookDetails.clientToken} </Typography>
                                                    <Typography variant="body2" >Referrer Decryption Key : {facebookDetails.referrerDecryptionKey} </Typography>
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
                                    </>
                                )
                            }

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
                                    {platform === 'Web' && <Button variant="outlined" href={playableLinkUrl} target="_blank" size="small" startIcon={<PlayArrow />} disabled={isDataSending}>Play Game</Button>}
                                    {platform !== 'Web' && storeUrl && <Button variant="outlined" href={storeUrl} target="_blank" size="small" startIcon={
                                        <img
                                            src="https://img.icons8.com/?size=100&id=L1ws9zn2uD01&format=png&color=000000"
                                            alt=""
                                            style={{ width: 20, height: 20 }}
                                        />
                                    } disabled={isDataSending}>Go to store</Button>}
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
