import { GridColDef } from "@mui/x-data-grid";
import { CustomDatagrid } from "../../data-grid.component"
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { setElementId } from "../../../common/utils";
import { DetailedReportViewerType } from "../../../common/constants";

export const columnProps: Partial<GridColDef> = {
    align: 'center',
    headerAlign: 'center',
    flex: 1,
    minWidth: 100
}

export const DetailedReportViewer = (props: any) => {
    const { data, rows, columns, detailedReportViewerType = DetailedReportViewerType.DATAGRID } = props.data;

    if (detailedReportViewerType === DetailedReportViewerType.CARD) {
        console.log(`FPS Data: ${JSON.stringify(data)}`);
    }

    return (
        <>
            {
                (detailedReportViewerType === DetailedReportViewerType.DATAGRID)
                    ? <CustomDatagrid
                        data={{
                            rows: setElementId(rows.data),
                            columns: columns,
                            rowSelection: false,
                            canUseCustomPageSize: true
                        }}
                    />
                    : <Stack direction={'row'} gap={2}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{data.value}</Typography>
                                <Typography variant="caption">{data.name}</Typography>
                            </CardContent>
                        </Card>
                    </Stack>
            }
        </>
    )
}
