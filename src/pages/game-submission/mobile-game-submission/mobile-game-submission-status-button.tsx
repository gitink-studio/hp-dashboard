import Button from "@mui/material/Button";
import { AuthenticationProvider } from "../../../auth-providers/auth-provider";
import { GameRequestStatus, TOTAL_MOBILE_GAME_SUBMISSION_STEPS } from "../../../common/constants";
import { useDataSending, useMobileGameSubmissionActions } from "../../../store/mobile-game-submission/sdk-details-store";
import { useGameSubmissionActions } from "../../../store/game-submission/game-submission-store";
import { useEffect } from "react";
import { ArrowCircleRightOutlined } from "@mui/icons-material";

export const MobileGameSubmissionStatusButton = (props: any) => {
    const { status, gameSubmissionDetails } = props.data;
    const isDataSending = useDataSending();
    const { setCurrentGameSetupDetails } = useMobileGameSubmissionActions();
    const { setDetailedView, setGameRequestDetails } = useGameSubmissionActions();
    const isPublisher = AuthenticationProvider.isRolePublisher();

    let gameRequestStatus = status;
    let newStatus = status;

    const isGameSubmissionInProgress = () => {
        return gameRequestStatus === GameRequestStatus.ACCEPTED
            && gameSubmissionDetails.currentSetupStateIndex < TOTAL_MOBILE_GAME_SUBMISSION_STEPS;
    }

    const canDisable = () => {
        if (isDataSending) return true;

        if (!isPublisher) {
            if (isGameSubmissionInProgress()) {
                return false;
            }
        } else if (isPublisher && gameRequestStatus === GameRequestStatus.PENDING) {
            return false;
        }

        return true;
    }

    const handleDetailedView = (gameRequestDetails: any) => {
        // console.log('Game Request Details: ', gameRequestDetails);
        setDetailedView(true);
        setGameRequestDetails(gameRequestDetails);
        setCurrentGameSetupDetails(gameRequestDetails);
    }

    const handleButtonClick = () => {
        if (isPublisher) {
            handleDetailedView(gameSubmissionDetails);
        }

        if (status === GameRequestStatus.ACCEPTED) {
            console.log("data", gameSubmissionDetails);
            setCurrentGameSetupDetails(gameSubmissionDetails);
            window.location.href = '/#/sdk';
        }
    }

    useEffect(() => {
        if (!isPublisher) {
            if (gameSubmissionDetails.currentSetupStateIndex === TOTAL_MOBILE_GAME_SUBMISSION_STEPS) {
                newStatus = GameRequestStatus.WAITING_FOR_APPROVAL;
            }
            else {
                if (status === GameRequestStatus.ACCEPTED) {
                    newStatus = gameSubmissionDetails.currentSetupStateName;
                } else if (status === GameRequestStatus.PENDING) {
                    newStatus = GameRequestStatus.WAITING_FOR_APPROVAL;
                }
            }
        }
    }, []);

    return (
        <Button
            variant="text"
            sx={{ textTransform: "none" }
            }
            disabled={canDisable()}
            endIcon={status === GameRequestStatus.ACCEPTED && !isPublisher && <ArrowCircleRightOutlined />}
            onClick={handleButtonClick}
        >
            {status}
        </Button >
    )
}
