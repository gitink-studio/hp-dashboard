import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    CircularProgress,
    Alert,
} from '@mui/material';

import { useNotify } from 'react-admin';
import { useActiveStep, useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions } from '../../../store/submit-web-game/submit-web-game-store';
import { FileType, WebGameSubmissionSetup } from '../../../common/constants';
import { MarketingComponent } from '../../../components/marketings/MarketingComponent';
import { webGameCreativesData } from './web-game-creatives-data';


export const WebGameCreatives = (): JSX.Element => {
    const notify = useNotify();
    const [tabIndex, setTabIndex] = useState<number>(0);
    const activeStep = useActiveStep();
    const currentStep = useCurrentStep();
    const isDataSending = useDataSending();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const { setCurrentStep, setDataSending, setCurrentSetupGameDetails } = useSubmitWebGameActions();

    const submitData = async () => {
        try {
            setDataSending(true);
            console.log("currentSetupGameDetails", currentSetupGameDetails);

            // setDataSending(false);
            // return;
            // let response = await sendFormDataRequest('upload-creatives-data', CREATE_CREATIVES_DATA_URL, fileList, {
            //     gameRequestId: currentSetupGameDetails.id,
            //     webGameSubmissionSetupCurrentStateId: currentSetupGameDetails.webGameRequest.webGameSubmissionSetupCurrentState.id,
            //     currentSetupIndex: currentSetupGameDetails.currentSetupStateIndex,
            //     webGameRequestId: currentSetupGameDetails.webGameRequest.id,
            //     webGameRequestDetailsId: currentSetupGameDetails.webGameRequest.webGameRequestDetails.id,
            //     fileInfoList: fileInfoList,
            //     studioId: currentSetupGameDetails.studioId
            // });

            // setCurrentSetupGameDetails(response.data.data);
            // setCurrentStep();
            // console.log('Response: ', response);
        } catch (err) {
            notify("Something went wrong!", { type: "error" });
            console.error(err);
        }

        setDataSending(false);
    }

    const handleStepComplete = () => {
        // let canSubmitData = true;
        // console.log(selectedPlatforms);
        // selectedPlatforms.forEach((platform: any) => {
        //     switch (platform) {
        //         case META:
        //             if (!isAllMetaCreativesCompleted) {
        //                 notify("Please complete the 'Meta' tab before proceeding.", { type: "warning" });
        //                 canSubmitData = false;
        //             }
        //             break;
        //         case POKI:
        //             if (!isAllPokiCreativesCompleted) {
        //                 notify("Please complete the 'Poki' tab before proceeding.", { type: "warning" });
        //                 canSubmitData = false;
        //             }
        //             break;
        //         case CRAZY_GAMES:
        //             if (!isAllCrazyGamesCreativesCompleted) {
        //                 notify("Please complete the 'Crazy Games' tab before proceeding.", { type: "warning" });
        //                 canSubmitData = false;
        //             }
        //             break;
        //         default:
        //             console.log(`Platform not found`);
        //             break;
        //     }
        // })

        // if (canSubmitData)
        //     submitData();
    }

    const isStepCompleted = () => currentStep > WebGameSubmissionSetup.CREATIVES;

    return (
        <Stack p={3} gap={2}>
            {isStepCompleted() &&
                <Alert severity="success" sx={{ mb: 2 }}>
                    You already completed this step
                </Alert>}

            <Stack gap={1}>
                <Typography variant='h5' fontWeight={'bold'}>Creatives (Marketing)</Typography>
                <Typography variant='body2'>Manage marketing assets for your game</Typography>
            </Stack>

            <Stack gap={2}>
                {
                    webGameCreativesData?.map((data: any) => {
                        return (
                            <MarketingComponent key={data.secondaryTitle} data={{
                                primaryTitle: data.primaryTitle,
                                secondaryTitle: data.secondaryTitle,
                                fileType: data.fileType,
                                creativeInfo: data.creativeInfo
                            }} />
                        )
                    })
                }
            </Stack>
        </Stack>
    );
}
