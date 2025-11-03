import { Box, Button, CircularProgress, FormControl, InputAdornment, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { Styles } from "../../../common/styles";
import { CREATE_WEB_GAME_SUBMISSION_DATA_URL, Genres, HttpMethod, Languages, Regions, REVIEW_AND_LAUNCH_URL, SubGenres, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL } from "../../../common/constants";
import { useAgeRating, useGameTitle, useGenre, useLanguages, useLongDescription, useMetadataAndRatingsActions, usePrivacyPolicyUrl, useRegionalAvailability, useShortDescription, useSubGenre, useSupportUrl } from "../../../store/submit-web-game/metadata-and-ratings-store";
import { notify } from "../../../components/notify";
import { useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions } from "../../../store/submit-web-game/submit-web-game-store";
import { useCrazyGamesSelected, useMetaSelected, useMsnSelected, usePokiSelected } from "../../../store/submit-web-game/select-platform-store";
import { Close, Done } from "@mui/icons-material";
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
    const { setCurrentStep, setDataSending } = useSubmitWebGameActions();
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
        console.log("submitData", currentSetupGameDetails);
        setDataSending(true);

        let response = await sendRequest(HttpMethod.POST, REVIEW_AND_LAUNCH_URL, {
            id: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
            studioId: currentSetupGameDetails.studioId,
            currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
            gameRequestId: currentSetupGameDetails.id,
            webGameRequestId: currentSetupGameDetails.webGameRequest.id,
        });

        console.log(response);

        if (response?.data?.id) {
            console.log("Platform requirements data sent successfully!", response.data);
            window.location.href = '/#/getAllGameRequests'
        } else {
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
            <Paper elevation={0} sx={Styles.paperStyle}>
                <Stack gap={2}>
                    <Typography fontWeight='bold' mb={3}> Review and Launch</Typography>
                    <Stack direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Game Title</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={gameTitle}
                            disabled
                        />
                    </Stack>

                    <Stack direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Platforms</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={getSelectedPlatforms()}
                            disabled
                        />
                    </Stack>

                    <Stack direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Builds</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={getSelectedPlatforms()}
                            disabled
                        />
                    </Stack>

                    <Typography mt={3} fontWeight='bold'> Tech Checks</Typography>
                    <Stack gap={2}>
                        {
                            platforms.map((data, index) => (
                                data.isSelected && (
                                    <Stack direction="row" sx={Styles.stackStyle} key={index}>
                                        <Typography width={250}>{data.label}</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={data.isSelected ? "Confirmed" : "Failed"}
                                            disabled
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: false, // prevents label from shrinking automatically
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {data.isSelected ? <Done /> : <Close />}
                                                        </InputAdornment>
                                                    )
                                                }
                                            }}
                                        />
                                    </Stack>)
                            ))
                        }
                    </Stack>

                    <Typography mt={3} fontWeight='bold'>Meta Data</Typography>
                    <Stack gap={2} direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Short Description</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={shortDescription}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Languages</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={languages.join(', ')}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Age Rating</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={ageRating}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Regions</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={regionalAvailability.join(', ')}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={Styles.stackStyle}>
                        <Typography width={250}>Privacy Policy Url</Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={privacyPolicyUrl}
                            disabled
                        />
                    </Stack>

                    <Stack gap={2} direction="row" sx={Styles.stackStyle}>
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
