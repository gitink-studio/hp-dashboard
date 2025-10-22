import React from "react";
import { Box, Paper, Stack, Typography, Button, Alert, FormControlLabel, Checkbox, useTheme } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useActiveStep, useCurrentStep, useDataSending, useSDKDetailActions } from "../../../store/sdk/sdk-details-store";
import { useActionData } from "react-router";
import { useDisplayAdvertisingID, useDisplayPrivacyGuide, useIsAdvertisingIDAnswered, useIsAllFieldsFilled, useIsAppAvailableInAllStores, useIsPrivacyGuideAnswered, useStoreStepActions } from "../../../store/sdk/store-step-store";
import { PrivacyGuide } from "./privacy-guide";
import { AdvertisingID } from "./advertising-id";
import { useNotify } from "react-admin";
import { sendRequest } from "../../../common/utils";
import { CREATE_STORE_DATA_URL, CURRENT_SDK_SETUP_STATE_ID, HttpMethod } from "../../../common/constants";

export const StoreStep: React.FC = () => {
    const notify = useNotify();
    const theme = useTheme();
    const activeStep = useActiveStep();
    const canDisplayPrivacyGuide = useDisplayPrivacyGuide();
    const canDisplayAdvertisingID = useDisplayAdvertisingID();
    const isAppAvailableInAllStores = useIsAppAvailableInAllStores();
    const isPrivacyGuideAnswered = useIsPrivacyGuideAnswered();
    const isAdvertisingIDAnswered = useIsAdvertisingIDAnswered();
    const isAllFieldsFilled = useIsAllFieldsFilled();
    const isDataSending = useDataSending();
    const currentStep = useCurrentStep();
    const { isStepCompleted, setCurrentStep, setDataSending } = useSDKDetailActions();
    const { setDisplayPrivacyGuide, setDisplayAdvertisingID, setIsAppAvailableInAllStores, setIsPrivacyGuideAnswered, setIsAdvertisingIDAnswered, setIsAllFieldsFilled } = useStoreStepActions();

    const handleDisable = () => {
        return !isStepCompleted(activeStep);
    }

    const handleAdvertisingID = () => {
        setDisplayAdvertisingID(true);
    }

    const handlePrivacyGuide = () => {
        setDisplayPrivacyGuide(true);
    }

    const validateData = (): boolean => {
        if (!isAppAvailableInAllStores) {
            notify("Please make sure your app is available in all stores worldwide", { type: "warning" });
            return false;
        }

        if (!isPrivacyGuideAnswered) {
            notify("Please use the guide to answer Google Play’s privacy questionnaire", { type: "warning" });
            return false;
        }

        if (!isAdvertisingIDAnswered) {
            notify("Please use the guide to answer Google Play’s Android 13 Advertising ID Questionnaire", { type: "warning" });
            return false;
        }

        if (!isAllFieldsFilled) {
            notify("Please make sure to fill the following fields", { type: "warning" });
            return false;
        }

        return true;
    }
    const submitData = async () => {
        setDataSending(true);

        const response = await sendRequest(HttpMethod.POST, CREATE_STORE_DATA_URL, {
            currentSetupStateId: localStorage.getItem(CURRENT_SDK_SETUP_STATE_ID),
        });

        if (response?.data?.id) {
            console.log("Store step data sent successfully!", response.data);
            setCurrentStep();
        } else {
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#fff",
                border: "1px solid #eee",
            }}
        >
            {/* Step Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    Store
                </Typography>
            </Stack>

            {/* Step Title */}
            <Typography variant="subtitle1" fontWeight="medium" mb={3}>
                Step 5: Upload to Google Play
            </Typography>

            {/* Validation Card */}
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    p: 3,
                    backgroundColor: "#fcfcfc",
                    border: "1px solid #eee",
                }}
            >
                <Stack direction="row" alignItems="flex-start" gap={3}>
                    {/* Left Icon */}
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            backgroundColor: "#f4f8ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src="https://img.icons8.com/?size=100&id=DaBUh3GLrPni&format=png&color=000000" // replace with your icon
                            alt="Validate Icon"
                            style={{ width: 40, height: 40 }}
                        />
                    </Box>

                    {/* Right Content */}
                    <Stack flex={1} gap={1}>
                        <Typography fontWeight="bold">
                            Validate your game in the store
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create / update the application on the Google Play account
                        </Typography>

                        {/* Checklist (disabled items mimic “grayed out”) */}
                        <Stack>
                            {[
                                { label: "Make sure your app is available in all stores worldwide", checked: isAppAvailableInAllStores },
                                { label: "Use the guide to answer Google Play’s privacy questionnaire", checked: isPrivacyGuideAnswered },
                                { label: "Use the guide to answer Google Play’s Android 13 Advertising ID Questionnaire", checked: isAdvertisingIDAnswered },
                                { label: "Make sure to fill the following fields", checked: isAllFieldsFilled },
                            ].map((data, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            checked={data.checked}
                                            disabled={isDataSending}
                                            onChange={(event) => {
                                                switch (index) {
                                                    case 0:
                                                        setIsAppAvailableInAllStores(event.target.checked);
                                                        break;
                                                    case 1:
                                                        setIsPrivacyGuideAnswered(event.target.checked);
                                                        break;
                                                    case 2:
                                                        setIsAdvertisingIDAnswered(event.target.checked);
                                                        break;
                                                    case 3:
                                                        setIsAllFieldsFilled(event.target.checked);
                                                        break;
                                                }
                                            }}
                                            size="small"
                                        />
                                    }
                                    label={data.label}
                                    sx={{
                                        "& .MuiFormControlLabel-label": {
                                            fontSize: "0.875rem", // same as body2 (14px)
                                        },
                                        alignItems: "center",
                                        m: 0,
                                    }}
                                />
                            ))}

                            {/* Sublist */}
                            <Stack gap={0.5} ml={5}>
                                <Typography variant="body2" color="text.primary">1. Under App Category section choose 'Games' as a category</Typography>
                                <Typography variant="body2" color="text.primary">2. Game description</Typography>
                                <Typography variant="body2" color="text.primary">3. Game icon</Typography>
                                <Typography variant="body2" color="text.primary">4. Privacy Policy</Typography>
                            </Stack>
                        </Stack>

                        {canDisplayPrivacyGuide && <PrivacyGuide />}
                        {canDisplayAdvertisingID && <AdvertisingID />}

                        {/* Buttons */}
                        <Stack direction="row" gap={2} mt={2}>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={handlePrivacyGuide}
                                sx={{
                                    borderRadius: 5,
                                    textTransform: "none",
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    "&:hover": { borderColor: theme.palette.primary.main, backgroundColor: "#fff5f2" },
                                }}
                            >
                                Privacy guide
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={handleAdvertisingID}
                                sx={{
                                    borderRadius: 5,
                                    textTransform: "none",
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    "&:hover": { borderColor: theme.palette.primary.main, backgroundColor: "#fff5f2" },
                                }}
                            >
                                Advertising ID
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>

            {/* Footer Note */}
            <Typography
                variant="body2"
                mt={3}
                sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
            >
                Use the time waiting for the store’s approval to upload creatives.
            </Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3
            }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (validateData()) {
                            submitData();
                        }
                    }}
                    sx={{ px: 4, py: 1 }}
                    disabled={isDataSending || activeStep !== currentStep}
                >
                    Complete Step
                </Button>
            </Box>
        </Paper>
    );
};

