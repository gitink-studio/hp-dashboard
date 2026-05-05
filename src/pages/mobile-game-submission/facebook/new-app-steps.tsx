import { Box, Checkbox, FormControlLabel, Stack, Typography, useTheme } from "@mui/material";
import { Images, ImageSize } from "../../../common/constants";
import { useFacebookSetupActions, useNewAppStepCompleted } from "../../../store/mobile-game-submission/facebook-setup-store";
import { customStyle } from "../../../common/styles";


const newAppSteps = [
    {
        lines: [
            "Go to “My Apps” and create a new app",
            "Choose “Other”",
        ],
        imageUrl: Images.fbSetup.newApp.image1,
    },
    {
        lines: [
            <>Select <strong>"Business"</strong> as an app type</>,
        ],
        imageUrl: Images.fbSetup.newApp.image2,
    },
    {
        lines: [
            "Fill the following fields",
            '1. "Display name"',
            '2. "App Contact Email"',
            '3. "Business Account"'

        ],
        imageUrl: Images.fbSetup.newApp.image3,
    },
];

export const NewAppSteps = () => {
    const theme = useTheme();
    const isNewAppSetupCompleted = useNewAppStepCompleted();
    const { setNewAppStepCompleted } = useFacebookSetupActions();

    return <>
        {newAppSteps.map((step, index) => (
            <Stack direction="row" gap={1} key={index}>
                <Box sx={customStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                    {index + 1}
                </Box>
                <Stack>
                    {step.lines.map((line, idx) => (
                        <Typography component={'div'} variant="body2" key={idx}>
                            {line}
                        </Typography>
                    ))}
                    <br />
                    <img
                        src={step.imageUrl}
                        key={index}
                        alt={`Step ${index + 1} screenshot`}
                        style={customStyle.screenshotStyle}
                    />
                    <br />
                </Stack>
            </Stack>
        ))}
        <FormControlLabel
            control={
                <Checkbox
                    checked={isNewAppSetupCompleted}
                    onChange={(event) => setNewAppStepCompleted(event.target.checked)}
                    name="acceptTerms"
                />
            }
            label="Mark this step as done"
            sx={customStyle.checkboxTextStyle}
        />
    </>
}
