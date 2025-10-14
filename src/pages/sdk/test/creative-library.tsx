import React, { useState } from "react";
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Divider,
    Dialog,
    IconButton,
} from "@mui/material";
import { Close, FileUploadOutlined } from "@mui/icons-material";

const CreativesLibrary: React.FC = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        // Handle dropped files here
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => setIsDragOver(false);

    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen}>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    border: "1px solid #eee",
                    minHeight: "70vh",
                }}
            >
                {/* Header */}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <Close />
                </IconButton>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#333", fontSize: "1rem" }}
                    >
                        Creatives Library
                    </Typography>

                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            borderRadius: 20,
                            borderColor: "#f26a2e",
                            color: "#f26a2e",
                            px: 2,
                            py: 0.5,
                            fontSize: "0.85rem",
                            "&:hover": {
                                borderColor: "#f26a2e",
                                backgroundColor: "#fff5f0",
                            },
                        }}
                    >
                        Creatives Guide
                    </Button>
                </Stack>

                {/* Upload Creatives Section */}
                <Stack gap={1.5}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Upload Creatives
                    </Typography>

                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                        Please attach 4–6 creatives for your FB marketability test campaign
                        following these instructions: The creatives you will upload as part of
                        this step will be used for this game’s marketability test campaign,
                        therefore they should be ready for marketing.
                    </Typography>

                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                        Please note:
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Video name length should be up to 25 characters
                    </Typography>

                    <Box component="ul" sx={{ pl: 3, m: 0 }}>
                        <li>
                            <Typography variant="body2" color="text.secondary">
                                Use English letters and numbers, you may include spaces
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2" color="text.secondary">
                                Refrain from using caret (^), underscore (_), hash (#) or period (.)
                                symbols
                            </Typography>
                        </li>
                    </Box>

                    {/* Upload Box */}
                    <Box
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        sx={{
                            mt: 2,
                            p: 3,
                            border: "2px dashed #ccc",
                            borderColor: isDragOver ? "#f26a2e" : "#ccc",
                            borderRadius: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "border-color 0.2s ease",
                            "&:hover": {
                                borderColor: "#f26a2e",
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            gap={1}
                        >
                            <FileUploadOutlined sx={{ color: "#f26a2e" }} />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Drag & drop your files here or browse your computer
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Format Info */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, fontSize: "0.8rem" }}
                    >
                        Format: MP4. Size: Less than 100 MB. Aspect Ratio: 4×5 (1080×1350).
                        Video Length: 15–30s
                    </Typography>
                </Stack>
            </Paper>
        </Dialog >
    );
};

export default CreativesLibrary;
