import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Stack } from "@mui/material";
import { useNotify } from "react-admin";
import { FileUploadOutlined } from "@mui/icons-material";
import { useGameIconFile, useGamePlayVideoFile, useGameSubmissionActions, useStoreStatus } from "../../../store/sdk/game-submission-store";
import { Styles } from "../../../common/styles";

const GameAssetsForm = () => {
    const notify = useNotify();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const storeStatus = useStoreStatus();
    const gameIconFile = useGameIconFile();
    const { setGameIconFile, setGamePlayVideoFile } = useGameSubmissionActions();

    useEffect(() => { console.log(`GameIconUrl Changed: ${gameIconFile}`) }, [gameIconFile]);

    const resetIconFile = () => {
        setGameIconFile(null as unknown as File);
    }

    const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log("handleIconUpload")
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                notify("Icon must be 10 MB or less", { type: "warning" });
                resetIconFile();
                return;
            }

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;

            img.onload = () => {
                const { naturalWidth, naturalHeight } = img;
                const isSquare = naturalWidth === naturalHeight;
                console.log("width: " + naturalWidth + " height: " + naturalHeight);
                if (!isSquare) {
                    notify('Image must be square (equal width and height)', { type: 'warning' });
                    URL.revokeObjectURL(objectUrl); // Clean up
                    resetIconFile();
                    return;
                }
            }

            if (file.size > 10 * 1024 * 1024) {
                notify("Icon must be 10 MB or less", { type: "warning" });
                resetIconFile();
                return;
            }

            setGameIconFile(file);
            console.log("File name: ", gameIconFile);
            e.target.value = "";
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 100 * 1024 * 1024) {
                notify("Video must be 100 MB or less", { type: "warning" });
                return;
            }
            setVideoFile(file);
            setGamePlayVideoFile(file);
        }
    };

    const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.size > 100 * 1024 * 1024) {
                notify("Video must be 100 MB or less", { type: "warning" });
                return;
            }
            setVideoFile(file);
        }
    };

    const getImageSrc = () => {
        if (gameIconFile instanceof File)
            return URL.createObjectURL(gameIconFile);

        if (typeof gameIconFile === 'string')
            return gameIconFile;
    }

    return (
        <Paper elevation={0} sx={Styles.paperStyle}>
            <Stack gap={3}>
                <Typography fontWeight={"bold"}>Game Assets</Typography>

                <Stack direction={"row"} sx={Styles.stackStyle} gap={3}>
                    <Button
                        variant={gameIconFile === null ? "outlined" : "text"}
                        component="label"
                        sx={{
                            width: 75,
                            height: 75,
                            borderStyle: "dashed",
                            position: "relative",
                            overflow: "hidden",
                            p: 0,
                        }}
                        disabled={storeStatus === 'Live'}
                    >
                        {!gameIconFile && (
                            <Stack sx={Styles.stackStyle} gap={1}>
                                <FileUploadOutlined />
                                <Typography fontSize="12px" sx={{ textTransform: "none" }}>
                                    Upload
                                </Typography>
                            </Stack>
                        )}

                        <input type="file" hidden accept="image/png" onChange={handleIconUpload} />

                        {(typeof gameIconFile === 'string' && gameIconFile !== "" && gameIconFile !== null) && (
                            <Box
                                component="img"
                                src={gameIconFile}
                                alt="Fetched icon preview"
                                sx={{
                                    position: 'absolute',
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    objectPosition: "center",
                                    imageRendering: "auto",
                                }}
                            />
                        )}

                        {gameIconFile instanceof File && gameIconFile !== null && (
                            <><Typography variant="body2">Culprit</Typography>
                                <Box
                                    component="img"
                                    src={URL.createObjectURL(gameIconFile)}
                                    alt="Uploaded icon preview"
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain", // fit nicely
                                        backgroundColor: "#fafafa",
                                    }}
                                /></>
                        )}
                    </Button>

                    <Stack gap={1}>
                        <Typography>Game Icon</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Upload a square icon in PNG format (10 MB or less)
                        </Typography>
                    </Stack>
                </Stack>

                {/* Gameplay / Concept Video */}
                <Stack gap={1}>
                    <Typography>Gameplay / Concept Videos</Typography>
                    <Typography variant="body2" color="textSecondary" mb={1}>
                        Please attach a 15-20s video. It should show the core gameplay clearly so that we can
                        assess your concept properly. Make sure the file weighs less than 100 MB.
                    </Typography>

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 4,
                            borderStyle: "dashed",
                            cursor: "pointer",
                        }}
                        onDrop={handleVideoDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >

                        <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} gap={3}>
                            <FileUploadOutlined fontSize="large" />
                            <Stack>
                                <Typography>
                                    Drag & drop your files here or
                                    <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                        browse
                                        <input type="file" hidden accept="video/*" onChange={handleVideoUpload} />
                                    </Button>
                                    your computer
                                </Typography>
                                {videoFile && <Typography variant="caption"> {videoFile.name}</Typography>}
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>
            </Stack>
        </Paper >
    );
};

export default GameAssetsForm;
