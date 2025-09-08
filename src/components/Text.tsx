import { Typography } from "@mui/material";

export const Text = ({ data, ...props }: { data: string; }) => {
    return (<Typography sx={{ p: 2, pt: 0, }
    } {...props}> {data} </Typography>);
}
