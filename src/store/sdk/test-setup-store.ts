import { create } from "zustand";

type CreativeLibraryAction = {
    setDisplayCreativeLibrary: (canDisplayCreativeLibrary: boolean) => void;
    setVideoFiles: (videoFiles: File[]) => void;
    resetTestSetupData: () => void;
}

type CreativeLibraryState = {
    canDisplayCreativeLibrary: boolean;
    videoFiles: File[];
    actions: CreativeLibraryAction;
}

const initialState = {
    canDisplayCreativeLibrary: false,
    videoFiles: [],
}

const useCreativeLibraryStore = create<CreativeLibraryState>((set) => ({
    ...initialState,
    actions: {
        setVideoFiles: (videoFiles: File[]) => set({ videoFiles }),
        setDisplayCreativeLibrary: (canDisplayCreativeLibrary: boolean) => set({ canDisplayCreativeLibrary }),
        resetTestSetupData: () => set(initialState),
    }
}))

export const useDisplayCreativeLibrary = () => useCreativeLibraryStore((state) => state.canDisplayCreativeLibrary);
export const useVideoFiles = () => useCreativeLibraryStore((state) => state.videoFiles);
export const useTestSetupActions = () => useCreativeLibraryStore((state) => state.actions);

