import { GridColDef } from "@mui/x-data-grid";
import { CustomDatagrid } from "../../data-grid.component"
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { MEAN, MEDIAN, MODE } from "../../../common/constants";
import { setElementId } from "../../../common/utils";

export const columnProps: Partial<GridColDef> = {
    align: 'center',
    headerAlign: 'center',
    flex: 1
}

export const DetailedReportViewer = (props: any) => {
    const { rows, columns } = props.data;
    const newData: any = setElementId(rows.data);

    const setId = (data: any) => {
        if (data.type === MEAN) {
            return data;
        }
        else if (data.type === MEDIAN) {
            return {
                ...data.value,
                id: data.name
            };
        }
        else if (data.type === MODE) {
            // console.log(`Mode data: ${JSON.stringify(data)}`);

            if (Array.isArray(data?.value))
                return setElementId(data.value);
            else
                return data;
        }
    }

    return <Stack direction={'row'} gap={2}>
        <CustomDatagrid
            data={{
                rows: newData,
                columns: columns,
                rowSelection: false,
            }}
        />
        {/* <Box >
            <Stack direction={'row'} gap={2}>
                {
                    props.data?.rows?.additionalMetrics?.map((data: any) => {
                        // const newData = setId(data);
                        return (
                            <Card variant="outlined">
                                <CardContent sx={{ px: 4 }} >
                                    <Typography variant="caption">{data.name}</Typography>
                                    {
                                        data?.columns ?
                                            <CustomDatagrid
                                                data={{
                                                    rows: newData?.value,
                                                    columns: newData?.columns
                                                }}
                                            />
                                            : <Typography variant="h6">{data.value}</Typography>
                                    }
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </Stack>
        </Box> */}
    </Stack>
}
