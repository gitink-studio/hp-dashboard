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

const VARIANTS: VariantRow[] = [
    { name: "Control", installs: 20000, spend: 8800, cpi: 0.44, d1: "36%", roas7: "120%", lift: "—", p: "—", signif: "—" },
    { name: "A", installs: 30000, spend: 12000, cpi: 0.40, d1: "39%", roas7: "130%", lift: "–9% CPI", p: "0.02", signif: "98%" },
    { name: "B", installs: 30000, spend: 13200, cpi: 0.44, d1: "37%", roas7: "124%", lift: "0% CPI", p: "0.45", signif: "n.s." },
];

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

    // Test details mapping
    const TEST_DETAILS = {
        "cpi-hook-test": {
            title: "CPI Hook Test – Pickle Ball Clash",
            cpi: "$0.79",
            gender: { male: 82, female: 18 },
            age: { range: "13-44", percentage: 29 },
            placements: { q: 7, f: 83, o: 9 }
        },
        "onboarding-flow-ux": {
            title: "Onboarding Flow UX – Game Onboarding",
            cpi: "$0.65",
            gender: { male: 75, female: 25 },
            age: { range: "18-34", percentage: 45 },
            placements: { q: 12, f: 75, o: 13 }
        },
        "monetization-pack-a": {
            title: "Monetization Pack A – Revenue Optimization",
            cpi: "$0.92",
            gender: { male: 70, female: 30 },
            age: { range: "25-44", percentage: 35 },
            placements: { q: 5, f: 88, o: 7 }
        }
    };

    // Get test details or use default
    const testDetails = TEST_DETAILS[id as keyof typeof TEST_DETAILS] || {
        title: "Unknown Test",
        cpi: "$0.00",
        gender: { male: 0, female: 0 },
        age: { range: "N/A", percentage: 0 },
        placements: { q: 0, f: 0, o: 0 }
    };

    // Static demo data for Placements chart
    const placementsData: PlacementDatum[] = [
        {
            network: "Audience Network",
            impressions: 10275,
            installs: 929,
            amountSpent: 136.61
        },
        {
            network: "Facebook",
            impressions: 70275,
            installs: 6929,
            amountSpent: 736.61
        },
        {
            network: "Instagram",
            impressions: 5275,
            installs: 429,
            amountSpent: 236.61
        },
    ];

    // Static demo data for Demographics chart
    const demoData: DemographicDatum[] = [
        { age: "18-24", male: 20, female: 10 },
        { age: "25-34", male: 60, female: 25 },
        { age: "35-44", male: 150, female: 35 },
        { age: "45-54", male: 280, female: 50 },
        { age: "55+", male: 360, female: 120 },
    ];

    const genderSummary: GenderSummary[] = [
        { label: "M", percent: 80, installs: 898, spend: 709.2, color: "#b388ff" },
        { label: "F", percent: 20, installs: 227, spend: 184.17, color: "#ffd54f" },
    ];

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

    // Date range from the reference image
    const startDate = "23/08/2025";
    const endDate = "29/09/2025";

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
                                Dual-axis line chart: Installs (left) and CPI (right) vs Date
                            </Typography>

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
                                    {VARIANTS.map((v) => (
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
                                    ))}
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
                        appu={{
                            mean: [308, 359, 381, 357, 358, 355, 372, 0, 0],
                            dates: [
                                { date: "23 Aug", values: [262, 297, 326, 332, 335, 324, 316, 297, 284], users: 131 },
                                { date: "24 Aug", values: [331, 371, 391, 389, 377, 406, 265, 373, 328], users: 207 },
                                { date: "25 Aug", values: [351, 385, 323, 400, 398, 311, 403, 431, 425], users: 160 },
                                { date: "26 Aug", values: [362, 433, 419, 342, 391, 367, 258, 368, 272], users: 195 },
                                { date: "27 Aug", values: [362, 428, 430, 398, 442, 251, 279, 331, 300], users: 185 },
                                { date: "28 Aug", values: [362, 343, 446, 253, 401, 291, 358, 374, 364], users: 169 },
                                { date: "29 Aug", values: [362, 433, 443, 290, 387, 270, 309, 450, 407], users: 47 }
                            ]
                        }}
                        retention={{
                            mean: [7.04, 5.04, 3.82, 0, 0, 0, 0, 0, 0],
                            dates: [
                                { date: "23 Aug", values: [8.40, 5.34, 3.82, 3.05, 3.82, 2.29, 3.05, 1.53, 0.76], users: 131 },
                                { date: "24 Aug", values: [5.83, 4.85, 2.91, 2.43, 0.97, 0.49, 0.00, 0.97, 0.00], users: 207 },
                                { date: "25 Aug", values: [7.50, 2.50, 0.63, 1.25, 1.25, 0.63, 0.00, 0.00, 0.00], users: 160 },
                                { date: "26 Aug", values: [11.79, 8.21, 5.64, 4.10, 5.13, 3.59, 0.00, 0.00, 0.00], users: 195 },
                                { date: "27 Aug", values: [13.04, 7.61, 3.80, 4.89, 4.35, 0.00, 0.00, 0.00, 0.00], users: 185 },
                                { date: "28 Aug", values: [8.33, 4.76, 4.76, 2.38, 0.00, 0.00, 0.00, 0.00, 0.00], users: 169 },
                                { date: "29 Aug", values: [0.00, 2.13, 2.13, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00], users: 47 }
                            ]
                        }}
                        playtime={{
                            mean: [331, 540, 465, 153, 0, 0, 0, 0, 0],
                            dates: [
                                { date: "23 Aug", values: [262, 412, 540, 153, 495, 339, 358, 249, 190], users: 131 },
                                { date: "24 Aug", values: [331, 683, 417, 110, 407, 560, 278, 0, 156], users: 207 },
                                { date: "25 Aug", values: [351, 459, 331, 468, 478, 190, 35, 124, 0], users: 160 },
                                { date: "26 Aug", values: [362, 762, 291, 441, 254, 331, 377, 0, 0], users: 195 },
                                { date: "27 Aug", values: [362, 428, 430, 398, 442, 251, 279, 331, 300], users: 185 },
                                { date: "28 Aug", values: [362, 343, 446, 253, 401, 291, 358, 374, 364], users: 169 },
                                { date: "29 Aug", values: [362, 433, 443, 290, 387, 270, 309, 450, 407], users: 47 }
                            ]
                        }}
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
                <Button variant="outlined" onClick={() => {/* export */ }}>Export CSV</Button>
                <Button variant="outlined" onClick={() => {/* save */ }}>Save Report</Button>
                <Button variant="contained" onClick={() => navigate(-1)}>Back to Tests</Button>
            </Stack>
        </Box>
    );
};

export default DeveloperTestDetail;


