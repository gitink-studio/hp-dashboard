import { DataGrid } from "@mui/x-data-grid";
import { customStyle } from "../common/styles";

const pageSizeOptions = [5, 10, 20, 50, 100];
const currentPageSize = 20;

export const CustomDatagrid = (props: any) => {
    const { rows, columns } = props;
    return (
        <>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: currentPageSize }
                    }
                }}
                pageSizeOptions={pageSizeOptions}
                sx={customStyle.dataGrid}
                rowSelection={false}
            />
        </>
    )
}
