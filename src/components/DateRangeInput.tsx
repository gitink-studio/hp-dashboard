import { DateInput, SimpleForm } from "react-admin";
import { Box, Stack } from "@mui/material";
import { MIN_DATE } from "../common/constants";

export const DateRangeInput = ({
  source,
  label,
  ...props
}: {
  source: string;
  label: string;
} & any) => {
  return (
    // <SimpleForm toolbar={false} sx={{ height: "60px", p: 0 }} defaultValues={{startDate: MIN_DATE, endDate: new Date}}>
    // <Box display="flex" gap={2} sx={{ alignItems: "center" }}>
    //   <DateInput source="startDate" label="From " />
    //   <DateInput source="endDate" label="To" />
    // </Box>
    {
      /* </SimpleForm> */
    }
  );
};
