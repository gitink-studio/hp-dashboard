import { GridColDef } from "@mui/x-data-grid";
import { CustomDatagrid } from "../../data-grid.component"

export const columnProps: Partial<GridColDef> = {
    align: 'center',
    headerAlign: 'center',
}

export const DetailedReportViewer = (props: any) => {
    const { columns } = props.data;

    const newData: any = props.data.rows.map((data: any, index: any) => {
        return {
            ...data,
            id: index + 1
        }
    });

    return <CustomDatagrid
        data={{
            rows: newData,
            columns: columns,
            rowSelection: false,
        }}
    />
}
