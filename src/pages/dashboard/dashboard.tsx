import {
  Datagrid,
  DateInput,
  FunctionField,
  InfiniteList,
  ReferenceInput,
  SelectInput,
  TextField,
  useListContext,
} from "react-admin";
import { DECIMAL_LENGTH, QueryNames } from "../../common/constants";
import { Stack, Typography } from "@mui/material";
import { formatNumber } from "../../common/utils";

export const Dashboard = () => {
  const filters = [
    <ReferenceInput
      source="platform"
      reference={QueryNames.GET_PLATFORM_FILTER}
      alwaysOn
    >
      <SelectInput
        optionText="name"
        label="Platforms"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
      />
    </ReferenceInput>,
    <ReferenceInput
      source="subPlatform"
      reference={QueryNames.GET_SUB_PLATFORM_FILTER}
      alwaysOn
    >
      <SelectInput
        optionText="name"
        label="Sub Platforms"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
      />
    </ReferenceInput>,
    <ReferenceInput
      source="game"
      reference={QueryNames.GET_GAME_FILTER}
      alwaysOn
    >
      <SelectInput
        optionText="name"
        label="Games"
        defaultValue="All"
        emptyText="All"
        emptyValue="All"
      />
    </ReferenceInput>,
    <SelectInput
      source="dateRange"
      choices={[
        { id: 0, name: "Yesterday" },
        { id: 1, name: "7 days" },
        { id: 2, name: "30 days" },
      ]}
      optionText="name"
      label="Date Range"
      emptyText="Today"
      emptyValue="Today"
      alwaysOn
    />,
    <DateInput source="startDate" label="From " alwaysOn />,
    <DateInput source="endDate" label="To" alwaysOn />,
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
    let metaIndex = 0;
    let roasD7 = 0;
    let totalCrashRates = 0;
    let retentionD1 = 0;

    if (data?.length) {
      roasD7 = data[metaIndex].meta.roasD7.toFixed(DECIMAL_LENGTH);
      totalInstalls = data[metaIndex].meta.totalInstalls;
      totalCPI = data[metaIndex].meta.totalCPI;
      totalRevenue = data[metaIndex].meta.totalRevenue;
      totalCrashRates = data[metaIndex].meta.totalCrashRates ?? 0;
      retentionD1 = data[metaIndex].meta.retentionD1 ?? 0;
    }
    return (
      <>
        <Text data={"Games: " + data?.length} />
        <Text data={"Installs: " + formatNumber(totalInstalls)} />
        <Text data={"CPI: $" + formatNumber(totalCPI)} />
        <Text data={"Revenue: $" + formatNumber(totalRevenue)} />
        <Text data={"ROAS: " + roasD7 + "%"} />
        <Text data={"CrashRates: " + totalCrashRates + "%"} />
        <Text data={"Retention D1: " + formatNumber(retentionD1) + "%"} />
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
