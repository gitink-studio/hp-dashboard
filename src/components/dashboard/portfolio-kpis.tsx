import { Typography } from "@mui/material"
import { formatNumber } from "../../common/utils";
import { DECIMAL_LENGTH } from "../../common/constants";

export const PortfolioKPIs = (props: any) => {
    const Text = ({ data, ...props }: { data: string; }) => {
        return (<Typography sx={{ p: 2, pt: 0, }
        } {...props}> {data} </Typography>);
    }

    const data = props.data;

    // if (isLoading) return null;
    let totalInstalls = 0;
    let totalCPI = 0;
    let totalRevenue = 0;
    let metaIndex = 0;
    let roasD7 = 0;
    let totalCrashRates = 0;
    let retentionD1 = 0;

    if (data?.length) {
        roasD7 = data[metaIndex].meta.roasD7.toFixed(DECIMAL_LENGTH);
        totalInstalls = data[metaIndex].meta?.totalInstalls;
        totalCPI = data[metaIndex].meta?.totalCPI;
        totalRevenue = data[metaIndex].meta?.totalRevenue;
        totalCrashRates = data[metaIndex].meta?.totalCrashRates ?? 0;
        retentionD1 = data[metaIndex].meta?.retentionD1 ?? 0;
    }

    return (
        <>
            {/* <Text data={"Games: " + data?.length} /> */}
            < Text data={"Installs: " + formatNumber(totalInstalls)} />
            <Text data={"CPI: $" + formatNumber(totalCPI)} />
            < Text data={"Revenue: $" + formatNumber(totalRevenue)} />
            <Text data={"ROAS: " + roasD7 + "%"} />
            < Text data={"CrashRates: " + totalCrashRates + "%"} />
            <Text data={"Retention D1: " + formatNumber(retentionD1) + "%"} />
        </>
    )
};

