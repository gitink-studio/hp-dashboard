import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Paper, Stack, TextField, Typography } from "@mui/material"
import { useCrazyGamesSelected, useMetaSelected, useMsnSelected, usePokiSelected, useSelectPlatformActions } from "../../../store/submit-web-game/select-platform-store"
import { useNotify } from "react-admin"
import { useCurrentSetupGameDetails, useDataSending, useSubmitWebGameActions } from "../../../store/submit-web-game/submit-web-game-store"
import { Styles } from "../../../common/styles"
import { sendRequest } from "../../../common/utils"
import { CREATE_WEB_GAME_SUBMISSION_DATA_URL, HttpMethod, CREATE_WEB_SUBMISSION_SELECT_PLATFORMS_URL, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL } from "../../../common/constants"

export const SelectPlatformsStep = () => {
    const notify = useNotify();
    const isMetaSelected = useMetaSelected();
    const isPokiSelected = usePokiSelected();
    const isMsnSelected = useMsnSelected();
    const isCrazyGamesSelected = useCrazyGamesSelected();
    const { setMetaSelected, setPokiSelected, setMsnSelected, setCrazyGamesSelected } = useSelectPlatformActions();
    const isDataSending = useDataSending();
    const { setCurrentStep, setDataSending } = useSubmitWebGameActions();
    const currentSetupGameDetails = useCurrentSetupGameDetails();

    const platforms = [
        { label: "Meta", checked: isMetaSelected },
        { label: "Poki", checked: isPokiSelected },
        // { label: "MSN", checked: isMsnSelected },
        { label: "Crazy Games", checked: isCrazyGamesSelected },
    ]

    const validateData = (): boolean => {
        if (!isMetaSelected && !isPokiSelected && !isMsnSelected && !isCrazyGamesSelected) {
            notify("Please select at least one platform", { type: "warning" });
            return false;
        }
        return true;
    }

    const getSelectedPlatforms = (): string[] => {
        let selectedPlatforms: string[] = [];
        if (isMetaSelected) {
            selectedPlatforms.push("Meta");
        }
        if (isPokiSelected) {
            selectedPlatforms.push("Poki");
        }
        if (isCrazyGamesSelected) {
            selectedPlatforms.push("Crazy Games");
        }

        return selectedPlatforms;
    }

    const submitData = async () => {
        setDataSending(true);
        console.log("currentSetupGameDetails", currentSetupGameDetails);

        let response = await sendRequest(HttpMethod.POST, CREATE_WEB_SUBMISSION_SELECT_PLATFORMS_URL, {
            id: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
            webGameRequestId: currentSetupGameDetails.webGameRequest.id,
            selectedPlatforms: getSelectedPlatforms(),
        });
        console.log(response);

        if (response?.data?.id) {
            console.log("Select platforms data sent successfully!", response.data);
            setCurrentStep();
        } else {
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);
    }

    const handleSubmit = () => {
        if (validateData()) {
            submitData();
            console.log("submitData");
        }
    }

    return (
        <Stack gap={2}>
            <Alert severity="success" sx={{ mb: 2 }} >
                Your {currentSetupGameDetails.name.toLowerCase()} game has been approved.
            </Alert>
            <Typography fontWeight='bold' p={0}> Select Platforms</Typography>
            <Stack >
                <Paper elevation={0} sx={{ px: 2, py: 1 }}>
                    <Typography mb={1}> Platforms Supported</Typography>
                    <Stack>
                        {platforms.map((data, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        checked={data.checked}
                                        // disabled={isDataSending}
                                        onChange={(event) => {
                                            switch (index) {
                                                case 0:
                                                    setMetaSelected(event.target.checked);
                                                    break;
                                                case 1:
                                                    setPokiSelected(event.target.checked);
                                                    break;
                                                case 2:
                                                    setCrazyGamesSelected(event.target.checked);
                                                    break;
                                                case 3:
                                                    setMsnSelected(event.target.checked);
                                                    break;
                                            }
                                        }}
                                        size="small"
                                    />
                                }
                                label={data.label}
                                sx={{
                                    "& .MuiFormControlLabel-label": {
                                        fontSize: "0.875rem", // same as body2 (14px)
                                    },
                                    alignItems: "center",
                                    m: 0,
                                }}
                            />
                        ))}
                    </Stack>

                </Paper>

                <Stack direction="row" gap={2}
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 3
                    }}>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ px: 4, py: 1, textTransform: "none" }}
                        disabled={isDataSending}
                    >
                        {
                            isDataSending ? (
                                <Stack gap={2} direction={'row'}>
                                    <Typography>Processing</Typography>
                                    <CircularProgress size={20} color="inherit" />
                                </Stack>
                            ) : "Complete Step"
                        }
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    )
}