import { create } from "zustand";

type UploadWebBuildsAction = {
    setUploadMode: (uploadMode: string) => void;
    setUniversalBuildName: (universalBuildName: string) => void;
    setMetaBuildName: (metaBuildName: string) => void;
    setPokiBuildName: (pokiBuildName: string) => void;
    setMsnBuildName: (msnBuildName: string) => void;
    setCrazyGamesBuildName: (crazyGamesBuildName: string) => void;
    resetUploadWebBuildsStore: () => void;
}

type UploadWebBuildsState = {
    uploadMode: string;
    universalBuildName: string;
    metaBuildName: string;
    pokiBuildName: string;
    msnBuildName: string;
    crazyGamesBuildName: string;
    actions: UploadWebBuildsAction;
}

const initialState = {
    uploadMode: "Single universal ZIP",
    universalBuildName: "",
    metaBuildName: "",
    pokiBuildName: "",
    msnBuildName: "",
    crazyGamesBuildName: "",
}

const useUploadWebBuildsStore = create<UploadWebBuildsState>((set) => ({
    ...initialState,
    actions: {
        setUploadMode: (uploadMode: string) => set({ uploadMode }),
        setUniversalBuildName: (universalBuildName: string) => set({ universalBuildName }),
        setMetaBuildName: (metaBuildName: string) => set({ metaBuildName }),
        setPokiBuildName: (pokiBuildName: string) => set({ pokiBuildName }),
        setMsnBuildName: (msnBuildName: string) => set({ msnBuildName }),
        setCrazyGamesBuildName: (crazyGamesBuildName: string) => set({ crazyGamesBuildName }),
        resetUploadWebBuildsStore: () => set(initialState),
    }
}));

export const useUniversalBuildName = () => useUploadWebBuildsStore((state) => state.universalBuildName);
export const useMetaBuildName = () => useUploadWebBuildsStore((state) => state.metaBuildName);
export const usePokiBuildName = () => useUploadWebBuildsStore((state) => state.pokiBuildName);
export const useMsnBuildName = () => useUploadWebBuildsStore((state) => state.msnBuildName);
export const useCrazyGamesBuildName = () => useUploadWebBuildsStore((state) => state.crazyGamesBuildName);
export const useUploadMode = () => useUploadWebBuildsStore((state) => state.uploadMode);
export const useUploadWebBuildsActions = () => useUploadWebBuildsStore((state) => state.actions);