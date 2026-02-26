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
import { Images, ImageSize } from "../../../common/constants";
import { customStyle } from "../../../common/styles";

const advertisingIDData = [
    {
        content: [
            "As of Android 13, developers will not be able to upload or update Android apps without answering the Advertising ID questionnaire.",
            <Stack gap={2} mt={2}>
                <img key="advertisingIDImage1" src={Images.storeSetup.advertisingId.image1} alt="Advertising ID Screenshot" style={customStyle.screenshotStyle} />
            </Stack>
        ],
    },
    {
        content: [
            'To answer the questionnaire, developers should go to the "App content" tab and press "Manage" in the "Advertising ID" section.',
            <Stack gap={2} mt={2}>
                <img key="advertisingIDImage2" src={Images.storeSetup.advertisingId.image2} alt="Advertising ID Screenshot" style={customStyle.screenshotStyle} />
                <img key="advertisingIDImage3" src={Images.storeSetup.advertisingId.image3} alt="Advertising ID Screenshot" style={customStyle.screenshotStyle} />
            </Stack>
        ],
    },
    {
        content: [
            'After you click on "Manage", you will see a scroll-down screen with 2 questions. Please respond to these questions as detailed below:',
            <Stack gap={2} mt={2}>
                <img key="advertisingIDImage4" src={Images.storeSetup.advertisingId.image4} alt="Advertising ID Screenshot" style={customStyle.screenshotStyle} />
                <img key="advertisingIDImage5" src={Images.storeSetup.advertisingId.image5} alt="Advertising ID Screenshot" style={customStyle.screenshotStyle} />
            </Stack>
        ],
    },
    {
        content: [
            'After clicking "Save", you should see the following message at the left bottom of the page.'
        ],
        imageUrl: Images.storeSetup.advertisingId.image6,
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
        <Dialog open={canDisplayAdvertisingID} fullWidth maxWidth="lg">
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
                            Android 13 - Advertising ID questionnaire
                        </Typography>
                    </Box>

                    <Stack overflow={"auto"} >
                        <Stack gap={1} pl={4}>
                            <Typography variant="body2" fontWeight="bold" >Getting Started</Typography>
                            <Typography variant="body2" >Google Play added a new section under App content &rarr; Advertising ID.</Typography>
                        </Stack>
                        {advertisingIDData.map((step, index) => (
                            <Stack direction="row" gap={1} key={index} pl={4} pr={2} mt={2}>
                                <Box key={index} sx={customStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                                    {index + 1}
                                </Box>
                                <Stack>
                                    {step.content.map((line, idx) => (
                                        <Typography variant="body2" key={idx} component="div">
                                            {line}
                                        </Typography>
                                    ))}
                                    {step.imageUrl && <>
                                        <br />
                                        <Box
                                            component="img" src={step.imageUrl} alt={`Step ${index + 1} screenshot`} style={customStyle.screenshotStyle} />
                                        <br />
                                    </>}
                                </Stack>
                            </Stack>
                        ))}
                        <Typography variant="body2" fontWeight="bold" pl={4}>Congratulations! You completed the questionnaire!</Typography>

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
