import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Grid,
    Tooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import { AdvancedDateFilter } from "../../components/dashboard/advanced-date-filter";
import { GRAPHQL_URL, ROOT_URL } from "../../common/constants";

type TestRow = {
    id: string;
    title: string;
    type: "CPI" | "Feature" | "Monetize";
    variants: number;
    startDate: string;
    status: "Testing" | "Completed";
    primaryMetric: string;
    gameName: string;
    gamePlatform: string;
};

export const TestsHub: React.FC = () => {
    const navigate = useNavigate();
    // Keep UI identical: same two visible selects for Game and Platform
    // Internally mirror developer dashboard filters and cascading behavior
    const [filters, setFilters] = useState({
        platform: "All",
        subPlatform: "All",
        game: "All",
        dateRange: "Last 30d",
    });

    const [platforms, setPlatforms] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tests, setTests] = useState<TestRow[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Map internal platform selection to the UI's platform label when needed
    const [platform, setPlatform] = useState("All");
    const [game, setGame] = useState("All");
    const [testStatus, setTestStatus] = React.useState("All");
    const [testType, setTestType] = React.useState("All");

    const userRole = (localStorage.getItem("userRole") || "developer").toLowerCase();

    // ── New Test dialog ──────────────────────────────────────────────────────
    const [newTestOpen, setNewTestOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const emptyForm = {
        gameId: "",
        title: "",
        type: "CPI" as "CPI" | "Feature" | "Monetize",
        primaryMetric: "CPI",
        startDate: "",
        endDate: "",
        variants: 2,
        description: "",
    };
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState<Partial<typeof emptyForm & { variants: string }>>({});

    // Returns today's date as "YYYY-MM-DD" in the user's LOCAL timezone.
    // new Date().toISOString() returns UTC — for users in UTC+ timezones this
    // can be "tomorrow" locally, making today unselectable as a start date.
    const todayLocal = (): string => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm   = String(d.getMonth() + 1).padStart(2, "0");
        const dd   = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const PRIMARY_METRIC_OPTIONS = [
        { value: "CPI", label: "CPI – Cost Per Install" },
        { value: "D1 Retention", label: "D1 Retention (%)" },
        { value: "D7 Retention", label: "D7 Retention (%)" },
        { value: "ROAS", label: "ROAS – Return on Ad Spend" },
        { value: "DAU", label: "DAU – Daily Active Users" },
        { value: "Revenue", label: "Revenue" },
        { value: "Session Length", label: "Session Length (sec)" },
        { value: "Level Completion Rate", label: "Level Completion Rate (%)" },
        { value: "ARPDAU", label: "ARPDAU – Avg Revenue Per DAU" },
    ];

    const validateForm = (): boolean => {
        const errors: Partial<typeof emptyForm & { variants: string }> = {};
        if (!form.gameId) errors.gameId = "Please select an approved game.";
        if (!form.title.trim()) errors.title = "Title is required.";
        if (!form.startDate) errors.startDate = "Start date is required.";
        if (form.endDate && form.endDate <= form.startDate)
            errors.endDate = "End date must be after start date.";
        if (form.variants < 1 || !Number.isInteger(Number(form.variants)))
            (errors as any).variants = "Variants must be a whole number ≥ 1.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNewTestSubmit = async () => {
        if (!validateForm()) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const payload: any = {
                gameId: form.gameId,
                title: form.title.trim(),
                type: form.type,
                primaryMetric: form.primaryMetric,
                startDate: form.startDate,
                variants: Number(form.variants),
                status: "Testing",
            };
            if (form.endDate) payload.endDate = form.endDate;
            if (form.description.trim()) payload.description = form.description.trim();

            const res = await fetch(`${ROOT_URL}/tests`, {
                method: "POST",
                mode: 'cors',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message || `Server error: ${res.status}`);
            }

            const created = await res.json();
            setNewTestOpen(false);
            setForm(emptyForm);
            // Navigate to the new test detail page directly
            const base = userRole === "publisher" ? "/tests/publisher" : "/tests/developer";
            navigate(`${base}/${created.id}`);
        } catch (err: any) {
            setSubmitError(err.message || "Failed to create test. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDialogClose = () => {
        if (submitting) return;
        setNewTestOpen(false);
        setForm(emptyForm);
        setFormErrors({});
        setSubmitError(null);
    };
    // ────────────────────────────────────────────────────────────────────────

    const handleOpenDetail = (row: TestRow) => {
        const base = userRole === "publisher" ? "/tests/publisher" : "/tests/developer";
        navigate(`${base}/${row.id}`);
    };

    // Fetch platforms and sub-platforms (same query as developer dashboard)
    useEffect(() => {
        const fetchPlatforms = async () => {
            setLoading(true);
            try {
                const response = await fetch(GRAPHQL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
              query {
                platforms { id name additionalPlatformData }
                gamePlatforms { id name platformId additionalGamePlatformData }
              }
            `,
                    }),
                });
                const result = await response.json();
                if (result.errors) {
                    console.error('Error fetching platforms:', result.errors);
                    setPlatforms([
                        { id: 'All', name: 'All' },
                        { id: 'apple', name: 'App Store (Apple)' },
                        { id: 'android', name: 'Play Store (Android)' },
                    ]);
                } else {
                    setPlatforms([{ id: 'All', name: 'All' }, ...(result.data.platforms || [])]);
                }
            } catch (error) {
                console.error('Error fetching platforms:', error);
                setPlatforms([
                    { id: 'All', name: 'All' },
                    { id: 'apple', name: 'App Store (Apple)' },
                    { id: 'android', name: 'Play Store (Android)' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPlatforms();
    }, []);

    // Fetch games like developer dashboard
    const fetchGames = async (currentFilters: typeof filters) => {
        try {
            const studioId = localStorage.getItem("studioId") || undefined;
            const response = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            query GamesList($filters: DashboardFiltersInput!) {
              gamesList(filters: $filters) {
                id
                name
                icon
                platform
                subPlatform
                dau
                installs
                cpi
                revenue
              }
            }
          `,
                    variables: {
                        filters: {
                            studioId,
                            platform: currentFilters.platform,
                            subPlatform: currentFilters.subPlatform,
                            game: 'All',
                            dateRange: currentFilters.dateRange,
                            startDate: '2024-08-15',
                            endDate: '2024-09-14',
                            launchedOnly: true,
                        },
                    },
                }),
            });
            const result = await response.json();
            if (result.errors) {
                console.error('Error fetching games:', result.errors);
                setGames([]);
            } else {
                setGames(result.data.gamesList || []);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            setGames([]);
        }
    };

    // Fetch games when platform or subPlatform changes
    useEffect(() => {
        if (platforms.length > 0) {
            fetchGames(filters);
        }
    }, [filters.platform, filters.subPlatform, platforms.length]);

    // Fetch tests from backend
    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (game !== "All") {
                    queryParams.append('gameId', game);
                }
                if (testType !== "All") {
                    queryParams.append('type', testType);
                }
                if (testStatus !== "All") {
                    queryParams.append('status', testStatus);
                }

                const response = await fetch(`${ROOT_URL}/tests?${queryParams}`, { mode: 'cors' });
                if (!response.ok) {
                    throw new Error(`Failed to fetch tests (${response.status})`);
                }

                const data = await response.json();
                
                // Transform backend data to frontend format
                const transformedTests: TestRow[] = data.map((test: any) => ({
                    id: test.id,
                    title: test.title,
                    type: test.type as "CPI" | "Feature" | "Monetize",
                    variants: test.variants || 1,
                    startDate: new Date(test.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                    status: test.status as "Testing" | "Completed",
                    primaryMetric: test.primaryMetric || "CPI",
                    gameName: test.game?.name || "—",
                    gamePlatform: test.game?.gamePlatform?.name || "—",
                }));

                setFetchError(null);
                setTests(transformedTests);
            } catch (error: any) {
                console.error('Error fetching tests:', error);
                const isCors = error instanceof TypeError && error.message.toLowerCase().includes('fetch');
                setFetchError(isCors
                    ? 'Could not reach the server. This may be a network or CORS issue — please try again.'
                    : (error.message || 'Failed to load tests.')
                );
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [game, testType, testStatus]);

    // Handle UI changes while syncing internal filters
    const onPlatformChange = (value: string) => {
        setPlatform(value);
        setFilters(prev => ({ ...prev, platform: value, subPlatform: 'All', game: 'All' }));
        setGame('All');
    };

    const onGameChange = (value: string) => {
        setGame(value);
        setFilters(prev => ({ ...prev, game: value }));
    };

    return (
        <Box p={3} mt={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tests Hub – {userRole === "publisher" ? "Publisher" : "Developer"}
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>Game</InputLabel>
                    <Select label="Game" value={game} onChange={(e: SelectChangeEvent) => onGameChange(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        {games.map((g: any) => (
                            <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>Platform</InputLabel>
                    <Select label="Platform" value={platform} onChange={(e: SelectChangeEvent) => onPlatformChange(e.target.value)}>
                        {platforms.map((p: any) => (
                            <MenuItem key={p.id} value={p.name || p.id}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Date Range: match Publisher Dashboard advanced date filter */}
                <Box sx={{ minWidth: 240 }}>
                    <AdvancedDateFilter source="dateRange" label="Date Range" alwaysOn hideQuickButtons />
                </Box>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Test Status</InputLabel>
                    <Select label="Test Status" value={testStatus} onChange={(e: SelectChangeEvent) => setTestStatus(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Testing">Testing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Test Type</InputLabel>
                    <Select label="Test Type" value={testType} onChange={(e: SelectChangeEvent) => setTestType(e.target.value)}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="CPI">CPI</MenuItem>
                        <MenuItem value="Feature">Feature</MenuItem>
                        <MenuItem value="Monetize">Monetize</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Active / Recent Tests
            </Typography>

            {fetchError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>
                    {fetchError}
                </Alert>
            )}

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Game</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Variants</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Primary Metric</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">Loading tests...</TableCell>
                        </TableRow>
                    ) : tests.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">No tests found</TableCell>
                        </TableRow>
                    ) : (
                        tests.map((row) => (
                            <TableRow key={row.id} hover sx={{ cursor: "pointer" }} onClick={() => handleOpenDetail(row)}>
                                <TableCell sx={{ color: "primary.main", textDecoration: "underline" }}>{row.title}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500} noWrap>{row.gameName}</Typography>
                                    {row.gamePlatform !== "—" && (
                                        <Chip
                                            label={row.gamePlatform}
                                            size="small"
                                            variant="outlined"
                                            sx={{ mt: 0.25, height: 16, fontSize: 10, borderRadius: 1 }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.variants}</TableCell>
                                <TableCell>{row.startDate}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={row.status}
                                        color={
                                            row.status === "Testing" ? "warning" :
                                            row.status === "Completed" ? "primary" :
                                            "default"
                                        }
                                    />
                                </TableCell>
                                <TableCell>{row.primaryMetric}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {platform !== "Web" && (
                <Box mt={2}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSubmitError(null);
                            setFormErrors({});
                            setForm(emptyForm);
                            setNewTestOpen(true);
                        }}
                    >
                        + New Test
                    </Button>
                </Box>
            )}

            {/* ── New Test Dialog ─────────────────────────────────────────── */}
            <Dialog open={newTestOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    Create New Test
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Only games with event tracking activated (launched games) are available.
                    </Typography>
                </DialogTitle>

                <DialogContent dividers>
                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
                    )}

                    <Grid container spacing={2}>
                        {/* Game select — only launched/approved games */}
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small" error={!!formErrors.gameId}>
                                <InputLabel>Game *</InputLabel>
                                <Select
                                    label="Game *"
                                    value={form.gameId}
                                    onChange={(e) => {
                                        setForm(prev => ({ ...prev, gameId: e.target.value }));
                                        setFormErrors(prev => ({ ...prev, gameId: undefined }));
                                    }}
                                >
                                    {games.length === 0 ? (
                                        <MenuItem disabled value="">
                                            No approved games found — launch a game first
                                        </MenuItem>
                                    ) : (
                                        games.map((g: any) => {
                                            const plt = (g.platform || "").toLowerCase();
                                            const platformColor =
                                                plt === "android" ? "success" :
                                                plt === "ios" ? "primary" :
                                                plt === "web" ? "warning" : "default";
                                            return (
                                                <MenuItem key={g.id} value={g.id} sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                                                    <Typography variant="body2" sx={{ flexShrink: 0 }}>{g.name}</Typography>
                                                    {g.platform && (
                                                        <Chip
                                                            label={g.platform}
                                                            size="small"
                                                            color={platformColor as any}
                                                            variant="outlined"
                                                            sx={{ height: 18, fontSize: 10, flexShrink: 0 }}
                                                        />
                                                    )}
                                                    {g.subPlatform && (
                                                        <Chip
                                                            label={g.subPlatform}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 18, fontSize: 10, flexShrink: 0, color: "text.secondary", borderColor: "divider" }}
                                                        />
                                                    )}
                                                    <Chip
                                                        label="Events Active"
                                                        size="small"
                                                        color="success"
                                                        sx={{ ml: "auto", height: 18, fontSize: 10, flexShrink: 0 }}
                                                    />
                                                </MenuItem>
                                            );
                                        })
                                    )}
                                </Select>
                                {formErrors.gameId && (
                                    <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                                        {formErrors.gameId}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Test Title *"
                                value={form.title}
                                onChange={(e) => {
                                    setForm(prev => ({ ...prev, title: e.target.value }));
                                    setFormErrors(prev => ({ ...prev, title: undefined }));
                                }}
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                                placeholder="e.g. Icon A/B Test – Summer Campaign"
                            />
                        </Grid>

                        {/* Type */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Test Type *</InputLabel>
                                <Select
                                    label="Test Type *"
                                    value={form.type}
                                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                                >
                                    <MenuItem value="CPI">CPI – User Acquisition</MenuItem>
                                    <MenuItem value="Feature">Feature Test</MenuItem>
                                    <MenuItem value="Monetize">Monetization Test</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Primary Metric */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Primary Metric *</InputLabel>
                                <Select
                                    label="Primary Metric *"
                                    value={form.primaryMetric}
                                    onChange={(e) => setForm(prev => ({ ...prev, primaryMetric: e.target.value }))}
                                >
                                    {PRIMARY_METRIC_OPTIONS.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Start Date */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Start Date *"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={form.startDate}
                                onChange={(e) => {
                                    setForm(prev => ({ ...prev, startDate: e.target.value }));
                                    setFormErrors(prev => ({ ...prev, startDate: undefined }));
                                }}
                                error={!!formErrors.startDate}
                                helperText={formErrors.startDate}
                                inputProps={{ min: todayLocal() }}
                            />
                        </Grid>

                        {/* End Date */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="End Date (optional)"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={form.endDate}
                                onChange={(e) => {
                                    setForm(prev => ({ ...prev, endDate: e.target.value }));
                                    setFormErrors(prev => ({ ...prev, endDate: undefined }));
                                }}
                                error={!!formErrors.endDate}
                                helperText={formErrors.endDate}
                                inputProps={{ min: form.startDate || todayLocal() }}
                            />
                        </Grid>

                        {/* Variants */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Number of Variants *"
                                type="number"
                                value={form.variants}
                                onChange={(e) => {
                                    setForm(prev => ({ ...prev, variants: Number(e.target.value) }));
                                    setFormErrors(prev => ({ ...prev, variants: undefined }));
                                }}
                                error={!!(formErrors as any).variants}
                                helperText={(formErrors as any).variants || "Min 1 — includes control group"}
                                inputProps={{ min: 1, step: 1 }}
                                InputProps={{
                                    endAdornment: (
                                        <Tooltip title="The number of creative/feature variants to test, including the control.">
                                            <InfoOutlinedIcon fontSize="small" sx={{ color: "text.secondary", cursor: "help" }} />
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Description (optional)"
                                multiline
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe the hypothesis, what's being tested, and expected outcome..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleDialogClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNewTestSubmit}
                        disabled={submitting || games.length === 0}
                        startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {submitting ? "Creating…" : "Create Test"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* ──────────────────────────────────────────────────────────────── */}
        </Box>
    );
};

export default TestsHub;


