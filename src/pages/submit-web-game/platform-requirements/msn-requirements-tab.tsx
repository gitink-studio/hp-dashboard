import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Styles } from "../../../common/styles";
import { useMsnRequirementsCompleted, usePlatformRequirementsActions } from "../../../store/submit-web-game/platform-requirements-store";

export const MSNRequirementsTab = () => {
    const isMsnRequirementsCompleted = useMsnRequirementsCompleted();
    const { setMsnRequirementsCompleted } = usePlatformRequirementsActions();

    const requirements = [
        'Build: HTML 5 (ZIP)',
        'Entry file: index.html.',
        'Full keyboard & mouse support; mobile optional.',
        'No external trackers without consent.',
        'Accessibility: focus ring & pause on blur recommended',
    ]

    return (
        <>
            <Stack gap={2}>
                <Box>
                    <List dense>
                        {requirements.map((requirement, index) => (
                            <ListItem key={index}>
                                <ListItemIcon sx={Styles.listItemIconStyle}>
                                    <FiberManualRecordIcon fontSize="inherit" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={requirement} />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isMsnRequirementsCompleted}
                            onChange={(event) => setMsnRequirementsCompleted(event.target.checked)}
                            name="acceptTerms"
                        />
                    }
                    label="I confirm my build adheres to MSN tech requirements"
                // sx={SDKStyle.checkboxTextStyle}
                />
            </Stack>

        </>
    )
}