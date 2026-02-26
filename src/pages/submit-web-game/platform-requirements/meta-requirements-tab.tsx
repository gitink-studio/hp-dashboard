import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { customStyle } from "../../../common/styles";
import { useMetaRequirementsCompleted, usePlatformRequirementsActions } from "../../../store/submit-web-game/platform-requirements-store";
import { useCurrentStep } from "../../../store/submit-web-game/submit-web-game-store";
import { WebGameSubmissionSetup } from "../../../common/constants";
import { useEffect } from "react";

export const MetaRequirementsTab = () => {
    const currentStep = useCurrentStep();
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

    const isStepCompleted = () => currentStep > WebGameSubmissionSetup.PLATFORM_REQUIREMENTS;

    useEffect(() => {
        if (isStepCompleted()) {
            setMetaRequirementsCompleted(true);
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
                            checked={isMetaRequirementsCompleted}
                            onChange={(event) => setMetaRequirementsCompleted(event.target.checked)}
                            name="acceptTerms"
                            disabled={isStepCompleted()}
                        />
                    }
                    label="I confirm my build adheres to Meta tech requirements"
                // sx={SDKStyle.checkboxTextStyle}
                />
            </Stack>

        </>
    )
}
