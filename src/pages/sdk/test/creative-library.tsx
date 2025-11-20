import React, { useState } from "react";
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Dialog,
    IconButton,
    useTheme,
} from "@mui/material";
import { Close, FileUploadOutlined } from "@mui/icons-material";
import { useDisplayCreativeLibrary, useTestSetupActions, useVideoFiles } from "../../../store/sdk/test-setup-store";
import { useNotify } from "react-admin";

const CreativesLibrary: React.FC = () => {
    const notify = useNotify();
    const canDisplayCreativeLibrary = useDisplayCreativeLibrary();
    const videoFiles = useVideoFiles();
    const { setDisplayCreativeLibrary, setVideoFiles } = useTestSetupActions();
    const [isDragOver, setIsDragOver] = useState(false);
    const theme = useTheme();
    let uploadedFiles: any = [];

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
        setDisplayCreativeLibrary(false);
    }

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        uploadedFiles = [];
        let totalFileSize = 0;
        console.log(files);
        if (files !== null) {
            if (files.length >= 4 && files.length <= 6) {

                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    totalFileSize += file?.size;
                    uploadedFiles.push(file);
                }

                if (totalFileSize > 100 * 1024 * 1024) {
                    notify("Videos must be 100 MB or less", { type: "warning" });
                    return;
                }

                setVideoFiles(uploadedFiles);
            } else {
                notify("Please attach 4 - 6 videos", { type: "warning" });
                return;
            }
        }
    };

    return (
        <Dialog open={canDisplayCreativeLibrary}>
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
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            mr: 2,
                            px: 2,
                            py: 0.5,
                            fontSize: "0.85rem",
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
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
                            borderColor: isDragOver ? theme.palette.primary.main : "#ccc",
                            borderRadius: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "border-color 0.2s ease",
                            "&:hover": {
                                borderColor: theme.palette.primary.main,
                            },
                        }}
                    >
                        <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} gap={3}>
                            <FileUploadOutlined fontSize="large" />
                            <Stack>
                                <Typography>
                                    Drag & drop your files here or
                                    <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                        browse
                                        <input type="file" hidden accept="video/mp4" multiple onChange={handleVideoUpload} />
                                    </Button>
                                    your computer
                                </Typography>
                                {videoFiles !== null && <Typography variant="caption" sx={{ whiteSpace: "pre-wrap" }}>
                                    {videoFiles.map((file) => `${file.name.slice(0, 25)}${file.name.length > 25 ? "..." : ""}`).join("\n")}
                                </Typography>}
                            </Stack>
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
