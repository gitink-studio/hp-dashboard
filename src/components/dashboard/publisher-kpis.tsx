import { formatNumber } from "../../common/utils";
import { DECIMAL_LENGTH } from "../../common/constants";
import { Text } from "../text";

export const PublishKPIs = (props: any) => {
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
            < Text data={"Gross Revenue: $0"} />
            <Text data={"Net Revenue: $ 0"} />
            < Text data={"Payout Due: $0"} />
            <Text data={"eCPM: $ 0"} />
            < Text data={"Fill: 94%"} />
            <Text data={"Impr: 0"} />
            <Text data={"IVT: 1.6%"} />
            <Text data={"Compliance: 97%"} />
            <Text data={"Crash: 0.9%"} />
            <Text data={"Retention D1: 38%"} />
            <Text data={"ROAS D7: 128%"} />
        </>
    )
};

