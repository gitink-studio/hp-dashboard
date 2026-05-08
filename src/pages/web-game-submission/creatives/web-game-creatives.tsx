import {
    Typography,
    Stack,
    Alert,
} from '@mui/material';

import { useCurrentStep } from '../../../store/submit-web-game/submit-web-game-store';
import { WebGameSubmissionSetup } from '../../../common/constants';
import { MarketingComponent } from '../../../components/marketings/MarketingComponent';
import { webGameCreativesData } from './web-game-creatives-data';

export const WebGameCreatives = (): JSX.Element => {
    const currentStep = useCurrentStep();

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
