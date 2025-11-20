import { create } from "zustand";

type PokiCreativesAction = {
    setSmallIconFile: (smallIconFile: File | null) => void;
    setLargeIconFile: (largeIconFile: File | null) => void;
    setSmallScreenshotFile: (smallScreenshotFile: File | null) => void;
    setLargeScreenshotFile: (largeScreenshotFile: File | null) => void;
    getAllPokiCreatives: () => any;
    resetPokiCreativesStore: () => void;
}

type PokiCreativesState = {
    smallIconFile: File | null;
    largeIconFile: File | null;
    smallScreenshotFile: File | null;
    largeScreenshotFile: File | null;
    actions: PokiCreativesAction;
}

const initialState = {
    smallIconFile: null,
    largeIconFile: null,
    smallScreenshotFile: null,
    largeScreenshotFile: null,
    portraitGameplayVideoFile: null,
}

const usePokiCreativesStore = create<PokiCreativesState>((set, get) => ({
    ...initialState,
    actions: {
        setSmallIconFile: (smallIconFile: File | null) => set({ smallIconFile }),
        setLargeIconFile: (largeIconFile: File | null) => set({ largeIconFile }),
        setSmallScreenshotFile: (smallScreenshotFile: File | null) => set({ smallScreenshotFile }),
        setLargeScreenshotFile: (largeScreenshotFile: File | null) => set({ largeScreenshotFile }),
        resetPokiCreativesStore: () => set(initialState),

        getAllPokiCreatives: () => {
            let files = [];
            let state = get();

            files.push(state.smallIconFile);
            files.push(state.largeIconFile);
            files.push(state.smallScreenshotFile);
            files.push(state.largeScreenshotFile);

            return files;
        },

    }
}));

export const useSmallIconFile = () => usePokiCreativesStore((state) => state.smallIconFile);
export const useLargeIconFile = () => usePokiCreativesStore((state) => state.largeIconFile);
export const useSmallScreenshotFile = () => usePokiCreativesStore((state) => state.smallScreenshotFile);
export const useLargeScreenshotFile = () => usePokiCreativesStore((state) => state.largeScreenshotFile);
export const usePokiCreativesActions = () => usePokiCreativesStore((state) => state.actions);

export const isAllPokiCreativeFilesUploaded = () => usePokiCreativesStore((state) => {
    const {
        smallIconFile,
        largeIconFile,
        smallScreenshotFile,
        largeScreenshotFile,
    } = state;

    return (
        smallIconFile !== null &&
        largeIconFile !== null &&
        smallScreenshotFile !== null &&
        largeScreenshotFile !== null
    );
});


