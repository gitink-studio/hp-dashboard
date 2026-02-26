// FacebookSetup.tsx
import { Button, CircularProgress, LinearProgress, useTheme } from '@mui/material';
import React, { useState, SyntheticEvent } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Divider,
    Stack,
} from '@mui/material';
import { NewAppSteps } from './new-app-steps';
import { BasicsSteps } from './basics-steps';
import { AdvancedSteps } from './advanced-steps';
import { useActiveStep, useCurrentGameSetupDetails, useCurrentSetupStateId, useCurrentStep, useDataSending, useGameId, useSDKDetailActions } from '../../../store/sdk/sdk-details-store';
import { useAdvancedAppStepCompleted, useAppId, useBasicAppStepCompleted, useClientToken, useFacebookSetupActions, useNewAppStepCompleted, useProgress, useReferrerDecryptionKey } from '../../../store/sdk/facebook-setup-store';
import { useNotify } from 'react-admin';
import { UPDATE_FB_DATA_URL, CREATE_GAME_SUBMISSION_DATA_URL, CURRENT_SDK_SETUP_STATE_ID, FB_APP_ID_LENGTH, HttpMethod, MINIMUM_FB_CLIENT_TOKEN_LENGTH, MINIMUM_FB_REFERRER_DECRYPTION_KEY, SDK_SETUP_GAME_ID, STUDIO_TOKEN } from '../../../common/constants';
import { sendRequest } from '../../../common/utils';
import { customStyle } from '../../../common/styles';

// Props for TabPanel component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`facebook-tabpanel-${index}`}
            aria-labelledby={`facebook-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export const FacebookSetupStep: React.FC = () => {
    const [tabIndex, setTabIndex] = useState<number>(0);
    const activeStep = useActiveStep();
    const isNewAppSetupCompleted = useNewAppStepCompleted();
    const isBasicAppSetupCompleted = useBasicAppStepCompleted();
    const isAdvancedAppSetupCompleted = useAdvancedAppStepCompleted();
    const appId = useAppId();
    const clientToken = useClientToken();
    const referrerDecryptionKey = useReferrerDecryptionKey();
    const isDataSending = useDataSending();
    const gameId = useGameId();
    const currentStep = useCurrentStep();
    const currentGameSetupDetails = useCurrentGameSetupDetails();
    const { setCurrentStep, setDataSending, setCurrentGameSetupDetails } = useSDKDetailActions();
    const notify = useNotify();
    const progress = useProgress();
    const { setBasicAppStepCompleted, setAdvancedAppStepCompleted } = useFacebookSetupActions();

    const handleTabChange = (event: SyntheticEvent, newValue: number): void => {
        setTabIndex(newValue);
    };

    const handleCompleteStep = () => {
        if (!isNewAppSetupCompleted) {
            notify("Please complete the 'New App' tab before proceeding.", { type: "warning" });
            return;
        }

        if (!isBasicAppSetupCompleted) {
            notify("Please complete the 'Basic' tab before proceeding.", { type: "warning" });
            return;
        }

        if (!isAdvancedAppSetupCompleted) {
            notify("Please complete the 'Advanced' tab before proceeding.", { type: "warning" });
            return;
        }

        if (isNaN(Number(appId))) {
            notify("App ID must be a number", { type: "error" });
            setBasicAppStepCompleted(false);
            return;
        }

        if (appId.length < FB_APP_ID_LENGTH) {
            notify("Invalid App ID", { type: "error" });
            setBasicAppStepCompleted(false);
            return;
        }

        if (referrerDecryptionKey.length < MINIMUM_FB_REFERRER_DECRYPTION_KEY) {
            notify("Invalid Referrer Decryption Key", { type: "error" });
            setBasicAppStepCompleted(false);
            return;
        }

        if (clientToken.length < MINIMUM_FB_CLIENT_TOKEN_LENGTH) {
            notify("Invalid Client Token", { type: "error" });
            setAdvancedAppStepCompleted(false);
            return;
        }

        // setCurrentStep();
        submitData();
    }

    const submitData = async () => {
        try {
            setDataSending(true);
            setTabIndex(2);

            let response = await sendRequest(HttpMethod.POST, UPDATE_FB_DATA_URL, {
                appId: appId,
                referrerDecryptionKey: referrerDecryptionKey,
                clientToken: clientToken,
                gameId: localStorage.getItem(SDK_SETUP_GAME_ID),
                gameRequestId: currentGameSetupDetails.gameRequestId,
                sdkSetupCurrentStateId: currentGameSetupDetails.androidOrIOSGameRequest.sdkSetupCurrentState.id,
                currentSetupStateIndex: currentGameSetupDetails.currentSetupStateIndex,
                facebookDetailsId: currentGameSetupDetails.androidOrIOSGameRequest.androidOrIOSGameRequestDetails.facebookDetails.id

            });
            console.log(response);

            console.log("FB data sent successfully!", response.data);
            setCurrentGameSetupDetails(response.data.data.currentGameSetupDetails.data);
            setCurrentStep();
        } catch (err) {
            console.error(err);
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);
    }

    return (
        <Box pb={4}>
            <Typography fontWeight={"bold"} gutterBottom>
                Facebook Setup
            </Typography>

            <Typography variant="body2" color="textSecondary" gutterBottom>
                Step 3: Use the step-by-step guide below to create an app for your game on Facebook.
                <br />
                If you already have an existing app for this game on FB, please follow this guide and update the settings accordingly.
            </Typography>


            <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Box>
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Facebook Setup Tabs">
                        <Tab label="New app" disabled={isDataSending} />
                        <Tab label="Basic" disabled={isDataSending} />
                        <Tab label="Advanced" disabled={isDataSending} />
                    </Tabs>
                </Box>

                <Stack direction={"row"} gap={1} sx={{ ...customStyle.stackStyle, justifyContent: "flex-end" }} >
                    <LinearProgress variant='determinate' value={progress} sx={{ width: "150px", height: "5px", borderRadius: "5px" }} />
                    <Typography variant='body2'>{progress}%</Typography>
                </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Tab Content */}
            <Box display="flex" flexDirection="column" gap={2} maxHeight={400} overflow={"auto"}>
                <Stack gap={1} direction={"row"} >
                    <img
                        src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
                        alt="Facebook Icon"
                        width={50}
                        height={50}
                        style={{ marginTop: "24px", marginLeft: "24px" }}
                    />
                    <TabPanel value={tabIndex} index={0}>
                        <Stack gap={2}>
                            <Stack>
                                <Typography fontWeight={"bold"}>Create a new app on Facebook</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    (If you already set up an app, please skip this step)
                                </Typography>
                            </Stack>
                            <NewAppSteps />
                        </Stack>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <Stack gap={2}>
                            <Stack>
                                <Typography fontWeight={"bold"}>Basic Settings</Typography>
                            </Stack>
                            <BasicsSteps />
                        </Stack>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <Stack gap={2}>
                            <Stack>
                                <Typography fontWeight={"bold"}>Advanced Settings</Typography>
                            </Stack>
                            <AdvancedSteps />
                        </Stack>
                    </TabPanel>
                </Stack>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3
            }}>
                <Button
                    variant="contained"
                    onClick={handleCompleteStep}
                    sx={{ px: 4, py: 1, textTransform: 'none' }}
                    disabled={isDataSending || activeStep !== currentStep}
                >
                    {
                        isDataSending ? (
                            <Stack gap={2} direction={'row'}>
                                <Typography>Processing</Typography>
                                <CircularProgress size={20} />
                            </Stack>
                        ) : "Complete Step"
                    }
                </Button>
            </Box>
        </Box>
    );
};
