import { create } from 'zustand'

type CustomDialogActions = {
    setCanOpenCustomDialog: (canOpenCustomDialog: boolean) => void;
    reset: () => void
}

type CustomDialogState = {
    canOpenCustomDialog: boolean,
    actions: CustomDialogActions
}

const initialState = {
    canOpenCustomDialog: false
}

const useCustomDialogState = create<CustomDialogState>((set) => ({
    ...initialState,
    actions: {
        setCanOpenCustomDialog: (canOpenCustomDialog: boolean) => ({ canOpenCustomDialog }),
        reset: () => set({ ...initialState })
    }
}))

export const useCanOpenCustomDialog = () => useCustomDialogState((state) => state.canOpenCustomDialog);
export const useCustomDialogActions = () => useCustomDialogState((state) => state.actions);
