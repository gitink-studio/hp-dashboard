import { DataGrid } from "@mui/x-data-grid";
import { customStyle } from "../common/styles";
import { useDataGridActions, useDataGridPageSize } from "../store/common/data-grid-store";

const pageSizeOptions = [5, 10, 20, 50, 100];

export const CustomDatagrid = (props: any) => {
    const { rows, columns, rowSelection = true } = props.data;
    const pageSize = useDataGridPageSize();
    const { setPageSize, setPage } = useDataGridActions();


    const handlePaginationModelChange = (newModel: any) => {
        setPage(newModel.page);
        setPageSize(newModel.pageSize);
    }

    return (
        <>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: pageSize }
                    }
                }}
                pageSizeOptions={pageSizeOptions}
                sx={customStyle.dataGrid}
                rowSelection={rowSelection}
                onPaginationModelChange={handlePaginationModelChange}
            />
        </>
    )
}
