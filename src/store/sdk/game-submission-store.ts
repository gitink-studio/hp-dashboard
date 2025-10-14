import { create } from "zustand";

type GameSubmissionActions = {
    setStoreStatus: (status: string) => void;
    setStoreUrl: (storeUrl: string) => void;
    setGameTitle: (gameTitle: string) => void;
    setMinOSCompatibility: (minOSCompatibility: string) => void;
    setGameIconUrl: (gameIconUrl: string) => void;
    setStoreUrlDisabled: (isStoreUrlDisabled: boolean) => void;
    setPlayStoreDataFetch: (isPlayStoreDataFetching: string) => void;
}

type GameSubmissionState = {
    storeStatus: string;
    storeUrl: string;
    gameTitle: string;
    minOSCompatibility: string;
    gameIconUrl: string;
    isStoreUrlDisabled: boolean;
    playStoreDataFetchState: string;
    actions: GameSubmissionActions;
}

const useGameSubmissionStore = create<GameSubmissionState>((set) => ({
    storeStatus: "Live",
    storeUrl: '',
    gameTitle: '',
    minOSCompatibility: '',
    gameIconUrl: '',
    isStoreUrlDisabled: false,
    playStoreDataFetchState: '',
    actions: {
        setStoreStatus: (storeStatus: string) => set({ storeStatus }),
        setStoreUrl: (storeUrl: string) => set({ storeUrl }),
        setGameTitle: (gameTitle: string) => set({ gameTitle }),
        setMinOSCompatibility: (minOSCompatibility: string) => set({ minOSCompatibility }),
        setGameIconUrl: (gameIconUrl: string) => set({ gameIconUrl }),
        setStoreUrlDisabled: (isStoreUrlDisabled: boolean) => set({ isStoreUrlDisabled }),
        setPlayStoreDataFetch: (isPlayStoreDataFetching: string) => set({ playStoreDataFetchState: isPlayStoreDataFetching })
    }
}))

export const useStoreStatus = () => useGameSubmissionStore((state) => state.storeStatus);
export const useStoreUrl = () => useGameSubmissionStore((state) => state.storeUrl);
export const useStoreUrlDisabled = () => useGameSubmissionStore((state) => state.isStoreUrlDisabled);
export const usePlayStoreDataFetch = () => useGameSubmissionStore((state) => state.playStoreDataFetchState);
export const useGameTitle = () => useGameSubmissionStore((state) => state.gameTitle);
export const useMinOSCompatibility = () => useGameSubmissionStore((state) => state.minOSCompatibility);
export const useGameIconUrl = () => useGameSubmissionStore((state) => state.gameIconUrl);
export const useGameSubmissionActions = () => useGameSubmissionStore((state) => state.actions);