import React from "react";
import { Box, Tabs, Tab, Typography, Stack, Tooltip, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Divider, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useParams, useNavigate } from "react-router-dom";
import DemographicsChart, { DemographicDatum, GenderSummary } from "../../components/dashboard/demographics-chart";
import PlacementsChart, { PlacementDatum } from "../../components/dashboard/placements-chart";

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
    const { id: _id } = useParams();
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

    return (
        <Box p={3} mt={6}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">Test: CPI Hook Test – Pickle Ball Clash</Typography>
            </Stack>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
                <Tab label="Performance" />
                <Tab label="Demographics" />
                <Tab label="Placements" />
                <Tab label="Heatmaps" />
                <Tab label="Facebook Campaign" />
            </Tabs>

            <Divider sx={{ my: 2 }} />

            {tab === 0 && (
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
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        1) APPU (Average Playtime Per User – seconds)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Days → D0 D1 D2 D3 | Mean 331 368 392 397
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>2) Retention (%)</Typography>
                    <Typography variant="body2" color="text.secondary">Days → D1 D2 D3 | Mean 7.04 5.04 3.82</Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>3) Playtime (Mean Seconds)</Typography>
                    <Typography variant="body2" color="text.secondary">Days → D0 D1 D2 D3 | Mean 331 540 465 153</Typography>
                </Box>
            )}

            {tab === 4 && (
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Facebook Campaign</Typography>
                    <Table size="small" sx={{ mt: 1 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Creative ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Impr</TableCell>
                                <TableCell>Clicks</TableCell>
                                <TableCell>Installs</TableCell>
                                <TableCell>CPI</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[{ t: 1, id: "PICK_v1_1080x1350…_004037", s: "Active", i: 55697, c: 1143, ins: 789, cpi: 0.79 }, { t: 2, id: "PICK_v1_1080x1350…_004035", s: "Active", i: 51738, c: 1056, ins: 738, cpi: 0.77 }, { t: 3, id: "PICK_Ad2_1080x1350…_004036", s: "Active", i: 3580, c: 75, ins: 44, cpi: 1.05 }, { t: 4, id: "PICK_Ad1_1080x1350…_004034", s: "Active", i: 110, c: 2, ins: 1, cpi: 1.94 }].map((r) => (
                                <TableRow key={r.t}>
                                    <TableCell>{r.t}</TableCell>
                                    <TableCell>{r.id}</TableCell>
                                    <TableCell>{r.s}</TableCell>
                                    <TableCell>{r.i.toLocaleString()}</TableCell>
                                    <TableCell>{r.c.toLocaleString()}</TableCell>
                                    <TableCell>{r.ins.toLocaleString()}</TableCell>
                                    <TableCell>${r.cpi.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="outlined" onClick={() => {/* export */ }}>Export CSV</Button>
                <Button variant="outlined" onClick={() => {/* save */ }}>Save Report</Button>
                <Button variant="contained" onClick={() => navigate(-1)}>Back to Tests</Button>
            </Stack>
        </Box>
    );
};

export default DeveloperTestDetail;


