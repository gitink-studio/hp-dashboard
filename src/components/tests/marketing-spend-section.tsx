import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";

const API = "http://localhost:3000";

// ─── Types ────────────────────────────────────────────────────────────────────

type SpendStatus = "Active" | "Paused" | "Ended";

type SpendRow = {
    date: Date;
    plannedSpend: number;
    status: SpendStatus;
    notes: string;
};

/** Wire format stored in the JSON column — dates are ISO strings. */
type SpendRowJson = {
    date: string;
    plannedSpend: number;
    status: SpendStatus;
    notes: string;
};

type Props = {
    testId: string;
    /** ISO date string from the test record — used to pre-fill the date range */
    testStartDate?: string | null;
    testEndDate?: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toInputValue = (d: Date) => d.toISOString().split("T")[0]; // "YYYY-MM-DD"

const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" });

const fmtUSD = (n: number) =>
    n === 0 ? "$0" : `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/** Generate one SpendRow per calendar day in [start, end] (inclusive). */
function buildRows(start: Date, end: Date, existing: SpendRow[] = []): SpendRow[] {
    const rows: SpendRow[] = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    while (cursor <= endDay) {
        const key = cursor.toISOString().split("T")[0];
        const prev = existing.find((r) => r.date.toISOString().split("T")[0] === key);
        rows.push({
            date: new Date(cursor),
            plannedSpend: prev?.plannedSpend ?? 0,
            status: prev?.status ?? "Active",
            notes: prev?.notes ?? "",
        });
        cursor.setDate(cursor.getDate() + 1);
    }
    return rows;
}

/** Redistribute budget evenly across all rows. */
function distributeRows(rows: SpendRow[], totalBudget: number): SpendRow[] {
    if (rows.length === 0) return rows;
    const daily = parseFloat((totalBudget / rows.length).toFixed(2));
    return rows.map((r) => ({ ...r, plannedSpend: daily }));
}

function rowsFromJson(json: SpendRowJson[]): SpendRow[] {
    return json.map((r) => ({ ...r, date: new Date(r.date) }));
}

function rowsToJson(rows: SpendRow[]): SpendRowJson[] {
    return rows.map((r) => ({ ...r, date: r.date.toISOString() }));
}

const AUTO_PCT_OPTIONS = [5, 10, 15, 20, 25, 30];

const statusColor = (s: SpendStatus) =>
    s === "Active" ? "success" : s === "Paused" ? "warning" : "default";

// ─── Component ────────────────────────────────────────────────────────────────

export const MarketingSpendSection: React.FC<Props> = ({
    testId,
    testStartDate,
    testEndDate,
}) => {
    // ── Accordion open state
    const [expanded, setExpanded] = React.useState(false);

    // ── Remote-data state
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [hasFetched, setHasFetched] = React.useState(false);
    const [dirty, setDirty] = React.useState(false);
    const [savedAt, setSavedAt] = React.useState<Date | null>(null);

    // ── Date range (controlled via text inputs)
    const [startInput, setStartInput] = React.useState<string>(() => {
        if (testStartDate) return new Date(testStartDate).toISOString().split("T")[0];
        const d = new Date();
        return toInputValue(d);
    });
    const [endInput, setEndInput] = React.useState<string>(() => {
        if (testEndDate) return new Date(testEndDate).toISOString().split("T")[0];
        const d = new Date();
        d.setDate(d.getDate() + 33); // default ~1 month window
        return toInputValue(d);
    });

    // ── Budget
    const [totalBudget, setTotalBudget] = React.useState<string>("");

    // ── Spend rows
    const [rows, setRows] = React.useState<SpendRow[]>([]);

    // ── Controls
    const [distributeEvenly, setDistributeEvenly] = React.useState(false);
    const [autoPct, setAutoPct] = React.useState<string>(""); // "" = disabled
    const [editMode, setEditMode] = React.useState(false);

    // Used to prevent the date-range effect from overwriting rows loaded from API.
    const skipRowRebuild = React.useRef(false);

    // ─── Fetch saved plan on first expand ────────────────────────────────────
    React.useEffect(() => {
        if (!expanded || hasFetched) return;
        setHasFetched(true);
        setLoading(true);

        fetch(`${API}/tests/${testId}/marketing-budget`)
            .then((r) => r.json())
            .then((data) => {
                if (!data) return; // no plan saved yet — keep defaults
                skipRowRebuild.current = true;
                if (data.startDate) setStartInput(new Date(data.startDate).toISOString().split("T")[0]);
                if (data.endDate)   setEndInput(new Date(data.endDate).toISOString().split("T")[0]);
                setTotalBudget(data.totalBudget > 0 ? String(data.totalBudget) : "");
                setDistributeEvenly(!!data.distributeEvenly);
                setAutoPct(data.autoPct ?? "");
                const loaded: SpendRowJson[] = Array.isArray(data.rows) ? data.rows : [];
                setRows(rowsFromJson(loaded));
            })
            .catch((err) => console.error("Failed to load marketing budget:", err))
            .finally(() => {
                setLoading(false);
                setDirty(false);
            });
    }, [expanded, hasFetched, testId]);

    // ─── Initialise / refresh rows when date range changes ───────────────────
    React.useEffect(() => {
        if (skipRowRebuild.current) {
            skipRowRebuild.current = false; // one-shot skip
            return;
        }
        const start = new Date(startInput);
        const end = new Date(endInput);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return;

        setRows((prev) => {
            const newRows = buildRows(start, end, prev);
            if (distributeEvenly && Number(totalBudget) > 0) {
                return distributeRows(newRows, Number(totalBudget));
            }
            return newRows;
        });
        setDirty(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startInput, endInput]);

    // ─── Re-distribute when "evenly distribute" is toggled on ────────────────
    const handleDistributeToggle = (checked: boolean) => {
        setDistributeEvenly(checked);
        setDirty(true);
        if (checked && rows.length > 0 && Number(totalBudget) > 0) {
            setRows((prev) => distributeRows(prev, Number(totalBudget)));
        }
    };

    // ─── Re-distribute when total budget changes (if distribute is on) ────────
    const handleBudgetChange = (val: string) => {
        setTotalBudget(val);
        setDirty(true);
        if (distributeEvenly && rows.length > 0 && Number(val) > 0) {
            setRows((prev) => distributeRows(prev, Number(val)));
        }
    };

    // ─── Row field editing helpers ────────────────────────────────────────────
    const updateRow = <K extends keyof SpendRow>(idx: number, field: K, value: SpendRow[K]) => {
        setRows((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            return next;
        });
        setDirty(true);
    };

    // ─── Save plan ────────────────────────────────────────────────────────────
    const savePlan = async () => {
        setSaving(true);
        try {
            const payload = {
                totalBudget:      Number(totalBudget) || 0,
                startDate:        startInput || null,
                endDate:          endInput   || null,
                distributeEvenly,
                autoPct,
                rows:             rowsToJson(rows),
            };
            const res = await fetch(`${API}/tests/${testId}/marketing-budget`, {
                method:  "PUT",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(await res.text());
            setSavedAt(new Date());
            setDirty(false);
        } catch (err) {
            console.error("Failed to save marketing budget:", err);
            alert("Failed to save. Check the console for details.");
        } finally {
            setSaving(false);
        }
    };

    // ─── Totals ────────────────────────────────────────────────────────────────
    const totalPlanned = rows.reduce((s, r) => s + r.plannedSpend, 0);
    const budget = Number(totalBudget) || 0;
    const remaining = budget - totalPlanned;

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <Accordion
            expanded={expanded}
            onChange={(_, v) => setExpanded(v)}
            sx={{ mt: 2 }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                    <Typography sx={{ flexGrow: 1 }}>Marketing Spend</Typography>
                    {expanded && dirty && (
                        <Chip label="Unsaved changes" size="small" color="warning" variant="outlined" />
                    )}
                    {expanded && !dirty && savedAt && (
                        <Chip
                            label={`Saved ${savedAt.toLocaleTimeString()}`}
                            size="small"
                            color="success"
                            variant="outlined"
                        />
                    )}
                </Stack>
            </AccordionSummary>

            <AccordionDetails>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : (
                    <>
                        {/* ── Header row ──────────────────────────────────────── */}
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                            Daily Auto-Budget Planner
                        </Typography>

                        {/* ── Date range + budget inputs ──────────────────────── */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
                            <TextField
                                label="Start Date"
                                type="date"
                                size="small"
                                value={startInput}
                                onChange={(e) => setStartInput(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 160 }}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                size="small"
                                value={endInput}
                                onChange={(e) => setEndInput(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 160 }}
                            />
                            <TextField
                                label="Total Budget"
                                size="small"
                                type="number"
                                value={totalBudget}
                                onChange={(e) => handleBudgetChange(e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                sx={{ minWidth: 160 }}
                                placeholder="10,000"
                            />
                        </Stack>

                        {/* ── Budget summary chips ─────────────────────────────── */}
                        {budget > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
                                <Chip label={`Budget: ${fmtUSD(budget)}`} size="small" variant="outlined" />
                                <Chip label={`Planned: ${fmtUSD(totalPlanned)}`} size="small" color="primary" variant="outlined" />
                                <Chip
                                    label={`Remaining: ${fmtUSD(remaining)}`}
                                    size="small"
                                    color={remaining < 0 ? "error" : "success"}
                                    variant={remaining < 0 ? "filled" : "outlined"}
                                />
                            </Stack>
                        )}

                        {/* ── Controls row ─────────────────────────────────────── */}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems={{ sm: "center" }}
                            flexWrap="wrap"
                            sx={{ mb: 2 }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={distributeEvenly}
                                        onChange={(e) => handleDistributeToggle(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        Evenly distribute spend over range
                                    </Typography>
                                }
                            />

                            <Tooltip title={distributeEvenly ? "Disable even distribution to edit individual rows" : ""}>
                                <span>
                                    <Button
                                        size="small"
                                        variant={editMode ? "contained" : "outlined"}
                                        startIcon={editMode ? <CheckIcon /> : <EditIcon />}
                                        onClick={() => setEditMode((v) => !v)}
                                        disabled={distributeEvenly}
                                        sx={{ textTransform: "none" }}
                                    >
                                        {editMode ? "Done Editing" : "Edit Table"}
                                    </Button>
                                </span>
                            </Tooltip>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    Auto-increase if CPI &lt; target:
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 90 }}>
                                    <InputLabel>%</InputLabel>
                                    <Select
                                        label="%"
                                        value={autoPct}
                                        onChange={(e: SelectChangeEvent) => {
                                            setAutoPct(e.target.value);
                                            setDirty(true);
                                        }}
                                        displayEmpty
                                    >
                                        <MenuItem value=""><em>Off</em></MenuItem>
                                        {AUTO_PCT_OPTIONS.map((p) => (
                                            <MenuItem key={p} value={String(p)}>{p}%</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>

                            {/* Save button */}
                            <Box sx={{ ml: "auto !important" }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    color={dirty ? "primary" : "success"}
                                    startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
                                    onClick={savePlan}
                                    disabled={saving}
                                    sx={{ textTransform: "none" }}
                                >
                                    {saving ? "Saving…" : "Save Plan"}
                                </Button>
                            </Box>
                        </Stack>

                        {/* ── Spend table ──────────────────────────────────────── */}
                        {rows.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                                Set a date range above to generate the daily spend plan.
                            </Typography>
                        ) : (
                            <Box sx={{ overflowX: "auto" }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell align="right">Planned Spend</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Notes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, idx) => (
                                            <TableRow key={idx} hover>
                                                {/* Date */}
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>
                                                    <Typography variant="body2">{fmtDate(row.date)}</Typography>
                                                </TableCell>

                                                {/* Planned Spend */}
                                                <TableCell align="right">
                                                    {editMode ? (
                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            value={row.plannedSpend === 0 ? "" : row.plannedSpend}
                                                            onChange={(e) =>
                                                                updateRow(idx, "plannedSpend", parseFloat(e.target.value) || 0)
                                                            }
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                            }}
                                                            sx={{ width: 110 }}
                                                            inputProps={{ min: 0, step: 0.01 }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" fontFamily="monospace">
                                                            {fmtUSD(row.plannedSpend)}
                                                        </Typography>
                                                    )}
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    {editMode ? (
                                                        <FormControl size="small" sx={{ minWidth: 90 }}>
                                                            <Select
                                                                value={row.status}
                                                                onChange={(e: SelectChangeEvent) =>
                                                                    updateRow(idx, "status", e.target.value as SpendStatus)
                                                                }
                                                            >
                                                                <MenuItem value="Active">Active</MenuItem>
                                                                <MenuItem value="Paused">Paused</MenuItem>
                                                                <MenuItem value="Ended">Ended</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    ) : (
                                                        <Chip
                                                            label={row.status}
                                                            size="small"
                                                            color={statusColor(row.status) as any}
                                                        />
                                                    )}
                                                </TableCell>

                                                {/* Notes */}
                                                <TableCell>
                                                    {editMode ? (
                                                        <TextField
                                                            size="small"
                                                            value={row.notes}
                                                            onChange={(e) => updateRow(idx, "notes", e.target.value)}
                                                            placeholder="Optional note…"
                                                            sx={{ minWidth: 160 }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            {row.notes || "—"}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {/* Totals footer */}
                                        {budget > 0 && (
                                            <TableRow sx={{ "& td": { borderTop: "2px solid", borderColor: "divider", fontWeight: "bold" } }}>
                                                <TableCell>Total</TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" fontFamily="monospace" fontWeight="bold"
                                                        color={totalPlanned > budget ? "error.main" : "text.primary"}>
                                                        {fmtUSD(totalPlanned)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell colSpan={2}>
                                                    {totalPlanned > budget && (
                                                        <Typography variant="caption" color="error">
                                                            Exceeds budget by {fmtUSD(totalPlanned - budget)}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}
                    </>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default MarketingSpendSection;
