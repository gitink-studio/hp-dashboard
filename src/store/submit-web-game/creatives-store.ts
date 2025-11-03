import { create } from "zustand";

type CreativesAction = {
    setIsAllMetaCreativesCompleted: (isAllMetaCreativesCompleted: boolean) => void;
    setIsAllPokiCreativesCompleted: (isAllPokiCreativesCompleted: boolean) => void;
    setIsAllMsnCreativesCompleted: (isAllMsnCreativesCompleted: boolean) => void;
    setIsAllCrazyGamesCreativesCompleted: (isAllCrazyGamesCreativesCompleted: boolean) => void;
    resetCreativesStore: () => void;
}

type CreativesState = {
    isAllMetaCreativesCompleted: boolean;
    isAllPokiCreativesCompleted: boolean;
    isAllMsnCreativesCompleted: boolean;
    isAllCrazyGamesCreativesCompleted: boolean;
    actions: CreativesAction;
}

const initialState = {
    isAllMetaCreativesCompleted: false,
    isAllPokiCreativesCompleted: false,
    isAllMsnCreativesCompleted: false,
    isAllCrazyGamesCreativesCompleted: false,
}

const useCreativesStore = create<CreativesState>((set) => ({
    ...initialState,
    actions: {
        setIsAllMetaCreativesCompleted: (isAllMetaCreativesCompleted: boolean) => set({ isAllMetaCreativesCompleted }),
        setIsAllPokiCreativesCompleted: (isAllPokiCreativesCompleted: boolean) => set({ isAllPokiCreativesCompleted }),
        setIsAllMsnCreativesCompleted: (isAllMsnCreativesCompleted: boolean) => set({ isAllMsnCreativesCompleted }),
        setIsAllCrazyGamesCreativesCompleted: (isAllCrazyGamesCreativesCompleted: boolean) => set({ isAllCrazyGamesCreativesCompleted }),
        resetCreativesStore: () => set(initialState),
    }
}));

export const useIsAllMetaCreativesCompleted = () => useCreativesStore((state) => state.isAllMetaCreativesCompleted);
export const useIsAllPokiCreativesCompleted = () => useCreativesStore((state) => state.isAllPokiCreativesCompleted);
export const useIsAllMsnCreativesCompleted = () => useCreativesStore((state) => state.isAllMsnCreativesCompleted);
export const useIsAllCrazyGamesCreativesCompleted = () => useCreativesStore((state) => state.isAllCrazyGamesCreativesCompleted);
export const useCreativesActions = () => useCreativesStore((state) => state.actions);