import { ExpandMore, Refresh } from "@mui/icons-material"
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Paper, Stack, Typography } from "@mui/material"
import { Button, Datagrid } from "react-admin"
import { customStyle } from "../../common/styles"
import { CustomDropdown } from "../../components/dropdown"
import { CustomSearch } from "../../components/search"
import { CustomDatagrid } from "../../components/data-grid"

const gameplayData = [
    {
        studio: 'GitInk',
        games: [
            {
                name: 'Game 1',
            },
            {
                name: 'Game 2',
            },
            {
                name: 'Game 3',
            }
        ]
    },
    {
        studio: 'Znoops',
    },
    {
        studio: 'Weloadin',
    }
]

export const GameplayReportsPage = () => {
    return (
        <>
            <Stack gap={3} p={3}>
                {/* Gameplay Reports Title */}
                <Stack direction={'row'} style={{ display: "flex", justifyContent: 'space-between' }}>
                    <Typography variant="h4" gutterBottom>
                        Gameplay Reports
                    </Typography>
                    <Button variant="outlined" startIcon={<Refresh />} label="Refresh" sx={{ height: customStyle.button.height }} />
                </Stack>

                {/* Filters  */}
                <Stack gap={2}>
                    <Paper sx={{ p: customStyle.filterPaper.padding }}>
                        <Stack gap={2}>
                            <Typography variant="h6">
                                Filters
                            </Typography>

                            <Stack direction={'row'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Stack direction={'row'} gap={2}>
                                    <CustomDropdown
                                        data={{
                                            label: "Studio",
                                            value: "All",
                                            options: [{ label: 'All', value: 'all' }, { label: 'Studio 1', value: 'studio1' }],
                                            handleChange: () => { console.log('Dropdown selection changed'); }
                                        }}
                                    />
                                    <CustomDropdown
                                        data={{
                                            label: "Games",
                                            value: "All",
                                            options: [{ label: 'All', value: 'all' }, { label: 'Studio 1', value: 'studio1' }],
                                            handleChange: () => { console.log('Dropdown selection changed'); }
                                        }}
                                    />
                                    <CustomDropdown
                                        data={{
                                            label: "Date",
                                            value: "All",
                                            options: [{ label: 'All', value: 'all' }, { label: 'Studio 1', value: 'studio1' }],
                                            handleChange: () => { console.log('Dropdown selection changed'); }
                                        }}
                                    />
                                </Stack>

                                <CustomSearch data={{ label: 'Search' }} />
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>

                {/* Reports Table */}
                <Paper>
                    <Stack>
                        <Typography variant="h6" p={2}>Reports</Typography>
                        <Divider />
                        <Box>{
                            gameplayData.map((data, index) => {
                                return (<>
                                    <Accordion >
                                        <AccordionSummary expandIcon={<ExpandMore />}>{data.studio}</AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                // <CustomDatagrid
                                                //     data={{
                                                //         rows: [],
                                                //         columns: [{ field: 'name', headerName: 'Game', flex: 1 }]
                                                //     }} />
                                                <Datagrid />
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                </>)
                            })
                        }</Box>
                    </Stack>
                </Paper>
            </Stack >
        </>
    )
}
