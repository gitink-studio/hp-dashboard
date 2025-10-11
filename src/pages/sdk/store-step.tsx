import React from "react";
import { Box, Paper, Stack, Typography, Button, Alert, FormControlLabel, Checkbox, useTheme } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

export const StoreStep: React.FC = () => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "#fff",
                border: "1px solid #eee",
            }}
        >
            {/* Step Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                    Store
                </Typography>
                {/* <Alert
                    icon={<InfoOutlined fontSize="small" />}
                    severity="warning"
                    sx={{
                        p: 0.5,
                        px: 2,
                        borderRadius: 2,
                        fontSize: "0.85rem",
                        alignItems: "center",
                    }}
                >
                    You need to complete previous steps
                </Alert> */}
            </Stack>

            {/* Step Title */}
            <Typography variant="subtitle1" fontWeight="medium" mb={3}>
                Step 5: Upload to Google Play
            </Typography>

            {/* Validation Card */}
            <Paper
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    p: 3,
                    backgroundColor: "#fcfcfc",
                    border: "1px solid #eee",
                }}
            >
                <Stack direction="row" alignItems="flex-start" gap={3}>
                    {/* Left Icon */}
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            backgroundColor: "#f4f8ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src="https://img.icons8.com/?size=100&id=DaBUh3GLrPni&format=png&color=000000" // replace with your icon
                            alt="Validate Icon"
                            style={{ width: 40, height: 40 }}
                        />
                    </Box>

                    {/* Right Content */}
                    <Stack flex={1} gap={1}>
                        <Typography fontWeight="bold">
                            Validate your game in the store
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create / update the application on the Google Play account
                        </Typography>

                        {/* Checklist (disabled items mimic “grayed out”) */}
                        <Stack>
                            {[
                                "Make sure your app is available in all stores worldwide",
                                "Use the guide to answer Google Play’s privacy questionnaire",
                                "Use the guide to answer Google Play’s Android 13 Advertising ID Questionnaire",
                                "Make sure to fill the following fields",
                            ].map((label, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={
                                        <Checkbox
                                            disabled
                                            checked={index === 0 || index === 3}
                                            size="small"
                                            sx={{
                                                color: "text.disabled",
                                                "&.Mui-disabled": { color: "text.disabled" },
                                                "& .MuiSvgIcon-root": { fontSize: 18 }, // smaller checkbox icon
                                            }}
                                        />
                                    }
                                    label={label}
                                    sx={{
                                        "& .MuiFormControlLabel-label": {
                                            fontSize: "0.875rem", // same as body2 (14px)
                                            color: "text.disabled",
                                            fontWeight: 400,
                                        },
                                        alignItems: "center",
                                        m: 0,
                                    }}
                                />
                            ))}

                            {/* Sublist */}
                            <Stack gap={0.5} ml={5}>
                                <Typography variant="body2" color="text.primary">1. Under App Category section choose 'Games' as a category</Typography>
                                <Typography variant="body2" color="text.primary">2. Game description</Typography>
                                <Typography variant="body2" color="text.primary">3. Game icon</Typography>
                                <Typography variant="body2" color="text.primary">4. Privacy Policy</Typography>
                            </Stack>
                        </Stack>

                        {/* Buttons */}
                        <Stack direction="row" gap={2} mt={2}>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                sx={{
                                    borderRadius: 5,
                                    textTransform: "none",
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    "&:hover": { borderColor: theme.palette.primary.main, backgroundColor: "#fff5f2" },
                                }}
                            >
                                Privacy guide
                            </Button>
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                sx={{
                                    borderRadius: 5,
                                    textTransform: "none",
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    "&:hover": { borderColor: theme.palette.primary.main, backgroundColor: "#fff5f2" },
                                }}
                            >
                                Advertising ID
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>

            {/* Footer Note */}
            <Typography
                variant="body2"
                mt={3}
                sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
            >
                Use the time waiting for the store’s approval to upload creatives.
            </Typography>
        </Paper>
    );
};

