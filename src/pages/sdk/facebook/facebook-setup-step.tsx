// FacebookSetup.tsx
import { useTheme } from '@mui/material';
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

    const handleTabChange = (event: SyntheticEvent, newValue: number): void => {
        setTabIndex(newValue);
    };

    return (
        <Box pb={4}>
            <Typography variant="h5" fontWeight={"bold"} gutterBottom>
                Facebook Setup
            </Typography>

            <Typography variant="body1" color="textSecondary" gutterBottom>
                Step 3: Use the step-by-step guide below to create an app for your game on Facebook.
                <br />
                If you already have an existing app for this game on FB, please follow this guide and update the settings accordingly.
            </Typography>

            {/* Tabs for New app | Basic | Advanced */}
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Facebook Setup Tabs">
                <Tab label="New app" />
                <Tab label="Basic" />
                <Tab label="Advanced" />
            </Tabs>

            <Divider sx={{ my: 2 }} />

            {/* Tab Content */}
            <Box display="flex" flexDirection="column" gap={2} maxHeight={300} overflow={"auto"}>
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
                                <Typography variant="h6" fontWeight={"bold"}>Create a new app on Facebook</Typography>
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
                                <Typography variant="h6" fontWeight={"bold"}>Basic Settings</Typography>
                            </Stack>
                            <BasicsSteps />
                        </Stack>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <Stack gap={2}>
                            <Stack>
                                <Typography variant="h6" fontWeight={"bold"}>Advanced Settings</Typography>
                            </Stack>
                            <AdvancedSteps />
                        </Stack>
                    </TabPanel>
                </Stack>
            </Box>

            {/* Placeholder content for other tabs */}
            {/* <TabPanel value={tabIndex} index={1}>
                <Typography variant="body1">Basic settings go here...</Typography>
            </TabPanel> */}

            <TabPanel value={tabIndex} index={2}>
                <Typography variant="body1">Advanced settings go here...</Typography>
            </TabPanel>

        </Box>
    );
};