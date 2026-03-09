import { Typography, Box, Card, CardContent, Grid } from "@mui/material";
import { formatDecimalNumber } from "../../common/utils";
import { DECIMAL_LENGTH, QueryNames } from "../../common/constants";
import { useGetList } from "react-admin";

export const PortfolioKPIs = (props: any) => {
    // Get current user ID from localStorage
    const userId = localStorage.getItem("userId");

    const { data: kpiData, isLoading, error } = useGetList(
        QueryNames.PORTFOLIO_KPIS,
        {
            filter: {
                ...props.filter,
                userId: userId // Pass user ID to the query
            }
        }
    );

    const Text = ({ data, ...props }: { data: string; }) => {
        return (<Typography sx={{ p: 2, pt: 0, }} {...props}> {data} </Typography>);
    }

    if (isLoading) return <Text data="Loading KPIs..." />;
    if (error) return <Text data="Error loading KPIs" />;

    // Data provider now always returns array, so get first item
    const kpis = kpiData?.[0] || {};

    const defaultKPIs = {
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

    const finalKPIs = { ...defaultKPIs, ...kpis };

    // Determine platform type for conditional KPI display
    const isWebPlatform = props.filter?.platform === 'Web';
    const isMajorStores = props.filter?.platform !== 'Web' && props.filter?.platform !== 'All';

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                {/* Games - Always visible (Web/Major Stores) */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Games
                            </Typography>
                            <Typography variant="h4">
                                {finalKPIs.games}
                            </Typography>
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
                                <Typography variant="h6" color="primary">
                                    Installs
                                </Typography>
                                <Typography variant="h4">
                                    {formatDecimalNumber(finalKPIs.installs)}
                                </Typography>
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
                                <Typography variant="h6" color="primary">
                                    CPI
                                </Typography>
                                <Typography variant="h4">
                                    ${formatDecimalNumber(finalKPIs.cpi)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Ad Spend ÷ Installs
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Revenue - Always visible (Web/Major Stores) */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Revenue
                            </Typography>
                            <Typography variant="h4">
                                ${formatDecimalNumber(finalKPIs.revenue)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Ads + IAP
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ROAS D7 - Always visible (Web/Major Stores) */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                ROAS D7
                            </Typography>
                            <Typography variant="h4">
                                {finalKPIs.roasD7.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                (7d revenue ÷ spend) × 100
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Crash Rate - Always visible (Web/Major Stores) */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Crash Rate
                            </Typography>
                            <Typography variant="h4">
                                {finalKPIs.crashRate.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                (Crashes ÷ Sessions) × 100
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Retention D1 - Always visible (Web/Major Stores) */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Retention D1
                            </Typography>
                            <Typography variant="h4">
                                {finalKPIs.retentionD1.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Returning users ÷ Installs Day 0
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* DAU - Always visible (Web/Major Stores) */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                DAU
                            </Typography>
                            <Typography variant="h4">
                                {formatDecimalNumber(finalKPIs.dau)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Daily Active User average
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* MAU - Always visible (Web/Major Stores) */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                MAU
                            </Typography>
                            <Typography variant="h4">
                                {formatDecimalNumber(finalKPIs.mau)}
                            </Typography>
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

