import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useAdvancedAppStepCompleted, useClientToken, useFacebookSetupActions } from "../../../store/sdk/facebook-setup-store";
import { Images, MINIMUM_FB_CLIENT_TOKEN_LENGTH } from "../../../common/constants";
import { useCurrentGameSetupDetails, useDataSending } from "../../../store/sdk/sdk-details-store";
import { customStyle } from "../../../common/styles";


export const AdvancedSteps = () => {
    const theme = useTheme();
    const isAdvancedAppSetupCompleted = useAdvancedAppStepCompleted();
    const clientToken = useClientToken();
    const isDataSending = useDataSending();
    const currentGameSetupDetails = useCurrentGameSetupDetails();
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
            imageUrl: Images.fbSetup.advanced.image1,
        },
        {
            lines: [
                <>Toggle on <strong>"Social Discover"</strong></>
            ],
            imageUrl: Images.fbSetup.advanced.image2,
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
                                ...customStyle.textFieldSmallStyle,
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
            imageUrl: Images.fbSetup.advanced.image3,
        },
        {
            lines: [
                <>Fill the <strong>{currentGameSetupDetails.androidOrIOSGameRequest.androidOrIOSGameRequestDetails.facebookDetails.adAccountId}</strong> as an authorized ad account ID</>
            ],
            imageUrl: Images.fbSetup.advanced.image4,
        },
        {
            lines: [
                <>Switch the toggle from <strong>"in development"</strong> to <strong>"live"</strong> (Your app doesn\'t have to be live on the store at this point)</>
            ],
            imageUrl: Images.fbSetup.advanced.image5,
        },
        {
            lines: [
                'Don\'t forget to save your changes'
            ],
            imageUrl: Images.fbSetup.advanced.image6,
        },
    ];

    return <>
        {advancedSteps.map((step, index) => (
            <Stack direction="row" gap={1} key={index}>
                <Stack>
                    <Stack direction={'row'} gap={2} >
                        <Box sx={customStyle.numberStyle} bgcolor={theme.palette.primary.main}>
                            {index + 1}
                        </Box>
                        <Stack>
                            {step.lines.map((line, idx) => (
                                <Typography component={'div'} key={idx} style={{ fontSize: "14px", margin: 0 }}> {line}</Typography>
                            ))}
                            <br />
                            <Box
                                component="img"
                                key={index}
                                src={step.imageUrl}
                                alt={`Step ${index + 1} screenshot`}
                                style={{ ...customStyle.screenshotStyle, objectFit: "cover" }}
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
            sx={customStyle.checkboxTextStyle}
        />
    </>
}
