import {
  Datagrid,
  FunctionField,
  InfiniteList,
  TextField,
  useListContext,
} from "react-admin";
import { QueryNames } from "../../common/constants";
import { DropdownList } from "../../components/DropdownList";
import { Stack, Typography } from "@mui/material";
import { formatNumber } from "../../common/utils";
import { DateRangeInput } from "../../components/DateRangeInput";

export const Dashboard = () => {
  const filters = [
    <DropdownList
      source="platform"
      reference={QueryNames.GET_PLATFORM_FILTER}
      optionText="name"
      optionLabel="Platforms"
      emptyText="All"
      emptyValue="All"
      selectInput={true}
      alwaysOn
    />,
    <DropdownList
      source="subPlatform"
      reference={QueryNames.GET_SUB_PLATFORM_FILTER}
      optionText="name"
      optionLabel="Sub Platforms"
      emptyText="All"
      emptyValue="All"
      selectInput={true}
      alwaysOn
    />,
    <DropdownList
      source="game"
      reference={QueryNames.GET_GAME_FILTER}
      optionText="name"
      optionLabel="Games"
      emptyText="All"
      emptyValue="All"
      selectInput={true}
      alwaysOn
    />,
    <DateRangeInput alwaysOn />,
  ];

  const Text = ({ data, ...props }: { data: string }) => (
    <Typography sx={{ p: 2, pt: 0 }} {...props}>
      {data}
    </Typography>
  );

  const PortfolioKPI = () => {
    const { data, isLoading } = useListContext();
    if (isLoading) return null;
    let totalInstalls = 0;
    let totalCPI = 0;
    let totalRevenue = 0;

    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        totalInstalls += data[i].installs;
        totalCPI += data[i].cpi;
        totalRevenue += data[i].revenue;
      }
    }

    return (
      <>
        <Text data={"Games: " + data?.length} />
        <Text data={"Installs: " + formatNumber(totalInstalls)} />
        <Text data={"CPI: $" + formatNumber(totalCPI)} />
        <Text data={"Revenue: $" + formatNumber(totalRevenue)} />
      </>
    );
  };

  return (
    <>
      <InfiniteList filters={filters}>
        {/* <InfiniteList filters={filters}> */}
        <Typography variant="h6" sx={{ p: 2 }}>
          Portfolio KPIs (Last 30 days)
        </Typography>
        <Stack direction="row">
          <PortfolioKPI />
          <Typography sx={{ p: 2, pt: 0 }}>ROAS D7: 0%</Typography>
          <Typography sx={{ p: 2, pt: 0 }}>Crash Rate: 0%</Typography>
          <Typography sx={{ p: 2, pt: 0 }}>Retention D1: [#]</Typography>
        </Stack>
        <Datagrid>
          <TextField source="name" label="Games" />
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
