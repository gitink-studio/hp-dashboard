import { useState, ReactNode } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Stack,
    Divider,
} from '@mui/material';

import { GamePostSubmission } from './game-post-submission';
import { usePlayTestsActions, useSelectedGameSubmissionPage } from '../../store/play-tests/play-tests-store';
import { useFacebookSetupActions } from '../../store/sdk/facebook-setup-store';
import { useStoreStepActions } from '../../store/sdk/store-step-store';
import { useGameSubmissionActions } from '../../store/sdk/game-submission-store';
import { useTestingTermActions } from '../../store/sdk/testing-terms-store';
import { useSDKDetailActions } from '../../store/sdk/sdk-details-store';
import { useSDKIntegrationActions } from '../../store/sdk/sdk-integration-store';
import { useTestSetupActions } from '../../store/sdk/test-setup-store';
import { WebGameSubmissionPage } from './web-game-submission-page';
import { GameSubmissionPage } from '../../common/constants';
import { Android, HomeMaxOutlined } from '@mui/icons-material';
import { MobileGameSubmissionPage } from './mobile-game-submission-page';

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
    const selectedGameSubmissionPage = useSelectedGameSubmissionPage();

    const { setSelectedGameSubmissionPage } = usePlayTestsActions();

    const gameSubmissionPages = [
        { name: 'Web', component: <WebGameSubmissionPage /> },
        { name: 'Android/iOS', component: <MobileGameSubmissionPage /> },
    ]

    const steps = gameSubmissionPages;

    const handleTabChange = (event: any, newIndex: number) => {
        setTabIndex(newIndex);
        setSelectedGameSubmissionPage(newIndex === 0 ? GameSubmissionPage.WEB_GAME_SUBMISSION_PAGE : GameSubmissionPage.MOBILE_GAME_SUBMISSION_PAGE)
    };

    const handleNewGame = () => {
        // resetAllGameSubmissionStates();
        window.location.href = '/#/sdk';
    }

    const handleNewWebGame = () => {
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
                >
                    {steps.map((step, index) => (
                        <Tab key={index} label={step.name} />
                    ))}
                </Tabs>

                {/* {isDeveloper && (<Box>
                    <Stack direction={'row'} gap={2}>
                        <Button variant="outlined" color="primary" sx={{ textTransform: "none" }} startIcon={<Add />} onClick={handleNewGame}>
                            New Android/iOS Game
                        </Button>
                        <Button variant="outlined" color="primary" sx={{ textTransform: "none" }} startIcon={<Add />} onClick={handleNewWebGame}>
                            New Web Game
                        </Button>
                    </Stack>
                </Box>)} */}
            </Stack>
            <Divider />

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
