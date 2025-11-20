import { Box, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography, useTheme } from "@mui/material"
import { Check, ContentCopy, Visibility, VisibilityOff } from "@mui/icons-material";
import { useCopied, useSDKIntegrationActions, useShowPassword, useStep1Completed } from "../../../store/sdk/sdk-integration-store";
import { Images, ImageSize, STUDIO_TOKEN } from "../../../common/constants";
import { Styles } from "../../../common/styles";
import { useCurrentGameDetails } from "../../../store/play-tests/play-tests-store";
import { useCurrentGameSetupDetails } from "../../../store/sdk/sdk-details-store";

export const SDKIntegrationStep1 = () => {
    const theme = useTheme();
    const copied = useCopied();
    const showPassword = useShowPassword();
    const isStep1Completed = useStep1Completed();
    const currentGameSetupDetails = useCurrentGameSetupDetails();
    const { setCopied, setShowPassword, setStep1Completed } = useSDKIntegrationActions();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(currentGameSetupDetails.token);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // Reset icon after 1.5s
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }

    const editSettingsInfo = [
        {
            lines: [
                <>
                    <Typography variant="body2">
                        Go to &rarr; HyperRabbit &rarr; Settings &rarr; Login with the following token.<br />
                        Your game will be automatically selected and retrieve the relevant credentials IDs
                    </Typography>
                    <TextField
                        name="token"
                        variant="outlined"
                        placeholder="Token"
                        value={currentGameSetupDetails.token}
                        type={showPassword ? "text" : "password"}
                        sx={{ ...Styles.textFieldSmallStyle, width: "640px", mt: 1 }}
                        slotProps={{
                            inputLabel: {
                                shrink: false, // prevents label from shrinking automatically
                            },
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {/* Copy Button */}
                                        <IconButton onClick={handleCopy} size="small" edge="end" >
                                            {copied ? <Check color="success" fontSize="small" /> : <ContentCopy fontSize="small" />}
                                        </IconButton>

                                        {/* Show/Hide Button */}
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            size="small"
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                </>
            ],
            imageUrl: Images.sdkIntegration.image1,
        },
        {
            lines: [
                <>
                    Go to the Platform tab iOS & Android and make sure all IDs were filled successfully.<br />
                    In the general tab - Facebook SDK App ID should be filled as well.
                </>
            ],
            imageUrl: Images.sdkIntegration.image2,
        },
    ]

    return (
        <>
            <Stack gap={5}>
                <Stack direction={"row"} sx={Styles.stackStyle} gap={2}>
                    <Box>
                        <img
                            src="https://img.icons8.com/?size=100&id=EGUjkmeZxwn4&format=png&color=000000"
                            alt="Import Icon"
                            width={50}
                            height={50}
                        />
                    </Box>
                    <Stack gap={1}>
                        <Typography variant={'h6'} fontWeight={"bold"}>Import</Typography>
                        <Typography variant="body2">Import <a href="https://drive.google.com/uc?export=download&id=14KMB5SdihkpzZF8WupB-hCbJg1oW823p" download={"hyper-rabbit-sdk"} style={{ textDecoration: "none", color: theme.palette.primary.main }}>HyperRabbitSDK.unitypackage</a> into your project</Typography>
                    </Stack>
                </Stack>

                <Stack direction={"row"} gap={2}>
                    <Box>
                        <img
                            src="https://img.icons8.com/?size=100&id=im9sGyKROO0h&format=png&color=000000"
                            alt="Edit Icon"
                            width={50}
                            height={50}
                        />
                    </Box>
                    <Stack gap={1}>
                        <Typography variant={'h6'} fontWeight={"bold"}>Edit Settings</Typography>
                        {editSettingsInfo.map((step, index) => (
                            <Stack direction="row" gap={1} key={index}>
                                <Box sx={Styles.numberStyle} bgcolor={theme.palette.primary.main}>
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
                                        alt={`Step ${index + 1} screenshot`}
                                        style={Styles.screenshotStyle}
                                    />
                                    <br />
                                </Stack>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isStep1Completed}
                            onChange={(event) => setStep1Completed(event.target.checked)}
                            name="acceptTerms"
                        />
                    }
                    label="Mark this step as done"
                    sx={Styles.checkboxTextStyle}
                />
            </Stack>
        </>
    )
}
