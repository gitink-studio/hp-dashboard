import { useState, SyntheticEvent, ReactNode } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Stack,
    CircularProgress,
} from '@mui/material';

import { useNotify } from 'react-admin';
import { useCrazyGamesSelected, useMetaSelected, useMsnSelected, usePokiSelected } from '../../../store/submit-web-game/select-platform-store';
import { useActiveStep, useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions } from '../../../store/submit-web-game/submit-web-game-store';
import { useCrazyGamesRequirementsCompleted, useMetaRequirementsCompleted, useMsnRequirementsCompleted, usePokiRequirementsCompleted } from '../../../store/submit-web-game/platform-requirements-store';
import { MetaCreativesTab } from './meta-creatives-tab';
import { CustomImageUploader } from '../../../components/CustomImageUploader';
import { CrazyGamesCreativesTab } from './crazy-games-creatives-tab';
import { PokiCreativesTab } from './poki-creatives-tab';
import { sendRequest } from '../../../common/utils';
import { CREATE_WEB_GAME_SUBMISSION_DATA_URL, HttpMethod, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL } from '../../../common/constants';



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

export const CreativesStep = (): JSX.Element => {
    const notify = useNotify();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const activeStep = useActiveStep();
    const currentStep = useCurrentStep();
    const isDataSending = useDataSending();
    const isMetaSelected = useMetaSelected();
    const isPokiSelected = usePokiSelected();
    const isMsnSelected = useMsnSelected();
    const isMetaRequirementsCompleted = useMetaRequirementsCompleted();
    const isPokiRequirementsCompleted = usePokiRequirementsCompleted();
    const isMsnRequirementsCompleted = useMsnRequirementsCompleted();
    const isCrazyGamesRequirementsCompleted = useCrazyGamesRequirementsCompleted();
    const isCrazyGamesSelected = useCrazyGamesSelected();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const { isStepCompleted, setCurrentStep, setDataSending } = useSubmitWebGameActions();

    const steps = [
        { name: 'Meta', component: <MetaCreativesTab />, isPlatformSelected: isMetaSelected },
        { name: 'Poki', component: <PokiCreativesTab />, isPlatformSelected: isPokiSelected },
        { name: 'Crazy Games', component: <CrazyGamesCreativesTab />, isPlatformSelected: isCrazyGamesSelected },
        { name: 'MSN', component: <MetaCreativesTab />, isPlatformSelected: isMsnSelected },
    ];

    const handleDisable = () => {
        if (currentStep === activeStep) return false;
        return !isStepCompleted(activeStep);
    }

    const submitData = async () => {
        setDataSending(true);
        console.log("currentSetupGameDetails", currentSetupGameDetails);

        let response = await sendRequest(HttpMethod.POST, WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL, {
            id: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
            currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
            webGameRequestId: currentSetupGameDetails.webGameRequest.id,
            webGameRequestDetails: currentSetupGameDetails.webGameRequestDetailsId,
        });
        console.log(response);

        if (response?.data?.id) {
            console.log("Select platforms data sent successfully!", response.data);
            setCurrentStep();
        } else {
            notify("Something went wrong!", { type: "error" });
        }

        setDataSending(false);
    }

    const handleStepComplete = () => {
        if (isMetaSelected) {
            if (!isMetaRequirementsCompleted) {
                notify("Please complete the 'Meta' tab before proceeding.", { type: "warning" });
                return;
            }
        }
        if (isPokiSelected) {
            if (!isPokiRequirementsCompleted) {
                notify("Please complete the 'Poki' tab before proceeding.", { type: "warning" });
                return;
            }
        }
        if (isMsnSelected) {
            if (!isMsnRequirementsCompleted) {
                notify("Please complete the 'MSN' tab before proceeding.", { type: "warning" });
                return;
            }
        }
        if (isCrazyGamesSelected) {
            if (!isCrazyGamesRequirementsCompleted) {
                notify("Please complete the 'Crazy Games' tab before proceeding.", { type: "warning" });
                return;
            }
        }

        submitData();
    }

    const handleTabChange = (event: SyntheticEvent, newIndex: number) => {
        setTabIndex(newIndex);
    };

    return (
        <Box p={3}>
            <Typography fontWeight="bold" mb={2}>
                Creatives (Marketing)
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
                {steps.map((step, index) => (
                    step.isPlatformSelected ? <Tab key={index} label={step.name} /> : null
                ))}
            </Tabs>

            <Box >
                {steps.map((step, i) => (
                    step.isPlatformSelected ? (
                        <TabPanel key={i} value={tabIndex} index={i}>
                            {step.component}
                        </TabPanel>
                    ) : null
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
                    disabled={isDataSending}
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
