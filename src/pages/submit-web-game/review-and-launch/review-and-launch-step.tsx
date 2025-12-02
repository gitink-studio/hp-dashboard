import { Box, Button, CircularProgress, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material"
import { customStyle } from "../../../common/styles";
import { HttpMethod, REVIEW_AND_LAUNCH_URL } from "../../../common/constants";
import { useAgeRating, useGameTitle, useLanguages, usePrivacyPolicyUrl, useRegionalAvailability, useShortDescription, useSupportUrl } from "../../../store/submit-web-game/metadata-and-ratings-store";
import { notify } from "../../../components/notify";
import { useCurrentSetupGameDetails, useDataSending, useSubmitWebGameActions } from "../../../store/submit-web-game/submit-web-game-store";
import { useCrazyGamesSelected, useMetaSelected, useMsnSelected, usePokiSelected } from "../../../store/submit-web-game/select-platform-store";
import { Done } from "@mui/icons-material";
import { sendRequest } from "../../../common/utils";

export const ReviewAndLaunchStep = () => {
    const gameTitle = useGameTitle();
    const shortDescription = useShortDescription();
    const languages = useLanguages();
    const ageRating = useAgeRating();
    const regionalAvailability = useRegionalAvailability();
    const privacyPolicyUrl = usePrivacyPolicyUrl();
    const supportUrl = useSupportUrl();
    const isDataSending = useDataSending();
    const { setCurrentStep, setDataSending, setCurrentSetupGameDetails } = useSubmitWebGameActions();
    const currentSetupGameDetails = useCurrentSetupGameDetails();

    const isMetaSelected = useMetaSelected();
    const isPokiSelected = usePokiSelected();
    const isMsnSelected = useMsnSelected();
    const isCrazyGamesSelected = useCrazyGamesSelected();
    const platforms = [
        { label: "Meta", isSelected: isMetaSelected },
        { label: "Poki", isSelected: isPokiSelected },
        // { label: "MSN", isSelected: isMsnSelected },
        { label: "Crazy Games", isSelected: isCrazyGamesSelected }
    ]

    const submitData = async () => {
        try {
            console.log("submitData", currentSetupGameDetails);
            setDataSending(true);

            let response = await sendRequest(HttpMethod.POST, REVIEW_AND_LAUNCH_URL, {
                webGameSubmissionSetupCurrentStateId: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
                studioId: currentSetupGameDetails.studioId,
                currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
                gameRequestId: currentSetupGameDetails.id,
                webGameRequestId: currentSetupGameDetails.webGameRequest.id,
                webGameRequestDetails: currentSetupGameDetails.webGameRequest.webGameRequestDetails.id,
            });

            console.log(response);
            setCurrentSetupGameDetails(response.data.data);
            window.location.href = '/#/getAllGameRequests'
        } catch (err) {
            console.error(err);
            notify("Something went wrong!", { type: "error" });
        }
        setDataSending(false);
    }

    const handleSubmit = async () => {
        console.log("submitData");
        submitData();
    }

    const getSelectedPlatforms = () => {
        let selectedPlatforms = "";

        if (isMetaSelected) {
            selectedPlatforms += "Meta, ";
        }
        if (isPokiSelected) {
            selectedPlatforms += "Poki, ";
        }
        // if (isMsnSelected) {
        //     selectedPlatforms += "MSN, ";
        // }
        if (isCrazyGamesSelected) {
            selectedPlatforms += "Crazy Games, ";
        }

        return selectedPlatforms.slice(0, -2);
    }

    return (
        <Box>
            <Paper elevation={0} sx={customStyle.paperStyle}>
                <Stack gap={2}>
                    <Typography variant="h6" fontWeight='bold' mb={3}> Review and Launch</Typography>
                    <Stack direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Game Title</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={gameTitle}
                            disabled
                        />
                    </Stack>

                    <Stack direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Platforms</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={currentSetupGameDetails.selectedPlatforms.map((platform: any) => platform.name).join(", ")}
                            disabled
                        />
                    </Stack>

                    {/* <Stack direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Builds</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={getSelectedPlatforms()}
                            disabled
                        />
                    </Stack> */}

                    <Typography mt={3} fontWeight='bold'> Tech Checks</Typography>
                    <Stack gap={2}>
                        {
                            currentSetupGameDetails.selectedPlatforms.map((data: any, index: any) => (
                                <Stack direction="row" sx={customStyle.stackStyle} key={index}>
                                    <Typography width={250}>{data.name}</Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={"Confirmed"}
                                        disabled
                                        slotProps={{
                                            inputLabel: {
                                                shrink: false, // prevents label from shrinking automatically
                                            },
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {<Done />}
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                    />
                                </Stack>
                            ))
                        }
                    </Stack>

                    <Typography mt={3} fontWeight='bold'>Meta Data</Typography>
                    <Stack gap={2} direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Short Description</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={shortDescription}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Languages</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={languages.join(', ')}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Age Rating</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={ageRating}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Regions</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={regionalAvailability.join(', ')}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Privacy Policy Url</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={privacyPolicyUrl}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Support Url</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={supportUrl}
                            disabled
                        />
                    </Stack>
                </Stack>
            </Paper>

            <Stack direction="row" gap={2}
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}>
                <Button
                    variant="contained"
                    onClick={() => handleSubmit()}
                    sx={{ px: 4, py: 1, textTransform: "none" }}
                    disabled={isDataSending}
                >
                    {
                        isDataSending ? (
                            <Stack gap={2} direction={'row'}>
                                <Typography>Processing</Typography>
                                <CircularProgress size={20} />
                            </Stack>
                        ) : "Launch Test"
                    }
                </Button>
            </Stack>
        </Box>
    )
}
