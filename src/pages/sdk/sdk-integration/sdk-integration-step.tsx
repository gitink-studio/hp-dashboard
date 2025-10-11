import React, { useState, SyntheticEvent, ReactNode } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Step labels
const steps: string[] = ['Pre Requirements', 'Step 1', 'Step 2', 'Step 3', 'Step 4', 'Test SDK'];

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

export const SDKIntegrationStep = (): JSX.Element => {
    const [tabIndex, setTabIndex] = useState<number>(0);

    const handleTabChange = (event: SyntheticEvent, newIndex: number) => {
        setTabIndex(newIndex);
    };

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                SDK Integration
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                Step 4: Follow the three easy steps below and integrate Supersonic’s SDK.
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
                {steps.map((label, index) => (
                    <Tab key={index} label={label} />
                ))}
            </Tabs>

            {/* Pre Requirements Content */}
            <TabPanel value={tabIndex} index={0}>
                <Typography fontWeight="bold" gutterBottom>
                    Pre Requirements
                </Typography>

                <List dense>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Unity version 2019.4 or higher (LTS recommended)" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="API compatibility level .NET 4.X OR .NET Framework" />
                    </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight="bold" gutterBottom>
                    Android
                </Typography>

                <List dense>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Android operating systems version 6 (API level 23) or higher" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="TargetSdkVersion 34 or higher" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <>
                                    Enable Android X libraries{' '}
                                    <Typography component="span" fontWeight="bold">
                                        (Go to: Assets {'>'} External Dependency Manager {'>'} Android Resolver {'>'} Settings, Enable Use Jetifier)
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="The Gradle version is 6.7.1 or higher" />
                    </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight="bold" gutterBottom>
                    iOS
                </Typography>

                <List dense>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="iOS Xcode version 15 or higher" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Cocoapods version ≥ 1.12.1" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="The target minimum iOS Version 12.0 (iOSTargetOSVersionString)" />
                    </ListItem>
                </List>
            </TabPanel>

            {/* Placeholder panels for other steps */}
            {steps.slice(1).map((label, i) => (
                <TabPanel key={i + 1} value={tabIndex} index={i + 1}>
                    <Typography>Content for {label} goes here...</Typography>
                </TabPanel>
            ))}
        </Box>
    );
}
