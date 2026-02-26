import { create } from "zustand";

type CrazyGamesCreativesAction = {
    setLandscapeBannerFile: (landscapeBannerFile: File | null) => void;
    setPortraitBannerFile: (portraitBannerFile: File | null) => void;
    setSquareBannerFile: (squareBannerFile: File | null) => void;
    setLandscapeGameplayVideoFile: (landscapeGameplayVideoFile: File | null) => void;
    setPortraitGameplayVideoFile: (portraitGameplayVideoFile: File | null) => void;
    resetCrazyGamesCreativesStore: () => void;
    getAllCrazyGamesCreatives: () => any;
}

type CrazyGamesCreativesState = {
    landscapeBannerFile: File | null;
    portraitBannerFile: File | null;
    squareBannerFile: File | null;
    landscapeGameplayVideoFile: File | null;
    portraitGameplayVideoFile: File | null;

    actions: CrazyGamesCreativesAction;
}

const initialState = {
    landscapeBannerFile: null,
    portraitBannerFile: null,
    squareBannerFile: null,
    landscapeGameplayVideoFile: null,
    portraitGameplayVideoFile: null,
}

const useCrazyGamesCreativesStore = create<CrazyGamesCreativesState>((set, get) => ({
    ...initialState,
    actions: {
        setLandscapeBannerFile: (landscapeBannerFile: File | null) => set({ landscapeBannerFile }),
        setPortraitBannerFile: (portraitBannerFile: File | null) => set({ portraitBannerFile }),
        setSquareBannerFile: (squareBannerFile: File | null) => set({ squareBannerFile }),
        setLandscapeGameplayVideoFile: (landscapeGameplayVideoFile: File | null) => set({ landscapeGameplayVideoFile }),
        setPortraitGameplayVideoFile: (portraitGameplayVideoFile: File | null) => set({ portraitGameplayVideoFile }),
        resetCrazyGamesCreativesStore: () => set(initialState),
        getAllCrazyGamesCreatives: () => {
            let files = [];
            let state: any = get();

            files.push(state.landscapeBannerFile);
            files.push(state.portraitBannerFile);
            files.push(state.squareBannerFile);
            files.push(state.landscapeGameplayVideoFile);
            files.push(state.portraitGameplayVideoFile);

            return files;
        }
    }
}));

export const useLandscapeBannerFile = () => useCrazyGamesCreativesStore((state) => state.landscapeBannerFile);
export const usePortraitBannerFile = () => useCrazyGamesCreativesStore((state) => state.portraitBannerFile);
export const useSquareBannerFile = () => useCrazyGamesCreativesStore((state) => state.squareBannerFile);
export const useLandscapeGameplayVideoFile = () => useCrazyGamesCreativesStore((state) => state.landscapeGameplayVideoFile);
export const usePortraitGameplayVideoFile = () => useCrazyGamesCreativesStore((state) => state.portraitGameplayVideoFile);
export const useCrazyGamesCreativesActions = () => useCrazyGamesCreativesStore((state) => state.actions);

export const isAllCrazyGamesCreativeFilesUploaded = () => useCrazyGamesCreativesStore((state) => {
    const {
        landscapeBannerFile,
        portraitBannerFile,
        squareBannerFile,
        landscapeGameplayVideoFile,
        portraitGameplayVideoFile,
    } = state;

    return (
        landscapeBannerFile !== null &&
        portraitBannerFile !== null &&
        squareBannerFile !== null &&
        landscapeGameplayVideoFile !== null &&
        portraitGameplayVideoFile !== null
    );
})
