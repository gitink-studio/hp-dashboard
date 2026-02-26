import { create } from "zustand";

type MetaCreativesAction = {
    setLargeAppIconFile: (largeAppIconFile: File | null) => void;
    setSmallAppIconFile: (smallAppIconFile: File | null) => void;
    setSmallLandscapeBannerImageFile: (smallLandscapeBannerImageFile: File | null) => void;
    setLargeLandscapeBannerImageFile: (largeLandscapeBannerImageFile: File | null) => void;
    setPortraitBannerImageFile: (portraitBannerImageFile: File | null) => void;
    setSquareBannerImageFile: (squareBannerImageFile: File | null) => void;
    setCoverImageFile: (coverImageFile: File | null) => void;
    setLandscapeSplashImageFile: (landscapeSplashImageFile: File | null) => void;
    setPortraitSplashImageFile: (portraitSplashImageFile: File | null) => void;

    setGameplayLandscapeVideoFile: (gameplayLandscapeVideoFile: File | null) => void;
    setGameplayPortraitVideoFile: (gameplayPortraitVideoFile: File | null) => void;
    setGameplaySquareVideoFile: (gameplaySquareVideoFile: File | null) => void;

    getAllMetaCreatives: () => any;
    resetMetaCreativesStore: () => void;
}

type MetaCreativesState = {
    smallAppIconFile: File | null;
    largeAppIconFile: File | null;
    smallLandscapeBannerImageFile: File | null;
    largeLandscapeBannerImageFile: File | null;
    portraitBannerImageFile: File | null;
    squareBannerImageFile: File | null;
    coverImageFile: File | null;
    landscapeSplashImageFile: File | null;
    portraitSplashImageFile: File | null;

    gameplayLandscapeVideoFile: File | null;
    gameplayPortraitVideoFile: File | null;
    gameplaySquareVideoFile: File | null;
    actions: MetaCreativesAction;
}

const initialState = {
    largeAppIconFile: null,
    smallAppIconFile: null,
    smallLandscapeBannerImageFile: null,
    largeLandscapeBannerImageFile: null,
    portraitBannerImageFile: null,
    squareBannerImageFile: null,
    coverImageFile: null,
    landscapeSplashImageFile: null,
    portraitSplashImageFile: null,

    gameplayLandscapeVideoFile: null,
    gameplayPortraitVideoFile: null,
    gameplaySquareVideoFile: null,
}

const useMetaCreativesStore = create<MetaCreativesState>((set, get) => ({
    ...initialState,
    actions: {
        setLargeAppIconFile: (largeAppIconFile: File | null) => set({ largeAppIconFile: largeAppIconFile }),
        setSmallAppIconFile: (smallAppIconFile: File | null) => set({ smallAppIconFile }),
        setSmallLandscapeBannerImageFile: (smallLandscapeBannerImageFile: File | null) => set({ smallLandscapeBannerImageFile }),
        setLargeLandscapeBannerImageFile: (largeLandscapeBannerImageFile: File | null) => set({ largeLandscapeBannerImageFile }),
        setPortraitBannerImageFile: (portraitBannerImageFile: File | null) => set({ portraitBannerImageFile }),
        setSquareBannerImageFile: (squareBannerImageFile: File | null) => set({ squareBannerImageFile }),
        setCoverImageFile: (coverImageFile: File | null) => set({ coverImageFile }),
        setLandscapeSplashImageFile: (landscapeSplashImageFile: File | null) => set({ landscapeSplashImageFile }),
        setPortraitSplashImageFile: (portraitSplashImageFile: File | null) => set({ portraitSplashImageFile }),

        setGameplayLandscapeVideoFile: (gameplayLandscapeVideoFile: File | null) => set({ gameplayLandscapeVideoFile }),
        setGameplayPortraitVideoFile: (gameplayPortraitVideoFile: File | null) => set({ gameplayPortraitVideoFile }),
        setGameplaySquareVideoFile: (gameplaySquareVideoFile: File | null) => set({ gameplaySquareVideoFile }),
        resetMetaCreativesStore: () => set(initialState),
        getAllMetaCreatives: () => {
            let files = [];
            let state = get();

            files.push(state.smallAppIconFile);
            files.push(state.largeAppIconFile);
            files.push(state.smallLandscapeBannerImageFile);
            files.push(state.largeLandscapeBannerImageFile);
            files.push(state.portraitBannerImageFile);
            files.push(state.squareBannerImageFile);
            files.push(state.coverImageFile);
            files.push(state.landscapeSplashImageFile);
            files.push(state.portraitSplashImageFile);
            files.push(state.gameplayLandscapeVideoFile);
            files.push(state.gameplayPortraitVideoFile);
            files.push(state.gameplaySquareVideoFile);

            return files;
        },
    }
}));

export const useLargeAppIconFile = () => useMetaCreativesStore((state) => state.largeAppIconFile);
export const useSmallAppIconFile = () => useMetaCreativesStore((state) => state.smallAppIconFile);
export const useSmallLandscapeBannerImageFile = () => useMetaCreativesStore((state) => state.smallLandscapeBannerImageFile);
export const useLargeLandscapeBannerImageFile = () => useMetaCreativesStore((state) => state.largeLandscapeBannerImageFile);
export const usePortraitBannerImageFile = () => useMetaCreativesStore((state) => state.portraitBannerImageFile);
export const useSquareBannerImageFile = () => useMetaCreativesStore((state) => state.squareBannerImageFile);
export const useCoverImageFile = () => useMetaCreativesStore((state) => state.coverImageFile);
export const useLandscapeSplashImageFile = () => useMetaCreativesStore((state) => state.landscapeSplashImageFile);
export const usePortraitSplashImageFile = () => useMetaCreativesStore((state) => state.portraitSplashImageFile);

export const useGameplayLandscapeVideoFile = () => useMetaCreativesStore((state) => state.gameplayLandscapeVideoFile);
export const useGameplayPortraitVideoFile = () => useMetaCreativesStore((state) => state.gameplayPortraitVideoFile);
export const useGameplaySquareVideoFile = () => useMetaCreativesStore((state) => state.gameplaySquareVideoFile);

export const useMetaCreativesActions = () => useMetaCreativesStore((state) => state.actions);

export const isAllMetaCreativeFilesUploaded = () => useMetaCreativesStore((state) => {
    const {
        smallAppIconFile,
        largeAppIconFile,
        smallLandscapeBannerImageFile,
        largeLandscapeBannerImageFile,
        portraitBannerImageFile,
        squareBannerImageFile,
        coverImageFile,
        landscapeSplashImageFile,
        portraitSplashImageFile,
        gameplayLandscapeVideoFile,
        gameplayPortraitVideoFile,
        gameplaySquareVideoFile
    } = state;

    return (
        smallAppIconFile !== null &&
        largeAppIconFile !== null &&
        smallLandscapeBannerImageFile !== null &&
        largeLandscapeBannerImageFile !== null &&
        portraitBannerImageFile !== null &&
        squareBannerImageFile !== null &&
        coverImageFile !== null &&
        landscapeSplashImageFile !== null &&
        portraitSplashImageFile !== null &&
        gameplayLandscapeVideoFile !== null &&
        gameplayPortraitVideoFile !== null &&
        gameplaySquareVideoFile
    );
})

