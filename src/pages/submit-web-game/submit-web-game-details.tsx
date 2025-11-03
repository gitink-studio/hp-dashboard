import { useEffect, useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Stack,
    Container,
    Alert,
    useTheme,
    CircularProgress,
} from '@mui/material';
import { WebGameSubmissionStep } from './web-game-submission/web-game-submission-step';
import { SelectPlatformsStep } from './select-platforms/select-platforms-step';
import { UploadWebBuildStep } from './upload-web-build/upload-web-build-step';
import { useActiveStep, useCurrentSetupGameDetails, useCurrentStep, useDataSending, useSubmitWebGameActions, useWebGameSubmissionDetails } from '../../store/submit-web-game/submit-web-game-store';
import { PlatformRequirementsStep } from './platform-requirements/platform-requirements-step';
import { CreativesStep } from './creatives/creatives-step';
import { MetaDataAndRatingsStep } from './metadata-and-ratings/metadata-and-ratings-step';
import { ReviewAndLaunchStep } from './review-and-launch/review-and-launch-step';
import { sendGraphqlRequest } from '../../common/utils';
import { GRAPHQL_URL, QueryNames } from '../../common/constants';
import { Queries } from '../../graphql/queries';

export const SubmitWebGameDetails = () => {
    const theme = useTheme();
    const currentStep = useCurrentStep();
    const activeStep = useActiveStep();
    const webGameSubmissionDetails = useWebGameSubmissionDetails();
    const currentSetupGameDetails = useCurrentSetupGameDetails();
    const { setActiveStep, setCurrentStepWithIndex, isStepCompleted, setWebGameSubmissionDetails } = useSubmitWebGameActions();
    let isStepSet = false;

    useEffect(() => {

        // if (webGameSubmissionDetails.length == 0) {
        //     const fetchGameSubmissionRequests = async () => {
        //         let response = await sendGraphqlRequest(GRAPHQL_URL, QueryNames.GET_ALL_GAME_REQUEST_BY_STUDIO_ID, {
        //             query: Queries.GetAllGameRequestByStudioId,
        //             variables: { studioId: localStorage.getItem('studioId') ?? undefined }
        //         });

        //         setWebGameSubmissionDetails(response.data);
        //     }

        //     fetchGameSubmissionRequests();
        // }
        if (!isStepSet && currentSetupGameDetails !== "") {
            console.log("currentSetupGameDetails", currentSetupGameDetails.currentSetupStateIndex);
            setCurrentStepWithIndex(currentSetupGameDetails.currentSetupStateIndex);
            isStepSet = true;
        }
    }, []);

    const steps = [
        { name: "Web Game Submission", component: <WebGameSubmissionStep />, isAllDataEntered: false },
        { name: "Select Platforms", component: <SelectPlatformsStep />, isAllDataEntered: false },
        { name: "Upload Web Builds", component: <UploadWebBuildStep />, isAllDataEntered: false },
        { name: "Platform Requirements (Tech)", component: <PlatformRequirementsStep />, isAllDataEntered: false },
        { name: "Creatives (Marketing)", component: <CreativesStep />, isAllDataEntered: false },
        { name: "Metadata & Ratings", component: <MetaDataAndRatingsStep />, isAllDataEntered: false },
        { name: "Review & Launch", component: <ReviewAndLaunchStep />, isAllDataEntered: false },
    ]

    const DisplayCurrentStepContent = () => {
        if (activeStep > steps.length - 1) {
            setActiveStep(activeStep - 1);
        }

        return steps[activeStep].component;
    };

    const handleDisable = () => {
        return !isStepCompleted(activeStep);
    }

    const handleStepper = (index: number) => {
        setActiveStep(index);

        // if (index >= currentStep) {
        //     setActiveStep(index);
        // }
    }

    return (
        <>
            {
                // webGameSubmissionDetails.length == 0 ? (
                //     <div style={{
                //         position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
                //     }}>
                //         <CircularProgress size={50} />
                //     </div>
                // ) :
                <Container sx={{ mt: 5, width: "100%" }}>
                    <Typography component="h1" gutterBottom fontWeight="bold">New Game</Typography>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mt={3}>
                        <Box sx={{ width: { xs: '100%', md: '250px' }, }}>
                            <Stepper
                                activeStep={activeStep}
                                orientation="vertical"
                                sx={{
                                    '& .MuiStepLabel-root': {
                                        padding: '8px 0'
                                    },
                                }}
                            >
                                {steps.map((label, index) => (
                                    <Step key={label.name} active={currentStep == index} completed={isStepCompleted(index)}>
                                        <StepLabel
                                            onClick={() => handleStepper(index)}
                                            sx={{ cursor: activeStep >= currentStep ? "pointer" : "default" }}>{label.name}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        <Box sx={{ p: 3, pl: 0, width: '100%' }}>
                            {/* {
                        activeStep > currentStep &&
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You need to complete previous steps
                        </Alert>
                    } */}
                            <DisplayCurrentStepContent />
                            {/* <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 3
                    }}>
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ px: 4, py: 1 }}
                            disabled={disableStepCompleteButton()}
                        >
                            {activeStep === 0 ? "Add Game" : "Complete Step"}
                        </Button>
                    </Box> */}
                        </Box>
                    </Stack>
                </Container >
            }
        </>
    );
};
