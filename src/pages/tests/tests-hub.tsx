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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdvancedDateFilter } from "../../components/dashboard/advanced-date-filter";
import { GRAPHQL_URL, ROOT_URL } from "../../common/constants";

type TestRow = {
    id: string;
    title: string;
    type: "CPI" | "Feature" | "Monetize";
    variants: number;
    startDate: string;
    status: "Running" | "Completed" | "Draft";
    primaryMetric: string;
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

    // Map internal platform selection to the UI's platform label when needed
    const [platform, setPlatform] = useState("All");
    const [game, setGame] = useState("All");
    const [testStatus, setTestStatus] = React.useState("All");
    const [testType, setTestType] = React.useState("All");

    const userRole = (localStorage.getItem("userRole") || "developer").toLowerCase();

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

                const response = await fetch(`${ROOT_URL}/tests?${queryParams}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tests');
                }

                const data = await response.json();
                
                // Transform backend data to frontend format
                const transformedTests: TestRow[] = data.map((test: any) => ({
                    id: test.id,
                    title: test.title,
                    type: test.type as "CPI" | "Feature" | "Monetize",
                    variants: test.variants || 1,
                    startDate: new Date(test.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                    status: test.status as "Running" | "Completed" | "Draft",
                    primaryMetric: test.primaryMetric || "CPI"
                }));

                setTests(transformedTests);
            } catch (error) {
                console.error('Error fetching tests:', error);
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
                        <MenuItem value="Running">Running</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
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

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
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
                            <TableCell colSpan={6} align="center">Loading tests...</TableCell>
                        </TableRow>
                    ) : tests.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">No tests found</TableCell>
                        </TableRow>
                    ) : (
                        tests.map((row) => (
                            <TableRow key={row.id} hover sx={{ cursor: "pointer" }} onClick={() => handleOpenDetail(row)}>
                                <TableCell sx={{ color: "primary.main", textDecoration: "underline" }}>{row.title}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.variants}</TableCell>
                                <TableCell>{row.startDate}</TableCell>
                                <TableCell>
                                    <Chip size="small" label={row.status} color={row.status === "Running" ? "success" : row.status === "Completed" ? "primary" : "default"} />
                                </TableCell>
                                <TableCell>{row.primaryMetric}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {platform !== "Web" && (
                <Box mt={2}>
                    <Button variant="contained" onClick={() => { window.location.href = '/#/sdk' }}>
                        + New Test
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default TestsHub;


