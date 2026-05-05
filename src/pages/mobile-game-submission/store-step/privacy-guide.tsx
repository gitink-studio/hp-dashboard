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
    TableContainer,
    TableBody,
    Table,
    TableRow,
    TableCell,
    TableHead,
} from "@mui/material";
import { useDisplayPrivacyGuide, useStoreStepActions } from "../../../store/mobile-game-submission/store-step-store";
import { Images, ImageSize } from "../../../common/constants";
import { customStyle } from "../../../common/styles";

const gettingStarted = [
    {
        content: [
            "As of October 2021, developers will not be able to upload or update Android apps without answering the data safety questionnaire. Developers will receive the following message if they did not answer the questionnaire:",

        ],
        imageUrl: Images.storeSetup.privacyGuide.image1,
    },
    {
        content: [
            "To answer the questionnaire, developers should go to the “App content” tab and press “Start” in the “Data safety” section.",
            <img src={Images.storeSetup.privacyGuide.image2} alt="Screenshot" style={customStyle.screenshotStyle} />

        ],
        imageUrl: Images.storeSetup.privacyGuide.image3,
    },
    {
        content: [
            'The first screen that will be presented is the following one. You should click “Next”.'
        ],
        imageUrl: Images.storeSetup.privacyGuide.image4,
    },
    {
        content: [
            'After you click “Next”, you will see a scroll-down screen with 3 questions. Please respond to these questions as detailed below:'
        ],
        imageUrl: Images.storeSetup.privacyGuide.image5,
    },
    {
        content: [
            'On the next page, you will have to list all categories of data collected by the app. Please mark only the following data categories, as further detailed in the pictures below, and then click next:',

            [
                { data: 'a. Location - click “Show” and select “Approximate Location”.', imageUrl: Images.storeSetup.privacyGuide.image6 },
                { data: 'b. Financial info - If purchase options such as “No ads” are added to your app by the Supersonic team, click “Show” and select “Purchases History”. If not, please don’t select anything under Financial info.', imageUrl: Images.storeSetup.privacyGuide.image7 },
                { data: 'c. App Activity - click “Show” and select “Page views and taps in app” and “other actions”.', imageUrl: Images.storeSetup.privacyGuide.image8 },
                { data: 'd. App info and performance - click “Show” and select “Crash logs” and “Diagnostics”.', imageUrl: Images.storeSetup.privacyGuide.image9 },
                { data: 'e. Device or other identifiers - click “Show” and select “Device or other identifiers”.', imageUrl: Images.storeSetup.privacyGuide.image10 },
            ].map((data, index) => (
                <Stack gap={2} mt={2} key={index}>
                    <Typography variant="body2">{data.data}</Typography>
                    <img src={data.imageUrl} alt="Screenshot" style={customStyle.screenshotStyle} />
                </Stack>)),
            ,
        ],
    },
];

const collectedData = [
    {
        title: <Typography variant="body2" fontWeight="bold" >Defining the use of the collected data</Typography>,
        content: [
            `After clicking “Next”, on the next page, you will see a list of data types collected by the app, with a “Show” button next to each data type.`,
        ],
        imageUrl: Images.storeSetup.privacyGuide.image11,
    },
    {
        content: [
            'Click “Show” next to the “Location” data type, and then click on the marked arrow to start answering additional questions regarding the Approximate Location data type.'
        ],
        imageUrl: Images.storeSetup.privacyGuide.image12,
    },
    {
        content: [
            'For each data type, you will have to repeat the above process and answer the following questions:',
            <Stack gap={1} mt={2}>
                {['a. Location - click “Show” and select “Approximate Location”.',
                    'b. Financial info - If purchase options such as “No ads” are added to your app by the Supersonic team, click “Show” and select “Purchases History”. If not, please don’t select anything under Financial info.',
                    'c. App Activity - click “Show” and select “Page views and taps in app” and “other actions”.',
                    'd. App info and performance - click “Show” and select “Crash logs” and “Diagnostics”.',
                    'e. Device or other identifiers - click “Show” and select “Device or other identifiers”.',].map((data, index) => (
                        <Typography variant="body2" key={index}>{data}</Typography>
                    ))}
            </Stack>
        ],
    },
    {
        content: [
            'For the “Approximate Location” data type, please answer these questions as detailed in the pictures below:',
            <Stack gap={2} mt={2}>
                <img src={Images.storeSetup.privacyGuide.image13} alt="Screenshot" style={customStyle.screenshotStyle} />
                <img src={Images.storeSetup.privacyGuide.image14} alt="Screenshot" style={customStyle.screenshotStyle} />
                <img src={Images.storeSetup.privacyGuide.image15} alt="Screenshot" style={customStyle.screenshotStyle} />
            </Stack>
        ],
    },
];

const dateSafetyQuestionnaire = [
    {
        title: <Typography variant="body2" fontWeight="bold" >Completing the data safety questionnaire.</Typography>,
        content: [
            `After you answered all the questions, the “Store listing preview” page should look as follows. Please make sure that you have answered all questions correctly. Then, click “Save”.`,
            <Stack gap={2} mt={2}>
                <img src={Images.storeSetup.privacyGuide.image16} alt="Screenshot" style={customStyle.screenshotStyle} />
                <img src={Images.storeSetup.privacyGuide.image17} alt="Screenshot" style={customStyle.screenshotStyle} />
                <img src={Images.storeSetup.privacyGuide.image18} alt="Screenshot" style={customStyle.screenshotStyle} />
            </Stack>
        ],
    },
    {
        content: [
            'After you answered all the questions, the “Store listing preview” page should look as follows. Please make sure that you have answered all questions correctly. Then, click “Save”.'
        ],
        imageUrl: Images.storeSetup.privacyGuide.image19,
    },
];

const dataTable = [
    {
        dataType: "Financial info",
        selectedData: "Purchase history",
        firstQuestion: 'Select “Collected”',
        secondQuestion: "No",
        thirdQuestion: 'Select “Data collection is required”',
        fourthQuestion: ["App functionality", "Analytics", "Fraud prevention, security, and compliance", "Advertising or marketing"],
        fifthQuestion: "N/A",
    },
    {
        dataType: "App info and performance",
        selectedData: "Crash logs",
        firstQuestion: 'Select “Collected”',
        secondQuestion: "No",
        thirdQuestion: 'Select “Data collection is required”',
        fourthQuestion: ["App functionality", "Analytics", "Fraud prevention, security, and compliance"],
        fifthQuestion: "N/A",
    },
    {
        dataType: "App info and performance",
        selectedData: "Diagnostics",
        firstQuestion: 'Select “Collected”',
        secondQuestion: "No",
        thirdQuestion: 'Select “Data collection is required”',
        fourthQuestion: ["App functionality", "Analytics", "Fraud prevention, security, and compliance"],
        fifthQuestion: "N/A",
    },
    {
        dataType: "App activity",
        selectedData: "App interactions",
        firstQuestion: 'Select “Collected” and “Shared”',
        secondQuestion: "No",
        thirdQuestion: 'Select “Data collection is required”',
        fourthQuestion: ["App functionality", "Analytics", "Fraud prevention, security, and compliance", "Advertising or marketing", "Personalization"],
        fifthQuestion: ["Analytics", "Fraud prevention, security, and compliance", "Advertising or marketing"],
    },
    {
        dataType: "App activity",
        selectedData: "Other actions",
        firstQuestion: 'Select “Collected” and “Shared”',
        secondQuestion: "No",
        thirdQuestion: 'Select “Data collection is required”',
        fourthQuestion: ["App functionality", "Analytics", "Fraud prevention, security, and compliance", "Advertising or marketing", "Personalization"],
        fifthQuestion: ["Analytics", "Fraud prevention, security, and compliance", "Advertising or marketing"],
    },
    {
        dataType: "Device or other identifiers",
        selectedData: "Device or other identifiers",
        firstQuestion: 'Select “Collected” and “Shared”',
        secondQuestion: "No",
        thirdQuestion: 'Select “Data collection is required”',
        fourthQuestion: ["App functionality", "Analytics", "Fraud prevention, security, and compliance", "Advertising or marketing", "Personalization"],
        fifthQuestion: ["Analytics", "Fraud prevention, security, and compliance", "Advertising or marketing"],
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
            <Paper elevation={0}>
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

                        {gettingStarted.map((step, index) => (
                            <Stack direction="row" gap={1} key={index + "gettingStarted"} pl={4} pr={2}>
                                <Box sx={customStyle.numberStyle} bgcolor={theme.palette.primary.main}>
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
                                        <img
                                            src={step.imageUrl}
                                            key={index}
                                            alt={`Step ${index + 1} screenshot`}
                                            style={customStyle.screenshotStyle}
                                        />
                                    </>}
                                    <br />
                                </Stack>
                            </Stack>
                        ))}
                        {collectedData.map((step, index) => (
                            <Box key={index + "collectedData"}>
                                <Typography variant="body2" fontWeight="bold" p={2} pl={4} component="div" key={index + "collectedData"}>{step.title}</Typography>
                                <Stack direction="row" gap={1} key={index} pl={4} pr={2}>
                                    <Box sx={customStyle.numberStyle} bgcolor={theme.palette.primary.main}>
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
                                            <img
                                                src={step.imageUrl}
                                                key={index}
                                                alt={`Step ${index + 1} screenshot`}
                                                style={customStyle.screenshotStyle}
                                            />
                                        </>}
                                        <br />
                                    </Stack>
                                </Stack>
                            </Box>
                        ))}

                        <Typography variant="body2" p={2} pl={4}>Repeat the process for the rest of the data types and fill the other questions based on the below table:</Typography>

                        <TableContainer component={Paper} elevation={0} sx={{ p: 2, pl: 4 }}>
                            <Table sx={{ minWidth: 650 }} aria-label="data safety table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Data Type</TableCell>
                                        <TableCell>Selected Data</TableCell>
                                        <TableCell>First question - collected or shared</TableCell>
                                        <TableCell>Second Question - processed ephemerally</TableCell>
                                        <TableCell>Third question - Is collection required</TableCell>
                                        <TableCell>Fourth question - purposes of collection</TableCell>
                                        <TableCell>Fifth question - purposes of sharing</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataTable.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{row.dataType}</TableCell>
                                            <TableCell>{row.selectedData}</TableCell>
                                            <TableCell>{row.firstQuestion}</TableCell>
                                            <TableCell>{row.secondQuestion}</TableCell>
                                            <TableCell>{row.thirdQuestion}</TableCell>
                                            <TableCell>
                                                {row.fourthQuestion.map((item, i) => (
                                                    <Typography key={i}>{i + 1}. {item}</Typography>
                                                ))}
                                            </TableCell>
                                            <TableCell>{row.fifthQuestion}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {dateSafetyQuestionnaire.map((step, index) => (
                            <>
                                <Typography variant="body2" fontWeight="bold" p={2} pl={4} component="div" key={index + "dateSafetyQuestionnaire"}>{step.title}</Typography>
                                <Stack direction="row" gap={1} key={index} pl={4} pr={2}>
                                    <Box sx={customStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                                        {index + 1}
                                    </Box>
                                    <Stack>
                                        {step.content.map((line, idx) => (
                                            <Typography variant="body2" key={idx + "dateSafetyQuestionnaire"} component="div">
                                                {line}
                                            </Typography>
                                        ))}

                                        {step.imageUrl && <>
                                            <br />
                                            <img
                                                src={step.imageUrl}
                                                key={index}
                                                alt={`Step ${index + 1} screenshot`}
                                                style={customStyle.screenshotStyle}
                                            />
                                        </>}
                                        <br />
                                    </Stack>
                                </Stack>
                            </>
                        ))}

                        <Typography variant="body2" fontWeight="bold" p={2} pl={4}>Congratulations! You completed the questionnaire!</Typography>
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
