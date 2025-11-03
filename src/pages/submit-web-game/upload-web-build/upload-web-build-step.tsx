import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { FileUploadOutlined, PlayArrow } from "@mui/icons-material"
import { useState } from "react";
import { Styles } from "../../../common/styles";
import { useCrazyGamesBuildName, useMetaBuildName, useMsnBuildName, usePokiBuildName, useUniversalBuildName, useUploadMode, useUploadWebBuildsActions } from "../../../store/submit-web-game/upload-web-builds-store";
import { useCrazyGamesSelected, useMetaSelected, useMsnSelected, usePokiSelected } from "../../../store/submit-web-game/select-platform-store";
import { useNotify } from "react-admin";
import { handleFileDrop, handleFileUpload, sendRequest } from "../../../common/utils";
import { useCurrentSetupGameDetails, useDataSending, useSubmitWebGameActions } from "../../../store/submit-web-game/submit-web-game-store";
import { CREATE_WEB_GAME_SUBMISSION_DATA_URL, HttpMethod, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL } from "../../../common/constants";


export const UploadWebBuildStep = () => {
    const notify = useNotify();
    const uploadMode = useUploadMode();
    const isPokiSelected = usePokiSelected();
    const isMsnSelected = useMsnSelected();
    const isCrazyGamesSelected = useCrazyGamesSelected();
    const isMetaSelected = useMetaSelected();
    const universalBuildName = useUniversalBuildName();
    const metaBuildName = useMetaBuildName();
    const pokiBuildName = usePokiBuildName();
    const msnBuildName = useMsnBuildName();
    const crazyGamesBuildName = useCrazyGamesBuildName();
    const isDataSending = useDataSending();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const { setCurrentStep, setDataSending } = useSubmitWebGameActions();
    const { setUploadMode, setUniversalBuildName: setUniversalBuildName, setMetaBuildName: setMetaBuildName, setPokiBuildName: setPokiBuildName, setMsnBuildName: setMsnBuildName, setCrazyGamesBuildName: setCrazyGamesBuildName } = useUploadWebBuildsActions();

    const platforms = [
        { label: "Meta", value: metaBuildName, checked: isMetaSelected },
        { label: "Poki", value: pokiBuildName, checked: isPokiSelected },
        { label: "MSN", value: msnBuildName, checked: isMsnSelected },
        { label: "Crazy Games", value: crazyGamesBuildName, checked: isCrazyGamesSelected },
    ]

    const validateData = (): boolean => {
        if (uploadMode === "Single universal ZIP" && universalBuildName === "") {
            notify("Please upload a universal build", { type: "error" });
            return false;
        }
        if (uploadMode === "Platform-specific ZIP") {

            if (isMetaSelected && metaBuildName === "") {
                notify("Please upload a Meta build", { type: "error" });
                return false;
            }

            if (isPokiSelected && pokiBuildName === "") {
                notify("Please upload a Poki build", { type: "error" });
                return false;
            }

            if (isMsnSelected && msnBuildName === "") {
                notify("Please upload a MSN build", { type: "error" });
                return false;
            }

            if (isCrazyGamesSelected && crazyGamesBuildName === "") {
                notify("Please upload a Crazy Games build", { type: "error" });
                return false;
            }

            notify("Please upload a platform-specific build", { type: "error" });
            return false;
        }
        return true;
    }

    const submitData = async () => {
        console.log("submitData", currentSetupGameDetails);
        setDataSending(true);

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL, {
            id: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
            currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
            webGameRequestId: currentSetupGameDetails.webGameRequest.id,
            webGameRequestDetails: currentSetupGameDetails.webGameRequestDetailsId,
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

    const handleUploadBuilds = () => {
        if (validateData()) {
            console.log("uploadBuilds");
            submitData();
        }
    }

    const getName = (platformName: string): any => {
        switch (platformName) {
            case "Meta":
                return setMetaBuildName;
            case "Poki":
                return setPokiBuildName;
            case "MSN":
                return setMsnBuildName;
            case "Crazy Games":
                return setCrazyGamesBuildName;
            default:
                return setUniversalBuildName;
        }
    }

    return (
        <Box>
            <Typography fontWeight='bold' mb={3}> Upload Web Builds</Typography>
            {/* <Alert severity="success" >
                Your pickle ball clash game has been approved.
            </Alert> */}
            <Stack gap={5}>
                <Paper elevation={0} sx={Styles.paperStyle}>
                    <Stack gap={3}>
                        <Stack direction="row" sx={Styles.stackStyle}>
                            <Typography width={250}>Upload Mode</Typography >
                            <ToggleButtonGroup
                                exclusive
                                value={uploadMode}
                                onChange={(event, value) => value !== null && setUploadMode(value)}
                                sx={Styles.toggleButtonGroupStyle}
                                fullWidth
                            >
                                <ToggleButton
                                    value="Single universal ZIP"
                                // sx={Styles.leftRounded}
                                // disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                >
                                    Single universal ZIP
                                </ToggleButton>
                                <ToggleButton
                                    value="Platform-specific ZIP"
                                // sx={Styles.rightRounded}
                                // disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                >
                                    Platform-specific ZIP
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                        {uploadMode === "Single universal ZIP" && (
                            <Stack direction="row" sx={Styles.stackStyle}>
                                <Typography width={250}>Single universal ZIP</Typography >
                                <Stack gap={1} width="100%">
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 4,
                                            borderStyle: "dashed",
                                            cursor: "pointer",
                                        }}
                                        // onDrop={handleVideoDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} gap={3}>
                                            <FileUploadOutlined fontSize="large" />
                                            <Stack>
                                                <Typography>
                                                    Drag & drop your zip here or
                                                    <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                                        browse
                                                        <input type="file" hidden accept=".zip"
                                                            onChange={(e) => handleFileUpload(e, setUniversalBuildName, "zip", 50)}
                                                        />
                                                    </Button>
                                                    your computer
                                                </Typography>
                                                {universalBuildName && <Typography variant="caption"> {universalBuildName}</Typography>}
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Stack>
                        )}

                        {uploadMode === "Platform-specific ZIP" && (
                            platforms.map(
                                (platform) => (
                                    platform.checked && (
                                        <Stack direction="row" sx={Styles.stackStyle}>
                                            <Typography width={250}>{platform.label}</Typography >
                                            <Stack gap={1} width="100%">
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        p: 4,
                                                        borderStyle: "dashed",
                                                        cursor: "pointer",
                                                    }}
                                                    onDrop={(e) => handleFileDrop(e, getName(platform.label), "zip", 50)}
                                                    onDragOver={(e) => e.preventDefault()}
                                                >
                                                    <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} gap={3}>
                                                        <FileUploadOutlined fontSize="large" />
                                                        <Stack>
                                                            <Typography>
                                                                Drag & drop your zip here or
                                                                <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                                                    browse
                                                                    <input type="file" hidden accept=".zip"
                                                                        onChange={(e) =>
                                                                            handleFileUpload(e, getName(platform.label), "zip", 50)
                                                                        }
                                                                    />
                                                                </Button>
                                                                your computer
                                                            </Typography>
                                                            {platform.value && <Typography variant="caption"> {platform.value}</Typography>}
                                                        </Stack>
                                                    </Stack>
                                                </Paper>
                                            </Stack>
                                        </Stack>
                                    )
                                )
                            )
                        )}

                        {/* <Typography fontWeight='bold'>Validation Results</Typography>
                        <Stack gap={1}>
                            <Alert severity="success">Index.html file found</Alert>
                            <Alert severity="success">/assets present</Alert>
                            <Alert severity="error">No absolute XHR blocked origins</Alert>
                            <Alert severity="warning">Uses WebGL; fallback canvas detected</Alert>
                            <Alert severity="success">Mobile viewport meta tag </Alert>
                            <Alert severity="success">Game loads under 5s (local test)</Alert>
                        </Stack> */}
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
                        onClick={handleUploadBuilds}
                        sx={{ px: 4, py: 1, textTransform: "none" }}
                    // disabled={isStepCompleted(activeStep) || isDataSending}
                    >
                        {
                            isDataSending ? (
                                <Stack gap={2} direction={'row'}>
                                    <Typography>Processing</Typography>
                                    <CircularProgress size={20} />
                                </Stack>
                            ) : "Upload Builds"
                        }
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}