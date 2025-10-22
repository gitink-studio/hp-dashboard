import { create } from "zustand";

type CreativeLibraryAction = {
    setDisplayCreativeLibrary: (canDisplayCreativeLibrary: boolean) => void;
    setVideoFileUrls: (videoFileUrls: string[]) => void;
}

type CreativeLibraryState = {
    canDisplayCreativeLibrary: boolean;
    videoFileUrls: string[];
    actions: CreativeLibraryAction;
}

const useCreativeLibraryStore = create<CreativeLibraryState>((set) => ({
    canDisplayCreativeLibrary: false,
    videoFileUrls: [],
    actions: {
        setVideoFileUrls: (videoFileUrls: string[]) => set({ videoFileUrls }),
        setDisplayCreativeLibrary: (canDisplayCreativeLibrary: boolean) => set({ canDisplayCreativeLibrary }),
    }
}))

export const useDisplayCreativeLibrary = () => useCreativeLibraryStore((state) => state.canDisplayCreativeLibrary);
export const useVideoFileUrls = () => useCreativeLibraryStore((state) => state.videoFileUrls);
export const useTestSetupActions = () => useCreativeLibraryStore((state) => state.actions);

