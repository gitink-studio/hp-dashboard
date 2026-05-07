import { Box, Button, Stack, Typography } from "@mui/material"
import { customStyle } from "../../common/styles"
import { useEffect, useState } from "react"
import { CREATE_CREATIVES_DATA_URL, CREATIVES_ROOT_URL, FileType, MARKETINGS } from "../../common/constants";
import { getFileInfo, sendFormDataRequest, slugify } from "../../common/utils";
import { useCurrentSetupGameDetails, useDataSending, useSubmitWebGameActions } from "../../store/submit-web-game/submit-web-game-store";

export const MarketingUploader = (props: any) => {
    const {
        width,
        height,
        fileType,
        setFileSrc,
        creativeType,
        onFileChangeCallback,
    } = props.data;
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const isDataSending = useDataSending();
    const [fileName, setFileName] = useState("No file chosen");
    const [preview, setPreview] = useState("");
    const [file, setFile] = useState(null);
    const [isValidImage, setValidImage] = useState(false);
    const { setDataSending } = useSubmitWebGameActions();

    const handleFileChange = (event: any) => {
        const file = event.target.files?.[0];

        if (file) {
            console.log(`File uploaded!`);
            const fileUrl = URL.createObjectURL(file);

            if (fileType === FileType.image) {
                const image = new Image();
                image.onload = () => {
                    setValidImage(image.width === width && image.height === height);
                }
                image.src = fileUrl;
            } else if (fileType === FileType.video) {
                const video = document.createElement("video");

                video.onloadedmetadata = () => {
                    setValidImage(video.videoWidth === width && video.videoHeight === height);
                };

                video.src = fileUrl;
            }

            setFile(file);
            setFileName(file.name);
            setPreview(fileUrl);
        }
    }

    const handleDisableButton = () => {
        return !file || !isValidImage || isDataSending;
    }

    const handleUploadAsset = async () => {
        try {
            if (!file) return;
            // console.log(`Current Setup Details: ${JSON.stringify(currentSetupGameDetails)}`);
            const filePath = `${CREATIVES_ROOT_URL}/${localStorage.studioId}/${currentSetupGameDetails.platform.toLowerCase()}/${slugify(currentSetupGameDetails.name)}/${MARKETINGS}`;
            const fileInfo: any = getFileInfo(filePath, file, `${slugify(creativeType)}-${width}x${height}`);
            setDataSending(true);

            let response = await sendFormDataRequest('upload-creatives-data', CREATE_CREATIVES_DATA_URL, [file], {
                webGameRequestDetailsId: currentSetupGameDetails?.webGameRequest?.webGameRequestDetails?.id,
                fileInfo: fileInfo,
            });

            const fileUrl = URL.createObjectURL(file);
            setFileSrc(fileUrl);
            onFileChangeCallback(width, height, file);
        } catch (err) {
            console.error(err);
        }

        setDataSending(false);
    }

    const getFileFormat = () => {
        if (fileType === FileType.image) {
            return "image/png, image/jpg, image/jpeg";
        } else if (fileType === FileType.video) {
            return "video/mp4";
        }
    }

    return (
        <Stack gap={2}>
            <Stack gap={1}>
                <Stack>
                    <Typography variant="body2" fontWeight={'bold'}>Asset</Typography>
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{
                            ...customStyle.button,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            borderRadius: '8px',
                        }}
                    >
                        Choose file {fileName}
                        <input
                            hidden
                            type="file"
                            accept={getFileFormat()}
                            onChange={(e: any) => handleFileChange(e)}
                        />
                    </Button>
                </Stack>

                {
                    fileType === FileType.image && <>
                        <Typography variant="body2">Upload an image {`${width}x${height}`}px for your game</Typography>
                        {preview && (
                            <Stack alignItems={'center'}>
                                <Box
                                    component={"img"}
                                    src={preview}
                                    alt="preview"
                                    style={{
                                        maxWidth: 550,
                                        maxHeight: 320,
                                        borderRadius: 4
                                    }}
                                />
                            </Stack>
                        )}
                    </>
                }

                {
                    fileType === FileType.video && <>
                        <Typography variant="body2">Upload a video {`${width}x${height}`}px for your game</Typography>
                        {
                            preview && (
                                <video src={preview} controls style={{
                                    maxWidth: 550,
                                    maxHeight: 320,
                                }} />
                            )
                        }
                    </>
                }
            </Stack>



            <Button
                variant="contained"
                onClick={() => handleUploadAsset()}
                disabled={handleDisableButton()}
                sx={{
                    ...customStyle.button,
                    borderRadius: '8px',
                }}>Upload asset</Button>
        </Stack>
    )
}
