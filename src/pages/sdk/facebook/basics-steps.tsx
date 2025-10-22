import { Box, Checkbox, FormControlLabel, Stack, TextField, Typography, useTheme } from "@mui/material";
import { SDKStyle } from "../sdk-style";
import { FB_APP_ID_LENGTH, ImageRootURL, ImageSize, MINIMUM_FB_REFERRER_DECRYPTION_KEY } from "../../../common/constants";
import { useAppId, useBasicAppStepCompleted, useFacebookSetupActions, useReferrerDecryptionKey } from "../../../store/sdk/facebook-setup-store";
import { useNotify } from "react-admin";



export const BasicsSteps = () => {
    const notify = useNotify();
    const theme = useTheme();
    const isBasicAppSetupCompleted = useBasicAppStepCompleted();
    const appId = useAppId();
    const referrerDecryptionKey = useReferrerDecryptionKey();
    const { setBasicAppStepCompleted, setAppId, setReferrerDecryptionKey: setReferrerDecryptionKey } = useFacebookSetupActions();

    const basicSteps = [
        {
            lines: [
                <>Go to "Settings" &rarr; "Basic"</>
            ],
            imageId: "11ZMj_AW75MHO9evnxHqxDWA-y_m7rAkN",
        },
        {
            lines: [
                <Stack direction={"row"} sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Typography variant="body2">Please fill your "App ID"</Typography>
                    <TextField
                        name="appId"
                        variant="outlined"
                        placeholder="Enter App ID"
                        value={appId}
                        onChange={(event) => setAppId(event.target.value)}
                        sx={{
                            ...SDKStyle.textFieldSmallStyle,
                            position: "relative",
                            bottom: "5px",
                            width: "460px",
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
            imageId: "1qjaC83UQJXa7x3aXzGGYqwfN_ttp_9Z-",
        },
        {
            lines: [
                'Fill the app\'s "Privacy Policy URL"',
                'Please use the same Privacy Policy  URL you have provided on Google Play.',
                <>Make sure to have a "Data Deletion Request" section of your app\'s privacy policy, that contains instructions for users on how to delete their personal data. Read more about it. <a href="https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback" target="_blank" style={{ textDecoration: "none", color: "#4c94db" }}>Click here for additional information</a>.</>
            ],
            imageId: "1IKQEizzbTtZ2S1IWktYWHb166_VrQIxv",
        },
        {
            lines: [
                <> Select the most appropriate <strong>"Sub-Category"</strong></>
            ],
            imageId: "1w58dS8NpUBFFDocV_v_M5WkoIVkrNEuA",
        },
        {
            lines: [
                <>If you have more than 15 apps and didn't add your business account when creating the app, please click on <strong>"Verification" &rarr; "Start Verification"</strong> and select <strong>"Business Verification"</strong>, then click <strong>"Start"</strong>. Otherwise, you can skip the business verification.</>
            ],
            imageId: "1VOC0FKFit2ZJQ2EygGl4NtAnrAzxK1Yz",
        },
        {
            lines: [
                <>if you have an existing account, please select it here. If not, click on <strong>"Create New Account"</strong> and follow the instructions</>
            ],
            imageId: "1EsVGocvUF5szMix94mjOn-phcwUmeUn5",
        },
        {
            lines: [
                <>Scroll down and click <strong>"Add Platform" &rarr; "Android"</strong></>
            ],
            imageId: "1T8pVNfOYOlUM6xIEJ53KQ399rPWDlUJo",
        },
        {
            lines: [
                <>Select <strong>"Google Play"</strong> as an Android store</>
            ],
            imageId: "/your-screenshot-path.png",
        },
        {
            lines: [
                <>Fill your app's <strong>"Key Hashes"</strong></>,
                ' (Key Hashes are 28 characters including the trailing, and are limited to the limited to the following characters: [a-zA-Z0-9+/=])'
            ],
            imageId: "/your-screenshot-path.png",
        },
        {
            lines: [
                <>Fill out your game's <strong>"Package Name"</strong>. In case your game is not live yet on the store, you might get an error. This will be resolved once the app will be live on the store.</>
            ],
            imageId: "/your-screenshot-path.png",
        },
        {
            lines: [
                <>Fill your app's <strong>"Class Name"</strong></>
            ],
            imageId: "/your-screenshot-path.png",
        },
        {
            lines: [
                <>
                    Copy the "install referrer Decryption Key", found under the "package name" and paste it.
                    <TextField
                        name="decryptionKey"
                        variant="outlined"
                        placeholder="Enter Referrer Decryption Key"
                        value={referrerDecryptionKey}
                        onChange={(event) => setReferrerDecryptionKey(event.target.value)}
                        sx={{ ...SDKStyle.textFieldSmallStyle, width: "640px", mt: 1 }}
                        slotProps={{
                            inputLabel: {
                                shrink: false, // prevents label from shrinking automatically
                            }
                        }}
                    />
                </>
            ],
            imageId: "/your-screenshot-path.png",
        },
        {
            lines: [
                'Don\'t forget to save your changes'
            ],
            imageId: "/your-screenshot-path.png",
        },
    ];

    const validateData = (): boolean => {
        // if (isNaN(Number(appId))) {
        //     notify("App ID must be a number", { type: "error" });
        //     return false;
        // }

        if (appId.length < FB_APP_ID_LENGTH) {
            // notify("Invalid App ID", { type: "error" });
            return true;
        }

        if (referrerDecryptionKey.length < MINIMUM_FB_REFERRER_DECRYPTION_KEY) {
            // notify("Invalid Referrer Decryption Key", { type: "error" });
            return true;
        }

        return false;
    }

    return <>
        {basicSteps.map((step, index) => (
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
                                src={ImageRootURL + step.imageId + ImageSize}
                                alt={`Step ${index + 1} screenshot`}
                                style={{ ...SDKStyle.screenshotStyle, objectFit: "cover" }}
                            />
                            <br />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack >
        ))}
        <FormControlLabel
            control={
                <Checkbox
                    checked={isBasicAppSetupCompleted}
                    onChange={(event) => {
                        setBasicAppStepCompleted(event.target.checked)
                    }}
                    name="acceptTerms"
                    disabled={validateData()}
                />
            }
            label="Mark this step as done"
            sx={SDKStyle.checkboxTextStyle}
        />
    </>
}
