import React from "react";
import {
    Box,
    Typography,
    Stack,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Divider,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tabs,
    Tab
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams, useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend
} from "recharts";
import DemographicsChart, { DemographicDatum, GenderSummary } from "../../components/dashboard/demographics-chart";
import PlacementsChart, { PlacementDatum } from "../../components/dashboard/placements-chart";
import { TestOverallValues } from "../../components/tests/test-overall-values";
import { TestHeatmapDetails } from "../../components/tests/test-heatmap-details";

type VariantRow = {
    name: string;
    installs: number;
    spend: number;
    cpi: number;
    d1: string;
    roas7: string;
    lift: string;
    p: string;
    signif: string;
};

const tooltip = {
    cpi: "CPI = Spend ÷ Installs",
    ctr: "CTR = Clicks ÷ Impressions × 100",
    cvr: "CVR = Installs ÷ Clicks × 100",
    roas7: "ROAS D7 = (Revenue in 7 days ÷ Spend) × 100",
    retention: "Retention Dx = (Users active on day x ÷ Installs day 0) × 100",
    appu: "APPU Dx = Total playtime seconds on day x ÷ Users active on day x",
    lift: "Lift % = ((Variant – Control) ÷ Control) × 100",
    ci: "Confidence Interval 95% = mean ± 1.96 × (σ / √n)",
};

export const DeveloperTestDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [testData, setTestData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [testMetrics, setTestMetrics] = React.useState<any>(null);
    const [chartData, setChartData] = React.useState<any>(null);

    // Fetch test data from backend
    React.useEffect(() => {
        const fetchTestData = async () => {
            if (!id) return;

            setLoading(true);
            try {
                // Fetch test details
                const testResponse = await fetch(`http://localhost:3000/tests/${id}`);
                if (!testResponse.ok) {
                    throw new Error('Failed to fetch test');
                }
                const test = await testResponse.json();
                setTestData(test);

                // Fetch test metrics
                const metricsResponse = await fetch(`http://localhost:3000/tests/${id}/metrics`);
                if (metricsResponse.ok) {
                    const metrics = await metricsResponse.json();
                    setTestMetrics(metrics);
                }

                // Fetch chart data
                const chartsResponse = await fetch(`http://localhost:3000/tests/${id}/charts`);
                if (chartsResponse.ok) {
                    const charts = await chartsResponse.json();
                    setChartData(charts);
                } else {
                    // Fallback: try to get chart data from metrics if charts endpoint fails
                    const metricsResponse2 = await fetch(`http://localhost:3000/tests/${id}/metrics`);
                    if (metricsResponse2.ok) {
                        const metrics = await metricsResponse2.json();
                        if (metrics.metrics?.charts) {
                            setChartData(metrics.metrics.charts);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching test data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [id]);

    // Calculate overall values from chart data
    const overallValues = React.useMemo(() => {
        // Calculate CPI from placements or performance data
        let cpi = "$0.00";
        if (chartData?.placements && chartData.placements.length > 0) {
            const totalInstalls = chartData.placements.reduce((sum: number, p: any) => sum + (p.installs || 0), 0);
            const totalSpend = chartData.placements.reduce((sum: number, p: any) => sum + (p.amountSpent || 0), 0);
            if (totalInstalls > 0) {
                cpi = `$${(totalSpend / totalInstalls).toFixed(2)}`;
            }
        } else if (chartData?.performance && chartData.performance.length > 0) {
            const totalInstalls = chartData.performance.reduce((sum: number, p: any) => sum + (p.installs || 0), 0);
            const totalSpend = chartData.performance.reduce((sum: number, p: any) => sum + (p.cpi * (p.installs || 0)), 0);
            if (totalInstalls > 0) {
                cpi = `$${(totalSpend / totalInstalls).toFixed(2)}`;
            }
        }

        // Get gender distribution
        const gender = chartData?.demographics?.genderSummary
            ? {
                male: chartData.demographics.genderSummary.find((g: any) => g.label === "M")?.percent || 0,
                female: chartData.demographics.genderSummary.find((g: any) => g.label === "F")?.percent || 0
            }
            : { male: 0, female: 0 };

        // Calculate age range from demographics
        const age = chartData?.demographics?.data
            ? (() => {
                const ageGroups = chartData.demographics.data.filter((d: any) => (d.male + d.female) > 0);
                if (ageGroups.length > 0) {
                    const firstAge = ageGroups[0].age.split('-')[0] || ageGroups[0].age.split('+')[0];
                    const lastAge = ageGroups[ageGroups.length - 1].age.split('-')[1] || ageGroups[ageGroups.length - 1].age.split('+')[0];
                    const totalUsers = ageGroups.reduce((sum: number, d: any) => sum + d.male + d.female, 0);
                    const largestGroup = ageGroups.reduce((max: any, d: any) => 
                        (d.male + d.female) > (max.male + max.female) ? d : max
                    , ageGroups[0]);
                    const percentage = totalUsers > 0 ? Math.round(((largestGroup.male + largestGroup.female) / totalUsers) * 100) : 0;
                    return { range: `${firstAge}-${lastAge}`, percentage };
                }
                return { range: "N/A", percentage: 0 };
            })()
            : { range: "N/A", percentage: 0 };

        // Calculate placements distribution
        const placements = chartData?.placements
            ? (() => {
                const totalImpressions = chartData.placements.reduce((sum: number, p: any) => sum + (p.impressions || 0), 0);
                if (totalImpressions === 0) return { q: 0, f: 0, o: 0 };
                
                const q = chartData.placements.find((p: any) => p.network?.toLowerCase().includes('audience'))?.impressions || 0;
                const f = chartData.placements.find((p: any) => p.network?.toLowerCase().includes('facebook'))?.impressions || 0;
                const o = chartData.placements.find((p: any) => 
                    !p.network?.toLowerCase().includes('facebook') && 
                    !p.network?.toLowerCase().includes('audience')
                )?.impressions || 0;
                
                return {
                    q: Math.round((q / totalImpressions) * 100),
                    f: Math.round((f / totalImpressions) * 100),
                    o: Math.round((o / totalImpressions) * 100)
                };
            })()
            : { q: 0, f: 0, o: 0 };

        return { cpi, gender, age, placements };
    }, [chartData]);

    // Get test details or use default
    const testDetails = testData ? {
        title: testData.title || "Unknown Test",
        ...overallValues
    } : {
        title: "Unknown Test",
        cpi: "$0.00",
        gender: { male: 0, female: 0 },
        age: { range: "N/A", percentage: 0 },
        placements: { q: 0, f: 0, o: 0 }
    };

    // Use real chart data from backend, fallback to empty/default if not available
    const placementsData: PlacementDatum[] = React.useMemo(() => {
        if (chartData?.placements && chartData.placements.length > 0) {
            return chartData.placements;
        }
        return [];
    }, [chartData]);

    const demoData: DemographicDatum[] = React.useMemo(() => {
        if (chartData?.demographics?.data && chartData.demographics.data.length > 0) {
            return chartData.demographics.data;
        }
        return [
            { age: "18-24", male: 0, female: 0 },
            { age: "25-34", male: 0, female: 0 },
            { age: "35-44", male: 0, female: 0 },
            { age: "45-54", male: 0, female: 0 },
            { age: "55+", male: 0, female: 0 },
        ];
    }, [chartData]);

    const genderSummary: GenderSummary[] = React.useMemo(() => {
        if (chartData?.demographics?.genderSummary && chartData.demographics.genderSummary.length > 0) {
            return chartData.demographics.genderSummary;
        }
        return [
            { label: "M", percent: 0, installs: 0, spend: 0, color: "#b388ff" },
            { label: "F", percent: 0, installs: 0, spend: 0, color: "#ffd54f" },
        ];
    }, [chartData]);

    // Variants data from backend
    const variantsData: VariantRow[] = React.useMemo(() => {
        if (chartData?.variants && chartData.variants.length > 0) {
            return chartData.variants.map((v: any) => ({
                name: v.name || "Unknown",
                installs: v.installs || 0,
                spend: v.spend || 0,
                cpi: v.cpi || 0,
                d1: v.d1 || "0%",
                roas7: v.roas7 || "0%",
                lift: v.lift || "—",
                p: v.p || "—",
                signif: v.signif || "—"
            }));
        }
        return [];
    }, [chartData]);

    // Performance data for dual-axis chart
    const performanceData = React.useMemo(() => {
        if (chartData?.performance && chartData.performance.length > 0) {
            return chartData.performance;
        }
        return [];
    }, [chartData]);

    const [expandedPanels, setExpandedPanels] = React.useState<{ [key: string]: boolean }>({
        charts: false,
        heatmaps: false,
        facebook: false
    });

    const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedPanels(prev => ({
            ...prev,
            [panel]: isExpanded
        }));
    };

    const [chartTab, setChartTab] = React.useState(0);

    const handleChartTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setChartTab(newValue);
    };

    // Calculate date range from test data
    const startDate = testData?.startDate 
        ? new Date(testData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : "N/A";
    const endDate = testData?.endDate 
        ? new Date(testData.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : testData?.startDate
        ? new Date(testData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : "N/A";

    // Heatmap data from backend
    const heatmapData = React.useMemo(() => {
        if (chartData?.heatmaps) {
            return {
                appu: chartData.heatmaps.appu || { mean: new Array(9).fill(0), dates: [] },
                retention: chartData.heatmaps.retention || { mean: new Array(9).fill(0), dates: [] },
                playtime: chartData.heatmaps.playtime || { mean: new Array(9).fill(0), dates: [] },
            };
        }
        return {
            appu: { mean: new Array(9).fill(0), dates: [] },
            retention: { mean: new Array(9).fill(0), dates: [] },
            playtime: { mean: new Array(9).fill(0), dates: [] },
        };
    }, [chartData]);

    if (loading) {
        return (
            <Box p={3} mt={6}>
                <Typography>Loading test data...</Typography>
            </Box>
        );
    }

    if (!testData) {
        return (
            <Box p={3} mt={6}>
                <Typography>Test not found</Typography>
            </Box>
        );
    }

    return (
        <Box p={3} mt={6}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">{testDetails.title}</Typography>
                <TestOverallValues
                    cpi={testDetails.cpi}
                    gender={testDetails.gender}
                    age={testDetails.age}
                    placements={testDetails.placements}
                />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Accordion
                expanded={expandedPanels.charts}
                onChange={handleChange('charts')}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="charts-content"
                    id="charts-header"
                >
                    <Typography>Charts - {startDate} - {endDate}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Tabs
                        value={chartTab}
                        onChange={handleChartTabChange}
                        sx={{ mb: 2 }}
                    //centered
                    >
                        <Tab label="Performance" />
                        <Tab label="Demographics" />
                        <Tab label="Placements" />
                    </Tabs>

                    {chartTab === 0 && (
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">Performance</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Installs and CPI trends over time
                            </Typography>

                            {performanceData.length > 0 ? (
                                <Stack spacing={4} sx={{ mb: 4 }}>
                                    {/* Installs Chart */}
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 2 }}>Installs</Typography>
                                        <Box sx={{ height: 350 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={performanceData}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                    <XAxis
                                                        dataKey="date"
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={{ stroke: '#666' }}
                                                        label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={{ stroke: '#666' }}
                                                        label={{ value: 'Installs', angle: -90, position: 'insideLeft' }}
                                                    />
                                                    <RechartsTooltip
                                                        formatter={(value: any) => [value.toLocaleString(), 'Installs']}
                                                        labelFormatter={(label) => `Date: ${label}`}
                                                        contentStyle={{
                                                            backgroundColor: '#fff',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="installs"
                                                        stroke="#1976d2"
                                                        strokeWidth={3}
                                                        name="Installs"
                                                        dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                                                        activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Box>

                                    {/* CPI Chart */}
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 2 }}>CPI (Cost Per Install)</Typography>
                                        <Box sx={{ height: 350 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={performanceData}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                    <XAxis
                                                        dataKey="date"
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={{ stroke: '#666' }}
                                                        label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                                                    />
                                                    <YAxis
                                                        tick={{ fontSize: 12 }}
                                                        tickLine={{ stroke: '#666' }}
                                                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                                                        label={{ value: 'CPI', angle: -90, position: 'insideLeft' }}
                                                    />
                                                    <RechartsTooltip
                                                        formatter={(value: any) => [`$${value.toFixed(2)}`, 'CPI']}
                                                        labelFormatter={(label) => `Date: ${label}`}
                                                        contentStyle={{
                                                            backgroundColor: '#fff',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="cpi"
                                                        stroke="#4caf50"
                                                        strokeWidth={3}
                                                        name="CPI"
                                                        dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                                                        activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 2 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Box>
                                </Stack>
                            ) : (
                                <Box sx={{ mb: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No performance data available
                                    </Typography>
                                </Box>
                            )}

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Variant</TableCell>
                                        <TableCell>Installs</TableCell>
                                        <TableCell>Spend</TableCell>
                                        <TableCell>
                                            CPI
                                            <Tooltip title={tooltip.cpi}><IconButton size="small" sx={{ ml: 0.5 }}><InfoOutlinedIcon fontSize="inherit" /></IconButton></Tooltip>
                                        </TableCell>
                                        <TableCell>D1 Ret</TableCell>
                                        <TableCell>
                                            ROAS D7
                                            <Tooltip title={tooltip.roas7}><IconButton size="small" sx={{ ml: 0.5 }}><InfoOutlinedIcon fontSize="inherit" /></IconButton></Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            Lift vs Control
                                            <Tooltip title={tooltip.lift}><IconButton size="small" sx={{ ml: 0.5 }}><InfoOutlinedIcon fontSize="inherit" /></IconButton></Tooltip>
                                        </TableCell>
                                        <TableCell>p-value</TableCell>
                                        <TableCell>Signif%</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {variantsData.length > 0 ? (
                                        variantsData.map((v) => (
                                            <TableRow key={v.name}>
                                                <TableCell>{v.name}</TableCell>
                                                <TableCell>{v.installs.toLocaleString()}</TableCell>
                                                <TableCell>${v.spend.toLocaleString()}</TableCell>
                                                <TableCell>{v.cpi.toFixed(2)}</TableCell>
                                                <TableCell>{v.d1}</TableCell>
                                                <TableCell>{v.roas7}</TableCell>
                                                <TableCell>{v.lift}</TableCell>
                                                <TableCell>{v.p}</TableCell>
                                                <TableCell>{v.signif}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    No variant data available
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    )}

                    {chartTab === 1 && (
                        <DemographicsChart title="Demographics" data={demoData} genderSummary={genderSummary} />
                    )}

                    {chartTab === 2 && (
                        <PlacementsChart title="Placements" data={placementsData} />
                    )}
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expandedPanels.heatmaps}
                onChange={handleChange('heatmaps')}
                sx={{ mt: 2 }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="heatmaps-content"
                    id="heatmaps-header"
                >
                    <Typography>Heatmaps</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TestHeatmapDetails
                        appu={heatmapData.appu}
                        retention={heatmapData.retention}
                        playtime={heatmapData.playtime}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion
                expanded={expandedPanels.facebook}
                onChange={handleChange('facebook')}
                sx={{ mt: 2 }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="facebook-content"
                    id="facebook-header"
                >
                    <Typography>Facebook Campaign</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle1" fontWeight="bold">Facebook Campaign</Typography>
                    <Typography variant="body2" color="text.secondary">Campaign details will be displayed here.</Typography>
                </AccordionDetails>
            </Accordion>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={() => {
                    console.log('Exporting CSV for test:', id);
                }}>Export CSV</Button>
                <Button variant="outlined" onClick={() => {
                    console.log('Saving report for test:', id);
                }}>Save Report</Button>
                <Button variant="contained" onClick={() => navigate(-1)}>Back to Tests</Button>
            </Stack>
        </Box>
    );
};

export default DeveloperTestDetail;


