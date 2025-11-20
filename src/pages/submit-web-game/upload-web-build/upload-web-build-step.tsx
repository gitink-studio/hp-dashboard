import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { FileDownloadDoneOutlined, FileDownloadOutlined, FileUploadOutlined, PlayArrow } from "@mui/icons-material"
import { useState } from "react";
import { Styles } from "../../../common/styles";
import { useCrazyGamesBuildFile, useMetaBuildFile, useMsnBuildFile, usePokiBuildFile, useUniversalBuildFile, useUploadMode, useUploadWebBuildsActions } from "../../../store/submit-web-game/upload-web-builds-store";
import { useCrazyGamesSelected, useMetaSelected, useMsnSelected, usePokiSelected } from "../../../store/submit-web-game/select-platform-store";
import { useNotify } from "react-admin";
import { getBuildFilesInfo, getFilesInfo, handleFileDrop, handleFileUpload, sendFormDataRequest, sendRequest } from "../../../common/utils";
import { useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions } from "../../../store/submit-web-game/submit-web-game-store";
import { BUILDS_ROOT_URL, CRAZY_GAMES, CREATE_UPLOAD_WEB_BUILDS_URL, CREATE_WEB_GAME_SUBMISSION_DATA_URL, HttpMethod, META, MSN, PLATFORM_SPECIFIC_ZIP, POKI, SINGLE_UNIVERSAL_ZIP, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL, WEB_GAME_SUBMISSION_STATUS_UPDATE_URL, WebGameSubmissionSetup } from "../../../common/constants";
import { localStorageData } from "../../../common/localStorage";
import { useGameRequests } from "../../../store/play-tests/play-tests-store";


export const UploadWebBuildStep = () => {
    const notify = useNotify();
    const uploadMode = useUploadMode();
    const universalBuildFile = useUniversalBuildFile();
    const metaBuildFile = useMetaBuildFile();
    const pokiBuildFile = usePokiBuildFile();
    const msnBuildFile = useMsnBuildFile();
    const crazyGamesBuildFile = useCrazyGamesBuildFile();
    const isDataSending = useDataSending();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const currentStep = useCurrentStep();
    const { setCurrentStep, setDataSending, setCurrentSetupGameDetails } = useSubmitWebGameActions();
    const { setUploadMode, setUniversalBuildFile: setUniversalBuildFile, setMetaBuildFile: setMetaBuildFile, setPokiBuildFile: setPokiBuildFile, setMsnBuildFile: setMsnBuildFile, setCrazyGamesBuildFile: setCrazyGamesBuildFile } = useUploadWebBuildsActions();
    const gameRequest = useGameRequests();

    const getSelectedPlatforms = () => {
        let gamePlatforms: any = [];

        currentSetupGameDetails.selectedPlatforms.forEach((gamePlatform: any) => {
            gamePlatforms.push(gamePlatform.name);
        })

        return gamePlatforms;
    };

    const getPlatforms = () => {
        let platforms: any = [];

        selectedPlatforms.forEach((platform: any) => {
            switch (platform) {
                case "Meta":
                    platforms.push({
                        label: platform,
                        value: metaBuildFile
                    })
                    break;
                case "Poki":
                    platforms.push({
                        label: platform,
                        value: pokiBuildFile
                    })
                    break;
                case "MSN":
                    platforms.push({
                        label: platform,
                        value: msnBuildFile
                    })
                    break;
                case "Crazy Games":
                    platforms.push({
                        label: platform,
                        value: crazyGamesBuildFile
                    })
                    break;
                default:
                    console.log('Platform not found');
                    break;
            }
        })

        return platforms;
    }

    const selectedPlatforms = getSelectedPlatforms();
    const platforms = getPlatforms();

    const validateData = (): boolean => {
        console.log(uploadMode);
        if (uploadMode === SINGLE_UNIVERSAL_ZIP && universalBuildFile === null) {
            notify("Please upload a universal build", { type: "error" });
            return false;
        }

        if (uploadMode === PLATFORM_SPECIFIC_ZIP) {
            selectedPlatforms.forEach((platform: any) => {
                switch (platform) {
                    case META:
                        if (metaBuildFile === null) {
                            notify("Please upload a Meta build", { type: "error" });
                            return false
                        }
                        break;
                    case POKI:
                        if (pokiBuildFile === null) {
                            notify("Please upload a Poki build", { type: "error" });
                            return false;
                        }
                        break;
                    case CRAZY_GAMES:
                        if (crazyGamesBuildFile === null) {
                            notify("Please upload a Crazy Games build", { type: "error" });
                            return false;
                        }
                        break;
                    case MSN:
                        if (msnBuildFile === null) {
                            notify("Please upload a MSN Games build", { type: "error" });
                            return false;
                        }
                        break;
                    default:
                        console.log("Platform not found!");
                        break;
                }
            })
        }

        return true;
    }

    const getFileByPlatform = (platform: string) => {
        if (uploadMode === SINGLE_UNIVERSAL_ZIP) {
            return universalBuildFile;
        }

        switch (platform) {
            case META:
                return metaBuildFile;
            case POKI:
                return pokiBuildFile;
            case CRAZY_GAMES:
                return crazyGamesBuildFile;
            case MSN:
                return msnBuildFile;
            default:
                console.log("Platform not found!");
                return null;
                break;
        }
    }

    const getFiles = () => {
        let files = [];

        for (let i = 0; i < selectedPlatforms.length; i++) {
            files.push(getFileByPlatform(selectedPlatforms[i]));
        }

        return files;
    }

    const getFileInfoList = (files: File[]) => {
        let fileInfoList = [];

        for (let i = 0; i < currentSetupGameDetails.selectedPlatforms.length; i++) {
            let platform = currentSetupGameDetails.selectedPlatforms[i];
            let commonFilePath = `${BUILDS_ROOT_URL}/${localStorageData.studioId}/${platform.id}`;
            fileInfoList.push(getBuildFilesInfo(commonFilePath, files[i]));
        }

        return fileInfoList;
    }

    const submitData = async () => {
        try {
            console.log("submitData", currentSetupGameDetails);
            setDataSending(true);

            let fileList: any = getFiles();
            let fileInfoList = getFileInfoList(fileList as File[]);
            let response = await sendFormDataRequest('upload-builds', CREATE_UPLOAD_WEB_BUILDS_URL, fileList, {
                gameRequestId: currentSetupGameDetails.id,
                webGameSubmissionSetupCurrentStateId: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
                currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
                webGameRequestId: currentSetupGameDetails.webGameRequest.id,
                webGameRequestDetailsId: currentSetupGameDetails.webGameRequestDetailsId,
                fileInfoList: fileInfoList,
                studioId: currentSetupGameDetails.studioId
            });
            console.log(response);

            setCurrentSetupGameDetails(response.data);
            setCurrentStep();
        } catch (err) {
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

    const getFileSetter = (platformName: string): any => {
        switch (platformName) {
            case META:
                return setMetaBuildFile;
            case POKI:
                return setPokiBuildFile;
            case MSN:
                return setMsnBuildFile;
            case CRAZY_GAMES:
                return setCrazyGamesBuildFile;
            default:
                return setUniversalBuildFile;
        }
    }

    const isStepCompleted = () => currentStep > WebGameSubmissionSetup.UPLOAD_WEB_BUILDS;


    return (
        <Box>
            {isStepCompleted() &&
                <Alert severity="success" sx={{ mb: 2 }}>
                    You already completed this step
                </Alert>}
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
                                    value={SINGLE_UNIVERSAL_ZIP}
                                // sx={Styles.leftRounded}
                                // disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                >
                                    Single universal ZIP
                                </ToggleButton>
                                <ToggleButton
                                    value={PLATFORM_SPECIFIC_ZIP}
                                // sx={Styles.rightRounded}
                                // disabled={canDisableAllComponents || isStepCompleted(activeStep)}
                                >
                                    Platform-specific ZIP
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                        {uploadMode === SINGLE_UNIVERSAL_ZIP && (
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
                                                            onChange={(e) => handleFileUpload(e, setUniversalBuildFile, "zip", 50)}
                                                        />
                                                    </Button>
                                                    your computer
                                                </Typography>
                                                {universalBuildFile && <Typography variant="caption"> {universalBuildFile.name}</Typography>}
                                            </Stack>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Stack>
                        )}

                        {uploadMode === PLATFORM_SPECIFIC_ZIP && (
                            platforms.map(
                                (platform: any) => (
                                    (
                                        <Stack key={platform.label} direction="row" sx={Styles.stackStyle}>
                                            <Typography width={250}>{platform.label}</Typography >
                                            <Stack gap={1} width="100%">
                                                <Paper
                                                    variant="outlined"
                                                    sx={{
                                                        p: 4,
                                                        borderStyle: "dashed",
                                                        cursor: "pointer",
                                                    }}
                                                    onDrop={(e) => handleFileDrop(e, getFileSetter(platform.label), "zip", 50)}
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
                                                                            handleFileUpload(e, getFileSetter(platform.label), "zip", 50)
                                                                        }
                                                                    />
                                                                </Button>
                                                                your computer
                                                            </Typography>
                                                            {platform.value !== null && <Typography variant="caption"> {platform.value.name}</Typography>}
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
                        disabled={isStepCompleted() || isDataSending}
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
