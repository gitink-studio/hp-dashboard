import { useState } from 'react';
import {
    Typography,
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    Box,
    Button
} from '@mui/material';

export const ApprovalStep = () => {
    const [accepted, setAccepted] = useState(false);

    const handleCheckboxChange = (event: any) => {
        setAccepted(event.target.checked);
    };

    return (
        <Paper elevation={0} sx={{ padding: 4 }}>
            <Stack gap={2}>
                <Stack gap={2} maxHeight={500} overflow={"auto"}>
                    <Typography variant="h5" gutterBottom>
                        Testing Terms
                    </Typography>

                    <Typography variant='body1'>
                        Thanks for choosing to test your application with Hyper Rabbit.
                    </Typography>

                    <Typography>
                        Hyper Rabbit is a world leader of mobile applications publishing. As part of our services, we provide mobile application developers and studios (You or Developer) with the opportunity to submit Your owned and operated mobile applications (the Application) for a test to better evaluate the commercial and business potential of publishing Your Application by Hyper Rabbit. The test will require basic effort from your end, while we will, subject to our sole discretion, invest in performing a marketability test that may include distributing and measuring the performance of Your Application against some key indicators (the Test).
                        The Test is subject to the availability of the Application at a minimal viable level, on the applicable app store and, as part of Testing the Application, We might need Your cooperation in integrating basic Application measurement tools and providing us with access to such tools.
                        As a consideration for such Test, and because we are putting significant resources into Testing Applications, in order to initiate the mutual relationship between us, you agree not to submit the Application with, or grant other rights in the Application to, any third party during the Test period and for a period of an additional two weeks after the completion of the Test period or immediately upon the receipt of a rejection notice from us for the Application, unless agreed otherwise between us as part of a separate agreement.
                        For the avoidance of any doubt, any information provided or exchanged between us as part of the Test and related engagement is deemed Confidential Information and is subject to the Confidentiality Agreement. If the Test will be successful, and the Application would qualify for publishing with Hyper Rabbit, You acknowledge that the legal terms of such engagement will be governed by the Terms and Conditions of Hyper Rabbit’s standard Publishing Agreement. The commercial terms with respect to the publishing of an Application will be agreed between us.
                    </Typography>

                    <Typography>
                        You grant Hyper Rabbit a worldwide, non-exclusive, transferable, sublicensable, royalty-free license to use your Application’s creatives, logo and trademark for the purposes of internal case studies and creating a knowledge base for its developers.
                        Before submitting Your game, We would like to make sure that: (i) the Application is an original work which you are the sole author and developer of, and the Application does not and will not be copied from and does not and will not infringe upon, or misappropriate, any copyright, trademark, trade secret, patent or other rights of any third party; (ii) Your Application does not contain any code or component that will disrupt, disable, harm or otherwise impede in any manner the operation of an end user’s device or any other application or damage or destroy any data or system included in the device; (iii) You have not granted any rights in the Application to any third party; (iv) no open source or public library software, including any version of any software licensed pursuant to any GNU public license, was used in the development or modification of the Application in a manner that can limit, restrict or harm Hyper Rabbit’s publishing endeavors; (v) in connection with the Application and its development, the Developer has complied with all applicable rules (including those of the applicable mobile operating systems), including but not limited to data protection and privacy laws and rules applicable to the personal information that is being accessed, collected, used and/or shared by Developer.
                        If one of the above requirements does not apply to you, please do not submit your Application for Testing with Hyper Rabbit. We reserve the right to refuse to Test any Application in our sole discretion or stop testing at any time and we make no representations or undertakings with respect to any testing conducted or results provided following any Test.
                    </Typography>
                </Stack>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={accepted}
                            onChange={handleCheckboxChange}
                            name="acceptTerms"
                        />
                    }
                    label="I have read and agree to the Hyper Rabbit testing terms"
                />
            </Stack>
        </Paper>
    );
};
