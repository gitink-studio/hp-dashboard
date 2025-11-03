import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Styles } from "../../../common/styles";
import { useMetaRequirementsCompleted, usePlatformRequirementsActions } from "../../../store/submit-web-game/platform-requirements-store";

export const MetaRequirementsTab = () => {
    const isMetaRequirementsCompleted = useMetaRequirementsCompleted();
    const { setMetaRequirementsCompleted } = usePlatformRequirementsActions();
    const requirements = [
        'Build: HTML 5 (ZIP)',
        'Entry file: index.html.', ,
        'SDK hooks (recommended): init(), adBreak(), playerId(), locale().',
        'Async start: wait user gesture before audio.',
        'Mobile Support: touch & 9:16 safe area.',
        'Network calls: HTTPS only.',
        'Storage: localStorage allowed; size small.',
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
                            checked={isMetaRequirementsCompleted}
                            onChange={(event) => setMetaRequirementsCompleted(event.target.checked)}
                            name="acceptTerms"
                        />
                    }
                    label="I confirm my build adheres to Meta tech requirements"
                // sx={SDKStyle.checkboxTextStyle}
                />
            </Stack>

        </>
    )
}