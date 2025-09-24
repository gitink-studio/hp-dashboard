import { Typography, Box, Card, CardContent, Grid } from "@mui/material";
import { formatNumber } from "../../common/utils";
import { DECIMAL_LENGTH, QueryNames } from "../../common/constants";
import { useGetList } from "react-admin";

export const PublishKPIs = (props: any) => {
    const { data: kpiData, isLoading, error } = useGetList(QueryNames.PUBLISHER_KPIS, {
        filter: props.filter || {}
    });

    const Text = ({ data, ...props }: { data: string; }) => {
        return (<Typography sx={{ p: 2, pt: 0, }} {...props}> {data} </Typography>);
    }

    if (isLoading) return <Text data="Loading Publisher KPIs..." />;
    if (error) return <Text data="Error loading Publisher KPIs" />;

    const kpis = kpiData?.[0] || {
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

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Gross Revenue
                            </Typography>
                            <Typography variant="h4">
                                ${formatNumber(kpis.grossRevenue)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Net Revenue
                            </Typography>
                            <Typography variant="h4">
                                ${formatNumber(kpis.netRevenue)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Payout Due
                            </Typography>
                            <Typography variant="h4">
                                ${formatNumber(kpis.payoutDue)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                eCPM
                            </Typography>
                            <Typography variant="h4">
                                ${formatNumber(kpis.ecpm)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Fill Rate
                            </Typography>
                            <Typography variant="h4">
                                {kpis.fillRate.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Impressions
                            </Typography>
                            <Typography variant="h4">
                                {formatNumber(kpis.impressions)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                IVT Fraud Rate
                            </Typography>
                            <Typography variant="h4">
                                {kpis.ivtFraudRate.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Compliance
                            </Typography>
                            <Typography variant="h4">
                                {kpis.compliance.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Crash Rate
                            </Typography>
                            <Typography variant="h4">
                                {kpis.crashRate.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Retention D1
                            </Typography>
                            <Typography variant="h4">
                                {kpis.retentionD1.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                ROAS D7
                            </Typography>
                            <Typography variant="h4">
                                {kpis.roasD7.toFixed(DECIMAL_LENGTH)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

