import React, { useState } from "react";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts";

export type DemographicDatum = {
    age: string;
    male: number;
    female: number;
};

export type GenderSummary = {
    label: string; // M or F
    percent: number; // 0-100
    installs: number;
    spend: number; // currency value
    color: string;
};

type Props = {
    title?: string;
    data: DemographicDatum[];
    genderSummary: GenderSummary[];
};

export const DemographicsChart: React.FC<Props> = ({ title = "Demographics", data, genderSummary }) => {
    const theme = useTheme();
    const [selectedGenders, setSelectedGenders] = useState<string[]>(["M", "F"]);

    const maleColor = genderSummary.find(g => g.label === "M")?.color || theme.palette.primary.light;
    const femaleColor = genderSummary.find(g => g.label === "F")?.color || theme.palette.warning.light;

    // Determine gender chip label
    const getGenderLabel = () => {
        if (selectedGenders.length === 2) return "All";
        if (selectedGenders.includes("M")) return "Male";
        if (selectedGenders.includes("F")) return "Female";
        return "None"; // Unlikely scenario, but handled for completeness
    };

    // Toggle gender selection
    const toggleGenderSelection = (gender: string) => {
        setSelectedGenders(prev =>
            prev.includes(gender)
                ? prev.filter(g => g !== gender)
                : [...prev, gender]
        );
    };

    // Filter data based on gender selection
    const filteredData = data.map(item => ({
        ...item,
        male: selectedGenders.includes("M") ? item.male : 0,
        female: selectedGenders.includes("F") ? item.female : 0
    }));

    return (
        <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 3, mb: 5 }}>
                {/* <Typography variant="subtitle1" fontWeight="bold">{title}</Typography> */}
                {/* <Chip size="small" label="Ads" /> */}
                <Chip size="small" label={`Gender: ${getGenderLabel()}`} />
                <Chip size="small" label="Metrics: Installs" />
                <Chip size="small" label={`Date: 23/08/2025-29/08/2025`} />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: 1, minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={filteredData} barGap={8} barCategoryGap={20}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="age"
                                label={{
                                    value: "Ages",
                                    position: "insideBottom",
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '12px',
                                        fill: 'rgba(0,0,0,0.6)',
                                    }
                                }}
                                height={50}
                            />
                            <YAxis
                                label={{
                                    value: "Installs",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: {
                                        textAnchor: 'middle',
                                        fontSize: '12px',
                                        fill: 'rgba(0,0,0,0.6)'
                                    }
                                }}
                            />
                            <RechartsTooltip formatter={(v: any) => v.toLocaleString()} />
                            <Bar dataKey="male" name="Male" fill={maleColor} radius={[2, 2, 0, 0]} />
                            <Bar dataKey="female" name="Female" fill={femaleColor} radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>

                <Box sx={{ width: { xs: "100%", md: 300 }, border: "1px solid", borderColor: "divider", borderRadius: 1, p: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>Gender:</Typography>
                    <Stack spacing={1}>
                        {genderSummary.map((g) => (
                            <Stack
                                key={g.label}
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                    cursor: 'pointer',
                                    position: 'relative',
                                    opacity: selectedGenders.includes(g.label) ? 1 : 0.5,
                                    '&:hover': { opacity: 0.8 }
                                }}
                                onClick={() => toggleGenderSelection(g.label)}
                            >
                                <Box
                                    sx={{
                                        width: 16,
                                        height: 16,
                                        bgcolor: g.color,
                                        borderRadius: 0.5,
                                        position: 'relative',
                                        // border: selectedGenders.includes(g.label)
                                        //     ? `2px solid ${theme.palette.primary.main}`
                                        //     : '2px solid transparent',
                                    }}
                                >
                                    {selectedGenders.includes(g.label) && (
                                        <CheckIcon
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                color: 'white',
                                                fontSize: 12,
                                            }}
                                        />
                                    )}
                                </Box>
                                <Typography variant="body2">
                                    {g.label} {g.percent}% ({g.installs.toLocaleString()}) ${g.spend.toFixed(2)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default DemographicsChart;



