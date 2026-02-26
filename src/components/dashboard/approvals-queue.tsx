import { Stack, Typography } from "@mui/material";
import { Datagrid, InfiniteList, TextField, useGetList } from "react-admin";
import { QueryNames } from "../../common/constants";

export const ApprovalQueue = (props: any) => {
    const { data, isLoading, error } = useGetList(QueryNames.APPROVALS_QUEUE, {
        filter: props.filter || {}
    });

    if (isLoading) return <Typography>Loading approvals queue...</Typography>;
    if (error) return <Typography>Error loading approvals queue</Typography>;

    return (
        <>
            <InfiniteList resource={QueryNames.APPROVALS_QUEUE} data={data}>
                <Typography variant="h6" sx={{ p: 2 }}>
                    Approvals Queue
                </Typography>
                <Datagrid>
                    <TextField source="type" label="Type" />
                    <TextField source="studio" label="Studio" />
                    <TextField source="game" label="Game" />
                    <TextField source="item" label="Item" />
                    <TextField source="reason" label="Reason/Policy" />
                    <TextField source="status" label="Status" />
                </Datagrid>
            </InfiniteList>
        </>
    );
}
