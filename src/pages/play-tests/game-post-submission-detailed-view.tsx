import { Box, Button, CircularProgress, Dialog, Paper, Stack, TextField, Typography } from "@mui/material"
import { useDataSending, useDisplayGamePostSubmissionDetails, useDisplayGameRequestDetails, useGameRequestDetails, usePlayTestsActions, useReviewNotes } from "../../store/play-tests/play-tests-store";
import { Close, Done, PlayArrow } from "@mui/icons-material";
import { Styles } from "../../common/styles";
import { HttpMethod, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from "../../common/constants";
import { sendRequest } from "../../common/utils";

export const GamePostSubmissionDetailedView = () => {
    let gameRequestDetails = useGameRequestDetails();
    let reviewNotes = useReviewNotes();
    let displayGamePostSubmissionDetailedView = useDisplayGamePostSubmissionDetails();
    let isDataSending = useDataSending();
    const { setDisplayGamePostSubmissionDetails, setDataSending, setReviewNotes } = usePlayTestsActions();
    const { name, studio, playableLinkUrl, gamePlayVideoUrl, status, platform, webGameRequest, androidAndIOSGameRequest } = gameRequestDetails;
    let isPublisher = localStorage.getItem("userRole")?.toLowerCase().includes("publisher");

    const handleCloseGamePostSubmissionDetails = () => {
        if (!isDataSending) {
            setDisplayGamePostSubmissionDetails(false);
        }
    }

    const handleAcceptGameRequest = async () => {
        setDataSending(true);
        console.log("Accept Game Request");
        gameRequestDetails.status = "Accepted";
        console.log("Reviewer Notes: ", reviewNotes);

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
            id: webGameRequest.id,
            status: "Accepted",
            reviewNotes: reviewNotes
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDisplayGamePostSubmissionDetails(false);
    }

    const handleRejectGameRequest = async () => {
        setDataSending(true);
        console.log("Reject Game Request");
        gameRequestDetails.status = "Rejected";
        console.log("Reviewer Notes: ", reviewNotes);

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
            id: webGameRequest.id,
            status: "Rejected",
            reviewNotes: reviewNotes
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDisplayGamePostSubmissionDetails(false);
    }

    return (
        <>
            <Dialog open={displayGamePostSubmissionDetailedView} onClose={handleCloseGamePostSubmissionDetails} fullWidth maxWidth="lg" >
                <Paper sx={{ p: 4 }}>
                    <Stack gap={4}>
                        <Stack gap={2}>
                            <Typography variant="body1" fontWeight="bold">Review Game - {name}</Typography>
                            <Typography variant="body2">Studio: {studio}</Typography>
                            <Typography variant="body2">Platform: {platform}</Typography>
                            {
                                platform === "Web" ? (
                                    <>

                                        <Typography variant="body2">Control Description: {webGameRequest.controlDescription}</Typography>
                                        <Typography variant="body2">Additional Notes: {webGameRequest.additionalNotes}</Typography>
                                        <Typography variant="body2">Status: {status}</Typography>

                                        <Typography variant="body1" fontWeight="bold">Platforms</Typography>
                                        <Typography variant="body2">{gameRequestDetails.selectedPlatforms.map((platform: any) => platform.name).join(", ")}</Typography>

                                        <Typography variant="body1" fontWeight="bold">Builds</Typography>
                                        <Typography variant="body2"></Typography>

                                        <Typography variant="body1" fontWeight="bold">Tech Checks</Typography>
                                        <Typography variant="body2"></Typography>

                                        <Typography variant="body1" fontWeight="bold">Creative Summary</Typography>
                                        <Typography variant="body2"></Typography>

                                        <Typography variant="body1" fontWeight="bold">Metadata & Ratings</Typography>
                                        <Typography variant="body2"></Typography>
                                    </>
                                ) : null
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
                                    <Button variant="outlined" href={playableLinkUrl} target="_blank" size="small" startIcon={<PlayArrow />} disabled={isDataSending}>Play Game</Button>
                                    <Button variant="outlined" href={gamePlayVideoUrl} target="_blank" size="small" startIcon={<PlayArrow />} disabled={isDataSending}>Watch Gameplay</Button>
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
                                                Accept
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
                                        onClick={handleCloseGamePostSubmissionDetails}
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