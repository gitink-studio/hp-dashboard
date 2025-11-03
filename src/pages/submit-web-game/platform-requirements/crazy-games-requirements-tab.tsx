import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Styles } from "../../../common/styles";
import { useCrazyGamesRequirementsCompleted, usePlatformRequirementsActions } from "../../../store/submit-web-game/platform-requirements-store";

export const CrazyGamesRequirementsTab = () => {
    const isCrazyGamesRequirementsCompleted = useCrazyGamesRequirementsCompleted();
    const { setCrazyGamesRequirementsCompleted } = usePlatformRequirementsActions();
    const requirements = [
        'Build: HTML 5 (ZIP)',
        'Entry file: index.html.', ,
        'Ad-friendly: pause safely on ad callbacks.',
        'Canvas resize on container changes',
        'Handle visibility change (tabbed browsing)',
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
                            checked={isCrazyGamesRequirementsCompleted}
                            onChange={(event) => setCrazyGamesRequirementsCompleted(event.target.checked)}
                            name="acceptTerms"
                        />
                    }
                    label="I confirm my build adheres to CrazyGames tech requirements"
                // sx={SDKStyle.checkboxTextStyle}
                />
            </Stack>

        </>
    )
}