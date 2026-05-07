import { Add, Height, VisibilityOutlined, Widgets } from "@mui/icons-material"
import { Box, Paper, Popover, Stack, Tooltip, Typography, Button } from "@mui/material"
import { customStyle } from "../common/styles"
import { MarketingButtonComponent } from "./marketings/MarketingButtonComponent";
import { useEffect, useRef, useState } from "react";
import { CustomDialog } from "./dialog.component";
import { GridComponent } from "./GridComponent";
import { convertBase64ToImageFile, getFileInfo, isImageFile, isSameAspectRatio, resizeImage, sendFormDataRequest, slugify } from "../common/utils";
import { useWebCreativeListState, useWebGameCreativesActions } from "../store/submit-web-game/creatives-store";
import { CREATE_CREATIVES_DATA_URL, CREATIVES_ROOT_URL, MARKETINGS } from "../common/constants";
import { useCurrentSetupGameDetails } from "../store/submit-web-game/submit-web-game-store";


export const MarketingComponent = (props: any) => {
    const { creativeInfo, fileType, primaryTitle, secondaryTitle } = props.data;
    const [dialogState, setDialogState] = useState(false);
    const [creativeList, setCreativeList] = useState([]);
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const MAX_IMAGE_PREVIEW_COUNT = 6;
    const NON_PREVIEW_IMAGE_COUNT = creativeInfo.length - MAX_IMAGE_PREVIEW_COUNT;
    const isFileResized = useRef(false);

    const updateFileList = (prev: any, imageSrc: string, index: number) => {
        const updatedFileSrcList: any = [...prev];
        updatedFileSrcList[index] = imageSrc;
        return updatedFileSrcList;
    }

    const uploadResizedFile = async (resizedImageFile: File, resizedImageFilePrefix: string) => {
        try {
            if (!resizedImageFile) return;

            const filePath = `${CREATIVES_ROOT_URL}/${localStorage.studioId}/${currentSetupGameDetails.platform.toLowerCase()}/${slugify(currentSetupGameDetails.name)}/${MARKETINGS}`;
            const fileInfo: any = getFileInfo(filePath, resizedImageFile, `${resizedImageFilePrefix}`);

            let response = await sendFormDataRequest('upload-creatives-data', CREATE_CREATIVES_DATA_URL, [resizedImageFile], {
                webGameRequestDetailsId: currentSetupGameDetails?.webGameRequest?.webGameRequestDetails?.id,
                fileInfo: fileInfo,
            });

            return response;

        } catch (err) {
            console.error(err);
        }

    }

    const handleResizeImage = async (uri: string, index: number, fileName: string, filePrefix: string) => {
        console.log(`Handle resize image called!`);

        const resizedImageFile = convertBase64ToImageFile(uri, fileName);
        await uploadResizedFile(resizedImageFile, filePrefix);

        setCreativeList((prev: any) => {
            return updateFileList(prev, uri, index);
        });
    }

    const checkAndResizeFile = (width: number, height: number, file: any) => {
        creativeInfo.map((data: any, index: any) => {
            if (width < data.width || height < data.height) {
                console.log(`Low resolution!`);
                return;
            }

            if (!isSameAspectRatio({ width, height }, data)) {
                console.log(`Aspect ratio mismatch !`);
                return;
            }

            if (!isImageFile(file)) {
                console.log(`File type mismatch! ${file.type}`);
                return;
            }

            if (creativeList[index] === undefined && (width !== data.width && height !== data.height)) {
                console.log(`Resizing debug! ${width} x ${height}`);
                const resizedImageFilePrefix = `${slugify(secondaryTitle)}-${data.width}x${data.height}`;
                isFileResized.current = false;
                resizeImage(
                    {
                        file: file,
                        maxWidth: data.width,
                        maxHeight: data.height,
                        onResize: (uri: any) => {
                            handleResizeImage(uri, index, file.name, resizedImageFilePrefix);
                        }
                    }
                );
            } else {
                console.log(`Invalid creative for resize. File type: ${JSON.stringify(file)}`);
            }
        })
    }

    const buttonList = creativeInfo?.map((data: any, index: any) => {
        const buttonText = `${data.width}x${data.height}`;

        return <MarketingButtonComponent key={buttonText}
            data={{
                buttonText: buttonText,
                fileSrc: creativeList[index],
                width: data.width,
                height: data.height,
                fileType: fileType,
                creativeType: secondaryTitle,
                setFileSrc: (fileSrc: any) => setCreativeList((prev: any) => {
                    return updateFileList(prev, fileSrc, index);
                }),
                callback: (width: number, height: number, file: any) => checkAndResizeFile(width, height, file)
            }}
        />
    });


    const getButtonList = () => {
        return buttonList.map((data: any) => data);
    }

    return (
        <>
            <Stack gap={1}>
                <Typography variant="subtitle1">{primaryTitle}</Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px' }}>
                    <Stack gap={2}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Stack direction={'row'} gap={2}>
                                <Stack>
                                    <Typography variant="h6">{secondaryTitle}</Typography>
                                    {/* <Typography variant="subtitle2">15 uploaded</Typography> */}
                                </Stack>
                            </Stack>
                            <Button
                                variant="outlined"
                                startIcon={<VisibilityOutlined />}
                                sx={customStyle.button}
                                onClick={() => setDialogState(true)}
                            >
                                View All
                            </Button>
                        </Stack>

                        <Stack direction={'row'} justifyContent={'flex-start'} gap={2}>
                            {
                                buttonList?.map((data: any, index: any) => {
                                    let currentIndex = index + 1;
                                    if (currentIndex <= MAX_IMAGE_PREVIEW_COUNT) {
                                        return data;
                                    } else if (currentIndex <= (MAX_IMAGE_PREVIEW_COUNT + 1)) {
                                        return <MarketingButtonComponent
                                            data={{
                                                buttonText: NON_PREVIEW_IMAGE_COUNT,
                                                isImagePreviewButton: false,
                                                onClick: () => setDialogState(true)
                                            }}
                                        />
                                    }
                                })
                            }
                        </Stack>
                    </Stack>
                </Paper >
            </Stack >

            {
                dialogState && <CustomDialog data={{
                    title: `${primaryTitle} Assets`,
                    caption: "View and manage all assets",
                    size: 'xs',
                    component: <GridComponent data={{
                        componentList: getButtonList()
                    }} />,
                    callback: () => setDialogState(false)
                }} />
            }
        </>

    )
}
