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
    Divider,
} from "@mui/material";
import { Close, FileUploadOutlined } from "@mui/icons-material";
import { useDisplayCreativeLibrary, useTestSetupActions, useVideoFiles } from "../../../store/sdk/test-setup-store";
import { useNotify } from "react-admin";

const CreativesLibrary: React.FC = () => {
    const notify = useNotify();
    const canDisplayCreativeLibrary = useDisplayCreativeLibrary();
    const videoFiles = useVideoFiles();
    const { setDisplayCreativeLibrary, setVideoFiles } = useTestSetupActions();
    const theme = useTheme();
    let uploadedFiles: any = [];

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const files: FileList | null = e.dataTransfer.files;
        e.preventDefault();
        setFiles(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleClose = () => {
        setDisplayCreativeLibrary(false);
    }

    const setFiles = (files: FileList | null) => {
        let totalFileSize = 0;
        uploadedFiles = [];
        console.log(files);
        if (files !== null) {
            if (files.length >= 4 && files.length <= 6) {

                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    let extension = file.name.split('.').pop()?.toLowerCase();

                    if (extension !== 'mp4') {
                        notify("Only MP4 format is allowed", { type: "warning" });
                        return;
                    }

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
    }

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: FileList | null = e.target.files;
        setFiles(files);
    };

    return (
        <Dialog open={canDisplayCreativeLibrary} maxWidth="md" fullWidth>
            <Paper elevation={0}>
                {/* <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <Close />
                </IconButton> */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: "75px",
                        backgroundColor: `${theme.palette.background.paper}`,
                        borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                    px={4}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
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
                        }}
                    >
                        Creatives Guide
                    </Button>
                </Box>

                <Stack gap={1.5} px={4} py={2}>
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
                        sx={{
                            mt: 2,
                            p: 3,
                            border: "2px dashed #ccc",
                            borderRadius: 2,
                            textAlign: "center",
                        }}
                    >
                        <Stack>
                            <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} gap={3}>
                                <FileUploadOutlined fontSize="large" />
                                <Typography>
                                    Drag & drop your files here or
                                    <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                        browse
                                        <input type="file" hidden accept="video/mp4" multiple onChange={handleVideoUpload} />
                                    </Button>
                                    your computer
                                </Typography>
                            </Stack>
                            {videoFiles !== null &&
                                <Typography variant="caption" sx={{ whiteSpace: "pre-wrap" }}>
                                    {videoFiles.map((file) => `${file.name.slice(0, 25)}${file.name.length > 25 ? "..." : ""}`).join("\n")}
                                </Typography>
                            }
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

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: "center",
                    pr: 2,
                    position: 'sticky',
                    bottom: 0,
                    height: "75px",
                    width: "100%",
                    backgroundColor: theme.palette.background.paper,
                    borderTop: `1px solid ${theme.palette.divider}`
                }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: 20,
                            borderColor: theme.palette.divider,
                            color: theme.palette.text.disabled,
                            textTransform: "none",
                            fontSize: "14px",
                            height: "35px"
                        }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Box>
            </Paper>
        </Dialog >
    );
};

export default CreativesLibrary;
