import { useState, SyntheticEvent, ReactNode, useEffect } from 'react';
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
import { useActiveStep, useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions } from '../../../store/submit-web-game/submit-web-game-store';
import { MetaCreativesTab } from './meta-creatives-tab';
import { CrazyGamesCreativesTab } from './crazy-games-creatives-tab';
import { PokiCreativesTab } from './poki-creatives-tab';
import { getFilesInfo, sendFormDataRequest, slugify } from '../../../common/utils';
import { CRAZY_GAMES, CREATE_CREATIVES_DATA_URL, CREATIVES_ROOT_URL, MARKETINGS, META, POKI, WebGameSubmissionSetup } from '../../../common/constants';
import { isAllMetaCreativeFilesUploaded, useMetaCreativesActions } from '../../../store/submit-web-game/meta-creatives-store';
import { isAllPokiCreativeFilesUploaded, usePokiCreativesActions } from '../../../store/submit-web-game/poki-creatives-store';
import { isAllCrazyGamesCreativeFilesUploaded, useCrazyGamesCreativesActions } from '../../../store/submit-web-game/crazy-games-creatives-store';
import { localStorageData } from '../../../common/localStorage';

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
    const isAllMetaCreativesCompleted = isAllMetaCreativeFilesUploaded();
    const isAllPokiCreativesCompleted = isAllPokiCreativeFilesUploaded();
    const isAllCrazyGamesCreativesCompleted = isAllCrazyGamesCreativeFilesUploaded();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const { setCurrentStep, setDataSending, setCurrentSetupGameDetails } = useSubmitWebGameActions();
    const { getAllCrazyGamesCreatives, resetCrazyGamesCreativesStore } = useCrazyGamesCreativesActions();
    const { getAllPokiCreatives, resetPokiCreativesStore } = usePokiCreativesActions();
    const { getAllMetaCreatives, resetMetaCreativesStore } = useMetaCreativesActions();
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
                        name: platform, component: <MetaCreativesTab />
                    })
                    break;
                case POKI:
                    steps.push({
                        name: platform, component: <PokiCreativesTab />
                    })
                    break;
                case CRAZY_GAMES:
                    steps.push({
                        name: platform, component: <CrazyGamesCreativesTab />
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
        return !isStepCompleted();
    }

    const getFilesByPlatform = (platform: string) => {
        switch (platform) {
            case CRAZY_GAMES:
                return getAllCrazyGamesCreatives();
            case POKI:
                return getAllPokiCreatives();
            case META:
                return getAllMetaCreatives();
            default:
                console.log("Platform not found");
                return [];
        }
    }

    const getAllFiles = () => {
        let files: any = [];
        selectedPlatforms.forEach((platform: any) => {
            files.push(getFilesByPlatform(platform));
        })

        return files;
    }

    const getFileInfoList = () => {
        let fileInfoList = [];

        for (let i = 0; i < currentSetupGameDetails.selectedPlatforms.length; i++) {
            let platform = currentSetupGameDetails.selectedPlatforms[i].name;
            let commonFilePath = `${CREATIVES_ROOT_URL}/${localStorageData.studioId}/${currentSetupGameDetails.platform.toLowerCase()}/${slugify(currentSetupGameDetails.name)}/${MARKETINGS}/${currentSetupGameDetails.selectedPlatforms[i].id}`
            let files: any = getFilesByPlatform(platform);
            fileInfoList.push(getFilesInfo(commonFilePath, files));
        }

        return fileInfoList;
    }

    const submitData = async () => {
        try {
            setDataSending(true);
            console.log("currentSetupGameDetails", currentSetupGameDetails);
            let fileList = getAllFiles().flat();
            let fileInfoList = getFileInfoList().flat();

            console.log('File list: ', fileList);
            console.log('File info list: ', fileInfoList);
            // setDataSending(false);
            // return;
            let response = await sendFormDataRequest('upload-creatives-data', CREATE_CREATIVES_DATA_URL, fileList, {
                gameRequestId: currentSetupGameDetails.id,
                webGameSubmissionSetupCurrentStateId: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
                currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
                webGameRequestId: currentSetupGameDetails.webGameRequest.id,
                webGameRequestDetailsId: currentSetupGameDetails.webGameRequest.webGameRequestDetails.id,
                fileInfoList: fileInfoList,
                studioId: currentSetupGameDetails.studioId
            });

            setCurrentSetupGameDetails(response.data.data);
            setCurrentStep();
            console.log('Response: ', response);
        } catch (err) {
            notify("Something went wrong!", { type: "error" });
            console.error(err);
        }

        setDataSending(false);
    }

    const handleStepComplete = () => {
        let canSubmitData = true;
        console.log(selectedPlatforms);
        selectedPlatforms.forEach((platform: any) => {
            switch (platform) {
                case META:
                    if (!isAllMetaCreativesCompleted) {
                        notify("Please complete the 'Meta' tab before proceeding.", { type: "warning" });
                        canSubmitData = false;
                    }
                    break;
                case POKI:
                    if (!isAllPokiCreativesCompleted) {
                        notify("Please complete the 'Poki' tab before proceeding.", { type: "warning" });
                        canSubmitData = false;
                    }
                    break;
                case CRAZY_GAMES:
                    if (!isAllCrazyGamesCreativesCompleted) {
                        notify("Please complete the 'Crazy Games' tab before proceeding.", { type: "warning" });
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

    const isStepCompleted = () => currentStep > WebGameSubmissionSetup.CREATIVES;

    return (
        <Box p={3}>
            {isStepCompleted() &&
                <Alert severity="success" sx={{ mb: 2 }}>
                    You already completed this step
                </Alert>}
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
                {steps.map((step: any, index: any) => (
                    <Tab key={index} label={step.name} />
                ))}
            </Tabs>

            <Box >
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
