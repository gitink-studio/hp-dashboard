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
import { useDisplayAdvertisingID, useStoreStepActions } from "../../../store/sdk/store-step-store";
import { SDKStyle } from "../sdk-style";
import { ImageRootURL, ImageSize } from "../../../common/constants";

const AdvertisingIDData = [
    {
        content: [
            "As of Android 13, developers will not be able to upload or update Android apps without answering the Advertising ID questionnaire.",
        ],
        image: "160OqfTt881XUhR9EyiDXHr9GcooLFG7k",
    },
    {
        content: [
            'To answer the questionnaire, developers should go to the "App content" tab and press "Manage" in the "Advertising ID" section.'
        ],
        image: "1pH0W63YcHPR8QGD7Z35kgOK6b_Ql44Zx",
    },
    {
        content: [
            'After you click on "Manage", you will see a scroll-down screen with 2 questions. Please respond to these questions as detailed below:'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
    {
        content: [
            'After clicking "Save", you should see the following message at the left bottom of the page.'
        ],
        image: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
];

export const AdvertisingID: React.FC = () => {
    const canDisplayAdvertisingID = useDisplayAdvertisingID();
    const { setDisplayAdvertisingID } = useStoreStepActions();
    const theme = useTheme();

    const handleClose = () => {
        setDisplayAdvertisingID(false);
    }

    return (
        <Dialog open={canDisplayAdvertisingID} fullWidth maxWidth="md">
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    border: "1px solid #eee",
                    minHeight: "85vh",
                    pt: 1,
                }}
            >
                <Stack gap={2}>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        pl={4} pt={1}
                    >
                        Android 13 - Advertising ID questionnaire
                    </Typography>

                    <Divider variant="fullWidth" />

                    <Stack height="440px" overflow={"auto"} gap={2} pl={2}>
                        <Stack gap={1} pl={2}>
                            <Typography variant="body2" fontWeight="bold" >Getting Started</Typography>
                            <Typography variant="body2" >Google Play added a new section under App content &rarr; Advertising ID.</Typography>
                        </Stack>
                        {AdvertisingIDData.map((step, index) => (
                            <Stack direction="row" gap={1} key={index} pl={2} pr={2}>
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
                        <Typography variant="body2" fontWeight="bold" pl={2}>Congratulations! You completed the questionnaire!</Typography>

                    </Stack>

                    <Divider variant="fullWidth" />

                    <Box display={"flex"} justifyContent={"flex-end"} pr={2}>
                        <Button
                            variant="outlined"
                            sx={{
                                borderRadius: 20,
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.disabled,
                                textTransform: "none",
                                fontSize: "14px",
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