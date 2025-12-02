import { Alert, Box, Button, CircularProgress, FormControl, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { customStyle } from "../../../common/styles";
import { CREATE_METADATA_AND_RATINGS_DATA_URL, CREATE_WEB_GAME_SUBMISSION_DATA_URL, Genres, HttpMethod, Languages, Regions, SubGenres, WebGameSubmissionSetup } from "../../../common/constants";
import { useAgeRating, useGameTitle, useGenre, useLanguages, useLongDescription, useMetadataAndRatingsActions, usePrivacyPolicyUrl, useRegionalAvailability, useShortDescription, useSubGenre, useSupportUrl } from "../../../store/submit-web-game/metadata-and-ratings-store";
import { notify } from "../../../components/notify";
import { useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions } from "../../../store/submit-web-game/submit-web-game-store";
import { sendRequest } from "../../../common/utils";
import { useEffect } from "react";

export const MetaDataAndRatingsStep = () => {
    const gameTitle = useGameTitle();
    const shortDescription = useShortDescription();
    const longDescription = useLongDescription();
    const genre = useGenre();
    const subGenre = useSubGenre();
    const languages = useLanguages();
    const ageRating = useAgeRating();
    const regionalAvailability = useRegionalAvailability();
    const privacyPolicyUrl = usePrivacyPolicyUrl();
    const supportUrl = useSupportUrl();
    const isDataSending = useDataSending();
    const currentStep = useCurrentStep();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const { setCurrentStep, setDataSending, setCurrentSetupGameDetails } = useSubmitWebGameActions();
    const { setGameTitle, setShortDescription, setLongDescription, setGenre, setSubGenre, setLanguages, setAgeRating, setRegionalAvailability, setPrivacyPolicyUrl, setSupportUrl } = useMetadataAndRatingsActions();

    const validateData = (): boolean => {
        if (gameTitle == '') {
            notify("Game Title is required!", { type: "error" });
            return false;
        }
        if (shortDescription == '') {
            notify("Short Description is required!", { type: "error" });
            return false;
        }
        if (longDescription == '') {
            notify("Long Description is required!", { type: "error" });
            return false;
        }
        if (genre == '') {
            notify("Genre is required!", { type: "error" });
            return false;
        }
        if (subGenre.length == 0) {
            notify("Sub Genre is required!", { type: "error" });
            return false;
        }
        if (languages.length == 0) {
            notify("Languages is required!", { type: "error" });
            return false;
        }
        if (ageRating == '') {
            notify("Age Rating is required!", { type: "error" });
            return false;
        }
        if (regionalAvailability.length == 0) {
            notify("Regional Availability is required!", { type: "error" });
            return false;
        }
        if (privacyPolicyUrl == '') {
            notify("Privacy Policy Url is required!", { type: "error" });
            return false;
        }
        if (supportUrl == '') {
            notify("Support Url is required!", { type: "error" });
            return false;
        }

        return true;
    }

    const submitData = async () => {

        try {
            setDataSending(true);
            console.log("currentSetupGameDetails", currentSetupGameDetails);

            let response = await sendRequest(HttpMethod.POST, CREATE_METADATA_AND_RATINGS_DATA_URL, {
                gameRequestId: currentSetupGameDetails.id,
                webGameSubmissionSetupCurrentStateId: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
                currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
                webGameRequestId: currentSetupGameDetails.webGameRequest.id,
                webGameRequestDetailsId: currentSetupGameDetails.webGameRequest.webGameRequestDetails.id,
                metadataAndRatings: {
                    name: gameTitle,
                    shortDescription: shortDescription,
                    longDescription: longDescription,
                    genre: genre,
                    subGenre: subGenre,
                    languages: languages,
                    ageRating: ageRating,
                    regionalAvailability: regionalAvailability,
                    privacyPolicyUrl: privacyPolicyUrl,
                    supportUrl: supportUrl,
                    studioId: currentSetupGameDetails.studioId
                },
            });
            console.log(response);
            setCurrentSetupGameDetails(response.data.data);
            setCurrentStep();
        } catch (err) {
            console.error(err);
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);
    }

    const handleSubmit = () => {
        console.log("handleSubmit");

        if (validateData()) {
            submitData();
        }
    }

    const setMetadataAndRatings = () => {
        const {
            ageRating,
            genre,
            languages,
            longDescription,
            shortDescription,
            name,
            privacyPolicyUrl,
            supportUrl,
            subGenre,
            regionalAvailability
        } = currentSetupGameDetails.webGameRequest.webGameRequestDetails.metaDataAndRatings;

        setAgeRating(ageRating);
        setGenre(genre.name);
        setLanguages(languages.map((lang: any) => lang.name));
        setLongDescription(longDescription);
        setShortDescription(shortDescription)
        setGameTitle(name)
        setPrivacyPolicyUrl(privacyPolicyUrl)
        setSupportUrl(supportUrl)
        setSubGenre(subGenre.name)
        setRegionalAvailability(regionalAvailability.map((regional: any) => regional.name));
    }

    const isStepCompleted = () => currentStep > WebGameSubmissionSetup.METADATA_AND_RATINGS;

    useEffect(() => {
        if (isStepCompleted()) {
            setMetadataAndRatings();
        }
    }, [])

    return (
        <Box>
            {isStepCompleted() &&
                <Alert severity="success" sx={{ mb: 2 }}>
                    You already completed this step
                </Alert>}
            <Paper elevation={0} sx={customStyle.paperStyle}>
                <Stack gap={2}>
                    <Typography fontWeight='bold' mb={3}> Metadata and Ratings</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Game Title</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter game title here"
                                value={gameTitle}
                                onChange={(e) => setGameTitle(e.target.value)}
                                disabled={isDataSending || isStepCompleted()}
                            // sx={Styles.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>
                    </Stack>

                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Short Description</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter short description here"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                disabled={isDataSending || isStepCompleted()}
                            // sx={Styles.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>
                    </Stack>

                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Long Description</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter game title here"
                                value={longDescription}
                                onChange={(e) => setLongDescription(e.target.value)}
                                disabled={isDataSending || isStepCompleted()}
                            // sx={Styles.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>
                    </Stack>

                    <Stack direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Genre</Typography >
                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                displayEmpty
                                renderValue={(selected) => selected === '' ? 'Genre' : selected}
                                disabled={isDataSending || isStepCompleted()}
                            >
                                <MenuItem value="" disabled>Please Select</MenuItem>
                                {Genres.map((genre) => (
                                    <MenuItem key={genre} value={genre}>{genre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Sub Genre</Typography >
                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={subGenre}
                                onChange={(e) => setSubGenre(e.target.value)}
                                displayEmpty
                                renderValue={(selected: any) => selected === '' ? 'Sub Genre' : selected}
                                disabled={isDataSending || isStepCompleted()}
                            >
                                <MenuItem value="" disabled>Please Select</MenuItem>
                                {SubGenres.map((subGenre) => (
                                    <MenuItem key={subGenre} value={subGenre}>{subGenre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Languages</Typography >
                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={languages}
                                onChange={(e) => setLanguages(e.target.value as string[])}
                                // sx={Styles.selectStyle}
                                displayEmpty
                                multiple
                                renderValue={(selected: any) => selected.length === 0 ? 'Please Select' : selected.join(', ')}
                                disabled={isDataSending || isStepCompleted()}
                            >
                                <MenuItem value="" disabled>Please Select</MenuItem>
                                {Languages.map((language) => (
                                    <MenuItem key={language} value={language}>{language}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Age Rating</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter age rating here"
                                value={ageRating}
                                onChange={(e) => setAgeRating(e.target.value)}
                                disabled={isDataSending || isStepCompleted()}
                            // sx={Styles.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>
                    </Stack>

                    <Stack direction="row" sx={customStyle.stackStyle}>
                        <Typography width={250}>Regional Availability</Typography >
                        <FormControl fullWidth variant="outlined">
                            <Select
                                value={regionalAvailability}
                                onChange={(e) => setRegionalAvailability(e.target.value as string[])}
                                displayEmpty
                                // sx={Styles.selectStyle}
                                multiple
                                renderValue={(selected: any) => selected.length === 0 ? 'Please Select' : selected.join(', ')}
                                disabled={isDataSending || isStepCompleted()}
                            >
                                <MenuItem value="" disabled>Please Select</MenuItem>
                                {Regions.map((region) => (
                                    <MenuItem key={region} value={region}>{region}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Privacy Policy Url</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter privacy policy url here"
                                value={privacyPolicyUrl}
                                onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                                disabled={isDataSending || isStepCompleted()}
                            // sx={Styles.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>
                    </Stack>

                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Support Url</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter support url here"
                                value={supportUrl}
                                onChange={(e) => setSupportUrl(e.target.value)}
                                disabled={isDataSending || isStepCompleted()}
                            // sx={Styles.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>
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
                    disabled={isDataSending || isStepCompleted()}
                >
                    {
                        isDataSending ? (
                            <Stack gap={2} direction={'row'}>
                                <Typography>Processing</Typography>
                                <CircularProgress size={20} />
                            </Stack>
                        ) :
                            "Complete Step"
                    }
                </Button>
            </Stack>
        </Box>
    )
}
