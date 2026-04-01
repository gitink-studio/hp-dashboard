import React, { useEffect, useMemo, useState } from "react";
import { useAuthenticated } from "react-admin";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Grid,
    Tooltip,
    Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FilterList } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GRAPHQL_URL, ROOT_URL } from "../../common/constants";
import { isPublisherRole } from "../../common/role-utils";

type TestRow = {
    id: string;
    gameId: string;
    title: string;
    type: "CPI" | "Feature" | "Monetize";
    variants: number;
    startDate: string;
    rawStartDate: string;
    status: "Testing" | "Completed";
    primaryMetric: string;
    gameName: string;
    gamePlatform: string;
    /** Populated when API includes game.studio (publisher table column). */
    studioName: string;
};

/** Inclusive bounds for filtering tests by start date (same presets as developer dashboard). */
function getDateRangeBounds(dateRange: string): { start: Date; end: Date } | null {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();

    switch (dateRange) {
        case "Today":
            start.setHours(0, 0, 0, 0);
            return { start, end };
        case "Yesterday": {
            start.setDate(start.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            const yEnd = new Date(start);
            yEnd.setHours(23, 59, 59, 999);
            return { start, yEnd };
        }
        case "Last 7d":
        case "7d":
            start.setDate(start.getDate() - 7);
            start.setHours(0, 0, 0, 0);
            return { start, end };
        case "Last 14d":
        case "14d":
            start.setDate(start.getDate() - 14);
            start.setHours(0, 0, 0, 0);
            return { start, end };
        case "Last 30d":
        case "30d":
            start.setDate(start.getDate() - 30);
            start.setHours(0, 0, 0, 0);
            return { start, end };
        case "Last 90d":
            start.setDate(start.getDate() - 90);
            start.setHours(0, 0, 0, 0);
            return { start, end };
        case "Custom":
        default:
            return null;
    }
}

const normalizeGameNameKey = (name: string | undefined) => (name || "").trim().toLowerCase();

/** Same disambiguation as `PublisherGamesList` game dropdown. */
function getPublisherGameFilterOptions(gamesList: any[]): { game: any; label: string }[] {
    const byId = new Map<string, any>();
    for (const g of gamesList || []) {
        if (g?.id != null && g.id !== "" && !byId.has(g.id)) {
            byId.set(g.id, g);
        }
    }
    const unique = Array.from(byId.values());
    const nameCounts = new Map<string, number>();
    for (const g of unique) {
        const k = normalizeGameNameKey(g.name);
        nameCounts.set(k, (nameCounts.get(k) || 0) + 1);
    }
    return unique.map((g) => {
        const ambiguousName = (nameCounts.get(normalizeGameNameKey(g.name)) || 0) > 1;
        const base = g.name || "Untitled";
        if (!ambiguousName) {
            return { game: g, label: base };
        }
        const plat = g.platform || "Unknown";
        const sub =
            g.subPlatform && String(g.platform || "").toLowerCase() === "web"
                ? ` · ${g.subPlatform}`
                : "";
        return { game: g, label: `${base} (${plat}${sub})` };
    });
}

/** Developer game filter: when platform is "All", label every row with platform and Web sub-platform. */
function getDeveloperGameFilterOptions(
    gamesList: any[],
    platformFilterIsAll: boolean,
): { game: any; label: string }[] {
    const byId = new Map<string, any>();
    for (const g of gamesList || []) {
        if (g?.id != null && g.id !== "" && !byId.has(g.id)) {
            byId.set(g.id, g);
        }
    }
    const unique = Array.from(byId.values());
    return unique.map((g) => {
        const base = g.name || "Untitled";
        if (!platformFilterIsAll) {
            return { game: g, label: base };
        }
        const plat = g.platform || "—";
        const sub =
            g.subPlatform && String(g.platform || "").toLowerCase() === "web"
                ? ` · ${g.subPlatform}`
                : "";
        return { game: g, label: `${base} (${plat}${sub})` };
    });
}

export const TestsHub: React.FC = () => {
    useAuthenticated();
    const navigate = useNavigate();
    // Same shape and behavior as developer dashboard (`dashboard.tsx`) filter bar
    const [filters, setFilters] = useState({
        platform: "All",
        subPlatform: "All",
        game: "All",
        dateRange: "Last 90d",
    });

    const [platforms, setPlatforms] = useState<any[]>([]);
    const [subPlatforms, setSubPlatforms] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);
    const [platformsLoading, setPlatformsLoading] = useState(true);
    const [testsLoading, setTestsLoading] = useState(false);
    /** Raw rows from GET /tests (studio/gameId/type/status only). Platform/subPlatform/game scope applied in `displayTests`. */
    const [apiTests, setApiTests] = useState<TestRow[]>([]);
    /** True until the first `gamesList` response for the current role (avoids empty `games` hiding all rows). */
    const [devGamesLoading, setDevGamesLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [testStatus, setTestStatus] = React.useState("All");
    const [testType, setTestType] = React.useState("All");

    /** Publisher filters; `studioId` `"All"` = every studio (default). */
    const [publisherFilters, setPublisherFilters] = useState({
        studioId: "All",
        platform: "All",
        subPlatform: "All",
        game: "All",
        dateRange: "30d",
    });
    const [studios, setStudios] = useState<any[]>([]);
    const [publisherStudiosLoading, setPublisherStudiosLoading] = useState(false);
    /** Start true so we do not apply an empty `games` list before the first publisher fetch. */
    const [loadingPublisherGames, setLoadingPublisherGames] = useState(true);

    const rawUserRole = localStorage.getItem("userRole") || "";
    const lowerRole = rawUserRole.toLowerCase().trim();
    const publisherUser = isPublisherRole(rawUserRole);
    const adminUser =
        lowerRole.includes("admin") || lowerRole.includes("administrator");
    /** Developers (and similar) see only their studio; publishers and admins see all. */
    const scopeTestsToStudio = !publisherUser && !adminUser;

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
            const base = publisherUser ? "/tests/publisher" : "/tests/developer";
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
        const base = publisherUser ? "/tests/publisher" : "/tests/developer";
        navigate(`${base}/${row.id}`);
    };

    // Fetch platforms and sub-platforms (same query + fallbacks as developer dashboard)
    useEffect(() => {
        const fetchPlatforms = async () => {
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
                        { id: '2', name: 'App Store (Apple)' },
                        { id: '3', name: 'Play Store (Android)' },
                        { id: '4', name: 'Web' },
                    ]);
                    setSubPlatforms([]);
                } else {
                    setPlatforms(result.data.platforms || []);
                    setSubPlatforms(result.data.gamePlatforms || []);
                }
            } catch (error) {
                console.error('Error fetching platforms:', error);
                setPlatforms([
                    { id: '2', name: 'App Store (Apple)' },
                    { id: '3', name: 'Play Store (Android)' },
                    { id: '4', name: 'Web' },
                ]);
                setSubPlatforms([]);
            } finally {
                setPlatformsLoading(false);
            }
        };
        fetchPlatforms();
    }, []);

    // Studios list for publisher role (same query as publisher dashboard games tab)
    useEffect(() => {
        if (!publisherUser) {
            setStudios([]);
            return;
        }
        let cancelled = false;
        setPublisherStudiosLoading(true);
        (async () => {
            try {
                const response = await fetch(GRAPHQL_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: `
            query {
              studios {
                id
                name
                description
                contactEmail
                country
                isActive
              }
            }
          `,
                    }),
                });
                const result = await response.json();
                if (!cancelled) {
                    if (result.errors) {
                        console.error("Error fetching studios:", result.errors);
                        setStudios([]);
                    } else {
                        setStudios(result.data?.studios || []);
                    }
                }
            } catch (e) {
                console.error("Error fetching studios:", e);
                if (!cancelled) setStudios([]);
            } finally {
                if (!cancelled) setPublisherStudiosLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [publisherUser]);

    // Fetch games like developer dashboard
    const fetchGames = async (currentFilters: typeof filters) => {
        setDevGamesLoading(true);
        try {
            const role = localStorage.getItem("userRole") || "";
            const studioId = isPublisherRole(role) ? undefined : (localStorage.getItem("studioId") || undefined);
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
                            // Launched games only (for test creation); aligns with dashboard game pickers
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
        } finally {
            setDevGamesLoading(false);
        }
    };

    const fetchPublisherGames = async (pf: typeof publisherFilters) => {
        setLoadingPublisherGames(true);
        try {
            const studioScoped =
                pf.studioId && pf.studioId !== "All" ? pf.studioId : undefined;
            const queryFilters = {
                studio: studioScoped,
                platform: pf.platform !== "All" ? pf.platform : undefined,
                subPlatform: pf.subPlatform !== "All" ? pf.subPlatform : undefined,
                dateRange: pf.dateRange,
                currency: "INR",
            };
            const response = await fetch(GRAPHQL_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `
            query PublisherGamesList($filters: PublisherFiltersInput!) {
              publisherGamesList(filters: $filters) {
                id
                name
                icon
                platform
                subPlatform
                dau
                installs
                cpi
                revenue
                studioId
                studio { id name }
              }
            }
          `,
                    variables: { filters: queryFilters },
                }),
            });
            const result = await response.json();
            if (result.errors) {
                console.error("Error fetching publisher games:", result.errors);
                setGames([]);
            } else {
                const list = [...(result.data?.publisherGamesList || [])].sort(
                    (a: any, b: any) => (b.dau || 0) - (a.dau || 0),
                );
                setGames(list);
            }
        } catch (error) {
            console.error("Error fetching publisher games:", error);
            setGames([]);
        } finally {
            setLoadingPublisherGames(false);
        }
    };

    const handlePublisherFilterChange = (
        filterType: keyof typeof publisherFilters,
        value: string,
    ) => {
        setPublisherFilters((prev) => {
            const next = { ...prev, [filterType]: value };
            if (filterType === "platform") {
                next.subPlatform = "All";
                next.game = "All";
            } else if (filterType === "studioId") {
                next.game = "All";
            } else if (filterType === "subPlatform") {
                next.game = "All";
            }
            return next;
        });
    };

    const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
        setFilters((prev) => {
            const next = { ...prev, [filterType]: value };
            if (filterType === "platform") {
                next.subPlatform = "All";
                next.game = "All";
            }
            return next;
        });
    };

    // Reset game if it is no longer in the list (developer)
    useEffect(() => {
        if (publisherUser) return;
        if (filters.game !== "All" && games.length > 0) {
            const exists = games.some((g) => g.id === filters.game);
            if (!exists) {
                setFilters((prev) => ({ ...prev, game: "All" }));
            }
        }
    }, [publisherUser, games, filters.game]);

    // Reset game if it is no longer in the list (publisher)
    useEffect(() => {
        if (!publisherUser) return;
        if (publisherFilters.game !== "All" && games.length > 0) {
            const exists = games.some((g) => g.id === publisherFilters.game);
            if (!exists) {
                setPublisherFilters((prev) => ({ ...prev, game: "All" }));
            }
        }
    }, [publisherUser, games, publisherFilters.game]);

    // Fetch games when platform or subPlatform changes (developer dashboard parity)
    useEffect(() => {
        if (publisherUser || platforms.length === 0) return;
        fetchGames(filters);
    }, [publisherUser, filters.platform, filters.subPlatform, platforms.length]);

    // Publisher: scoped games via `publisherGamesList` (same as publisher dashboard)
    useEffect(() => {
        if (!publisherUser || platforms.length === 0) return;
        fetchPublisherGames(publisherFilters);
    }, [
        publisherUser,
        platforms.length,
        publisherFilters.studioId,
        publisherFilters.platform,
        publisherFilters.subPlatform,
        publisherFilters.dateRange,
    ]);

    // Fetch tests from backend
    useEffect(() => {
        const fetchTests = async () => {
            setTestsLoading(true);
            try {
                const queryParams = new URLSearchParams();

                if (publisherUser) {
                    const sid = publisherFilters.studioId.trim();
                    if (sid && sid !== "All") {
                        queryParams.append("studioId", sid);
                    }
                    if (publisherFilters.game !== "All") {
                        queryParams.append("gameId", publisherFilters.game);
                    }
                } else {
                    if (scopeTestsToStudio) {
                        const sid = (localStorage.getItem("studioId") || "").trim();
                        if (!sid) {
                            setApiTests([]);
                            setFetchError(null);
                            setTestsLoading(false);
                            return;
                        }
                        queryParams.append("studioId", sid);
                    }
                    // When game is "All", load all tests for the studio; narrow by platform/subPlatform via `games` + displayTests.
                    if (filters.game !== "All") {
                        queryParams.append("gameId", filters.game);
                    }
                }

                if (testType !== "All") {
                    queryParams.append("type", testType);
                }
                if (testStatus !== "All") {
                    queryParams.append("status", testStatus);
                }

                const response = await fetch(`${ROOT_URL}/tests?${queryParams}`, { mode: "cors" });
                if (!response.ok) {
                    throw new Error(`Failed to fetch tests (${response.status})`);
                }

                const data = await response.json();

                const transformedTests: TestRow[] = data.map((test: any) => ({
                    id: test.id,
                    gameId: test.gameId || test.game?.id || "",
                    title: test.title,
                    type: test.type as "CPI" | "Feature" | "Monetize",
                    variants: test.variants || 1,
                    rawStartDate: test.startDate,
                    startDate: new Date(test.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                    }),
                    status: test.status as "Testing" | "Completed",
                    primaryMetric: test.primaryMetric || "CPI",
                    gameName: test.game?.name || "—",
                    gamePlatform: test.game?.gamePlatform?.name || "—",
                    studioName: test.game?.studio?.name?.trim() || "—",
                }));

                setFetchError(null);
                setApiTests(transformedTests);
            } catch (error: any) {
                console.error("Error fetching tests:", error);
                const isCors =
                    error instanceof TypeError && error.message.toLowerCase().includes("fetch");
                setFetchError(
                    isCors
                        ? "Could not reach the server. This may be a network or CORS issue — please try again."
                        : error.message || "Failed to load tests.",
                );
                setApiTests([]);
            } finally {
                setTestsLoading(false);
            }
        };

        fetchTests();
    }, [
        publisherUser,
        publisherFilters.studioId,
        publisherFilters.game,
        filters.game,
        testType,
        testStatus,
        scopeTestsToStudio,
    ]);

    const gamesLoadingForScope = publisherUser ? loadingPublisherGames : devGamesLoading;

    /** Hide the tests table until API tests and scoped game list (and base filter data) are ready. */
    const testsTablePending =
        testsLoading ||
        gamesLoadingForScope ||
        platformsLoading ||
        (publisherUser && publisherStudiosLoading);

    const displayTests = useMemo(() => {
        const dateKey = publisherUser ? publisherFilters.dateRange : filters.dateRange;
        const bounds = getDateRangeBounds(dateKey);
        let rows = apiTests;
        if (bounds) {
            rows = rows.filter((r) => {
                const sd = new Date(r.rawStartDate);
                return sd >= bounds.start && sd <= bounds.end;
            });
        }
        const gamePick = publisherUser ? publisherFilters.game : filters.game;
        if (gamePick !== "All") {
            return rows.filter((r) => r.gameId === gamePick);
        }
        if (gamesLoadingForScope) {
            return rows;
        }
        if (games.length === 0) {
            return [];
        }
        const allowed = new Set(games.map((g) => g.id));
        return rows.filter((r) => r.gameId && allowed.has(r.gameId));
    }, [
        apiTests,
        games,
        gamesLoadingForScope,
        publisherUser,
        publisherFilters.game,
        publisherFilters.dateRange,
        filters.game,
        filters.dateRange,
    ]);

    const publisherAvailableSubPlatforms = useMemo(() => {
        if (publisherFilters.platform !== "Web") return [];
        const webPlatform = platforms.find((p) => p.name === "Web");
        if (!webPlatform) return [];
        return subPlatforms.filter((sp) => sp.platformId === webPlatform.id);
    }, [publisherFilters.platform, platforms, subPlatforms]);

    const publisherGameOptions = useMemo(() => getPublisherGameFilterOptions(games), [games]);

    const developerGameOptions = useMemo(
        () => getDeveloperGameFilterOptions(games, filters.platform === "All"),
        [games, filters.platform],
    );

    const newTestAllowed = publisherUser
        ? publisherFilters.platform !== "Web"
        : filters.platform !== "Web";

    if (!localStorage.getItem("userName")) return null;

    return (
        <Box p={3} mt={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                Tests Hub – {publisherUser ? "Publisher" : "Developer"}
            </Typography>

            {/* Publisher: same filter pattern as publisher dashboard games (`PublisherGamesList`) */}
            {publisherUser ? (
                <Paper sx={{ p: 2, mb: 2 }}>
                    {publisherStudiosLoading && (
                        <Box sx={{ mb: 2, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Loading studios…
                            </Typography>
                        </Box>
                    )}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={publisherFilters.studioId}
                                    displayEmpty
                                    disabled={publisherStudiosLoading}
                                    onChange={(e) =>
                                        handlePublisherFilterChange("studioId", e.target.value)
                                    }
                                >
                                    <MenuItem value="All">
                                        All Studio
                                        {publisherStudiosLoading
                                            ? " (Loading…)"
                                            : studios.length
                                              ? ` (${studios.length})`
                                              : ""}
                                    </MenuItem>
                                    {studios.map((s: any) => (
                                        <MenuItem key={s.id} value={s.id}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={publisherFilters.platform}
                                    displayEmpty
                                    disabled={platformsLoading}
                                    onChange={(e) =>
                                        handlePublisherFilterChange("platform", e.target.value)
                                    }
                                >
                                    <MenuItem value="All">Platform [ All ▼ ]</MenuItem>
                                    {platforms.map((p: any) => (
                                        <MenuItem key={p.id} value={p.name}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {publisherFilters.platform === "Web" && (
                            <Grid item xs={12} sm={6} md={2}>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={publisherFilters.subPlatform}
                                        displayEmpty
                                        disabled={platformsLoading}
                                        onChange={(e) =>
                                            handlePublisherFilterChange("subPlatform", e.target.value)
                                        }
                                    >
                                        <MenuItem value="All">
                                            Sub Platform [ All ▼ ] (
                                            {publisherAvailableSubPlatforms.length} options)
                                        </MenuItem>
                                        {publisherAvailableSubPlatforms.map((sp: any) => (
                                            <MenuItem key={sp.id} value={sp.name}>
                                                {sp.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={publisherFilters.game}
                                    displayEmpty
                                    disabled={loadingPublisherGames}
                                    onChange={(e) =>
                                        handlePublisherFilterChange("game", e.target.value)
                                    }
                                >
                                    <MenuItem value="All">
                                        Game [ All ▼ ]{" "}
                                        {loadingPublisherGames
                                            ? "(Loading…)"
                                            : `(${publisherGameOptions.length} games)`}
                                    </MenuItem>
                                    {publisherGameOptions.map(({ game: g, label }) => (
                                        <MenuItem key={g.id} value={g.id}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <Select
                                    value={publisherFilters.dateRange}
                                    displayEmpty
                                    onChange={(e) =>
                                        handlePublisherFilterChange("dateRange", e.target.value)
                                    }
                                >
                                    <MenuItem value="30d">Date [ 30d ▼ ]</MenuItem>
                                    <MenuItem value="Today">Today</MenuItem>
                                    <MenuItem value="Yesterday">Yesterday</MenuItem>
                                    <MenuItem value="7d">Last 7d</MenuItem>
                                    <MenuItem value="14d">Last 14d</MenuItem>
                                    <MenuItem value="30d">Last 30d</MenuItem>
                                    <MenuItem value="Custom">Custom</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="tests-pub-status-label">Test Status</InputLabel>
                                <Select
                                    labelId="tests-pub-status-label"
                                    label="Test Status"
                                    value={testStatus}
                                    onChange={(e: SelectChangeEvent) => setTestStatus(e.target.value)}
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Testing">Testing</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="tests-pub-type-label">Test Type</InputLabel>
                                <Select
                                    labelId="tests-pub-type-label"
                                    label="Test Type"
                                    value={testType}
                                    onChange={(e: SelectChangeEvent) => setTestType(e.target.value)}
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="CPI">CPI</MenuItem>
                                    <MenuItem value="Feature">Feature</MenuItem>
                                    <MenuItem value="Monetize">Monetize</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>
            ) : (
                <Box sx={{ mb: 2, p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <FilterList color="primary" />
                        </Grid>

                        <Grid item>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                    value={filters.platform}
                                    displayEmpty
                                    onChange={(e) => handleFilterChange("platform", e.target.value)}
                                    sx={{ "& .MuiSelect-select": { py: 0.5 } }}
                                    disabled={platformsLoading}
                                >
                                    <MenuItem value="All">Platform [ All ▼ ]</MenuItem>
                                    {platforms.map((p) => (
                                        <MenuItem key={p.id} value={p.name}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {filters.platform === "Web" && (
                            <Grid item>
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                    <Select
                                        value={filters.subPlatform}
                                        displayEmpty
                                        onChange={(e) =>
                                            handleFilterChange("subPlatform", e.target.value)
                                        }
                                        sx={{ "& .MuiSelect-select": { py: 0.5 } }}
                                        disabled={platformsLoading}
                                    >
                                        {[
                                            <MenuItem key="all" value="All">
                                                All Sub Platform
                                            </MenuItem>,
                                            ...subPlatforms
                                                .filter((sp) => {
                                                    const webPlatform = platforms.find(
                                                        (x) => x.name === "Web",
                                                    );
                                                    return webPlatform && sp.platformId === webPlatform.id;
                                                })
                                                .map((sp) => (
                                                    <MenuItem key={sp.id} value={sp.name}>
                                                        {sp.name}
                                                    </MenuItem>
                                                )),
                                        ]}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        <Grid item>
                            <FormControl
                                size="small"
                                sx={{ minWidth: filters.platform === "All" ? 280 : 120 }}
                            >
                                <Select
                                    value={filters.game}
                                    displayEmpty
                                    onChange={(e) => handleFilterChange("game", e.target.value)}
                                    sx={{ "& .MuiSelect-select": { py: 0.5 } }}
                                    disabled={platformsLoading}
                                >
                                    <MenuItem value="All">Game [ All ▼ ]</MenuItem>
                                    {developerGameOptions.map(({ game: g, label }) => (
                                        <MenuItem key={g.id} value={g.id}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item>
                            <FormControl size="small" sx={{ minWidth: 100 }}>
                                <Select
                                    value={filters.dateRange}
                                    displayEmpty
                                    onChange={(e) => handleFilterChange("dateRange", e.target.value)}
                                    sx={{ "& .MuiSelect-select": { py: 0.5 } }}
                                >
                                    <MenuItem value="Last 90d">Date [ 90d ▼ ]</MenuItem>
                                    <MenuItem value="Last 30d">30d</MenuItem>
                                    <MenuItem value="Last 14d">14d</MenuItem>
                                    <MenuItem value="Last 7d">7d</MenuItem>
                                    <MenuItem value="Yesterday">Yesterday</MenuItem>
                                    <MenuItem value="Today">Today</MenuItem>
                                    <MenuItem value="Custom">Custom</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item>
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                <InputLabel id="tests-hub-status-label">Test Status</InputLabel>
                                <Select
                                    labelId="tests-hub-status-label"
                                    label="Test Status"
                                    value={testStatus}
                                    onChange={(e: SelectChangeEvent) => setTestStatus(e.target.value)}
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Testing">Testing</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item>
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel id="tests-hub-type-label">Test Type</InputLabel>
                                <Select
                                    labelId="tests-hub-type-label"
                                    label="Test Type"
                                    value={testType}
                                    onChange={(e: SelectChangeEvent) => setTestType(e.target.value)}
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="CPI">CPI</MenuItem>
                                    <MenuItem value="Feature">Feature</MenuItem>
                                    <MenuItem value="Monetize">Monetize</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Active / Recent Tests
            </Typography>

            {fetchError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFetchError(null)}>
                    {fetchError}
                </Alert>
            )}

            {testsTablePending ? (
                <Box
                    sx={{
                        py: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        minHeight: 200,
                    }}
                >
                    <CircularProgress size={40} />
                    <Typography variant="body2" color="text.secondary">
                        Updating tests for the current filters…
                    </Typography>
                </Box>
            ) : (
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            {publisherUser && <TableCell>Studio</TableCell>}
                            <TableCell>Game</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Variants</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Primary Metric</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayTests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={publisherUser ? 8 : 7} align="center">No tests found</TableCell>
                            </TableRow>
                        ) : (
                            displayTests.map((row) => (
                                <TableRow key={row.id} hover sx={{ cursor: "pointer" }} onClick={() => handleOpenDetail(row)}>
                                    <TableCell sx={{ color: "primary.main", textDecoration: "underline" }}>{row.title}</TableCell>
                                    {publisherUser && (
                                        <TableCell>
                                            <Typography variant="body2" noWrap>{row.studioName}</Typography>
                                        </TableCell>
                                    )}
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
            )}

            {newTestAllowed && (
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
                                            const studioName = publisherUser && g.studio?.name?.trim();
                                            return (
                                                <MenuItem key={g.id} value={g.id} sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                                                    <Typography variant="body2" sx={{ flexShrink: 0 }}>{g.name}</Typography>
                                                    {studioName && (
                                                        <Chip
                                                            label={studioName}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ height: 18, fontSize: 10, flexShrink: 0, color: "text.secondary", borderColor: "divider" }}
                                                        />
                                                    )}
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


