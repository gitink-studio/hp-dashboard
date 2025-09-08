import {
  Datagrid,
  FunctionField,
  InfiniteList,
  TextField,
  useListController,
} from "react-admin";
import { QueryNames } from "../../common/constants";
import { Stack, Typography } from "@mui/material";
import { formatNumber } from "../../common/utils";
import { PlatformFilter } from "../../components/dashboard/platform-filter";
import { SubPlatformFilter } from "../../components/dashboard/sub-platform-filter";
import { GamesFilter } from "../../components/dashboard/games-filter";
import { PortfolioKPIs } from "../../components/dashboard/portfolio-kpis";

export const Dashboard = () => {
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
    <PlatformFilter alwaysOn />,
    <SubPlatformFilter alwaysOn />,
    <GamesFilter alwaysOn />,
    // <DateFilter alwaysOn />
  ];

  return (
    <>
      <InfiniteList filters={filters}
        filterDefaultValues={{ platform: "All", subPlatform: "All", games: "All" }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Portfolio KPIs
        </Typography>
        <Stack direction="row">
          <PortfolioKPIs />
        </Stack>
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
