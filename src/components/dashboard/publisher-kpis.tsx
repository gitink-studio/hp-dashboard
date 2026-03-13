import { Typography, Box, Grid, CircularProgress, Button } from "@mui/material";
import { formatDecimalNumber } from "../../common/utils";
import { DECIMAL_LENGTH, GRAPHQL_URL } from "../../common/constants";
import { useState, useEffect } from "react";
import { AttachMoney, Schedule, Description, Assignment, Notifications, HealthAndSafety } from "@mui/icons-material";

interface PublisherKPIsData {
    grossRevenue: number;
    netRevenue: number;
    payoutDue: number;
    ecpm: number;
    fillRate: number;
    impressions: number;
    ivtFraudRate: number;
    compliance: number;
    crashRate: number;
    retentionD1: number;
    roasD7: number;
}

const defaultKPIs: PublisherKPIsData = {
    grossRevenue: 0,
    netRevenue: 0,
    payoutDue: 0,
    ecpm: 0,
    fillRate: 0,
    impressions: 0,
    ivtFraudRate: 0,
    compliance: 0,
    crashRate: 0,
    retentionD1: 0,
    roasD7: 0
};

interface PublisherKPIsProps {
    filter: {
        studio?: string;
        platform?: string;
        subPlatform?: string;
        region?: string;
        game?: string;
        dateRange?: string;
        currency?: string;
    };
}

export const PublisherKPIs = ({ filter }: PublisherKPIsProps) => {
    const [kpis, setKpis] = useState<PublisherKPIsData>(defaultKPIs);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKPIs = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await fetch(GRAPHQL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query PublisherKPIs($filters: PublisherFiltersInput!) {
                                publisherKPIs(filters: $filters) {
                                    grossRevenue
                                    netRevenue
                                    payoutDue
                                    ecpm
                                    fillRate
                                    impressions
                                    ivtFraudRate
                                    compliance
                                    crashRate
                                    retentionD1
                                    roasD7
                                }
                            }
                        `,
                        variables: {
                            filters: {
                                studio: filter?.studio !== 'All' ? filter?.studio : undefined,
                                platform: filter?.platform ?? 'All',
                                subPlatform: filter?.subPlatform ?? 'All',
                                region: filter?.region !== 'All' ? filter?.region : undefined,
                                game: filter?.game ?? 'All',
                                dateRange: filter?.dateRange ?? 'Last 30d',
                                currency: filter?.currency ?? 'USD',
                            },
                        },
                    }),
                });

                const result = await response.json();
                if (result.errors) {
                    console.error('PublisherKPIs GraphQL errors:', result.errors);
                    setFetchError(result.errors[0]?.message || 'Failed to load KPIs');
                    setKpis(defaultKPIs);
                } else {
                    const data = result.data?.publisherKPIs;
                    setKpis(data ? { ...defaultKPIs, ...data } : defaultKPIs);
                }
            } catch (err: any) {
                console.error('PublisherKPIs fetch error:', err);
                setFetchError(err.message || 'Network error');
                setKpis(defaultKPIs);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKPIs();
    }, [filter?.studio, filter?.platform, filter?.subPlatform, filter?.region, filter?.game, filter?.dateRange, filter?.currency]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, mb: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">Loading Publisher KPIs...</Typography>
            </Box>
        );
    }

    if (fetchError) {
        return (
            <Box sx={{ p: 1, mb: 2 }}>
                <Typography variant="body2" color="error">Error loading KPIs: {fetchError}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1 }} />
                Publisher KPIs
            </Typography>

            {/* Row 1 — Revenue & Ad metrics */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Gross Rev</Typography>
                        <Typography variant="h6" color="primary">₹{formatDecimalNumber(kpis.grossRevenue)}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Net Rev</Typography>
                        <Typography variant="h6" color="success.main">₹{formatDecimalNumber(kpis.netRevenue)}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Payout Due</Typography>
                        <Typography variant="h6" color="warning.main">₹{formatDecimalNumber(kpis.payoutDue)}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">eCPM</Typography>
                        <Typography variant="h6">₹{kpis.ecpm.toFixed(DECIMAL_LENGTH)}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Fill Rate</Typography>
                        <Typography variant="h6" color="success.main">{kpis.fillRate.toFixed(DECIMAL_LENGTH)}%</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Impressions</Typography>
                        <Typography variant="h6">{formatDecimalNumber(kpis.impressions)}</Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Row 2 — Quality metrics */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">IVT (Fraud)</Typography>
                        <Typography variant="h6" color="error.main">{kpis.ivtFraudRate.toFixed(DECIMAL_LENGTH)}%</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Compliance</Typography>
                        <Typography variant="h6" color="success.main">{kpis.compliance.toFixed(DECIMAL_LENGTH)}%</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Crash Rate</Typography>
                        <Typography variant="h6" color="error.main">{kpis.crashRate.toFixed(DECIMAL_LENGTH)}%</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">Retention D1</Typography>
                        <Typography variant="h6" color="success.main">{kpis.retentionD1.toFixed(DECIMAL_LENGTH)}%</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Box sx={{ textAlign: 'center', p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">ROAS D7</Typography>
                        <Typography variant="h6" color="primary">{kpis.roasD7.toFixed(DECIMAL_LENGTH)}%</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    {/* spacer */}
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<Schedule />} size="small">Payout Schedule</Button>
                <Button variant="outlined" startIcon={<Description />} size="small">Invoices</Button>
                <Button variant="outlined" startIcon={<Assignment />} size="small">Contracts</Button>
                <Button variant="outlined" startIcon={<Notifications />} size="small">Alerts ▼</Button>
                <Button variant="outlined" startIcon={<HealthAndSafety />} size="small">Data Health ▼</Button>
            </Box>
        </Box>
    );
};
