import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography, useTheme } from "@mui/material";
import { SDKStyle } from "../sdk-style";

const basicSteps = [
    {
        lines: [
            <>Go to "Settings" &rarr; "Basic"</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <Stack direction={"row"} sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography>Please fill your "App ID"</Typography>
                <TextField
                    name="appId"
                    variant="outlined"
                    placeholder="Enter App ID"
                    // value={gameDetails.storeUrl}
                    // onChange={handleGameDetailsChange}
                    sx={{
                        ...SDKStyle.textFieldSmallStyle,
                        position: "relative",
                        bottom: "5px",
                        width: "475px",
                        marginLeft: "10px",
                    }}
                    slotProps={{
                        inputLabel: {
                            shrink: false, // prevents label from shrinking automatically
                        }
                    }}
                />
            </Stack>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            'Fill the app\'s "Privacy Policy URL"',
            'Please use the same Privacy Policy  URL you have provided on Google Play.',
            <>Make sure to have a "Data Deletion Request" section of your app\'s privacy policy, that contains instructions for users on how to delete their personal data. Read more about it. <a href="" style={{ textDecoration: "none", color: "#4c94db" }}>Click here for additional information</a>.</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <> Select the most appropriate <strong>"Sub-Category"</strong></>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>If you have more than 15 apps and didn't add your business account when creating the app, please click on <strong>"Verification" &rarr; "Start Verification"</strong> and select <strong>"Business Verification"</strong>, then click <strong>"Start"</strong>. Otherwise, you can skip the business verification.</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>if you have an existing account, please select it here. If not, click on <strong>"Create New Account"</strong> and follow the instructions</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Scroll down and click <strong>"Add Platform" &rarr; "Android"</strong></>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Select <strong>"Google Play"</strong> as an Android store</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Fill your app's <strong>"Key Hashes"</strong></>,
            ' (Key Hashes are 28 characters including the trailing, and are limited to the limited to the following characters: [a-zA-Z0-9+/=])'
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Fill out your game's <strong>"Package Name"</strong>. In case your game is not live yet on the store, you might get an error. This will be resolved once the app will be live on the store.</>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>Fill your app's <strong>"Class Name"</strong></>
        ],
        image: "/your-screenshot-path.png",
    },
    {
        lines: [
            <>
                Copy the "install referrer Decryption Key", found under the "package name" and paste it.
                <TextField
                    name="decryptionKey"
                    variant="outlined"
                    placeholder="Enter Referrer Decryption Key"
                    // value={gameDetails.storeUrl}
                    // onChange={handleGameDetailsChange}
                    sx={{ ...SDKStyle.textFieldSmallStyle, width: "685px" }}
                    slotProps={{
                        inputLabel: {
                            shrink: false, // prevents label from shrinking automatically
                        }
                    }}
                />
            </>
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

export const BasicsSteps = () => {
    const theme = useTheme();

    return <>
        {basicSteps.map((step, index) => (
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