import { Stack, Typography } from "@mui/material";
import { Datagrid, InfiniteList, TextField } from "react-admin";
import { PortfolioKPIs } from "./portfolio-kpis";

export const ApprovalQueue = () => {

    return (
        <>
            <InfiniteList>
                <Typography variant="h6" sx={{ p: 2 }}>
                    Approvals Queue
                </Typography>
                <Datagrid>
                    <TextField source="type" label="Type" />
                    <TextField source="studio" label="Studio" />
                    <TextField source="game" label="Game" />
                    <TextField source="item" label="Item" />
                    <TextField source="reason/policy" label="Reason/Policy" />
                    <TextField source="status" label="Status" />
                    <TextField source="action" label="Action" />
                </Datagrid>
            </InfiniteList>
        </>
    );
}
