import { DateInput } from "react-admin";
import { Box } from "@mui/material";

export const DateRangeInput = ({
  source,
  label,
  ...props
}: {
  source: string;
  label: string;
} & any) => {
  return (
    <Box display="flex" gap={2}>
      <DateInput source="startDate" key="from" label="From " />
      <DateInput source="endDate" key="To" label="To" />
    </Box>
  );
};
