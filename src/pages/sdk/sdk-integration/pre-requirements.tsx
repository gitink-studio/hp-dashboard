import { Box, Checkbox, Divider, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { usePreRequirementsCompleted, useSDKIntegrationActions } from "../../../store/sdk/sdk-integration-store";
import { customStyle } from "../../../common/styles";

export const PreRequirements = () => {
    const isPreRequirementsCompleted = usePreRequirementsCompleted();
    const { setPreRequirementsCompleted } = useSDKIntegrationActions();


    return (
        <>
            <Stack gap={2}>
                <Box>
                    <Typography variant="subtitle2" pl={2}>
                        Before you start, please confirm that the following are in use (MANDATORY):
                    </Typography>

                    <List dense>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Unity version 6 or higher (LTS recommended)" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="API compatibility level .NET 4.X OR .NET Framework" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Install Newtonsoft Json v.3.0.1 package" />
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <Typography variant="subtitle2" pl={2}>
                        Android
                    </Typography>

                    <List dense>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Android operating systems version 6 (API level 23) or higher" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="TargetSdkVersion 36 or higher" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="The Gradle version is 6.7.1 or higher" />
                        </ListItem>
                    </List>
                </Box>

                <Box>
                    <Typography variant="subtitle2" pl={2}>
                        iOS
                    </Typography>

                    <List dense>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="iOS Xcode version 15 or higher" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Cocoapods version ≥ 1.12.1" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={customStyle.listItemIconStyle}>
                                <FiberManualRecordIcon fontSize="inherit" color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="The target minimum iOS Version 12.0 (iOSTargetOSVersionString)" />
                        </ListItem>
                    </List>
                </Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isPreRequirementsCompleted}
                            onChange={(event) => setPreRequirementsCompleted(event.target.checked)}
                            name="acceptTerms"
                        />
                    }
                    label="Mark this step as done"
                    sx={customStyle.checkboxTextStyle}
                />
            </Stack>

        </>
    )
}
