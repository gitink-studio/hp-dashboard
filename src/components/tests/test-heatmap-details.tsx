import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface HeatmapData {
    mean: number[];
    dates: {
        date: string;
        values: number[];
        users: number;
    }[];
}

interface TestHeatmapDetailsProps {
    appu: HeatmapData;
    retention: HeatmapData;
    playtime: HeatmapData;
}

export const TestHeatmapDetails: React.FC<TestHeatmapDetailsProps> = ({
    appu,
    retention,
    playtime
}) => {
    const [expandedPanels, setExpandedPanels] = React.useState<{ [key: string]: boolean }>({
        appu: false,
        retention: false,
        playtime: false
    });

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedPanels(prev => ({
            ...prev,
            [panel]: isExpanded
        }));
    };

    const getValueSuffix = (metric: string) => {
        switch (metric) {
            case "APPU":
            case "Playtime":
                return "sec"
            case "Retention":
                return "%";
            default:
                return "";
        }
    }

    const calculateMeanUsers = (dates: { date: string; values: number[]; users: number }[]) => {
        const totalUsers = dates.reduce((sum, entry) => sum + entry.users, 0);
        return Math.round(totalUsers / dates.length);
    }

    const getColorIntensity = (value: number, metric: string) => {
        if (!value) return 0;
        const maxValue = metric === 'Retention' ? 15 : 800;
        const intensity = value / maxValue;
        return Math.min(intensity, 1);
    }

    const renderHeatmapTable = (data: HeatmapData, metric: string) => {
        const meanUsers = calculateMeanUsers(data.dates);

        return (
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Days →</TableCell>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(day => (
                                <TableCell key={day} align="center">{day}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Mean
                                <Typography variant="caption" display="block" color="text.secondary">
                                    {meanUsers} Users
                                </Typography>
                            </TableCell>
                            {data.mean.map((value, index) => (
                                <TableCell
                                    key={index}
                                    align="center"
                                    sx={{
                                        backgroundColor: `rgba(68, 171, 255, ${getColorIntensity(value, metric)})`,
                                        // color: 'white',
                                        // fontWeight: 'bold'
                                    }}
                                >
                                    {value} {getValueSuffix(metric)}
                                </TableCell>
                            ))}
                        </TableRow>
                        {data.dates.map((dateEntry) => (
                            <TableRow key={dateEntry.date}>
                                <TableCell component="th" scope="row">
                                    {dateEntry.date}
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {dateEntry.users} Users
                                    </Typography>
                                </TableCell>
                                {dateEntry.values.map((value, index) => (
                                    <TableCell
                                        key={index}
                                        align="center"
                                        sx={{
                                            backgroundColor: value
                                                ? `rgba(68, 171, 255, ${getColorIntensity(value, metric)})`
                                                : 'inherit',
                                            // color: value ? 'white' : 'inherit',
                                            // fontWeight: value ? 'bold' : 'normal'
                                        }}
                                    >
                                        {value} {getValueSuffix(metric)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box sx={{ p: 2 }}>
            <Accordion
                expanded={expandedPanels.appu}
                onChange={handleChange('appu')}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="appu-content"
                    id="appu-header"
                >
                    <Typography>APPU (Average Playtime Per User – seconds)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {renderHeatmapTable(appu, 'APPU')}
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expandedPanels.retention}
                onChange={handleChange('retention')}
                sx={{ mt: 2 }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="retention-content"
                    id="retention-header"
                >
                    <Typography>Retention (%)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {renderHeatmapTable(retention, 'Retention')}
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expandedPanels.playtime}
                onChange={handleChange('playtime')}
                sx={{ mt: 2 }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="playtime-content"
                    id="playtime-header"
                >
                    <Typography>Playtime (Mean Seconds)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {renderHeatmapTable(playtime, 'Playtime')}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
