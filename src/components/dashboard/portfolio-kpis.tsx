import { Typography } from "@mui/material"
import { formatNumber } from "../../common/utils";
import { DECIMAL_LENGTH } from "../../common/constants";
import { useListContext } from "react-admin";
import { FetchData } from "../../data-providers/data-provider";

export const PortfolioKPIs = (props: any,) => {
    const { data, filterValues } = useListContext();
    const Text = ({ data, canDisable, ...props }: { data: string; canDisable: boolean }) => {
        return (<Typography sx={{ p: 2, pt: 0, display: canDisable ? "none" : "block" }
        } {...props}> {data} </Typography>);
    }
    const selectedPlatform = filterValues.platform;

    const isWebPlatformSelected = () => FetchData.getWebPlatformId() === selectedPlatform;

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
            <Text data={"Games: " + data?.length} canDisable={false} />
            < Text data={"Installs: " + formatNumber(totalInstalls)} canDisable={isWebPlatformSelected()} />
            <Text data={"CPI: $" + formatNumber(totalCPI)} canDisable={isWebPlatformSelected()} />
            < Text data={"Revenue: $" + formatNumber(totalRevenue)} canDisable={false} />
            <Text data={"ROAS: " + roasD7 + "%"} canDisable={isWebPlatformSelected()} />
            < Text data={"CrashRates: " + totalCrashRates + "%"} canDisable={false} />
            <Text data={"Retention D1: " + formatNumber(retentionD1) + "%"} canDisable={false} />
        </>
    )
};

