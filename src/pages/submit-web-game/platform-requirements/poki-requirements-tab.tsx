import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Styles } from "../../../common/styles";
import { usePlatformRequirementsActions, usePokiRequirementsCompleted } from "../../../store/submit-web-game/platform-requirements-store";

export const PokiRequirementsTab = () => {
    const isPokiRequirementsCompleted = usePokiRequirementsCompleted();
    const { setPokiRequirementsCompleted } = usePlatformRequirementsActions();

    const requirements = [
        'Build: HTML 5 (ZIP)',
        'Entry file: index.html.',
        'Poki SDK (recommended hooks): commercialBreak(), gameplayStart/Stop.',
        'Pause game during ad events.',
        'Mobile & desktop responsive canvas.',
        'Performance: steady 30-60fps target.',
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
                            checked={isPokiRequirementsCompleted}
                            onChange={(event) => setPokiRequirementsCompleted(event.target.checked)}
                            name="acceptTerms"
                        />
                    }
                    label="I confirm my build adheres to Poki tech requirements"
                // sx={SDKStyle.checkboxTextStyle}
                />
            </Stack>

        </>
    )
}