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

type TestRow = {
    id: string;
    title: string;
    type: "CPI" | "Feature" | "Monetize";
    variants: number;
    startDate: string;
    status: "Running" | "Completed" | "Draft";
    primaryMetric: string;
};

const SAMPLE_TESTS: TestRow[] = [
    {
        id: "cpi-hook-test",
        title: "CPI Hook Test",
        type: "CPI",
        variants: 2,
        startDate: "10 Apr",
        status: "Running",
        primaryMetric: "CPI",
    },
    {
        id: "onboarding-flow-ux",
        title: "Onboarding Flow UX",
        type: "Feature",
        variants: 3,
        startDate: "22 Mar",
        status: "Completed",
        primaryMetric: "D1 Retention",
    },
    {
        id: "monetization-pack-a",
        title: "Monetization Pack A",
        type: "Monetize",
        variants: 2,
        startDate: "05 Mar",
        status: "Draft",
        primaryMetric: "ROAS D7",
    },
];

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
    const [subPlatforms, _setSubPlatforms] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);
    const [, setLoading] = useState<boolean>(false);

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
                const response = await fetch('http://localhost:3000/graphql', {
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
                        { id: 'web', name: 'Web' },
                    ]);
                    _setSubPlatforms([]);
                } else {
                    setPlatforms([{ id: 'All', name: 'All' }, ...(result.data.platforms || [])]);
                    _setSubPlatforms(result.data.gamePlatforms || []);
                }
            } catch (error) {
                console.error('Error fetching platforms:', error);
                setPlatforms([
                    { id: 'All', name: 'All' },
                    { id: 'apple', name: 'App Store (Apple)' },
                    { id: 'android', name: 'Play Store (Android)' },
                    { id: 'web', name: 'Web' },
                ]);
                _setSubPlatforms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPlatforms();
    }, []);

    // Fetch games like developer dashboard
    const fetchGames = async (currentFilters: typeof filters) => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            query GamesList($filters: DashboardFiltersInput!, $testUserId: String) {
              gamesList(filters: $filters, testUserId: $testUserId) {
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
                            platform: currentFilters.platform,
                            subPlatform: currentFilters.subPlatform,
                            game: 'All',
                            dateRange: currentFilters.dateRange,
                            startDate: '2024-08-15',
                            endDate: '2024-09-14',
                        },
                        testUserId: userId,
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
                    {SAMPLE_TESTS.filter((t) => (testStatus === "All" || t.status === testStatus) && (testType === "All" || t.type === testType as any)).map((row) => (
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
                    ))}
                </TableBody>
            </Table>

            <Box mt={2}>
                <Button variant="contained" onClick={() => {/* future: open wizard */ }}>
                    + New Test
                </Button>
            </Box>
        </Box>
    );
};

export default TestsHub;


