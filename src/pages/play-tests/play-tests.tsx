import { useState, SyntheticEvent, ReactNode } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Stack,
    Button,
} from '@mui/material';

import { GameRequests } from './game-requests';
import { GamePostSubmission } from './game-post-submission';
import { DeveloperGameSubmission } from './developer-game-submission';
import { Add } from '@mui/icons-material';
import { usePlayTestsActions } from '../../store/play-tests/play-tests-store';
import { useSubmitWebGameActions } from '../../store/submit-web-game/submit-web-game-store';
import { useCreativesActions } from '../../store/submit-web-game/creatives-store';
import { useMetaCreativesActions } from '../../store/submit-web-game/meta-creatives-store';
import { useMetadataAndRatingsActions } from '../../store/submit-web-game/metadata-and-ratings-store';
import { usePlatformRequirementsActions } from '../../store/submit-web-game/platform-requirements-store';
import { useSelectPlatformActions } from '../../store/submit-web-game/select-platform-store';
import { useUploadWebBuildsActions } from '../../store/submit-web-game/upload-web-builds-store';
import { useWebGameSubmissionActions } from '../../store/submit-web-game/web-game-submission-store';

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



export const PlayTests = (): JSX.Element => {
    const [tabIndex, setTabIndex] = useState<number>(0);
    let isDeveloper = localStorage.getItem("userRole")?.toLowerCase().includes("developer");
    let isPublisher = localStorage.getItem("userRole")?.toLowerCase().includes("publisher");
    const { resetPlayTestsStore } = usePlayTestsActions();
    const { resetSubmitWebGameStore } = useSubmitWebGameActions();
    const { resetCreativesStore } = useCreativesActions();
    const { resetMetaCreativesStore } = useMetaCreativesActions();
    const { resetMetadataAndRatingsStore } = useMetadataAndRatingsActions();
    const { resetPlatformRequirementsStore } = usePlatformRequirementsActions();
    const { resetSelectPlatformStore } = useSelectPlatformActions();
    const { resetUploadWebBuildsStore } = useUploadWebBuildsActions();
    const { resetWebGameSubmissionStore } = useWebGameSubmissionActions();
    const resetAllStates = () => {
        resetPlayTestsStore();
        resetSubmitWebGameStore();
        resetCreativesStore();
        resetMetaCreativesStore();
        resetMetadataAndRatingsStore();
        resetPlatformRequirementsStore();
        resetSelectPlatformStore();
        resetUploadWebBuildsStore();
        resetWebGameSubmissionStore();
    }

    const publisherSteps = [
        { name: 'Game Submissions', component: isDeveloper ? <DeveloperGameSubmission /> : <GameRequests /> },
        { name: 'Post Submissions', component: <GamePostSubmission /> },
    ];

    const developerSteps = [
        { name: 'Game Submissions', component: <DeveloperGameSubmission /> },
    ];

    const steps = isDeveloper ? developerSteps : publisherSteps;

    const handleTabChange = (event: SyntheticEvent, newIndex: number) => {
        setTabIndex(newIndex);
    };

    const handleNewGame = () => {
        resetAllStates();
        window.location.href = '/#/submit-web-game';
    }

    return (
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
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

                {isDeveloper && (<Box>
                    <Button variant="outlined" color="primary" sx={{ textTransform: "none" }} startIcon={<Add />} onClick={handleNewGame}>
                        New Game
                    </Button>
                </Box>)}
            </Stack>

            <Box >
                {steps.map((step, i) => (
                    <TabPanel key={i} value={tabIndex} index={i}>
                        {step.component}
                    </TabPanel>
                ))}
            </Box>
        </Box>
    );
}
