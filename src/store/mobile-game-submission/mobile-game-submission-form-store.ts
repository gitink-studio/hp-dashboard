import { create } from "zustand";

type MobileGameSubmissionFormActions = {
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
    setGameIconFile: (gameIconFile: File | string | null) => void;
    setGamePlayVideoFile: (gamePlayVideoFile: File | null) => void;
    setStoreUrlDisabled: (isStoreUrlDisabled: boolean) => void;
    setPlayStoreDataFetch: (isPlayStoreDataFetching: string) => void;
    setValidateInputs: (validateGameSubmissionInputs: boolean) => void;
    resetGameSubmissionData: () => void;
}

type MobileGameSubmissionFormState = {
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
    gameIconFile: File | string | null;
    gamePlayVideoFile: File | null;
    isStoreUrlDisabled: boolean;
    validateGameSubmissionInputs: boolean;
    playStoreDataFetchState: string;
    actions: MobileGameSubmissionFormActions;
}

const initialState = {
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
}

const useMobileGameSubmissionFormStore = create<MobileGameSubmissionFormState>((set) => ({
    ...initialState,
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
        setGameIconFile: (gameIconFile: File | string | null) => set({ gameIconFile }),
        setGamePlayVideoFile: (gamePlayVideoFile: File | null) => set({ gamePlayVideoFile }),
        setStoreUrlDisabled: (isStoreUrlDisabled: boolean) => set({ isStoreUrlDisabled }),
        setPlayStoreDataFetch: (isPlayStoreDataFetching: string) => set({ playStoreDataFetchState: isPlayStoreDataFetching }),
        setValidateInputs: (validateGameSubmissionInputs: boolean) => set({ validateGameSubmissionInputs }),
        resetGameSubmissionData: () => set(initialState),
    }
}))

export const useStoreStatus = () => useMobileGameSubmissionFormStore((state) => state.storeStatus);
export const useStoreUrl = () => useMobileGameSubmissionFormStore((state) => state.storeUrl);
export const useStoreUrlDisabled = () => useMobileGameSubmissionFormStore((state) => state.isStoreUrlDisabled);
export const usePlayStoreDataFetch = () => useMobileGameSubmissionFormStore((state) => state.playStoreDataFetchState);
export const useGameTitle = () => useMobileGameSubmissionFormStore((state) => state.gameTitle);
export const usePlatform = () => useMobileGameSubmissionFormStore((state) => state.platform);
export const useMinOSCompatibility = () => useMobileGameSubmissionFormStore((state) => state.minOSCompatibility);
export const useGenre = () => useMobileGameSubmissionFormStore((state) => state.genre);
export const useControl = () => useMobileGameSubmissionFormStore((state) => state.control);
export const useMechanics = () => useMobileGameSubmissionFormStore((state) => state.mechanics);
export const useOptionalTags = () => useMobileGameSubmissionFormStore((state) => state.optionalTags);
export const useGameType = () => useMobileGameSubmissionFormStore((state) => state.gameType);
export const useGameIconFile = () => useMobileGameSubmissionFormStore((state) => state.gameIconFile);
export const useGamePlayVideoFile = () => useMobileGameSubmissionFormStore((state) => state.gamePlayVideoFile);
export const useValidateMobileGameSubmissionFormInputs = () => useMobileGameSubmissionFormStore((state) => state.validateGameSubmissionInputs);
export const useMobileGameSubmissionFormActions = () => useMobileGameSubmissionFormStore((state) => state.actions);
