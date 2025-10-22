import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography, useTheme } from "@mui/material";
import { SDKStyle } from "../sdk-style";
import { useAdvancedAppStepCompleted, useClientToken, useFacebookSetupActions } from "../../../store/sdk/facebook-setup-store";
import { MINIMUM_FB_CLIENT_TOKEN_LENGTH } from "../../../common/constants";
import { useDataSending } from "../../../store/sdk/sdk-details-store";



export const AdvancedSteps = () => {
    const theme = useTheme();
    const isAdvancedAppSetupCompleted = useAdvancedAppStepCompleted();
    const clientToken = useClientToken();
    const isDataSending = useDataSending();
    const { setAdvancedAppStepCompleted, setClientToken } = useFacebookSetupActions();

    const validateData = (): boolean => {
        if (clientToken.length < MINIMUM_FB_CLIENT_TOKEN_LENGTH) {
            return true;
        }

        return false;
    }

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
                        <Typography variant='body2'>Fill your client token</Typography>
                        <TextField
                            name="clientToken"
                            variant="outlined"
                            placeholder="Enter Client Token"
                            value={clientToken}
                            onChange={(event) => setClientToken(event.target.value)}
                            disabled={isDataSending}
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

    return <>
        {advancedSteps.map((step, index) => (
            <Stack direction="row" gap={1} key={index}>
                <Stack>
                    <Stack direction={'row'} gap={2} >
                        <Box sx={SDKStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                            {index + 1}
                        </Box>
                        <Stack>
                            {step.lines.map((line, idx) => (
                                <p key={idx} style={{ fontSize: "14px", margin: 0 }}> {line}</p>
                            ))}
                            <br />
                            <img
                                src={step.image}
                                alt={`Step ${index + 1} screenshot`}
                                style={{ ...SDKStyle.screenshotStyle, objectFit: "cover" }}
                            />
                            <br />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        ))}
        <FormControlLabel
            control={
                <Checkbox
                    checked={isAdvancedAppSetupCompleted}
                    onChange={(event) => setAdvancedAppStepCompleted(event.target.checked)}
                    name="acceptTerms"
                    disabled={validateData()}
                />
            }
            label="Mark this step as done"
            sx={SDKStyle.checkboxTextStyle}
        />
    </>
}
