import { create } from "zustand";

type MetadataAndRatingsAction = {
    setGameTitle: (gameTitle: string) => void;
    setShortDescription: (shortDescription: string) => void;
    setLongDescription: (longDescription: string) => void;
    setGenre: (genre: string) => void;
    setSubGenre: (subGenre: string) => void;
    setLanguages: (languages: string[]) => void;
    setAgeRating: (ageRating: string) => void;
    setRegionalAvailability: (regionalAvailability: string[]) => void;
    setPrivacyPolicyUrl: (privacyPolicyUrl: string) => void;
    setSupportUrl: (supportUrl: string) => void;
    resetMetadataAndRatingsStore: () => void;
}

type MetadataAndRatingsState = {
    gameTitle: string;
    shortDescription: string;
    longDescription: string;
    genre: string;
    subGenre: string;
    languages: string[];
    ageRating: string;
    regionalAvailability: string[];
    privacyPolicyUrl: string;
    supportUrl: string;
    actions: MetadataAndRatingsAction;
}

const initialState = {
    gameTitle: '',
    shortDescription: '',
    longDescription: '',
    genre: '',
    subGenre: '',
    languages: [],
    ageRating: '',
    regionalAvailability: [],
    privacyPolicyUrl: '',
    supportUrl: '',
}

const useMetadataAndRatingsStore = create<MetadataAndRatingsState>((set) => ({
    ...initialState,
    actions: {
        setGameTitle: (gameTitle: string) => set({ gameTitle }),
        setShortDescription: (shortDescription: string) => set({ shortDescription }),
        setLongDescription: (longDescription: string) => set({ longDescription }),
        setGenre: (genre: string) => set({ genre }),
        setSubGenre: (subGenre: string) => set({ subGenre }),
        setLanguages: (languages: string[]) => set({ languages }),
        setAgeRating: (ageRating: string) => set({ ageRating }),
        setRegionalAvailability: (regionalAvailability: string[]) => set({ regionalAvailability }),
        setPrivacyPolicyUrl: (privacyPolicyUrl: string) => set({ privacyPolicyUrl }),
        setSupportUrl: (supportUrl: string) => set({ supportUrl }),
        resetMetadataAndRatingsStore: () => set(initialState),
    }
}))

export const useGameTitle = () => useMetadataAndRatingsStore((state) => state.gameTitle);
export const useShortDescription = () => useMetadataAndRatingsStore((state) => state.shortDescription);
export const useLongDescription = () => useMetadataAndRatingsStore((state) => state.longDescription);
export const useGenre = () => useMetadataAndRatingsStore((state) => state.genre);
export const useSubGenre = () => useMetadataAndRatingsStore((state) => state.subGenre);
export const useLanguages = () => useMetadataAndRatingsStore((state) => state.languages);
export const useAgeRating = () => useMetadataAndRatingsStore((state) => state.ageRating);
export const useRegionalAvailability = () => useMetadataAndRatingsStore((state) => state.regionalAvailability);
export const usePrivacyPolicyUrl = () => useMetadataAndRatingsStore((state) => state.privacyPolicyUrl);
export const useSupportUrl = () => useMetadataAndRatingsStore((state) => state.supportUrl);
export const useMetadataAndRatingsActions = () => useMetadataAndRatingsStore((state) => state.actions);