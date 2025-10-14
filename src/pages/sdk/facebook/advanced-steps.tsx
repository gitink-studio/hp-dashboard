import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography, useTheme } from "@mui/material";
import { SDKStyle } from "../sdk-style";

const advancedSteps = [
    {
        lines: [
            <>Go to the "Settings" &rarr; "Advanced"</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Toggle on <strong>"Social Discover"</strong></>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>
                <Stack direction={"row"} sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Typography>Fill your client token</Typography>
                    <TextField
                        name="clientToken"
                        variant="outlined"
                        placeholder="Enter Client Token"
                        // value={gameDetails.storeUrl}
                        // onChange={handleGameDetailsChange}
                        sx={{
                            ...SDKStyle.textFieldSmallStyle,
                            position: "relative",
                            bottom: "5px",
                            width: "500px",
                            marginLeft: "10px",
                        }}
                        slotProps={{
                            inputLabel: {
                                shrink: false, // prevents label from shrinking automatically
                            }
                        }}
                    />
                </Stack></>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Fill the <strong>968907902038316</strong> as an authorized ad account ID</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Switch the toggle from <strong>"in development"</strong> to <strong>"live"</strong> (Your app doesn\'t have to be live on the store at this point)</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            'Don\'t forget to save your changes'
        ],
        image: "/your-screenshot-path.png",
    },
];

export const AdvancedSteps = () => {
    const theme = useTheme();

    return <>
        {advancedSteps.map((step, index) => (
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