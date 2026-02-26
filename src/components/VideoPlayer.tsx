// VideoModal.tsx
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";

interface VideoModalProps {
    open: boolean;
    onClose: () => void;
    videoUrl: string;
}

export const VideoPlayer: React.FC<VideoModalProps> = ({ open, onClose, videoUrl }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <div style={{ position: "relative", paddingTop: "56.25%" /* 16:9 ratio */ }}>
                <video
                    src={videoUrl}
                    title="Video Player"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "0",
                        outline: "none",
                        margin: 0,
                        padding: 0,
                    }}
                    autoPlay
                    controls
                ></video>
            </div>
        </Dialog>
    );
};
