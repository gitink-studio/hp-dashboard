import { useState, ReactNode } from 'react';
import { useAuthenticated } from 'react-admin';
import {
    Box,
    Tabs,
    Tab,
    Stack,
    Divider,
} from '@mui/material';

import { useGameSubmissionActions } from '../../store/game-submission/game-submission-store';
import { WebGameSubmissionPage } from './web-game-submission-page';
import { GameSubmissionPage } from '../../common/constants';
import { MobileGameSubmissionPage } from './mobile-game-submission/mobile-game-submission-page';

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

export const GameSubmission = (): JSX.Element => {
    useAuthenticated();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const { setSelectedGameSubmissionPage } = useGameSubmissionActions();

    const gameSubmissionPages = [
        { name: 'Android/iOS', component: <MobileGameSubmissionPage /> },
        { name: 'Web', component: <WebGameSubmissionPage /> },
    ]
    const steps = gameSubmissionPages;

    const handleTabChange = (event: any, newIndex: number) => {
        setTabIndex(newIndex);
        setSelectedGameSubmissionPage(newIndex === 1 ? GameSubmissionPage.WEB_GAME_SUBMISSION_PAGE : GameSubmissionPage.MOBILE_GAME_SUBMISSION_PAGE)
    };

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
