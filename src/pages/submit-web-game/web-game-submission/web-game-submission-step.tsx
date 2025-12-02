import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material"
import { FileUploadOutlined, PlayArrow } from "@mui/icons-material"
import { useAdditionalNotes, useControlsDescription, useWebGameTitle, usePlayableLink, useShortGameplayVideoFile, useValidateWebGameSubmissionInputs, useWebGameSubmissionActions } from "../../../store/submit-web-game/web-game-submission-store";
import { useActiveStep, useCurrentStep, useDataSending, useSubmitWebGameActions } from "../../../store/submit-web-game/submit-web-game-store";
import { useNotify } from "react-admin";
import { customStyle } from "../../../common/styles";
import { getFilesInfo, handleFileDrop, handleFileUpload, sendFormDataRequest, sendRequest, slugify } from "../../../common/utils";
import { CREATE_WEB_GAME_SUBMISSION_DATA_URL, CREATIVES_ROOT_URL, HttpMethod, STUDIO_ID, TEST_SUBMISSION, WebGameSubmissionSetup } from "../../../common/constants";
import { localStorageData } from "../../../common/localStorage";

export const WebGameSubmissionStep = () => {
    const notify = useNotify();
    const webGameTitle = useWebGameTitle();
    const playableLink = usePlayableLink();
    const controlsDescription = useControlsDescription();
    const additionalNotes = useAdditionalNotes();
    const shortGameplayVideoFile = useShortGameplayVideoFile();
    const isDataSending = useDataSending();
    const currentStep = useCurrentStep();
    const { setPlayableLink, setControlsDescription, setAdditionalNotes, setShortGameplayVideoFile, setWebGameTitle, resetWebGameSubmissionStore } = useWebGameSubmissionActions();
    const { setCurrentStep, setDataSending } = useSubmitWebGameActions();

    const validateData = (): boolean => {
        console.log("validateData");

        if (webGameTitle == '') {
            notify("Game Title is required!", { type: "error" });
            return false;
        }
        if (playableLink == '') {
            notify("Playable Link is required!", { type: "error" });
            return false;
        }
        if (controlsDescription == '') {
            notify("Controls Description is required!", { type: "error" });
            return false;
        }

        if (shortGameplayVideoFile == null) {
            notify("Short Gameplay Video is required!", { type: "error" });
            return false;
        }

        return true;
    }

    const submitData = async () => {
        try {
            console.log("submitData");
            setDataSending(true);
            const commonFilePath = `${CREATIVES_ROOT_URL}/${localStorageData.studioId}/web/${slugify(webGameTitle)}/${TEST_SUBMISSION}`
            let fileList = [];
            fileList.push(shortGameplayVideoFile);

            let fileInfoList = getFilesInfo(commonFilePath, fileList as File[]);

            let response = await sendFormDataRequest("web-game-submission-data", CREATE_WEB_GAME_SUBMISSION_DATA_URL, fileList, {
                name: webGameTitle,
                studioId: localStorage.getItem(STUDIO_ID),
                playableLinkUrl: playableLink,
                controlDescription: controlsDescription,
                additionalNotes: additionalNotes,
                status: "Pending",
                fileInfoList: fileInfoList
            });

            console.log(`Response from web game submission data: `, response);

            resetWebGameSubmissionStore();
            window.location.href = '/#/getAllGameRequests'
        } catch (err) {
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

    const handleOpenPlayableLink = () => {
        window.open(playableLink, '_blank');
    }

    return (
        <Box>
            <Stack gap={5}>
                <Paper elevation={1} sx={customStyle.paperStyle}>
                    <Typography fontWeight='bold' mb={3}> Web Game Details</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Game Title</Typography>
                            <TextField
                                fullWidth
                                name="gameTitle"
                                variant="outlined"
                                placeholder="Enter game title here"
                                value={webGameTitle}
                                onChange={(e) => setWebGameTitle(e.target.value)}
                                required
                            // sx={SDKStyle.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Playable Link (HTML 5)</Typography>

                            <Stack direction="row" sx={customStyle.stackStyle} gap={1}><TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter playable link here"
                                value={playableLink}
                                onChange={(e) => setPlayableLink(e.target.value)}
                            // sx={SDKStyle.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleOpenPlayableLink}
                                    sx={{ px: 2, py: 1, textTransform: "none" }}
                                // disabled={isStepCompleted(activeStep) || isDataSending}
                                >
                                    Test <PlayArrow />
                                </Button></Stack>
                        </Stack>

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Controls Description</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={5}
                                name="controlsDescription"
                                variant="outlined"
                                placeholder={`Enter controls description here`}
                                value={controlsDescription}
                                onChange={(e) => setControlsDescription(e.target.value)}
                            // sx={SDKStyle.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>

                        <Stack direction="row" sx={customStyle.stackStyle}>
                            <Typography width={250}>Additional Notes (Optional)</Typography>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={5}
                                name="additionalNotes"
                                variant="outlined"
                                placeholder={`Enter additional notes here`}
                                value={additionalNotes}
                                onChange={(e) => setAdditionalNotes(e.target.value)}
                            // sx={SDKStyle.textFieldStyle}
                            // disabled={storeStatus === 'Live' || canDisableAllComponents || isStepCompleted(activeStep)}
                            />
                        </Stack>
                    </Stack>
                </Paper>

                <Paper elevation={1} sx={customStyle.paperStyle}>
                    <Stack gap={1}>
                        <Typography>Short Gameplay Video </Typography>
                        <Typography variant="body2" color="textSecondary" mb={1}>
                            Please attach a 15-20s video. It should show the core gameplay clearly so that we can
                            assess your concept properly. Make sure the file weighs less than 100 MB.
                        </Typography>

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 4,
                                borderStyle: "dashed",
                                cursor: "pointer",
                            }}
                            onDrop={(e) => handleFileDrop(e, setShortGameplayVideoFile, "video", 100)}
                            onDragOver={(e) => e.preventDefault()}
                        >

                            <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} gap={3}>
                                <FileUploadOutlined fontSize="large" />
                                <Stack>
                                    <Typography>
                                        Drag & drop your files here or
                                        <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                            browse
                                            <input type="file" hidden accept="video/*"
                                                onChange={(e) => handleFileUpload(e, setShortGameplayVideoFile, "video", 100)}
                                            />
                                        </Button>
                                        your computer
                                    </Typography>
                                    {shortGameplayVideoFile !== null && <Typography variant="caption"> {shortGameplayVideoFile.name}</Typography>}
                                </Stack>
                            </Stack>
                        </Paper>
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
                            ) : "Submit for Playtest"
                        }
                    </Button>
                </Stack>
            </Stack>
        </Box>
    )
}
