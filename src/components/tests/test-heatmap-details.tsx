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
    mean: (number | null)[];
    dates: {
        date: string;
        values: (number | null)[];
        users: number;
    }[];
}

/** Default lag indices match backend `values[1..8]`; tests pass `[1]` for a single stat column. */
const DEFAULT_HEATMAP_LAG_DAYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

interface TestHeatmapDetailsProps {
    appu: HeatmapData;
    retention: HeatmapData;
    playtime: HeatmapData;
    /** Which lag columns to render for all three heatmaps (indices match backend `values[lag]`). */
    heatmapLagDays?: readonly number[];
}

export const TestHeatmapDetails: React.FC<TestHeatmapDetailsProps> = ({
    appu,
    retention,
    playtime,
    heatmapLagDays = DEFAULT_HEATMAP_LAG_DAYS,
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

    const calculateMeanUsers = (dates: { date: string; values: (number | null)[]; users: number }[]) => {
        if (dates.length === 0) return 0;
        const totalUsers = dates.reduce((sum, entry) => sum + entry.users, 0);
        return Math.round(totalUsers / dates.length);
    }

    const getColorIntensity = (value: number | null | undefined, metric: string) => {
        if (value == null || Number.isNaN(value)) return 0;
        const maxValue = metric === 'Retention' ? 100 : 800;
        const intensity = value / maxValue;
        return Math.min(intensity, 1);
    }

    const formatCell = (value: number | null | undefined, metric: string) => {
        if (value == null || Number.isNaN(value)) return "—";
        if (metric === "Retention") return `${value.toFixed(2)}${getValueSuffix(metric)}`;
        return `${Math.round(value)} ${getValueSuffix(metric)}`.trim();
    };

    const columnHeader = (metric: string, day: number, lagDays: readonly number[]) => {
        // Single-stat test heatmaps: accordion title names the metric; no redundant lag label in the column header.
        if (lagDays.length === 1 && day === 1) {
            return 'Value';
        }
        return day === 1 ? 'D1' : String(day);
    };

    const renderHeatmapTable = (
        data: HeatmapData,
        metric: string,
        lagDays: readonly number[] = DEFAULT_HEATMAP_LAG_DAYS,
    ) => {
        const meanUsers = calculateMeanUsers(data.dates);

        return (
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{lagDays.length === 1 ? 'Metric →' : 'Days →'}</TableCell>
                            {lagDays.map((day) => (
                                <TableCell key={day} align="center">
                                    {columnHeader(metric, day, lagDays)}
                                </TableCell>
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
                            {lagDays.map((day) => {
                                const value = data.mean[day];
                                return (
                                    <TableCell
                                        key={day}
                                        align="center"
                                        sx={{
                                            backgroundColor:
                                                value != null
                                                    ? `rgba(68, 171, 255, ${getColorIntensity(value, metric)})`
                                                    : "inherit",
                                        }}
                                    >
                                        {formatCell(value, metric)}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        {data.dates.map((dateEntry) => (
                            <TableRow key={dateEntry.date}>
                                <TableCell component="th" scope="row">
                                    {dateEntry.date}
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        {dateEntry.users} Users
                                    </Typography>
                                </TableCell>
                                {lagDays.map((day) => {
                                    const value = dateEntry.values[day];
                                    return (
                                        <TableCell
                                            key={day}
                                            align="center"
                                            sx={{
                                                backgroundColor:
                                                    value != null
                                                        ? `rgba(68, 171, 255, ${getColorIntensity(value, metric)})`
                                                        : "inherit",
                                            }}
                                        >
                                            {formatCell(value, metric)}
                                        </TableCell>
                                    );
                                })}
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
                    {renderHeatmapTable(appu, 'APPU', heatmapLagDays)}
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
                    <Typography>Retention</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {renderHeatmapTable(retention, 'Retention', heatmapLagDays)}
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
                    {renderHeatmapTable(playtime, 'Playtime', heatmapLagDays)}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
