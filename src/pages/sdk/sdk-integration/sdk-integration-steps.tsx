import React, { useState, SyntheticEvent, ReactNode } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Stack,
    CircularProgress,
} from '@mui/material';
import { PreRequirements } from './pre-requirements';
import { SDKIntegrationStep1 } from './sdk-integration-step-1';
import { SDKIntegrationStep2 } from './sdk-integration-step-2';
import { useActiveStep, useCurrentGameSetupDetails, useCurrentStep, useDataSending, useSDKDetailActions } from '../../../store/sdk/sdk-details-store';
import { usePreRequirementsCompleted, useStep1Completed, useStep2Completed } from '../../../store/sdk/sdk-integration-store';
import { useNotify } from 'react-admin';
import { sendRequest } from '../../../common/utils';
import { CREATE_SDK_INTEGRATION_DATA_URL, CURRENT_SDK_SETUP_STATE_ID, HttpMethod } from '../../../common/constants';

const steps = [
    { name: 'Pre Requirements', component: <PreRequirements /> },
    { name: 'Step 1', component: <SDKIntegrationStep1 /> },
    { name: 'Step 2', component: <SDKIntegrationStep2 /> },
];

// TabPanel props interface
interface TabPanelProps {
    value: number;
    index: number;
    children?: ReactNode;
}

// Reusable TabPanel component
const TabPanel = ({ value, index, children }: TabPanelProps) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

export const SDKIntegrationSteps = (): JSX.Element => {
    const notify = useNotify();
    const isPreRequirementsCompleted = usePreRequirementsCompleted();
    const isStep1Completed = useStep1Completed();
    const isStep2Completed = useStep2Completed();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const activeStep = useActiveStep();
    const currentStep = useCurrentStep();
    const isDataSending = useDataSending();
    const currentGameSetupDetails = useCurrentGameSetupDetails();
    const { isStepCompleted, setCurrentStep, setDataSending, setCurrentGameSetupDetails } = useSDKDetailActions();

    const handleDisable = () => {
        if (currentStep === activeStep) return false;
        return !isStepCompleted(activeStep);
    }

    const submitData = async () => {
        setDataSending(true);

        try {
            const response = await sendRequest(HttpMethod.POST, CREATE_SDK_INTEGRATION_DATA_URL, {
                gameRequestId: currentGameSetupDetails.gameRequestId,
                sdkSetupCurrentStateId: currentGameSetupDetails.androidOrIOSGameRequest.sdkSetupCurrentState.id,
                currentSetupStateIndex: currentGameSetupDetails.currentSetupStateIndex
            });

            console.log("Sdk integration data sent successfully!", response.data);
            setCurrentGameSetupDetails(response.data);
            setCurrentStep();
        } catch (err) {
            console.error(err);
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);
    }

    const handleStepComplete = () => {
        if (!isPreRequirementsCompleted) {
            notify("Please complete the 'Pre Requirements' tab before proceeding.", { type: "warning" });
            return;
        }

        if (!isStep1Completed) {
            notify("Please complete the 'Step 1' tab before proceeding.", { type: "warning" });
            return;
        }

        if (!isStep2Completed) {
            notify("Please complete the 'Step 2' tab before proceeding.", { type: "warning" });
            return;
        }

        submitData();
    }

    const handleTabChange = (event: SyntheticEvent, newIndex: number) => {
        setTabIndex(newIndex);
    };

    return (
        <Box p={3}>
            <Typography fontWeight="bold" gutterBottom>
                SDK Integration
            </Typography>

            <Typography variant="body2" gutterBottom>
                Step 4: Follow the three easy steps below and integrate Hyper Rabbit SDK.
            </Typography>

            {/* Tabs */}
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
                {steps.map((step, index) => (
                    <Tab key={index} label={step.name} />
                ))}
            </Tabs>

            <Box maxHeight={400} overflow={"auto"}>
                {steps.map((step, i) => (
                    <TabPanel key={i} value={tabIndex} index={i}>
                        {step.component}
                    </TabPanel>
                ))}
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 3
            }}>
                <Button
                    variant="contained"
                    onClick={() => handleStepComplete()}
                    sx={{ px: 4, py: 1 }}
                    disabled={handleDisable() || isDataSending}
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
}
