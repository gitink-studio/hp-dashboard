import React, { useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Button,
    Paper,
    Tooltip,
    IconButton,
    useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import { SDKStyle } from "../sdk-style";
import CreativesLibrary from "./creative-library";

export const TestSetup: React.FC = () => {
    const theme = useTheme();
    const [showComponent, setShowComponent] = useState(false);

    const handleUploadCreatives = () => {
        setShowComponent(true);
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                minHeight: "70vh",
                backgroundColor: "#fff",
            }}
        >
            {/* Header */}
            <Stack direction={'row'}>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#333", fontSize: "1rem" }}
                >
                    Marketability Test
                </Typography>
                <Tooltip title="Learn more about Marketability Test">
                    <IconButton size="small" sx={{ color: "text.secondary" }}>
                        <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Stack maxHeight={"100%"}>
                <Stack
                    direction="row"
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    gap={6}
                >
                    {/* Illustration */}
                    <Box
                        sx={{
                            width: 180,
                            height: 180,
                            borderRadius: "50%",
                            backgroundColor: "#e9f5ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <img
                            src="https://img.icons8.com/?size=100&id=F6J7FBqVeMZ9&format=png&color=000000" // 🔹 Replace with your local or hosted icon
                            alt="Rocket icon"
                            style={{ width: 100, height: 100 }}
                        />
                    </Box>

                    {/* Right side content */}
                    <Stack spacing={2}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                                fontSize: "1.2rem",
                                lineHeight: 1.3,
                            }}
                        >
                            Great job, one more step and <br />
                            we’re ready to start testing
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: "0.9rem" }}
                        >
                            Please upload your creatives so we can create your test
                        </Typography>

                        {/* Buttons */}
                        <Stack direction="row" spacing={2} mt={1}>
                            <Button
                                variant="outlined"
                                startIcon={<UploadFileOutlinedIcon />}
                                sx={{
                                    textTransform: "none",
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    borderRadius: 20,
                                    px: 2.5,
                                    fontWeight: 500,
                                    "&:hover": {
                                        borderColor: theme.palette.primary.main,
                                    },
                                }}
                                onClick={handleUploadCreatives}
                            >
                                Upload Creatives
                            </Button>

                            <Button
                                variant="outlined"
                                disabled
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 20,
                                    px: 2.5,
                                    color: "#bdbdbd",
                                }}
                            >
                                Start Testing
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            {showComponent ? <CreativesLibrary /> : null}
        </Paper>
    );
};

