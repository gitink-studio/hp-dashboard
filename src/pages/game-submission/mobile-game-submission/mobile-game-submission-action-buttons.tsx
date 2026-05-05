import { Close, Done, Visibility } from "@mui/icons-material"
import { IconButton, Stack } from "@mui/material"
import { AuthenticationProvider } from "../../../auth-providers/auth-provider"
import { GameRequestStatus, HttpMethod, LAUNCH_GAME_URL, MOBILE_GAME_SUBMISSION_STATUS_UPDATE_URL, TOTAL_MOBILE_GAME_SUBMISSION_STEPS, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from "../../../common/constants"
import { useDataSending, useMobileGameSubmissionActions } from "../../../store/mobile-game-submission/sdk-details-store"
import { sendRequest } from "../../../common/utils"
import { notify } from "../../../components/notify"
import { useGameSubmissionActions, useReviewNotes } from "../../../store/game-submission/game-submission-store"

export const MobileGameSubmissionActionButtons = (props: any) => {
    const { gameSubmissionDetails } = props.data;
    const isDataSending = useDataSending();
    const reviewNotes = useReviewNotes();
    const { setDataSending, setCurrentGameSetupDetails } = useMobileGameSubmissionActions();
    const { setDetailedView, setGameRequestDetails } = useGameSubmissionActions();

    const isLaunchRequest = (gameRequestDetails: any) => {
        return gameRequestDetails.currentSetupStateIndex >= TOTAL_MOBILE_GAME_SUBMISSION_STEPS - 1;
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
                let response = await sendRequest(HttpMethod.POST, MOBILE_GAME_SUBMISSION_STATUS_UPDATE_URL, {
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

    const handleDetailedView = (gameRequestDetails: any) => {
        // console.log('Game Request Details: ', gameRequestDetails);
        setDetailedView(true);
        setGameRequestDetails(gameRequestDetails);
        setCurrentGameSetupDetails(gameRequestDetails);
    }

    return (
        <Stack direction="row" gap={1} >
            <IconButton onClick={() => handleDetailedView(gameSubmissionDetails)} disabled={isDataSending} >
                <Visibility />
            </IconButton>

            {
                AuthenticationProvider.isRolePublisher() && (
                    gameSubmissionDetails.status === GameRequestStatus.PENDING && (
                        <>
                            <IconButton onClick={() => handleAcceptGameRequest(gameSubmissionDetails)} disabled={isDataSending} >
                                <Done color="success" />
                            </IconButton>

                            < IconButton onClick={() => handleRejectGameRequest(gameSubmissionDetails)
                            } disabled={isDataSending} >
                                <Close color="error" />
                            </IconButton>
                        </>
                    )
                )
            }
        </Stack>
    )
}
