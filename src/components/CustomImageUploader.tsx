import { FileUploadOutlined } from "@mui/icons-material"
import { Box, Button, Stack, Typography } from "@mui/material"
import { Styles } from "../common/styles"
import { handleImageUpload } from "../common/utils";

type CustomImageUploaderProps = {
    disabled?: boolean;
    width?: number;
    height?: number;
    maxFileSize?: number;
    label: string;
    fileFormat?: string;
    imageFile: File | null;
    setImageFile: (value: File | null) => void;
}

type CustomImageUploaderPropsWrapper = {
    customProps: CustomImageUploaderProps;
}

export const CustomImageUploader = ({ customProps }: CustomImageUploaderPropsWrapper) => {
    const {
        disabled = false,
        label,
        imageFile,
        width = 0,
        height = 0,
        maxFileSize = 0,
        fileFormat = "",
        setImageFile,
    } = customProps;

    const getImageURL = (file: File) => URL.createObjectURL(file);

    return (
        <>
            <Stack direction={"row"} sx={Styles.stackStyle} gap={3}>
                <Button
                    variant={imageFile === null ? "outlined" : "text"}
                    component="label"
                    sx={{
                        width: 75,
                        height: 75,
                        borderStyle: "dashed",
                        position: "relative",
                        overflow: "hidden",
                        p: 0,
                    }}
                    disabled={disabled}
                >
                    {imageFile === null && (
                        <Stack sx={Styles.stackStyle} gap={1}>
                            <FileUploadOutlined />
                            <Typography fontSize="12px" sx={{ textTransform: "none" }}>
                                Upload
                            </Typography>
                        </Stack>
                    )}

                    <input type="file" hidden accept={fileFormat !== "" ? fileFormat : "image/png, image/jpg, image/jpeg"}
                        onClick={() => setImageFile(null)}
                        onChange={(e) =>
                            handleImageUpload(
                                e,
                                width,
                                height,
                                fileFormat,
                                setImageFile,
                                maxFileSize
                            )
                        } />

                    {(imageFile !== null) && (
                        <Box
                            component="img"
                            src={URL.createObjectURL(imageFile)}
                            alt="Icon preview"
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

                    {(imageFile !== null) &&
                        <Box
                            component="img"
                            src={getImageURL(imageFile)}
                            alt="Uploaded icon preview"
                            sx={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain", // fit nicely
                                backgroundColor: "#fafafa",
                            }}
                        />
                    }
                </Button>

                <Stack gap={1}>
                    <Stack>
                        <Typography>{label}</Typography>
                        <Typography variant="caption" fontWeight={"Light"} fontSize={"11px"}>{width}x{height}</Typography>
                    </Stack>

                    <Typography variant="body2" color="textSecondary">
                        Upload an image in {fileFormat !== "" ? fileFormat : "JPG or PNG"} format {maxFileSize !== 0 ? `(${maxFileSize} MB or less)` : ""}
                    </Typography>
                </Stack>
            </Stack>
        </>
    )
}
