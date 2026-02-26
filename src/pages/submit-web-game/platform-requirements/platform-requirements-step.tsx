import React, { useState, SyntheticEvent, ReactNode } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Stack,
    CircularProgress,
    Alert,
} from '@mui/material';

import { useNotify } from 'react-admin';
import { sendRequest } from '../../../common/utils';
import { CRAZY_GAMES, CREATE_SDK_INTEGRATION_DATA_URL, CURRENT_SDK_SETUP_STATE_ID, HttpMethod, META, MSN, POKI, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL, WebGameSubmissionSetup } from '../../../common/constants';
import { useCrazyGamesSelected, useMetaSelected, useMsnSelected, usePokiSelected } from '../../../store/submit-web-game/select-platform-store';
import { MetaRequirementsTab } from './meta-requirements-tab';
import { PokiRequirementsTab } from './poki-requirements-tab';
import { MSNRequirementsTab } from './msn-requirements-tab';
import { CrazyGamesRequirementsTab } from './crazy-games-requirements-tab';
import { useActiveStep, useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions } from '../../../store/submit-web-game/submit-web-game-store';
import { useCrazyGamesRequirementsCompleted, useMetaRequirementsCompleted, useMsnRequirementsCompleted, usePokiRequirementsCompleted } from '../../../store/submit-web-game/platform-requirements-store';

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

export const PlatformRequirementsStep = (): JSX.Element => {
    const notify = useNotify();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const activeStep = useActiveStep();
    const currentStep = useCurrentStep();
    const isDataSending = useDataSending();
    const isMetaRequirementsCompleted = useMetaRequirementsCompleted();
    const isPokiRequirementsCompleted = usePokiRequirementsCompleted();
    const isMsnRequirementsCompleted = useMsnRequirementsCompleted();
    const isCrazyGamesRequirementsCompleted = useCrazyGamesRequirementsCompleted();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const { setCurrentStep, setDataSending, setCurrentSetupGameDetails } = useSubmitWebGameActions();

    const getSelectedPlatforms = () => {
        let gamePlatforms: any = [];

        currentSetupGameDetails.selectedPlatforms.forEach((gamePlatform: any) => {
            gamePlatforms.push(gamePlatform.name);
        })

        return gamePlatforms;
    };

    const getSteps = () => {
        let steps: any = [];

        selectedPlatforms.forEach((platform: any) => {
            switch (platform) {
                case META:
                    steps.push({
                        name: platform, component: <MetaRequirementsTab />
                    })
                    break;
                case POKI:
                    steps.push({
                        name: platform, component: <PokiRequirementsTab />
                    })
                    break;
                case CRAZY_GAMES:
                    steps.push({
                        name: platform, component: <CrazyGamesRequirementsTab />
                    })
                    break;
                case MSN:
                    steps.push({
                        name: platform, component: <MSNRequirementsTab />
                    })
                    break;
                default:
                    console.log(`Platform not found`);
                    break;
            }
        })

        return steps;
    }

    const selectedPlatforms = getSelectedPlatforms();
    const steps = getSteps();

    const handleDisable = () => {
        if (currentStep === activeStep) return false;
        return isStepCompleted();
    }

    const submitData = async () => {
        try {
            setDataSending(true);

            let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL, {
                gameRequestId: currentSetupGameDetails.id,
                webGameSubmissionSetupCurrentStateId: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
                currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
                webGameRequestId: currentSetupGameDetails.webGameRequest.id,
                webGameRequestDetails: currentSetupGameDetails.webGameRequest.webGameRequestDetails.id,
                studioId: currentSetupGameDetails.studioId
            });

            console.log("Response Data: ", response.data.data);
            setCurrentSetupGameDetails(response.data.data);
            setCurrentStep();
        } catch (err) {
            console.error(err);
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);
    }

    const handleStepComplete = () => {
        let canSubmitData = true;

        selectedPlatforms.forEach((platform: any) => {
            switch (platform) {
                case META:
                    if (!isMetaRequirementsCompleted) {
                        notify("Please complete the 'Meta' tab before proceeding.", { type: "warning" });
                        canSubmitData = false;
                    }
                    break;
                case POKI:
                    if (!isPokiRequirementsCompleted) {
                        notify("Please complete the 'Poki' tab before proceeding.", { type: "warning" });
                        canSubmitData = false;
                    }
                    break;
                case CRAZY_GAMES:
                    if (!isCrazyGamesRequirementsCompleted) {
                        notify("Please complete the 'Crazy Games' tab before proceeding.", { type: "warning" });
                        canSubmitData = false;
                    }
                    break;
                case MSN:
                    if (!isMsnRequirementsCompleted) {
                        notify("Please complete the 'MSN' tab before proceeding.", { type: "warning" });
                        canSubmitData = false;
                    }
                    break;
                default:
                    console.log(`Platform not found`);
                    break;
            }
        })

        if (canSubmitData)
            submitData();
    }

    const handleTabChange = (event: SyntheticEvent, newIndex: number) => {
        setTabIndex(newIndex);
    };

    const isStepCompleted = () => currentStep > WebGameSubmissionSetup.PLATFORM_REQUIREMENTS;

    return (
        <Box p={3}>
            {isStepCompleted() &&
                <Alert severity="success" sx={{ mb: 2 }}>
                    You already completed this step
                </Alert>}
            <Typography fontWeight="bold" mb={2}>
                Platform Requirements (Tech)
            </Typography>

            {/* <Typography variant="body2" gutterBottom>
                Step 4: Follow the three easy steps below and integrate Hyper Rabbit SDK.
            </Typography> */}

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
                {steps.map((step: any, index: any) => (
                    <Tab key={index} label={step.name} />
                ))}
            </Tabs>

            <Box maxHeight={400} overflow={"auto"}>
                {steps.map((step: any, i: any) => (
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
                    sx={{ px: 4, py: 1, textTransform: "none" }}
                    disabled={isDataSending || isStepCompleted()}
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
