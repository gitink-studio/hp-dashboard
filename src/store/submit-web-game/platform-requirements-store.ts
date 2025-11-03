import { create } from "zustand";

type PlatformRequirementsAction = {
    setMetaRequirementsCompleted: (isMetaRequirementsCompleted: boolean) => void;
    setPokiRequirementsCompleted: (isPokiRequirementsCompleted: boolean) => void;
    setMsnRequirementsCompleted: (isMsnRequirementsCompleted: boolean) => void;
    setCrazyGamesRequirementsCompleted: (isCrazyGamesRequirementsCompleted: boolean) => void;
    resetPlatformRequirementsStore: () => void;
}

type PlatformRequirementsState = {
    isMetaRequirementsCompleted: boolean
    isPokiRequirementsCompleted: boolean
    isMsnRequirementsCompleted: boolean
    isCrazyGamesRequirementsCompleted: boolean
    actions: PlatformRequirementsAction
}

const initialState = {
    isMetaRequirementsCompleted: false,
    isPokiRequirementsCompleted: false,
    isMsnRequirementsCompleted: false,
    isCrazyGamesRequirementsCompleted: false,
}

const usePlatformRequirementsStore = create<PlatformRequirementsState>((set) => ({
    ...initialState,
    actions: {
        setMetaRequirementsCompleted: (isMetaRequirementsCompleted: boolean) => set({ isMetaRequirementsCompleted }),
        setPokiRequirementsCompleted: (isPokiRequirementsCompleted: boolean) => set({ isPokiRequirementsCompleted }),
        setMsnRequirementsCompleted: (isMsnRequirementsCompleted: boolean) => set({ isMsnRequirementsCompleted }),
        setCrazyGamesRequirementsCompleted: (isCrazyGamesRequirementsCompleted: boolean) => set({ isCrazyGamesRequirementsCompleted }),
        resetPlatformRequirementsStore: () => set(initialState),
    }
}))

export const useMetaRequirementsCompleted = () => usePlatformRequirementsStore((state) => state.isMetaRequirementsCompleted);
export const usePokiRequirementsCompleted = () => usePlatformRequirementsStore((state) => state.isPokiRequirementsCompleted);
export const useMsnRequirementsCompleted = () => usePlatformRequirementsStore((state) => state.isMsnRequirementsCompleted);
export const useCrazyGamesRequirementsCompleted = () => usePlatformRequirementsStore((state) => state.isCrazyGamesRequirementsCompleted);
export const usePlatformRequirementsActions = () => usePlatformRequirementsStore((state) => state.actions);

