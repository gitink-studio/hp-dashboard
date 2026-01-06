import { create } from 'zustand'

type DataGridAction = {
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
}

type DataGridStore = {
    page: number,
    pageSize: number,
    actions: DataGridAction
}

const initialState = {
    page: 0,
    pageSize: 20,
}

const useDataGrid = create<DataGridStore>((set) => ({
    ...initialState,
    actions: {
        setPage: (page: number) => set({ page: page }),
        setPageSize: (pageSize: number) => set({ pageSize: pageSize })
    }
}))

export const useDataGridPage = () => useDataGrid((state) => state.page);
export const useDataGridPageSize = () => useDataGrid((state) => state.pageSize);
export const useDataGridActions = () => useDataGrid((state) => state.actions);
