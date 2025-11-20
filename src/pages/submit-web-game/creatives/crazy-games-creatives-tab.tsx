import { Button, Divider, Paper, Stack, Typography } from "@mui/material"
import { Styles } from "../../../common/styles";
import { FileUploadOutlined } from "@mui/icons-material";
import { handleFileDrop, handleFileUpload } from "../../../common/utils";
import { CustomImageUploader } from "../../../components/CustomImageUploader";
import { useCrazyGamesCreativesActions, useLandscapeBannerFile, useLandscapeGameplayVideoFile, usePortraitBannerFile, usePortraitGameplayVideoFile, useSquareBannerFile } from "../../../store/submit-web-game/crazy-games-creatives-store";

export const CrazyGamesCreativesTab = () => {
    const fileFormat = "video";
    const maxFileSize = 50;
    const landscapeBannerFile = useLandscapeBannerFile();
    const portraitBannerFile = usePortraitBannerFile();
    const squareBannerFile = useSquareBannerFile();
    const landscapeGameplayVideoFile = useLandscapeGameplayVideoFile();
    const portraitGameplayVideoFile = usePortraitGameplayVideoFile();
    const {
        setLandscapeBannerFile,
        setPortraitBannerFile,
        setSquareBannerFile,
        setLandscapeGameplayVideoFile,
        setPortraitGameplayVideoFile,
    } = useCrazyGamesCreativesActions();

    const creativesImage = [
        {
            content: {
                label: "Banners",
                requirements: [
                    { label: "Landscape", width: 1920, height: 1080, value: landscapeBannerFile, setValue: setLandscapeBannerFile },
                    { label: "Portrait", width: 800, height: 1200, value: portraitBannerFile, setValue: setPortraitBannerFile },
                    { label: "Square", width: 800, height: 800, value: squareBannerFile, setValue: setSquareBannerFile },
                ]
            },
        },
    ]

    const creativesVideo = [
        {
            content: {
                label: "Game Play Video",
                requirements: [
                    { label: "Landscape", width: 1920, height: 1080, value: landscapeGameplayVideoFile, setValue: setLandscapeGameplayVideoFile },
                    { label: "Portrait", width: 800, height: 1080, value: portraitGameplayVideoFile, setValue: setPortraitGameplayVideoFile },
                ]
            },
        }
    ]

    return (
        <>
            <Stack gap={4}>
                {creativesImage.map((creative) => (
                    <Stack>
                        <Typography mb={2} fontWeight={"bold"}>{creative.content.label}</Typography >
                        <Stack gap={4} sx={{ ...Styles.stackStyle, ...Styles.outlineStyle }}>
                            <Stack direction="row" gap={2} sx={Styles.stackStyle} flexWrap={"wrap"}>
                                {creative.content.requirements.map((requirement) => (
                                    <CustomImageUploader
                                        customProps={{
                                            imageFile: requirement.value,
                                            label: requirement.label,
                                            disabled: false,
                                            width: requirement.width,
                                            height: requirement.height,
                                            maxFileSize: 0,
                                            fileFormat: "",
                                            setImageFile: requirement.setValue,
                                        }} />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>
                ))}

                {creativesVideo.map((creative) => (
                    <Stack>
                        <Typography mb={2} fontWeight={"bold"}>{creative.content.label}</Typography >
                        <Stack gap={4} sx={{ ...Styles.stackStyle, ...Styles.outlineStyle }}>
                            {creative.content.requirements.map((requirement) => (
                                <Stack gap={2} width={'100%'}>
                                    <Stack gap={1} width="100%">
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 4,
                                                borderStyle: "dashed",
                                                cursor: "pointer",
                                            }}
                                            onDrop={(e) => handleFileDrop(e, requirement.setValue, fileFormat, maxFileSize)}
                                            onDragOver={(e) => e.preventDefault()}
                                        >
                                            <Stack direction={"row"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} gap={3}>
                                                <FileUploadOutlined fontSize="large" />
                                                <Stack>
                                                    <Typography variant="body2">
                                                        Drag & drop your {requirement.label} ({requirement.width}x{requirement.height}) video here or
                                                        <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                                            browse
                                                            <input type="file" hidden accept="video/*"
                                                                onChange={(e) => handleFileUpload(e, requirement.setValue, fileFormat, maxFileSize)}
                                                            />
                                                        </Button>
                                                        your computer
                                                    </Typography>
                                                    {requirement.value !== null && <Typography variant="caption"> {requirement.value.name}</Typography>}
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack >))}
            </Stack >
        </>
    )
}
