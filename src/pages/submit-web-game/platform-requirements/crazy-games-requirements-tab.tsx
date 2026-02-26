import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { customStyle } from "../../../common/styles";
import { useCrazyGamesRequirementsCompleted, usePlatformRequirementsActions } from "../../../store/submit-web-game/platform-requirements-store";
import { useCurrentStep } from "../../../store/submit-web-game/submit-web-game-store";
import { WebGameSubmissionSetup } from "../../../common/constants";
import { useEffect } from "react";

export const CrazyGamesRequirementsTab = () => {
    const currentStep = useCurrentStep();
    const isCrazyGamesRequirementsCompleted = useCrazyGamesRequirementsCompleted();
    const { setCrazyGamesRequirementsCompleted } = usePlatformRequirementsActions();
    const requirements = [
        'Build: HTML 5 (ZIP)',
        'Entry file: index.html.', ,
        'Ad-friendly: pause safely on ad callbacks.',
        'Canvas resize on container changes',
        'Handle visibility change (tabbed browsing)',
    ]

    const isStepCompleted = () => currentStep > WebGameSubmissionSetup.PLATFORM_REQUIREMENTS;

    useEffect(() => {
        if (isStepCompleted()) {
            setCrazyGamesRequirementsCompleted(true);
        }
    }, [])

    return (
        <>
            <Stack gap={2}>
                <Box>
                    <List dense>
                        {requirements.map((requirement, index) => (
                            <ListItem key={index}>
                                <ListItemIcon sx={customStyle.listItemIconStyle}>
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
                            disabled={isStepCompleted()}
                        />
                    }
                    label="I confirm my build adheres to CrazyGames tech requirements"
                // sx={SDKStyle.checkboxTextStyle}
                />
            </Stack>
        </>
    )
}
