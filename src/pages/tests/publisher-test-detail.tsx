import React from "react";
import { Box, Tabs, Tab, Typography, Stack, Tooltip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Divider, Chip, Button, TextField, Checkbox, FormControlLabel } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams, useNavigate } from "react-router-dom";
import DemographicsChart, { DemographicDatum, GenderSummary } from "../../components/dashboard/demographics-chart";
import PlacementsChart, { PlacementDatum } from "../../components/dashboard/placements-chart";

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

export const PublisherTestDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = React.useState(0);

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

    // Marketing Spend state
    const [startDate, setStartDate] = React.useState("28/08/25");
    const [endDate, setEndDate] = React.useState("30/09/25");
    const [totalBudget, setTotalBudget] = React.useState(10000);
    const [evenlyDistribute, setEvenlyDistribute] = React.useState(true);
    const [autoIncreasePct, setAutoIncreasePct] = React.useState(10);
    const [targetCPI, setTargetCPI] = React.useState(0.5);

    return (
        <Box p={3} mt={6}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Hyper Rabbit Publisher – Test</Typography>
            </Stack>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
                <Tab label="Performance" />
                <Tab label="Demographics" />
                <Tab label="Placements" />
                <Tab label="Heatmaps" />
                <Tab label="Marketing Spend" />
                <Tab label="Facebook Campaign" />
            </Tabs>

            <Divider sx={{ my: 2 }} />

            {tab === 0 && (
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Performance</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        (same chart and variant table as developer view)
                    </Typography>
                </Box>
            )}

            {tab === 1 && (
                <Box>
                    <DemographicsChart title="Demographics" data={demoData} genderSummary={genderSummary} />
                </Box>
            )}

            {tab === 2 && (
                <Box>
                    <PlacementsChart title="Placements" data={placementsData} />
                </Box>
            )}

            {tab === 3 && (
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Heatmaps</Typography>
                    <Typography variant="body2" color="text.secondary">Identical structure & values as Developer view.</Typography>
                </Box>
            )}

            {tab === 4 && (
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Marketing Spend – Daily Auto-Budget Planner</Typography>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                        <TextField size="small" label="Start" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <TextField size="small" label="End" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <TextField size="small" label="Total Budget" type="number" value={totalBudget} onChange={(e) => setTotalBudget(parseFloat(e.target.value))} />
                        <TextField size="small" label="Target CPI" type="number" value={targetCPI} onChange={(e) => setTargetCPI(parseFloat(e.target.value))} />
                        <TextField size="small" label="Auto-increase %" type="number" value={autoIncreasePct} onChange={(e) => setAutoIncreasePct(parseFloat(e.target.value))} />
                    </Stack>
                    <Stack sx={{ mt: 2 }}>
                        <FormControlLabel control={<Checkbox checked={evenlyDistribute} onChange={(e) => setEvenlyDistribute(e.target.checked)} />} label="Evenly distribute spend over range" />
                        <FormControlLabel control={<Checkbox />} label="Custom daily amounts  [ Edit Table ]" />
                        <FormControlLabel control={<Checkbox defaultChecked />} label={`Auto-increase by % if CPI < Target (${autoIncreasePct}%)`} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Daily Spend (even) = Total Budget ÷ Total Days. Auto-increase applies when CPI &lt; Target, capped so total does not exceed Total Budget.
                    </Typography>
                </Box>
            )}

            {tab === 5 && (
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Facebook Campaign</Typography>
                    <Typography variant="body2" color="text.secondary">Same creative table as Developer view.</Typography>
                </Box>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" color="success">Approve Test</Button>
                <Button variant="outlined" color="warning">Pause Test</Button>
                <Button variant="outlined">Save Plan</Button>
                <Button variant="outlined">Export CSV</Button>
                <Button variant="contained" onClick={() => navigate(-1)}>Back to Tests</Button>
            </Stack>
        </Box>
    );
};

export default PublisherTestDetail;


