import { create } from 'zustand'

type DataGridAction = {
    setPageSize: (pageSize: number) => void;
}

type DataGridStore = {
    pageSize: number,
    actions: DataGridAction
}

const initialState = {
    pageSize: 20
}

const useDataGrid = create<DataGridStore>((set) => ({
    ...initialState,
    actions: {
        setPageSize: (pageSize: number) => set({ pageSize: pageSize })
    }
}))


export const useDataGridPageSize = () => useDataGrid((state) => state.pageSize);
export const useDataGridActions = () => useDataGrid((state) => state.actions);
