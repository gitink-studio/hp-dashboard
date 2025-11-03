import { create } from "zustand";

type SelectPlatformAction = {
    setMetaSelected: (isMetaSelected: boolean) => void;
    setPokiSelected: (isPokiSelected: boolean) => void;
    setMsnSelected: (isMsnSelected: boolean) => void;
    setCrazyGamesSelected: (isCrazyGamesSelected: boolean) => void;
    resetSelectPlatformStore: () => void;
}

type SelectPlatformState = {
    isMetaSelected: boolean;
    isPokiSelected: boolean;
    isMsnSelected: boolean;
    isCrazyGamesSelected: boolean;
    actions: SelectPlatformAction;
}

const initialState = {
    isMetaSelected: false,
    isPokiSelected: false,
    isMsnSelected: false,
    isCrazyGamesSelected: false,
}

const useSelectPlatformStore = create<SelectPlatformState>((set) => ({
    ...initialState,
    actions: {
        setMetaSelected: (isMetaSelected: boolean) => set({ isMetaSelected }),
        setPokiSelected: (isPokiSelected: boolean) => set({ isPokiSelected }),
        setMsnSelected: (isMsnSelected: boolean) => set({ isMsnSelected }),
        setCrazyGamesSelected: (isCrazyGamesSelected: boolean) => set({ isCrazyGamesSelected }),
        resetSelectPlatformStore: () => set(initialState),
    }
}));

export const useMetaSelected = () => useSelectPlatformStore((state) => state.isMetaSelected);
export const usePokiSelected = () => useSelectPlatformStore((state) => state.isPokiSelected);
export const useMsnSelected = () => useSelectPlatformStore((state) => state.isMsnSelected);
export const useCrazyGamesSelected = () => useSelectPlatformStore((state) => state.isCrazyGamesSelected);
export const useSelectPlatformActions = () => useSelectPlatformStore((state) => state.actions);

