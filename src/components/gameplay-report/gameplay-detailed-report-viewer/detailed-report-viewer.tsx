import { GridColDef } from "@mui/x-data-grid";
import { CustomDatagrid } from "../../data-grid.component"
import { Stack } from "@mui/material";
import { setElementId } from "../../../common/utils";

export const columnProps: Partial<GridColDef> = {
    align: 'center',
    headerAlign: 'center',
    flex: 1,
    minWidth: 100
}

export const DetailedReportViewer = (props: any) => {
    const { rows, columns } = props.data;
    const newData: any = setElementId(rows.data);

    return <CustomDatagrid
        data={{
            rows: newData,
            columns: columns,
            rowSelection: false,
            canUseCustomPageSize: true
        }}
    />
}
