import { Button, Divider, Paper, Stack, Typography } from "@mui/material"
import { Styles } from "../../../common/styles";
import { FileUploadOutlined } from "@mui/icons-material";
import { handleFileDrop, handleFileUpload } from "../../../common/utils";
import { useLargeAppIconFile, useSmallLandscapeBannerImageFile, useMetaCreativesActions, useSmallAppIconFile, useLargeLandscapeBannerImageFile, useCoverImageFile, useLandscapeSplashImageFile, usePortraitSplashImageFile, useGameplayLandscapeVideoFile, useGameplayPortraitVideoFile, useGameplaySquareVideoFile, } from "../../../store/submit-web-game/meta-creatives-store";
import { CustomImageUploader } from "../../../components/CustomImageUploader";
import { usePortraitBannerFile, useSquareBannerFile } from "../../../store/submit-web-game/crazy-games-creatives-store";

export const MetaCreativesTab = () => {
    const largeAppIconFile = useLargeAppIconFile();
    const smallAppIconFile = useSmallAppIconFile();
    const smallLandscapeBannerImageFile = useSmallLandscapeBannerImageFile();
    const largeLandscapeBannerImageFile = useLargeLandscapeBannerImageFile();
    const portraitBannerImageFile = usePortraitBannerFile();
    const squareBannerImageFile = useSquareBannerFile();
    const coverImageFile = useCoverImageFile();
    const landscapeSplashImageFile = useLandscapeSplashImageFile();
    const portraitSplashImageFile = usePortraitSplashImageFile();
    const gameplayLandscapeVideoFile = useGameplayLandscapeVideoFile();
    const gameplayPortraitVideoFile = useGameplayPortraitVideoFile();
    const gameplaySquareVideoFile = useGameplaySquareVideoFile();

    const {
        setLargeAppIconFile,
        setSmallAppIconFile,
        setSmallLandscapeBannerImageFile,
        setLargeLandscapeBannerImageFile,
        setPortraitBannerImageFile,
        setSquareBannerImageFile,
        setCoverImageFile,
        setLandscapeSplashImageFile,
        setPortraitSplashImageFile,
        setGameplayLandscapeVideoFile,
        setGameplayPortraitVideoFile,
        setGameplaySquareVideoFile,
    } = useMetaCreativesActions();

    const fileFormat = "video";
    const maxFileSize = 50;

    const creativesImage = [
        {
            content: {
                label: "App Icon",
                requirements: [
                    { label: "Small", width: 16, height: 16, value: smallAppIconFile, setValue: setSmallAppIconFile },
                    { label: "Large", width: 1024, height: 1024, value: largeAppIconFile, setValue: setLargeAppIconFile },
                ]
            },
        },
        {
            content: {
                label: "Banners",
                requirements: [
                    { label: "Small Landscape", width: 1200, height: 627, value: smallLandscapeBannerImageFile, setValue: setSmallLandscapeBannerImageFile },
                    { label: "Large Landscape", width: 1920, height: 1080, value: largeLandscapeBannerImageFile, setValue: setLargeLandscapeBannerImageFile },
                    { label: "Portrait", width: 1080, height: 1920, value: portraitBannerImageFile, setValue: setPortraitBannerImageFile },
                    { label: "Square", width: 1080, height: 1080, value: squareBannerImageFile, setValue: setSquareBannerImageFile },
                ]
            },
        },
        {
            content: {
                label: "Covers",
                requirements: [
                    { label: "Landscape Cover ", width: 1600, height: 300, value: coverImageFile, setValue: setCoverImageFile },
                ]
            },
        },
        {
            content: {
                label: "Splash",
                requirements: [
                    { label: "Landscape Splash", width: 1920, height: 1080, value: landscapeSplashImageFile, setValue: setLandscapeSplashImageFile },
                    { label: "Portrait Splash", width: 1080, height: 1920, value: portraitSplashImageFile, setValue: setPortraitSplashImageFile },
                ]
            },
        }
    ]

    const creativesVideo = [
        {
            content: {
                label: "Game Play Video",
                requirements: [
                    { label: "Landscape", width: 1920, height: 1080, value: gameplayLandscapeVideoFile, setValue: setGameplayLandscapeVideoFile },
                    { label: "Portrait", width: 1080, height: 1920, value: gameplayPortraitVideoFile, setValue: setGameplayPortraitVideoFile },
                    { label: "Square", width: 1080, height: 1080, value: gameplaySquareVideoFile, setValue: setGameplaySquareVideoFile },
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
                                    <CustomImageUploader customProps={{
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
                        <Stack gap={4} sx={{ ...Styles.outlineStyle }} >
                            {creative.content.requirements.map((requirement) => (
                                <Stack gap={2} width="100%">
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
                                                    <Typography variant='body2'>
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
