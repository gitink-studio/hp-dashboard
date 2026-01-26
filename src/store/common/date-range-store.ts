import { create } from 'zustand'

type DateRangeAction = {
    setOpenState: (openState: boolean) => void;
    setStartDate: (startDate: string) => void;
    setEndDate: (endDate: string) => void;
    resetAllDate: () => void;
}

type DateRangeState = {
    openState: boolean;
    startDate: string;
    endDate: string;
    actions: DateRangeAction
}

const initialState = {
    openState: false,
    startDate: '',
    endDate: ''
}

const useDateRangeStore = create<DateRangeState>((set) => ({
    ...initialState,
    actions: {
        setOpenState: (openState: boolean) => set({ openState }),
        setStartDate: (startDate: string) => set({ startDate }),
        setEndDate: (endDate: string) => set({ endDate }),
        resetAllDate: () => set(initialState)
    }
}))

export const useDateRangeOpenState = () => useDateRangeStore((state) => state.openState);
export const useStartDate = () => useDateRangeStore((state) => state.startDate);
export const useEndDate = () => useDateRangeStore((state) => state.endDate);
export const useDateRangeActions = () => useDateRangeStore((state) => state.actions)
