import { useState } from 'react';
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
} from '@mui/material';
import { SDKData } from './sdk-data';
import { GameSubmissionStep } from './game-submission-step';
import { ApprovalStep } from './approval-step';
import { FacebookSetupStep } from './facebook/facebook-setup-step';
import { SDKIntegrationStep } from './sdk-integration/sdk-integration-step';
import { StoreStep } from './store-step';
import { TestSetup } from './test/test-setup';

export const SDKDetails = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Container sx={{ mt: 5, width: "100%" }}>
            <Typography component="h1" gutterBottom fontWeight="bold">New Game</Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={5} mt={3}>
                <Box sx={{ width: { xs: '100%', md: '250px' }, flexShrink: 0 }}>
                    <Stepper
                        activeStep={activeStep}
                        orientation="vertical"
                        sx={{
                            '& .MuiStepLabel-root': {
                                padding: '8px 0'
                            }
                        }}
                    >
                        {SDKData.steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel onClick={() => setActiveStep(index)} sx={{ cursor: "pointer" }}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ p: 3, pl: 0, width: '100%' }}>
                    {/* <Alert severity="warning" sx={{ mb: 2 }}>
                        You need to complete previous steps
                    </Alert> */}
                    {activeStep === 0 ? (
                        <>
                            <GameSubmissionStep />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 3
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ px: 4, py: 1 }}
                                >
                                    Add Game
                                </Button>
                            </Box>
                        </>
                    ) : null}

                    {activeStep === 1 ? (
                        <>
                            <ApprovalStep />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 3
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ px: 4, py: 1 }}
                                >
                                    Complete Step
                                </Button>
                            </Box>
                        </>
                    ) : null}

                    {activeStep === 2 ? (
                        <>
                            <FacebookSetupStep />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 3
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ px: 4, py: 1 }}
                                >
                                    Complete Step
                                </Button>
                            </Box>
                        </>
                    ) : null}

                    {activeStep === 3 ? (
                        <>
                            <SDKIntegrationStep />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 3
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ px: 4, py: 1 }}
                                >
                                    Complete Step
                                </Button>
                            </Box>
                        </>
                    ) : null}

                    {activeStep === 4 ? (
                        <>
                            <StoreStep />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 3
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ px: 4, py: 1 }}
                                >
                                    Complete Step
                                </Button>
                            </Box>
                        </>
                    ) : null}

                    {activeStep === 5 ? (
                        <>
                            <TestSetup />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 3
                            }}>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ px: 4, py: 1 }}
                                >
                                    Complete Step
                                </Button>
                            </Box>
                        </>
                    ) : null}

                    {activeStep > 0 ? <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2
                    }}>
                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ mr: 2 }}
                        >
                            Back
                        </Button>
                    </Box> : null}

                    {activeStep > 5 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Step {activeStep + 1}: {SDKData.steps[activeStep]}
                            </Typography>
                            {activeStep < SDKData.steps.length - 1 && (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                >
                                    Complete Step
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            </Stack>
        </Container >
    );
};
