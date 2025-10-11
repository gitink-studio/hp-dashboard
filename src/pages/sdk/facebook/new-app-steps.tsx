import { Box, Checkbox, FormControlLabel, Stack, Typography, useTheme } from "@mui/material";
import { SDKStyle } from "../sdk-style";

const newAppSteps = [
    {
        lines: [
            "Go to “My Apps” and create a new app",
            "Choose “Other”",
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Select <strong>"Business"</strong> as an app type</>,
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            "Fill the following fields",
            '1. "Display name"',
            '2. "App Contact Email"',
            '3. "Business Account"'

        ],
        image: "/your-screenshot-path.png",
    },
];

export const NewAppSteps = () => {
    const theme = useTheme();

    return <>
        {newAppSteps.map((step, index) => (
            <Stack direction="row" gap={1} key={index}>
                <Box sx={SDKStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                    {index + 1}
                </Box>
                <Stack>
                    {step.lines.map((line, idx) => (
                        <Typography variant="body1" key={idx}>
                            {line}
                        </Typography>
                    ))}
                    <br />
                    <img
                        src={step.image}
                        alt={`Step ${index + 1} screenshot`}
                        style={SDKStyle.facebookImageStyle}
                    />
                    <br />
                </Stack>
            </Stack>
        ))}
        <FormControlLabel
            control={
                <Checkbox
                    // checked={false}
                    // onChange={handleCheckboxChange}
                    name="acceptTerms"
                />
            }
            label="Mark this step as done"
        />
    </>
}