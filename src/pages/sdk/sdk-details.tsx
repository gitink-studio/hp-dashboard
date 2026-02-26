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
} from '@mui/material';
import { SDKData } from './sdk-data';
import { GameSubmissionStep } from './game-submission/game-submission-step';
import { TestingTermsStep } from './testing-terms-step';
import { FacebookSetupStep } from './facebook/facebook-setup-step';
import { SDKIntegrationSteps } from './sdk-integration/sdk-integration-steps';
import { StoreStep } from './store-step/store-step';
import { TestSetup } from './test/test-setup';
import { useActiveStep, useCurrentGameSetupDetails, useCurrentStep, useSDKDetailActions } from '../../store/sdk/sdk-details-store';
import { useValidateGameSubmissionInputs } from '../../store/sdk/game-submission-store';

export const SDKDetails = () => {
    const currentStep = useCurrentStep();
    const activeStep = useActiveStep();
    const validateGameSubmissionInputs = useValidateGameSubmissionInputs();
    const currentSetupGameDetails = useCurrentGameSetupDetails();
    const { setActiveStep, setCurrentStepWithIndex, isStepCompleted } = useSDKDetailActions();
    let isStepSet = false;

    useEffect(() => {
        console.log(`Active Step: ${activeStep} Current Step: ${currentStep}`);
    })

    const stepContentList = [
        { component: <GameSubmissionStep />, isAllDataEntered: validateGameSubmissionInputs },
        { component: <TestingTermsStep />, isAllDataEntered: false },
        { component: <FacebookSetupStep />, isAllDataEntered: false },
        { component: <SDKIntegrationSteps />, isAllDataEntered: false },
        { component: <StoreStep />, isAllDataEntered: false },
        { component: <TestSetup />, isAllDataEntered: false },
    ]

    const DisplayCurrentStepContent = () => {
        if (activeStep > stepContentList.length - 1) {
            setActiveStep(activeStep - 1);
        }

        return stepContentList[activeStep].component;
    };

    const handleDisable = () => {
        return !isStepCompleted(activeStep);
    }

    const handleStepper = (index: number) => {
        // setActiveStep(index);

        if (index >= currentStep) {
            setActiveStep(index);
        }
    }

    useEffect(() => {
        if (!isStepSet && currentSetupGameDetails !== null) {
            console.log("currentSetupGameDetails: ", currentSetupGameDetails);
            setCurrentStepWithIndex(currentSetupGameDetails.currentSetupStateIndex);
            isStepSet = true;
        }
    }, []);

    return (
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
                        {SDKData.steps.map((label, index) => (
                            <Step key={label} active={currentStep == index} completed={isStepCompleted(index)}>
                                <StepLabel
                                    onClick={() => handleStepper(index)}
                                    sx={{ cursor: activeStep >= currentStep ? "pointer" : "none" }}>{label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ p: 3, pl: 0, width: '100%' }}>
                    {
                        activeStep > currentStep &&
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            You need to complete previous steps
                        </Alert>
                    }

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
    );
};
