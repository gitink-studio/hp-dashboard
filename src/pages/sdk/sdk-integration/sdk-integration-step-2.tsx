import { Box, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography, useTheme } from "@mui/material"
import { Check, ContentCopy, Visibility, VisibilityOff } from "@mui/icons-material";
import { useCopied, useSDKIntegrationActions, useShowPassword, useStep2Completed } from "../../../store/sdk/sdk-integration-store";
import { Light, Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula, dark, docco, github, lightfair, monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Styles } from "../../../common/styles";

export const SDKIntegrationStep2 = () => {
    const theme = useTheme();
    const copied = useCopied();
    const showPassword = useShowPassword();
    const password = "e862bb17e6fb3e0a9971fa518f1215bfc99cf6bc7c815e18abaffa4f1ebc0d22";
    const { setCopied, setShowPassword, setStep2Completed } = useSDKIntegrationActions();
    const isStep2Completed = useStep2Completed();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
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
                        Initialize Hyper Rabbit SDK
                    </Typography>
                    <TextField
                        name="token"
                        variant="outlined"
                        placeholder="Token"
                        value="e862bb17e6fb3e0a9971fa518f1215bfc99cf6bc7c815e18abaffa4f1ebc0d22"
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
            image: "/your-screenshot-path.png",
        },
        {
            lines: [
                <>
                    Go to the Platform tab iOS & Android and make sure all IDs were filled successfully.<br />
                    In the general tab - Facebook SDK App ID should be filled as well.
                </>
            ],
            image: "/your-screenshot-path.png",
        },
    ]
    const code = `
    private void Awake(){
        HRSdk.Initialize();
    }
    `

    return (
        <>
            <Stack gap={5}>
                <Stack direction={"row"} gap={2}>
                    <Box>
                        <img
                            src="https://img.icons8.com/?size=100&id=nG6kbttbBiqy&format=png&color=000000"
                            alt="Suitcase Icon"
                            width={50}
                            height={50}
                        />
                    </Box>
                    <Stack gap={1}>
                        <Typography fontWeight='bold'>Initialize Hyper Rabbit SDK</Typography>
                        <Typography variant="body2">
                            Invoke HRSdk.Initialize() in your first scene (even if it's a loading scene) in the void Awake() method of the Game Manager GameObject.
                        </Typography>
                        <SyntaxHighlighter language="csharp"
                            style={dark}
                            customStyle={Styles.codeStyle}>
                            {code}
                        </SyntaxHighlighter>
                        <Box>
                            For more information <a href="https://drive.google.com/uc?export=download&id=17lRtdIrV1PW1-idJ1Dv43VJG_4lspuzQ" download={"hyper-rabbit-sdk-doc.pdf"} style={{ textDecoration: "none", color: theme.palette.primary.main }}>download</a> the sdk documentation.
                        </Box>
                    </Stack>
                </Stack>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isStep2Completed}
                            onChange={(event) => setStep2Completed(event.target.checked)}
                            name="acceptTerms"
                        />
                    }
                    label="Mark this step as done"
                    sx={Styles.checkboxTextStyle}
                />
            </Stack >
        </>
    )
}