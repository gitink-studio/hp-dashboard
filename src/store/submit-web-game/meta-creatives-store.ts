import { create } from "zustand";

type MetaCreativesAction = {
    setLargeAppIconName: (largeAppIconName: string) => void;
    setSmallAppIconName: (smallAppIconName: string) => void;
    setBannerImageName: (bannerImageName: string) => void;
    setLargeLandscapeBannerImageName: (largeLandscapeBannerImageName: string) => void;
    setPortraitBannerImageName: (portraitBannerImageName: string) => void;
    setSquareBannerImageName: (squareBannerImageName: string) => void;
    setCoverImageName: (coverImageName: string) => void;
    setLandscapeSplashImageName: (landscapeSplashImageName: string) => void;
    setPortraitSplashImageName: (portraitSplashImageName: string) => void;

    setSmallPreviewAppIconName: (smallPreviewAppIconName: string) => void;
    setLargePreviewAppIconName: (largePreviewAppIconName: string) => void;
    setBannerPreviewImageName: (bannerPreviewImageName: string) => void;
    setLargeLandscapeBannerPreviewImageName: (largeLandscapeBannerPreviewImageName: string) => void;
    setPortraitBannerPreviewImageName: (portraitBannerPreviewImageName: string) => void;
    setSquareBannerPreviewImageName: (squareBannerPreviewImageName: string) => void;
    setCoverPreviewImageName: (coverPreviewImageName: string) => void;
    setLandscapeSplashPreviewImageName: (landscapeSplashPreviewImageName: string) => void;
    setPortraitSplashPreviewImageName: (portraitSplashPreviewImageName: string) => void;

    setGamePreviewLandscapeVideoName: (gamePreviewLandscapeVideoName: string) => void;
    setGamePreviewPortraitVideoName: (gamePreviewPortraitVideoName: string) => void;
    setGamePreviewSquareVideoName: (gamePreviewSquareVideoName: string) => void;
    setGamePlayLandscapeVideoName: (gamePlayLandscapeVideoName: string) => void;
    setGamePlayPortraitVideoName: (gamePlayPortraitVideoName: string) => void;
    setGamePlaySquareVideoName: (gamePlaySquareVideoName: string) => void;
    resetMetaCreativesStore: () => void;
}

type MetaCreativesState = {
    smallAppIconName: string;
    largeAppIconName: string;
    bannerImageName: string;
    largeLandscapeBannerImageName: string;
    portraitBannerImageName: string;
    squareBannerImageName: string;
    coverImageName: string;
    landscapeSplashImageName: string;
    portraitSplashImageName: string;

    smallPreviewAppIconName: string;
    largePreviewAppIconName: string;
    bannerPreviewImageName: string;
    largeLandscapeBannerPreviewImageName: string;
    portraitBannerPreviewImageName: string;
    squareBannerPreviewImageName: string;
    coverPreviewImageName: string;
    landscapeSplashPreviewImageName: string;
    portraitSplashPreviewImageName: string;

    gamePreviewLandscapeVideoName: string;
    gamePreviewPortraitVideoName: string;
    gamePreviewSquareVideoName: string;
    gamePlayLandscapeVideoName: string;
    gamePlayPortraitVideoName: string;
    gamePlaySquareVideoName: string;
    actions: MetaCreativesAction;
}

const initialState = {
    largeAppIconName: "",
    smallAppIconName: "",
    bannerImageName: "",
    largeLandscapeBannerImageName: "",
    portraitBannerImageName: "",
    squareBannerImageName: "",
    coverImageName: "",
    landscapeSplashImageName: "",
    portraitSplashImageName: "",

    smallPreviewAppIconName: "",
    largePreviewAppIconName: "",
    bannerPreviewImageName: "",
    largeLandscapeBannerPreviewImageName: "",
    portraitBannerPreviewImageName: "",
    squareBannerPreviewImageName: "",
    coverPreviewImageName: "",
    landscapeSplashPreviewImageName: "",
    portraitSplashPreviewImageName: "",

    gamePreviewLandscapeVideoName: "",
    gamePreviewPortraitVideoName: "",
    gamePreviewSquareVideoName: "",
    gamePlayLandscapeVideoName: "",
    gamePlayPortraitVideoName: "",
    gamePlaySquareVideoName: "",
}

const useMetaCreativesStore = create<MetaCreativesState>((set) => ({
    ...initialState,
    actions: {
        setLargeAppIconName: (largeAppIconName: string) => set({ largeAppIconName: largeAppIconName }),
        setSmallAppIconName: (smallAppIconName: string) => set({ smallAppIconName }),
        setBannerImageName: (bannerImageName: string) => set({ bannerImageName }),
        setLargeLandscapeBannerImageName: (largeLandscapeBannerImageName: string) => set({ largeLandscapeBannerImageName }),
        setPortraitBannerImageName: (portraitBannerImageName: string) => set({ portraitBannerImageName }),
        setSquareBannerImageName: (squareBannerImageName: string) => set({ squareBannerImageName }),
        setCoverImageName: (coverImageName: string) => set({ coverImageName }),
        setLandscapeSplashImageName: (landscapeSplashImageName: string) => set({ landscapeSplashImageName }),


        setSmallPreviewAppIconName: (smallPreviewAppIconName: string) => set({ smallPreviewAppIconName }),
        setLargePreviewAppIconName: (largePreviewAppIconName: string) => set({ largePreviewAppIconName }),
        setBannerPreviewImageName: (bannerPreviewImageName: string) => set({ bannerPreviewImageName }),
        setLargeLandscapeBannerPreviewImageName: (largeLandscapeBannerPreviewImageName: string) => set({ largeLandscapeBannerPreviewImageName }),
        setPortraitBannerPreviewImageName: (portraitBannerPreviewImageName: string) => set({ portraitBannerPreviewImageName }),
        setSquareBannerPreviewImageName: (squareBannerPreviewImageName: string) => set({ squareBannerPreviewImageName }),
        setCoverPreviewImageName: (coverPreviewImageName: string) => set({ coverPreviewImageName }),
        setLandscapeSplashPreviewImageName: (landscapeSplashPreviewImageName: string) => set({ landscapeSplashPreviewImageName }),
        setPortraitSplashPreviewImageName: (portraitSplashPreviewImageName: string) => set({ portraitSplashPreviewImageName }),

        setPortraitSplashImageName: (portraitSplashImageName: string) => set({ portraitSplashImageName }),
        setGamePreviewLandscapeVideoName: (gamePreviewLandscapeVideoName: string) => set({ gamePreviewLandscapeVideoName }),
        setGamePreviewPortraitVideoName: (gamePreviewPortraitVideoName: string) => set({ gamePreviewPortraitVideoName }),
        setGamePreviewSquareVideoName: (gamePreviewSquareVideoName: string) => set({ gamePreviewSquareVideoName }),
        setGamePlayLandscapeVideoName: (gamePlayLandscapeVideoName: string) => set({ gamePlayLandscapeVideoName }),
        setGamePlayPortraitVideoName: (gamePlayPortraitVideoName: string) => set({ gamePlayPortraitVideoName }),
        setGamePlaySquareVideoName: (gamePlaySquareVideoName: string) => set({ gamePlaySquareVideoName }),
        resetMetaCreativesStore: () => set(initialState),
    }
}));

export const useLargeAppIconName = () => useMetaCreativesStore((state) => state.largeAppIconName);
export const useSmallAppIconName = () => useMetaCreativesStore((state) => state.smallAppIconName);
export const useBannerImageName = () => useMetaCreativesStore((state) => state.bannerImageName);
export const useLargeLandscapeBannerImageName = () => useMetaCreativesStore((state) => state.largeLandscapeBannerImageName);
export const usePortraitBannerImageName = () => useMetaCreativesStore((state) => state.portraitBannerImageName);
export const useSquareBannerImageName = () => useMetaCreativesStore((state) => state.squareBannerImageName);
export const useCoverImageName = () => useMetaCreativesStore((state) => state.coverImageName);
export const useLandscapeSplashImageName = () => useMetaCreativesStore((state) => state.landscapeSplashImageName);
export const usePortraitSplashImageName = () => useMetaCreativesStore((state) => state.portraitSplashImageName);

export const useSmallPreviewAppIconName = () => useMetaCreativesStore((state) => state.smallPreviewAppIconName);
export const useLargePreviewAppIconName = () => useMetaCreativesStore((state) => state.largePreviewAppIconName);
export const useBannerPreviewImageName = () => useMetaCreativesStore((state) => state.bannerPreviewImageName);
export const useLargeLandscapeBannerPreviewImageName = () => useMetaCreativesStore((state) => state.largeLandscapeBannerPreviewImageName);
export const usePortraitBannerPreviewImageName = () => useMetaCreativesStore((state) => state.portraitBannerPreviewImageName);
export const useSquareBannerPreviewImageName = () => useMetaCreativesStore((state) => state.squareBannerPreviewImageName);
export const useCoverPreviewImageName = () => useMetaCreativesStore((state) => state.coverPreviewImageName);
export const useLandscapeSplashPreviewImageName = () => useMetaCreativesStore((state) => state.landscapeSplashPreviewImageName);
export const usePortraitSplashPreviewImageName = () => useMetaCreativesStore((state) => state.portraitSplashPreviewImageName);

export const useGamePreviewLandscapeVideoName = () => useMetaCreativesStore((state) => state.gamePreviewLandscapeVideoName);
export const useGamePreviewPortraitVideoName = () => useMetaCreativesStore((state) => state.gamePreviewPortraitVideoName);
export const useGamePreviewSquareVideoName = () => useMetaCreativesStore((state) => state.gamePreviewSquareVideoName);
export const useGamePlayLandscapeVideoName = () => useMetaCreativesStore((state) => state.gamePlayLandscapeVideoName);
export const useGamePlayPortraitVideoName = () => useMetaCreativesStore((state) => state.gamePlayPortraitVideoName);
export const useGamePlaySquareVideoName = () => useMetaCreativesStore((state) => state.gamePlaySquareVideoName);
export const useMetaCreativesActions = () => useMetaCreativesStore((state) => state.actions);