import { Box, Checkbox, FormControlLabel, Stack, Typography, useTheme } from "@mui/material";
import { SDKStyle } from "../sdk-style";
import { ImageRootURL, ImageSize } from "../../../common/constants";
import { useFacebookSetupActions, useNewAppStepCompleted } from "../../../store/sdk/facebook-setup-store";


const newAppSteps = [
    {
        lines: [
            "Go to “My Apps” and create a new app",
            "Choose “Other”",
        ],
        imageId: "160OqfTt881XUhR9EyiDXHr9GcooLFG7k",
    },
    {
        lines: [
            <>Select <strong>"Business"</strong> as an app type</>,
        ],
        imageId: "1pH0W63YcHPR8QGD7Z35kgOK6b_Ql44Zx",
    },
    {
        lines: [
            "Fill the following fields",
            '1. "Display name"',
            '2. "App Contact Email"',
            '3. "Business Account"'

        ],
        imageId: "1yEfWF-vGwqizUfdg3IDTvl-TQ9xQUMa8",
    },
];

export const NewAppSteps = () => {
    const theme = useTheme();
    const isNewAppSetupCompleted = useNewAppStepCompleted();
    const { setNewAppStepCompleted } = useFacebookSetupActions();

    return <>
        {newAppSteps.map((step, index) => (
            <Stack direction="row" gap={1} key={index}>
                <Box sx={SDKStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                    {index + 1}
                </Box>
                <Stack>
                    {step.lines.map((line, idx) => (
                        <Typography variant="body2" key={idx}>
                            {line}
                        </Typography>
                    ))}
                    <br />
                    <img
                        src={ImageRootURL + step.imageId + ImageSize}
                        key={index}
                        alt={`Step ${index + 1} screenshot`}
                        style={SDKStyle.screenshotStyle}
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
            sx={SDKStyle.checkboxTextStyle}
        />
    </>
}
