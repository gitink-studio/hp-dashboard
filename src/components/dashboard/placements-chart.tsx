import React, { useState } from "react";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts";

export type PlacementDatum = {
    network: string;
    impressions: number;
    installs: number;
    amountSpent: number;
};

type Props = {
    title?: string;
    data: PlacementDatum[];
};

export const PlacementsChart: React.FC<Props> = ({
    title = "Placements",
    data
}) => {
    const theme = useTheme();
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Impressions", "Installs"]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                }}>
                    <Typography variant="body2" fontWeight="bold">{data.network}</Typography>
                    <Typography variant="body2">Impressions: {data.impressions.toLocaleString()}</Typography>
                    <Typography variant="body2">Installs: {data.installs.toLocaleString()}</Typography>
                    <Typography variant="body2">Amount Spent: ${data.amountSpent.toLocaleString()}</Typography>
                </Box>
            );
        }
        return null;
    };

    // Toggle metric selection
    const toggleMetricSelection = (metric: string) => {
        setSelectedMetrics(prev =>
            prev.includes(metric)
                ? prev.filter(m => m !== metric)
                : [...prev, metric]
        );
    };

    // Placement summary data
    const placementSummary = [
        {
            label: "Impressions",
            value: data.reduce((sum, item) => sum + item.impressions, 0),
            color: theme.palette.primary.light
        },
        {
            label: "Installs",
            value: data.reduce((sum, item) => sum + item.installs, 0),
            color: theme.palette.warning.light
        }
    ];

    // Filter data based on selected metrics
    const filteredData = data.map(item => ({
        ...item,
        impressions: selectedMetrics.includes("Impressions") ? item.impressions : 0,
        installs: selectedMetrics.includes("Installs") ? item.installs : 0,
    }));

    return (
        <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3, mb: 5 }}>
                <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
                <Chip size="small" label="Ads" />
                <Chip size="small" label="Date: 23/08/2025-29/08/2025" />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Chip
                    label="Impressions"
                    color="primary"
                    size="small"
                    sx={{ opacity: 0.7 }}
                />
                <Chip
                    label="Installs"
                    color="primary"
                    size="small"
                    sx={{ opacity: 0.7 }}
                />
                <Chip
                    label="Spend"
                    color="primary"
                    size="small"
                    sx={{ opacity: 0.7 }}
                />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: 1, minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={filteredData} barGap={8} barCategoryGap={20}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="network"
                                label={{
                                    value: "",
                                    position: "insideBottom",
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '12px',
                                        fill: 'rgba(0,0,0,0.6)'
                                    }
                                }}
                                height={50}
                            />
                            <YAxis
                                label={{
                                    value: "Metrics",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '12px',
                                        fill: 'rgba(0,0,0,0.6)'
                                    }
                                }}
                            />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="impressions"
                                name="Impressions"
                                fill={theme.palette.primary.light}
                                radius={[2, 2, 0, 0]}

                            />
                            <Bar
                                dataKey="installs"
                                name="Installs"
                                fill={theme.palette.warning.light}
                                radius={[2, 2, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Box sx={{ width: { xs: "100%", md: 300 }, border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>Metrics:</Typography>
                    <Stack spacing={1}>
                        {placementSummary.map((m) => (
                            <Stack
                                key={m.label}
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                    cursor: 'pointer',
                                    opacity: selectedMetrics.includes(m.label) ? 1 : 0.5,
                                    '&:hover': { opacity: 0.8 }
                                }}
                                onClick={() => toggleMetricSelection(m.label)}
                            >
                                <Box sx={{
                                    width: 16,
                                    height: 16,
                                    bgcolor: m.color,
                                    borderRadius: 0.5,
                                    position: 'relative'
                                }}>
                                    {selectedMetrics.includes(m.label) && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                color: 'white',
                                                fontSize: 12,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ✓
                                        </Box>
                                    )}
                                </Box>
                                <Typography variant="body2">
                                    {m.label} {m.value.toLocaleString()}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default PlacementsChart;
