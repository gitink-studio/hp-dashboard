import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material"
import { formatTime } from "../../common/utils";

export const CustomGameplayReportViewer = (props: any) => {
    const { reportData, displayButton = false, handleButtonClick } = props.data;

    const DataNotFound = () => <Typography variant="caption">Data not found</Typography>

    const DisplayData = (props: any) => {
        const { name, value } = props.data;

        return (
            <Stack key={name}>
                <Typography variant="h6">{value}</Typography>
                <Typography variant="caption">{name}</Typography>
            </Stack>
        )
    }

    const TutorialData = (props: any) => {
        const { step, totalCount, tutorialType } = props.data;
        const name = `${tutorialType} step ${step}`;

        return <DisplayData
            key={name}
            data={{
                name: name,
                value: totalCount
            }}
        />
    }

    const LevelData = (props: any) => {
        const { levelName = "", totalCount = 0 } = props.data;

        return <DisplayData data={{
            name: levelName,
            value: totalCount
        }}
            key={levelName}
        />
    }

    const IAPData = (props: any) => {
        const { price, productId, totalCount, currencyCode } = props.data;

        return (
            <Card variant="outlined" key={productId}>
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'Product Id', value: productId }} />
                        <DisplayData data={{ name: 'Price', value: price }} />
                        <DisplayData data={{ name: 'Currency Code', value: currencyCode }} />
                        <DisplayData data={{ name: 'Count', value: totalCount }} />
                    </Stack>
                </CardContent>
            </Card>
        )

    }

    const AdData = (props: any) => {
        const { adType, duration, adSdkName, failReason, totalCount, adPlacement } = props.data;

        return (
            <Card variant="outlined" key={adPlacement}>
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'Ad Type', value: adType }} />
                        <DisplayData data={{ name: 'Ad Placement', value: adPlacement }} />
                        <DisplayData data={{ name: 'Count', value: totalCount }} />
                        <DisplayData data={{ name: 'Duration', value: formatTime(duration) }} />
                        <DisplayData data={{ name: 'Ad Sdk', value: adSdkName }} />
                        <DisplayData data={{ name: 'Fail Reason', value: failReason === "" ? "none" : failReason }} />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    const EconomyData = (props: any) => {
        const {
            itemId = 'None',
            itemName = "None",
            amount = 0,
            reason = 'None',
            totalCount = 0,
            currencyType = 'None'
        } = props.data

        return (
            <Card variant="outlined" >
                <CardContent>
                    <Stack direction={'row'} gap={4}>
                        <DisplayData data={{ name: 'Count', value: totalCount }} />
                        <DisplayData data={{ name: 'Item Id', value: itemId }} />
                        <DisplayData data={{ name: 'Item Name', value: itemName }} />
                        <DisplayData data={{ name: 'Amount', value: amount }} />
                        <DisplayData data={{ name: 'Currency Type', value: currencyType }} />
                        <DisplayData data={{ name: 'Reason', value: reason === "" ? "None" : reason }} />
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    const getData = (dataType: string, data: any) => {
        switch (dataType) {
            case 'Player Data':
            case 'Session Event Data':
            case 'Gameplay Event Data':
                return <DisplayData data={data} />
            case 'Tutorial Data':
                return <TutorialData data={data} />
            case 'Level Start Data':
            case 'Level Complete Data':
            case 'Level Fail Data':
                return <LevelData data={data} />
            case 'IAP Initiated':
            case 'IAP Successful':
            case 'IAP Failed':
            case 'IAP Consumed':
                return <IAPData data={data} />
            case 'Ad Started':
            case 'Ad Clicked':
            case 'Ad Skipped':
            case 'Ad Completed':
            case 'Ad Failed':
                return <AdData data={data} />
            case 'Currency Earned':
            case 'Currency Spent':
                return <EconomyData data={data} />
            default:
                return <DataNotFound />
        }
    }

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
                flexWrap: 'wrap',
                gap: 2,
            }}>
                <Stack gap={2} sx={{ width: '100%', flexWrap: 'wrap' }}>
                    {
                        reportData.map((data: any) => (
                            <Card variant="outlined" key={data.name}>
                                <CardContent sx={{ px: 4 }} >
                                    <Stack gap={2}>
                                        <Typography variant="subtitle1" textAlign={'left'}>{data.name}</Typography>
                                        <Stack direction={'row'} gap={4} flexWrap="wrap" justifyContent="flex-start">
                                            {
                                                data?.data.length === 0 ? <DataNotFound /> :

                                                    data.data.map((eventData: any) => {
                                                        return (
                                                            <>
                                                                {getData(data.name, eventData)}
                                                            </>
                                                        )
                                                    })
                                            }
                                        </Stack>

                                        {
                                            displayButton && (
                                                <Box display={'flex'} justifyContent={'flex-end'}>
                                                    <Button onClick={() => handleButtonClick}>View Full Report</Button>
                                                </Box>
                                            )
                                        }
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                    }
                </Stack>
            </Box >
        </>
    )
}
