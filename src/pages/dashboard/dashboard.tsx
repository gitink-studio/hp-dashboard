import { Datagrid, FunctionField, InfiniteList, TextField, useListController } from "react-admin";
import { Stack, Typography } from "@mui/material";
import { PlatformFilter } from "../../components/dashboard/platform-filter";
import { SubPlatformFilter } from "../../components/dashboard/sub-platform-filter";
import { GamesFilter } from "../../components/dashboard/games-filter";
import { PortfolioKPIs } from "../../components/dashboard/portfolio-kpis";
import { DateFilter } from "../../components/dashboard/date-filter";
import { formatNumber } from "../../common/utils";
import { DEFAULT_DATE_OPTION, DEFAULT_CUSTOM_START_DATE } from "../../common/constants";

export const Dashboard = () => {
  const listController = useListController();

  const selectedDateRange: string = `(${listController.filterValues.dateRange})`;
  const filters = [
    <PlatformFilter key="platformFilter" alwaysOn />,
    <SubPlatformFilter key="subPlatformFilter" alwaysOn />,
    <GamesFilter key="gamesFilter" alwaysOn />,
    <DateFilter key="dateFilter" alwaysOn />
  ];

  const getDefaultStartDate = () => {
    let date = new Date();
    date.setDate(date.getDate() - DEFAULT_CUSTOM_START_DATE);
    return date.toISOString().slice(0, 10);
  };

  const getDefaultEndDate = () => new Date();

  return (
    <>
      <InfiniteList filters={filters} filterDefaultValues={{ platform: "All", subPlatform: "All", games: "All", dateRange: DEFAULT_DATE_OPTION, startDate: getDefaultStartDate(), endDate: getDefaultEndDate() }}>
        <Typography variant="h6" sx={{ p: 2 }}>Portfolio KPIs {selectedDateRange}</Typography>
        <Stack direction="row"><PortfolioKPIs /></Stack>
        <Datagrid>
          <TextField source="name" label="Games" />
          <TextField source="gamePlatform" label="Platforms" />
          <TextField source="dau" label="DAU" />
          <TextField source="installs" label="Installs" />
          <FunctionField label="CPI" render={(record) => `$${formatNumber(record.cpi)}`} />
          <FunctionField label="Revenue" render={(record) => `$${formatNumber(record.revenue)}`} />
        </Datagrid>
      </InfiniteList>
    </>
  );
};