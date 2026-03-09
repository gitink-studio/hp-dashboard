import { GridColDef } from "@mui/x-data-grid";
import { CustomDatagrid } from "../../data-grid.component"
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export const columnProps: Partial<GridColDef> = {
    align: 'center',
    headerAlign: 'center',
}

export const DetailedReportViewer = (props: any) => {
    const { rows, columns } = props.data;
    console.log(`Props data: ${JSON.stringify(props.data)}`);
    const newData: any = rows.data.map((data: any, index: any) => {
        return {
            ...data,
            id: index + 1
        }
    });

    return <Stack direction={'row'} gap={2}>
        <CustomDatagrid
            data={{
                rows: newData,
                columns: columns,
                rowSelection: false,
            }}
        />
        <Box >
            <Stack direction={'row'} gap={2}>
                {
                    props.data?.rows?.additionalMetrics?.map((data: any) => {
                        return <Card variant="outlined">
                            <CardContent sx={{ px: 4 }} >
                                {
                                    Array.isArray(data.value)
                                        ? <></>
                                        : <Typography variant="h6">{data.value}</Typography>
                                }
                                <Typography variant="caption">{data.name}</Typography>
                            </CardContent>
                        </Card>
                    })
                }
            </Stack>
        </Box>
    </Stack>
}
