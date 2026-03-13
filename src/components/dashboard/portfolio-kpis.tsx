import { Typography, Box, Card, CardContent, Grid, CircularProgress } from "@mui/material";
import { formatDecimalNumber } from "../../common/utils";
import { DECIMAL_LENGTH, GRAPHQL_URL } from "../../common/constants";
import { useState, useEffect } from "react";

interface PortfolioKPIsData {
    games: number;
    installs: number;
    cpi: number;
    revenue: number;
    roasD7: number;
    crashRate: number;
    retentionD1: number;
    dau: number;
    mau: number;
}

const defaultKPIs: PortfolioKPIsData = {
    games: 0,
    installs: 0,
    cpi: 0,
    revenue: 0,
    roasD7: 0,
    crashRate: 0,
    retentionD1: 0,
    dau: 0,
    mau: 0
};

export const PortfolioKPIs = ({ filter }: { filter: any }) => {
    const [kpis, setKpis] = useState<PortfolioKPIsData>(defaultKPIs);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKPIs = async () => {
            const studioId = localStorage.getItem("studioId") || undefined;

            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await fetch(GRAPHQL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query PortfolioKPIs($filters: DashboardFiltersInput!) {
                                portfolioKPIs(filters: $filters) {
                                    id
                                    games
                                    installs
                                    cpi
                                    revenue
                                    roasD7
                                    crashRate
                                    retentionD1
                                    dau
                                    mau
                                }
                            }
                        `,
                        variables: {
                            filters: {
                                studioId,
                                platform: filter?.platform ?? 'All',
                                subPlatform: filter?.subPlatform ?? 'All',
                                game: filter?.game ?? 'All',
                                dateRange: filter?.dateRange ?? 'Last 30d',
                            },
                        },
                    }),
                });

                const result = await response.json();
                if (result.errors) {
                    console.error('PortfolioKPIs GraphQL errors:', result.errors);
                    setFetchError(result.errors[0]?.message || 'Failed to load KPIs');
                    setKpis(defaultKPIs);
                } else {
                    const data = result.data?.portfolioKPIs;
                    if (data) {
                        setKpis({ ...defaultKPIs, ...data });
                    } else {
                        setKpis(defaultKPIs);
                    }
                }
            } catch (err: any) {
                console.error('PortfolioKPIs fetch error:', err);
                setFetchError(err.message || 'Network error');
                setKpis(defaultKPIs);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKPIs();
    }, [filter?.platform, filter?.subPlatform, filter?.game, filter?.dateRange]);

    // Determine platform type for conditional KPI display
    const isMajorStores = filter?.platform !== 'Web' && filter?.platform !== 'All';

    if (isLoading) {
        return (
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">Loading KPIs...</Typography>
            </Box>
        );
    }

    if (fetchError) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="error">Error loading KPIs: {fetchError}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {/* Games - Always visible */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Games</Typography>
                            <Typography variant="h4">{kpis.games}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Count of games under filter
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Installs - Only for Major Stores */}
                {isMajorStores && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="primary">Installs</Typography>
                                <Typography variant="h4">{formatDecimalNumber(kpis.installs)}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Σ installs in range
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* CPI - Only for Major Stores */}
                {isMajorStores && (
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="primary">CPI</Typography>
                                <Typography variant="h4">₹{formatDecimalNumber(kpis.cpi)}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Ad Spend ÷ Installs
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Revenue - Always visible */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Revenue</Typography>
                            <Typography variant="h4">₹{formatDecimalNumber(kpis.revenue)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Ads + IAP
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ROAS D7 - Always visible */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">ROAS D7</Typography>
                            <Typography variant="h4">{kpis.roasD7.toFixed(DECIMAL_LENGTH)}%</Typography>
                            <Typography variant="caption" color="text.secondary">
                                (7d revenue ÷ spend) × 100
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Crash Rate - Always visible */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Crash Rate</Typography>
                            <Typography variant="h4">{kpis.crashRate.toFixed(DECIMAL_LENGTH)}%</Typography>
                            <Typography variant="caption" color="text.secondary">
                                (Crashes ÷ Sessions) × 100
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Retention D1 - Always visible */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">Retention D1</Typography>
                            <Typography variant="h4">{kpis.retentionD1.toFixed(DECIMAL_LENGTH)}%</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Returning users ÷ Installs Day 0
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* DAU - Always visible */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">DAU</Typography>
                            <Typography variant="h4">{formatDecimalNumber(kpis.dau)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Daily Active User average
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* MAU - Always visible */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">MAU</Typography>
                            <Typography variant="h4">{formatDecimalNumber(kpis.mau)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Monthly Active Users
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
