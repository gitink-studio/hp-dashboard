import { Grid2, Stack } from "@mui/material";


export const GridComponent = (props: any) => {
    const { componentList } = props.data;

    return (
        <>
            <Grid2 container gap={2}>
                {
                    componentList?.map((data: any) => {
                        return data;
                    })
                }
            </Grid2>
        </>
    )
}
