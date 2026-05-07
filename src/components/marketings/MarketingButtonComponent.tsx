import { FileUploadOutlined, Image, ImageOutlined, MovieOutlined, Upload, UploadOutlined, VideocamOutlined } from "@mui/icons-material";
import { Backdrop, Box, Button, Stack, Typography } from "@mui/material"
import { Component, useState } from "react";
import { Overlay } from "../Overlay";
import { CustomDialog } from "../dialog.component";
import { MarketingUploader } from "./MarketingUploader";
import { FileType } from "../../common/constants";

export const MarketingButtonComponent = (props: any) => {
    const {
        buttonText = "",
        isImagePreviewButton = true,
        onClick = null,
        width = 0,
        height = 0,
        fileSrc,
        setFileSrc,
        fileType,
        callback,
        creativeType,
    } = props.data;
    const [hoverState, setHoverState] = useState(false);
    const [dialogState, setDialogState] = useState(false);

    return (
        <>
            {
                isImagePreviewButton
                    ? <Stack gap={1} alignItems={'center'}>
                        <Button
                            onMouseEnter={() => setHoverState(true)}
                            onMouseLeave={() => setHoverState(false)}
                            onClick={() => setDialogState(true)}
                            sx={{ p: 0, }}
                        >
                            {
                                fileType === FileType.image && <Box
                                    component={'img'}
                                    src={fileSrc ? fileSrc : undefined}
                                    alt=""
                                    height={100}
                                    width={100}
                                    draggable={false}
                                    sx={{ objectFit: 'cover' }}
                                />
                            }

                            {
                                fileType === FileType.video && <video src={fileSrc} autoPlay style={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover'
                                }} />
                            }

                            {
                                !fileSrc && (

                                    <Stack sx={{ position: "absolute" }} alignItems={'center'}>
                                        {fileType === FileType.image && <ImageOutlined color="disabled" fontSize="small" />}
                                        {fileType === FileType.video && <MovieOutlined color="disabled" fontSize="small" />}
                                        <Typography color="textDisabled" fontSize={'10px'}>{buttonText}</Typography>
                                    </Stack>
                                )
                            }

                            {
                                (hoverState) && (
                                    <Overlay data={{ hoverState: hoverState, component: <FileUploadOutlined htmlColor="#fff" /> }}>
                                    </Overlay>
                                )
                            }
                        </Button>
                        {fileSrc && <Typography variant="caption" >{buttonText}</Typography>}
                    </Stack>
                    : <Button
                        onClick={onClick}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: "8px",
                            bgcolor: "rgba(0,0,0,0.05)",
                            textTransform: 'none',
                            width: 100,
                            height: 100,
                            color: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <Typography variant="body2">{`+${buttonText} more`}</Typography>
                    </Button >
            }

            {
                dialogState && (
                    <CustomDialog
                        data={{
                            title: "Upload asset",
                            caption: "Upload an asset for your game",
                            size: 'sm',
                            component: <MarketingUploader
                                data={{
                                    setFileSrc: (value: any) => setFileSrc(value),
                                    width: width,
                                    height: height,
                                    fileType: fileType,
                                    creativeType: creativeType,
                                    onFileChangeCallback: (width: any, height: any, file: any) => {
                                        callback(width, height, file);
                                        setDialogState(false);
                                    },
                                }}
                            />,
                            callback: () => setDialogState(false)
                        }}
                    />
                )
            }
        </>
    )
}
