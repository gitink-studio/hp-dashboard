import React, { useState } from "react";
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Dialog,
    useTheme,
    Divider,
} from "@mui/material";
import { useDisplayPrivacyGuide, useStoreStepActions } from "../../../store/sdk/store-step-store";
import { SDKStyle } from "../sdk-style";
import { ImageRootURL, ImageSize } from "../../../common/constants";

const privacyGuideData = [
    {
        content: [
            "As of October 2021, developers will not be able to upload or update Android apps without answering the data safety questionnaire. Developers will receive the following message if they did not answer the questionnaire:",
        ],
        image: "160OqfTt881XUhR9EyiDXHr9GcooLFG7k",
    },
    {
        content: [
            "To answer the questionnaire, developers should go to the “App content” tab and press “Start” in the “Data safety” section."
        ],
        image: "1pH0W63YcHPR8QGD7Z35kgOK6b_Ql44Zx",
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'After you click “Next”, you will see a scroll-down screen with 3 questions. Please respond to these questions as detailed below:'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'On the next page, you will have to list all categories of data collected by the app. Please mark only the following data categories, as further detailed in the pictures below, and then click next:',
            'Location - click “Show” and select “Approximate Location”.',
            'Financial info - If purchase options such as “No ads” are added to your app by the Supersonic team, click “Show” and select “Purchases History”. If not, please don’t select anything under Financial info.',
            'App Activity - click “Show” and select “Page views and taps in app” and “other actions”.',
            'App info and performance - click “Show” and select “Crash logs” and “Diagnostics”.',
            'Device or other identifiers - click “Show” and select “Device or other identifiers”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },

];

export const PrivacyGuide: React.FC = () => {
    const canDisplayPrivacyGuide = useDisplayPrivacyGuide();
    const { setDisplayPrivacyGuide } = useStoreStepActions();
    const theme = useTheme();

    const handleClose = () => {
        setDisplayPrivacyGuide(false);
    }

    return (
        <Dialog open={canDisplayPrivacyGuide} fullWidth maxWidth="lg">
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    border: "1px solid #eee",
                    height: "80vh",
                }}
            >
                <Stack gap={2} display={"flex"}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: "center",
                        position: 'sticky',
                        top: 0,
                        height: "75px",
                        width: "100%",
                        backgroundColor: `${theme.palette.background.paper}`,
                        borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            pl={4}
                        >
                            Privacy guide
                        </Typography>
                    </Box>

                    <Stack overflow={"auto"}>
                        <Typography variant="body2" fontWeight="bold" p={2} pl={4}>Getting Started</Typography>

                        {privacyGuideData.map((step, index) => (
                            <Stack direction="row" gap={1} key={index} pl={4} pr={2}>
                                <Box sx={SDKStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                                    {index + 1}
                                </Box>
                                <Stack>
                                    {step.content.map((line, idx) => (
                                        <Typography variant="body2" key={idx}>
                                            {line}
                                        </Typography>
                                    ))}
                                    <br />
                                    <img
                                        src={ImageRootURL + step.image + ImageSize}
                                        key={index}
                                        alt={`Step ${index + 1} screenshot`}
                                        style={SDKStyle.screenshotStyle}
                                    />
                                    <br />
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: "center",
                        pr: 2,
                        position: 'sticky',
                        bottom: 0,
                        height: "75px",
                        width: "100%",
                        backgroundColor: theme.palette.background.paper,
                        borderTop: `1px solid ${theme.palette.divider}`
                    }}>
                        <Button
                            variant="outlined"
                            sx={{
                                borderRadius: 20,
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.disabled,
                                textTransform: "none",
                                fontSize: "14px",
                                height: "35px"
                            }}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Dialog >
    );
};