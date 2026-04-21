import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Stack, Typography } from "@mui/material";
import { customStyle } from "../common/styles";
import { isEmptyContent, isEmptyObject } from "../common/utils";

export const CustomAccordion = (props: any) => {
    const { summary, details, summaryProps = {}, tableProps = {}, buttons = [] } = props.data;
    const hasContainButtons = buttons.length > 0;

    return (
        <>
            <Accordion variant="outlined" sx={{
                '&.Mui-expanded': {
                    mt: 0,
                },
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                        flexDirection: 'row-reverse',
                        '&.Mui-expanded': {
                            backgroundColor: '#f5f5f51c'
                        },
                    }}>
                    {!isEmptyObject(tableProps) ?
                        (
                            <Stack direction={'row'} display={'flex'} justifyContent={'space-around'} width={"100%"}>
                                {
                                    tableProps.map((data: any) => {
                                        return (
                                            <Stack justifyContent={'space-around'} sx={{ textAlign: 'center' }} key={data.name}>
                                                <Typography {...summaryProps}>{data.value}</Typography>
                                                <Typography variant="caption">{data.name}</Typography>
                                            </Stack>
                                        )
                                    })
                                }
                            </Stack>
                        ) :
                        (<Typography {...summaryProps} pl={1}>{summary}</Typography>)
                    }
                </AccordionSummary>

                <Divider />

                <AccordionDetails sx={{ pt: 0, pr: 0 }}>
                    {isEmptyContent(details) ?
                        (
                            <>
                                <Box p={2} display={'flex'} justifyContent={'center'} alignItems={'center'} height={100}>
                                    <Typography variant='body2' >No data available for this period</Typography>
                                </Box>
                            </>
                        ) :
                        (
                            <Stack gap={2} px={hasContainButtons ? 2 : 0}>
                                <Box>{details}</Box>
                                <Box display={'flex'} justifyContent={'flex-end'} gap={2}>
                                    {
                                        buttons.map((button: any, index: any) => (
                                            <Button key={button.name + index} variant="contained" sx={customStyle.button} onClick={button.onClick}>{button.name}</Button>
                                        ))
                                    }
                                </Box>
                            </Stack>
                        )
                    }
                </AccordionDetails>
            </Accordion >
        </>
    )
}
