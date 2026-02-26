import { Stack, Typography } from "@mui/material"
import { customStyle } from "../../../common/styles";
import { CustomImageUploader } from "../../../components/CustomImageUploader";
import { useLargeIconFile, useLargeScreenshotFile, usePokiCreativesActions, useSmallIconFile, useSmallScreenshotFile } from "../../../store/submit-web-game/poki-creatives-store";

export const PokiCreativesTab = () => {
    const fileFormat = "video";
    const maxFileSize = 50;
    const smallIconFile = useSmallIconFile();
    const largeIconFile = useLargeIconFile();
    const smallScreenshotFile = useSmallScreenshotFile();
    const largeScreenshotFile = useLargeScreenshotFile();
    const {
        setSmallIconFile,
        setLargeIconFile,
        setSmallScreenshotFile,
        setLargeScreenshotFile
    } = usePokiCreativesActions();

    const creativesImage = [
        {
            content: {
                label: "Icons",
                requirements: [
                    { label: "Small", width: 16, height: 16, value: smallIconFile, setValue: setSmallIconFile },
                    { label: "Large", width: 1024, height: 1024, value: largeIconFile, setValue: setLargeIconFile },
                ]
            },
        },
        {
            content: {
                label: "Screenshots",
                requirements: [
                    { label: "Small Screenshot", width: 100, height: 56, value: smallScreenshotFile, setValue: setSmallScreenshotFile },
                    { label: "Large Screenshot", width: 853, height: 480, value: largeScreenshotFile, setValue: setLargeScreenshotFile },
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
                        <Stack gap={4} sx={{ ...customStyle.stackStyle, ...customStyle.outlineStyle }}>
                            <Stack direction="row" gap={2} sx={customStyle.stackStyle} flexWrap={"wrap"}>
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
            </Stack >
        </>
    )
}
