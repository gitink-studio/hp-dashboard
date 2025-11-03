import { create } from "zustand";

type GameSubmissionActions = {
    setStoreStatus: (status: string) => void;
    setStoreUrl: (storeUrl: string) => void;
    setGameTitle: (gameTitle: string) => void;
    setPlatform: (platform: string) => void;
    setMinOSCompatibility: (minOSCompatibility: string) => void;
    setGenre: (genre: string) => void;
    setControl: (control: string[]) => void;
    setMechanics: (mechanics: string[]) => void;
    setOptionalTags: (optionalTags: string[]) => void;
    setGameType: (gameType: string) => void;
    setGameIconFile: (gameIconFile: File | null) => void;
    setGamePlayVideoFile: (gamePlayVideoFile: File | null) => void;
    setStoreUrlDisabled: (isStoreUrlDisabled: boolean) => void;
    setPlayStoreDataFetch: (isPlayStoreDataFetching: string) => void;
    setValidateInputs: (validateGameSubmissionInputs: boolean) => void;
}

type GameSubmissionState = {
    storeStatus: string;
    storeUrl: string;
    gameTitle: string;
    platform: string;
    minOSCompatibility: string;
    genre: string;
    control: string[];
    mechanics: string[];
    optionalTags: string[];
    gameType: string;
    gameIconFile: File | null;
    gamePlayVideoFile: File | null;
    isStoreUrlDisabled: boolean;
    validateGameSubmissionInputs: boolean;
    playStoreDataFetchState: string;
    actions: GameSubmissionActions;
}

const useGameSubmissionStore = create<GameSubmissionState>((set) => ({
    storeStatus: "Live",
    storeUrl: '',
    gameTitle: '',
    platform: 'Android',
    minOSCompatibility: '',
    genre: '',
    control: [],
    mechanics: [],
    optionalTags: [],
    gameType: '',
    gameIconFile: null,
    gamePlayVideoFile: null,
    isStoreUrlDisabled: false,
    validateGameSubmissionInputs: false,
    playStoreDataFetchState: '',
    actions: {
        setStoreStatus: (storeStatus: string) => set({ storeStatus }),
        setStoreUrl: (storeUrl: string) => set({ storeUrl }),
        setGameTitle: (gameTitle: string) => set({ gameTitle }),
        setPlatform: (platform: string) => set({ platform }),
        setMinOSCompatibility: (minOSCompatibility: string) => set({ minOSCompatibility }),
        setGenre: (genre: string) => set({ genre }),
        setControl: (control: string[]) => set({ control }),
        setMechanics: (mechanics: string[]) => set({ mechanics }),
        setGameType: (gameType: string) => set({ gameType }),
        setOptionalTags: (optionalTags: string[]) => set({ optionalTags }),
        setGameIconFile: (gameIconFile: File | null) => set({ gameIconFile }),
        setGamePlayVideoFile: (gamePlayVideoFile: File | null) => set({ gamePlayVideoFile }),
        setStoreUrlDisabled: (isStoreUrlDisabled: boolean) => set({ isStoreUrlDisabled }),
        setPlayStoreDataFetch: (isPlayStoreDataFetching: string) => set({ playStoreDataFetchState: isPlayStoreDataFetching }),
        setValidateInputs: (validateGameSubmissionInputs: boolean) => set({ validateGameSubmissionInputs })
    }
}))

export const useStoreStatus = () => useGameSubmissionStore((state) => state.storeStatus);
export const useStoreUrl = () => useGameSubmissionStore((state) => state.storeUrl);
export const useStoreUrlDisabled = () => useGameSubmissionStore((state) => state.isStoreUrlDisabled);
export const usePlayStoreDataFetch = () => useGameSubmissionStore((state) => state.playStoreDataFetchState);
export const useGameTitle = () => useGameSubmissionStore((state) => state.gameTitle);
export const usePlatform = () => useGameSubmissionStore((state) => state.platform);
export const useMinOSCompatibility = () => useGameSubmissionStore((state) => state.minOSCompatibility);
export const useGenre = () => useGameSubmissionStore((state) => state.genre);
export const useControl = () => useGameSubmissionStore((state) => state.control);
export const useMechanics = () => useGameSubmissionStore((state) => state.mechanics);
export const useOptionalTags = () => useGameSubmissionStore((state) => state.optionalTags);
export const useGameType = () => useGameSubmissionStore((state) => state.gameType);
export const useGameIconFile = () => useGameSubmissionStore((state) => state.gameIconFile);
export const useGamePlayVideoFile = () => useGameSubmissionStore((state) => state.gamePlayVideoFile);
export const useValidateGameSubmissionInputs = () => useGameSubmissionStore((state) => state.validateGameSubmissionInputs);
export const useGameSubmissionActions = () => useGameSubmissionStore((state) => state.actions);