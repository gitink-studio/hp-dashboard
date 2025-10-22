import React, { useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    Paper,
    Tooltip,
    IconButton,
    useTheme,
    CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { SDKStyle } from "../sdk-style";
import CreativesLibrary from "./creative-library";
import { useActiveStep, useDataSending, useSDKDetailActions } from "../../../store/sdk/sdk-details-store";
import { useDisplayCreativeLibrary, useTestSetupActions, useVideoFileUrls } from "../../../store/sdk/test-setup-store";
import { CREATE_TEST_SETUP_DATA_URL, CURRENT_SDK_SETUP_STATE_ID, HttpMethod, SDK_SETUP_GAME_ID } from "../../../common/constants";
import { sendRequest } from "../../../common/utils";
import { useNotify } from "react-admin";

export const TestSetup: React.FC = () => {
    const notify = useNotify();
    const theme = useTheme();
    const activeStep = useActiveStep();
    const videoFileUrls = useVideoFileUrls();
    const isDataSending = useDataSending();
    const { isStepCompleted, setCurrentStep, setDataSending } = useSDKDetailActions();
    const canDisplayCreativeLibrary = useDisplayCreativeLibrary();
    const { setDisplayCreativeLibrary } = useTestSetupActions();

    const handleUploadCreatives = () => {
        setDisplayCreativeLibrary(true);
    }

    const handleDisable = () => {
        return !isStepCompleted(activeStep);
    }

    const submitData = async () => {
        setDataSending(true);

        let response = await sendRequest(HttpMethod.POST, CREATE_TEST_SETUP_DATA_URL, {
            currentSetupStateId: localStorage.getItem(CURRENT_SDK_SETUP_STATE_ID),
            gameId: localStorage.getItem(SDK_SETUP_GAME_ID),
            videoUrls: videoFileUrls
        });
        console.log(response);

        if (response?.data?.id) {
            console.log("FB data sent successfully!", response.data);
            setCurrentStep();
        } else {
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);


        window.location.href = '/#/tests';
        setCurrentStep();
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                minHeight: "70vh",
                backgroundColor: "#fff",
            }}
        >
            {/* Header */}
            <Stack direction={'row'}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#333", fontSize: "1rem" }}
                >
                    Marketability Test
                </Typography>
                <Tooltip title="Learn more about Marketability Test">
                    <IconButton size="small" sx={{ color: "text.secondary" }}>
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Stack maxHeight={"100%"}>
                <Stack
                    direction="row"
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={6}
                    pt={10}
                >
                    {/* Illustration */}
                    <Box
                        sx={{
                            width: 180,
                            height: 180,
                            borderRadius: "50%",
                            backgroundColor: "#e9f5ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src="https://img.icons8.com/?size=100&id=F6J7FBqVeMZ9&format=png&color=000000" // 🔹 Replace with your local or hosted icon
                            alt="Rocket icon"
                            style={{ width: 100, height: 100 }}
                        />
                    </Box>

                    {/* Right side content */}
                    <Stack spacing={2}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                fontSize: "1.2rem",
                                lineHeight: 1.3,
                            }}
                        >
                            Great job, one more step and <br />
                            we’re ready to start testing
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: "0.9rem" }}
                        >
                            Please upload your creatives so we can create your test
                        </Typography>

                        {/* Buttons */}
                        <Stack direction="row" spacing={2} mt={1}>
                            <Button
                                variant="outlined"
                                startIcon={<UploadFileOutlinedIcon />}
                                sx={{
                                    textTransform: "none",
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    borderRadius: 20,
                                    px: 2.5,
                                    fontWeight: 500,
                                    "&:hover": {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                                onClick={handleUploadCreatives}
                                disabled={isDataSending}
                            >
                                Upload Creatives
                            </Button>

                            <Button
                                variant="outlined"
                                disabled={videoFileUrls.length === 0 || isDataSending}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 20,
                                    px: 2.5,
                                    color: theme.palette.primary.main,
                                }}
                                onClick={submitData}
                            >
                                {
                                    isDataSending ? (
                                        <Stack gap={2} direction={'row'}>
                                            <Typography>Processing</Typography>
                                            <CircularProgress size={20} />
                                        </Stack>
                                    ) : "Start Testing"
                                }
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            {canDisplayCreativeLibrary ? <CreativesLibrary /> : null}
        </Paper>
    );
};

