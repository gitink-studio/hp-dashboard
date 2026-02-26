import React from "react";
import {
    Box,
    Typography,
    Stack,
    Divider,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tabs,
    Tab
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams, useNavigate } from "react-router-dom";
import { ROOT_URL } from "../../common/constants";
import DemographicsChart, { DemographicDatum, GenderSummary } from "../../components/dashboard/demographics-chart";
import PlacementsChart, { PlacementDatum } from "../../components/dashboard/placements-chart";
import { TestOverallValues } from "../../components/tests/test-overall-values";
import { TestHeatmapDetails } from "../../components/tests/test-heatmap-details";

export const PublisherTestDetail: React.FC = () => {
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
                const testResponse = await fetch(`${ROOT_URL}/tests/${id}`);
                if (!testResponse.ok) {
                    throw new Error('Failed to fetch test');
                }
                const test = await testResponse.json();
                setTestData(test);

                // Fetch test metrics
                const metricsResponse = await fetch(`${ROOT_URL}/tests/${id}/metrics`);
                if (metricsResponse.ok) {
                    const metrics = await metricsResponse.json();
                    setTestMetrics(metrics);
                }

                // Fetch chart data
                const chartsResponse = await fetch(`${ROOT_URL}/tests/${id}/charts`);
                if (chartsResponse.ok) {
                    const charts = await chartsResponse.json();
                    setChartData(charts);
                } else {
                    // Fallback: try to get chart data from metrics if charts endpoint fails
                    const metricsResponse2 = await fetch(`${ROOT_URL}/tests/${id}/metrics`);
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

    const handleExportCSV = () => {
        // Implement CSV export logic
        console.log('Exporting CSV for test:', id);
    };

    const handleSaveReport = () => {
        // Implement save report logic
        console.log('Saving report for test:', id);
    };

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
                    // centered
                    >
                        <Tab label="Performance" />
                        <Tab label="Demographics" />
                        <Tab label="Placements" />
                    </Tabs>

                    {chartTab === 0 && (
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">Performance</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                (same chart and variant table as developer view)
                            </Typography>
                        </Box>
                    )}

                    {chartTab === 1 && (
                        <DemographicsChart 
                            title="Demographics" 
                            data={demoData} 
                            genderSummary={genderSummary} 
                        />
                    )}

                    {chartTab === 2 && (
                        <PlacementsChart 
                            title="Placements" 
                            data={placementsData.length > 0 ? placementsData : []} 
                        />
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
                    <Typography variant="body2" color="text.secondary">Same creative table as Developer view.</Typography>
                </AccordionDetails>
            </Accordion>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={handleExportCSV}>Export CSV</Button>
                <Button variant="outlined" onClick={handleSaveReport}>Save Report</Button>
                <Button variant="contained" onClick={() => navigate(-1)}>Back to Tests</Button>
            </Stack>
        </Box>
    );
};

export default PublisherTestDetail;


