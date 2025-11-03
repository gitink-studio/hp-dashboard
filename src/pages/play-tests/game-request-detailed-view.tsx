import { Box, Button, CircularProgress, Dialog, Paper, Stack, TextField, Typography } from "@mui/material"
import { useDataSending, useDisplayGameRequestDetails, useGameRequestDetails, usePlayTestsActions, useReviewNotes } from "../../store/play-tests/play-tests-store";
import { Close, Done, PlayArrow } from "@mui/icons-material";
import { Styles } from "../../common/styles";
import { HttpMethod, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from "../../common/constants";
import { sendRequest } from "../../common/utils";

export const GameRequestDetailedView = () => {
    let gameRequestDetails = useGameRequestDetails();
    let reviewNotes = useReviewNotes();
    let displayGameRequestDetails = useDisplayGameRequestDetails();
    let isDataSending = useDataSending();
    const { setDisplayGameRequestDetails, setDataSending, setReviewNotes } = usePlayTestsActions();
    const { name, studio, playableLinkUrl, gamePlayVideoUrl, status, platform, webGameRequest, androidAndIOSGameRequest } = gameRequestDetails;
    let isPublisher = localStorage.getItem("userRole")?.toLowerCase().includes("publisher");

    const handleCloseGameRequestDetails = () => {
        if (!isDataSending) {
            setDisplayGameRequestDetails(false);
        }
    }

    const handleAcceptGameRequest = async () => {
        setDataSending(true);
        console.log("Accept Game Request");
        gameRequestDetails.status = "Accepted";
        console.log("Reviewer Notes: ", reviewNotes);

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, {
            gameRequestId: gameRequestDetails.id,
            webGameRequestId: gameRequestDetails.webGameRequest.id,
            status: "Accepted",
            reviewNotes: reviewNotes
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDisplayGameRequestDetails(false);
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
            reviewNotes: reviewNotes
        });

        console.log("Game Request Response: ", response);

        setDataSending(false);
        setDisplayGameRequestDetails(false);
    }

    return (
        <>
            <Dialog open={displayGameRequestDetails} onClose={handleCloseGameRequestDetails} fullWidth maxWidth="lg" >
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