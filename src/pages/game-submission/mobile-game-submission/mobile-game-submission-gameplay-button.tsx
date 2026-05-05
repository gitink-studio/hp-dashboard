import Button from "@mui/material/Button";
import { useGameSubmissionActions } from "../../../store/game-submission/game-submission-store";
import { PlayArrow } from "@mui/icons-material";
import { useDataSending } from "../../../store/mobile-game-submission/sdk-details-store";


export const MobileGameSubmissionGameplayButton = (props: any) => {
    const { value } = props.data;
    const isDataSending = useDataSending();
    const { setVideoUrl, setOpenVideo } = useGameSubmissionActions();

    const handleButtonClick = () => {
        setVideoUrl(value);
        setOpenVideo(true);
    }

    return (
        <Button
            onClick={() => handleButtonClick()}
            variant="outlined"
            sx={{ textTransform: "none", color: "primary.main" }}
            startIcon={< PlayArrow />}
            disabled={isDataSending}
        >
            Watch
        </Button >
    )
}
