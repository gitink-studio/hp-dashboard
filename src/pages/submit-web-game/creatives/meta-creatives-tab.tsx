import { Button, Divider, Paper, Stack, Typography } from "@mui/material"
import { Styles } from "../../../common/styles";
import { FileUploadOutlined } from "@mui/icons-material";
import { handleFileDrop, handleFileUpload } from "../../../common/utils";
import { useUniversalBuildName, useUploadWebBuildsActions } from "../../../store/submit-web-game/upload-web-builds-store";
import { useLargeAppIconName, useBannerImageName, useCoverImageName, useGamePlayLandscapeVideoName, useGamePlayPortraitVideoName, useGamePlaySquareVideoName, useGamePreviewLandscapeVideoName, useGamePreviewPortraitVideoName, useGamePreviewSquareVideoName, useLandscapeSplashImageName, useLargeLandscapeBannerImageName, useMetaCreativesActions, usePortraitBannerImageName, usePortraitSplashImageName, useSmallAppIconName, useSquareBannerImageName, useSmallPreviewAppIconName, useLargePreviewAppIconName, useBannerPreviewImageName, useLargeLandscapeBannerPreviewImageName, usePortraitBannerPreviewImageName, useSquareBannerPreviewImageName, useLandscapeSplashPreviewImageName, usePortraitSplashPreviewImageName, useCoverPreviewImageName } from "../../../store/submit-web-game/meta-creatives-store";
import { CustomImageUploader } from "../../../components/CustomImageUploader";

export const MetaCreativesTab = () => {
    const universalBuildUrl = useUniversalBuildName();
    const largeAppIconName = useLargeAppIconName();
    const smallAppIconName = useSmallAppIconName();
    const bannerImageName = useBannerImageName();
    const largeLandscapeBannerImageName = useLargeLandscapeBannerImageName();
    const portraitBannerImageName = usePortraitBannerImageName();
    const squareBannerImageName = useSquareBannerImageName();
    const coverImageName = useCoverImageName();
    const landscapeSplashImageName = useLandscapeSplashImageName();
    const portraitSplashImageName = usePortraitSplashImageName();
    const smallPreviewAppIconName = useSmallPreviewAppIconName();
    const largePreviewAppIconName = useLargePreviewAppIconName();
    const bannerPreviewImageName = useBannerPreviewImageName();
    const largeLandscapeBannerPreviewImageName = useLargeLandscapeBannerPreviewImageName();
    const portraitBannerPreviewImageName = usePortraitBannerPreviewImageName();
    const squareBannerPreviewImageName = useSquareBannerPreviewImageName();
    const coverPreviewImageName = useCoverPreviewImageName();
    const landscapeSplashPreviewImageName = useLandscapeSplashPreviewImageName();
    const portraitSplashPreviewImageName = usePortraitSplashPreviewImageName();
    const { setUniversalBuildName: setUniversalBuildUrl } = useUploadWebBuildsActions();

    const gamePreviewLandscapeVideoName = useGamePreviewLandscapeVideoName();
    const gamePreviewPortraitVideoName = useGamePreviewPortraitVideoName();
    const gamePreviewSquareVideoName = useGamePreviewSquareVideoName();
    const gamePlayLandscapeVideoName = useGamePlayLandscapeVideoName();
    const gamePlayPortraitVideoName = useGamePlayPortraitVideoName();
    const gamePlaySquareVideoName = useGamePlaySquareVideoName();
    const { setGamePreviewLandscapeVideoName, setGamePreviewPortraitVideoName, setGamePreviewSquareVideoName, setGamePlayLandscapeVideoName, setGamePlayPortraitVideoName, setGamePlaySquareVideoName, setLargeAppIconName, setSmallAppIconName, setBannerImageName, setLargeLandscapeBannerImageName, setPortraitBannerImageName, setSquareBannerImageName, setCoverImageName, setLandscapeSplashImageName, setPortraitSplashImageName, setSmallPreviewAppIconName, setLargePreviewAppIconName, setBannerPreviewImageName, setLargeLandscapeBannerPreviewImageName, setPortraitBannerPreviewImageName, setSquareBannerPreviewImageName, setCoverPreviewImageName, setLandscapeSplashPreviewImageName, setPortraitSplashPreviewImageName } = useMetaCreativesActions();

    const fileFormat = "video";
    const maxFileSize = 50;

    const creativesImage = [
        {
            content: {
                label: "App Icon",
                requirements: [
                    { label: "Small", preview: smallPreviewAppIconName, setPreview: setSmallPreviewAppIconName, width: 16, height: 16, value: smallAppIconName, setValue: setSmallAppIconName },
                    { label: "Large", preview: largePreviewAppIconName, setPreview: setLargePreviewAppIconName, width: 1024, height: 1024, value: largeAppIconName, setValue: setLargeAppIconName },
                ]
            },
        },
        {
            content: {
                label: "Banners",
                requirements: [
                    { label: "Samll Landscape", preview: bannerPreviewImageName, setPreview: setBannerPreviewImageName, width: 1200, height: 627, value: bannerPreviewImageName, setValue: setBannerPreviewImageName },
                    { label: "Large Landscape", preview: largeLandscapeBannerPreviewImageName, setPreview: setLargeLandscapeBannerPreviewImageName, width: 1920, height: 1080, value: bannerImageName, setValue: setBannerImageName },
                    { label: "Portrait", preview: portraitBannerPreviewImageName, setPreview: setPortraitBannerPreviewImageName, width: 1080, height: 1920, value: portraitBannerPreviewImageName, setValue: setPortraitBannerPreviewImageName },
                    { label: "Square", preview: squareBannerPreviewImageName, setPreview: setSquareBannerPreviewImageName, width: 1080, height: 1080, value: squareBannerPreviewImageName, setValue: setSquareBannerPreviewImageName },
                ]
            },
        },
        {
            content: {
                label: "Covers",
                requirements: [
                    { label: "Landscape Cover ", preview: coverPreviewImageName, setPreview: setCoverPreviewImageName, width: 1600, height: 300, value: coverPreviewImageName, setValue: setCoverPreviewImageName },
                ]
            },
        },
        {
            content: {
                label: "Splash",
                requirements: [
                    { label: "Landscape Splash", preview: landscapeSplashPreviewImageName, setPreview: setLandscapeSplashPreviewImageName, width: 1920, height: 1080, value: landscapeSplashPreviewImageName, setValue: setLandscapeSplashPreviewImageName },
                    { label: "Portrait Splash", preview: portraitSplashPreviewImageName, setPreview: setPortraitSplashPreviewImageName, width: 1080, height: 1920, value: portraitSplashPreviewImageName, setValue: setPortraitSplashPreviewImageName },
                ]
            },
        }
    ]

    const creativesVideo = [
        {
            content: {
                label: "Game Preview Video",
                requirements: [
                    { label: "Landscape", width: 1920, height: 1080, value: gamePreviewLandscapeVideoName, setValue: setGamePreviewLandscapeVideoName },
                    { label: "Portrait", width: 1080, height: 1920, value: gamePreviewPortraitVideoName, setValue: setGamePreviewPortraitVideoName },
                    { label: "Square", width: 1080, height: 1080, value: gamePreviewSquareVideoName, setValue: setGamePreviewSquareVideoName },
                ]
            },
        },
        {
            content: {
                label: "Game Play Video",
                requirements: [
                    { label: "Landscape", width: 1920, height: 1080, value: gamePlayLandscapeVideoName, setValue: setGamePlayLandscapeVideoName },
                    { label: "Portrait", width: 1080, height: 1920, value: gamePlayPortraitVideoName, setValue: setGamePlayPortraitVideoName },
                    { label: "Square", width: 1080, height: 1080, value: gamePlaySquareVideoName, setValue: setGamePlaySquareVideoName },
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
                                        imageName: requirement.value,
                                        preview: requirement.preview,
                                        setPreview: requirement.setPreview,
                                        label: requirement.label,
                                        disabled: false,
                                        width: requirement.width,
                                        height: requirement.height,
                                        maxFileSize: 0,
                                        fileFormat: "",
                                        setImageName: requirement.setValue,
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
                                <Stack gap={2} >
                                    <Stack>
                                        <Typography width={100}> {requirement.label}</Typography >
                                        <Typography width={100} variant="caption"> ({requirement.width}x{requirement.height})</Typography>
                                    </Stack>
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
                                                    <Typography>
                                                        Drag & drop your video here or
                                                        <Button component="label" variant="text" sx={{ textTransform: 'none', textDecoration: "underline" }}>
                                                            browse
                                                            <input type="file" hidden accept="video/*"
                                                                onChange={(e) => handleFileUpload(e, requirement.setValue, fileFormat, maxFileSize)}
                                                            />
                                                        </Button>
                                                        your computer
                                                    </Typography>
                                                    {requirement.value && <Typography variant="caption"> {requirement.value}</Typography>}
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