import {
    Button,
    Datagrid,
    FunctionField,
    InfiniteList,
    TextField,
    useListContext,
    useListController,
} from "react-admin";
import { DECIMAL_LENGTH, QueryNames } from "../../common/constants";
import { Stack, Typography } from "@mui/material";
import { formatNumber } from "../../common/utils";
import { PlatformFilter } from "../../components/dashboard/platform-filter";
import { SubPlatformFilter } from "../../components/dashboard/sub-platform-filter";
import { GamesFilter } from "../../components/dashboard/games-filter";
import { DateFilter } from "../../components/dashboard/date-filter";
import { StudioFilter } from "../../components/dashboard/studio-filter";
import { RegionFilter } from "../../components/dashboard/Region-filter";
import { CurrencyFilter } from "../../components/dashboard/currency-filter";
import { SavedViewFilter } from "../../components/dashboard/saved-view-filter";
import { PublishKPIs } from "../../components/dashboard/publisher-kpis";
import { ApprovalQueue } from "../../components/dashboard/approvals-queue";

export const AdminDashboard = () => {
    const listController = useListController({ resource: QueryNames.GET_ALL_DASHBOARD_DATA, });
    const customDatePicker = "Custom";
    const getDate = (data: any) => data === "Custom"
        ? data : data === 0
            ? "Today" : data === 1
                ? "Yesterday" : `Last ${data} days`;

    const Text = ({ data, ...props }: { data: string; }) => {
        return (<Typography sx={{ p: 2, pt: 0, }} {...props}> {data} </Typography>);
    }

    const filters = [
        <StudioFilter />,
        <PlatformFilter />,
        <SubPlatformFilter />,
        <RegionFilter />,
        <GamesFilter />,
        <DateFilter />,
        <CurrencyFilter />,
        <SavedViewFilter />,
    ];

    return (
        <>
            <InfiniteList filters={filters}>
                <Typography variant="h6" sx={{ p: 2 }}>
                    Publisher KPIs
                </Typography>
                <Stack direction="row">
                    <PublishKPIs />
                </Stack>
                <ApprovalQueue />
                <Typography variant="h6" sx={{ p: 2 }}>
                    Studios
                </Typography>
                <Datagrid>
                    <TextField source="name" label="Games" />
                    <TextField source="gamePlatform" label="Platforms" />
                    <TextField source="dau" label="DAU" />
                    <TextField source="installs" label="Installs" />
                    <FunctionField
                        label="CPI"
                        render={(record) => `$${formatNumber(record.cpi)}`}
                    />
                    <FunctionField
                        label="Revenue"
                        render={(record) => `$${formatNumber(record.revenue)}`}
                    />
                </Datagrid>
            </InfiniteList>
        </>
    );
};
