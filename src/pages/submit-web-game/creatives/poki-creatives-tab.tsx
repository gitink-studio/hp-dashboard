import { Button, Divider, Paper, Stack, Typography } from "@mui/material"
import { Styles } from "../../../common/styles";
import { FileUploadOutlined } from "@mui/icons-material";
import { handleFileDrop, handleFileUpload } from "../../../common/utils";
import { useUniversalBuildName, useUploadWebBuildsActions } from "../../../store/submit-web-game/upload-web-builds-store";
import { useLargeAppIconName, useBannerImageName, useCoverImageName, useGamePlayLandscapeVideoName, useGamePlayPortraitVideoName, useGamePlaySquareVideoName, useGamePreviewLandscapeVideoName, useGamePreviewPortraitVideoName, useGamePreviewSquareVideoName, useLandscapeSplashImageName, useLargeLandscapeBannerImageName, useMetaCreativesActions, usePortraitBannerImageName, usePortraitSplashImageName, useSmallAppIconName, useSquareBannerImageName, useSmallPreviewAppIconName, useLargePreviewAppIconName, useBannerPreviewImageName, useLargeLandscapeBannerPreviewImageName, usePortraitBannerPreviewImageName, useSquareBannerPreviewImageName, useLandscapeSplashPreviewImageName, usePortraitSplashPreviewImageName, useCoverPreviewImageName } from "../../../store/submit-web-game/meta-creatives-store";
import { CustomImageUploader } from "../../../components/CustomImageUploader";

export const PokiCreativesTab = () => {
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
                label: "Icons",
                requirements: [
                    { label: "Small", preview: smallPreviewAppIconName, setPreview: setSmallPreviewAppIconName, width: 16, height: 16, value: smallAppIconName, setValue: setSmallAppIconName },
                    { label: "Large", preview: largePreviewAppIconName, setPreview: setLargePreviewAppIconName, width: 1024, height: 1024, value: largeAppIconName, setValue: setLargeAppIconName },
                ]
            },
        },
        {
            content: {
                label: "Screenshots",
                requirements: [
                    { label: "Samll Screenshot", preview: bannerPreviewImageName, setPreview: setBannerPreviewImageName, width: 100, height: 56, value: bannerPreviewImageName, setValue: setBannerPreviewImageName },
                    { label: "Large Screenshot", preview: largeLandscapeBannerPreviewImageName, setPreview: setLargeLandscapeBannerPreviewImageName, width: 853, height: 480, value: bannerImageName, setValue: setBannerImageName },
                ]
            },
        },
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
            </Stack >
        </>
    )
}