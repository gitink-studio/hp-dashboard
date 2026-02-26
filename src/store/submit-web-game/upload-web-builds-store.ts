import { create } from "zustand";
import { SINGLE_UNIVERSAL_ZIP } from "../../common/constants";

type UploadWebBuildsAction = {
    setUploadMode: (uploadMode: string) => void;
    setUniversalBuildFile: (universalBuildFile: File | null) => void;
    setMetaBuildFile: (metaBuildFile: File | null) => void;
    setPokiBuildFile: (pokiBuildFile: File | null) => void;
    setMsnBuildFile: (msnBuildFile: File | null) => void;
    setCrazyGamesBuildFile: (crazyGamesBuildFile: File | null) => void;
    resetUploadWebBuildsStore: () => void;
}

type UploadWebBuildsState = {
    uploadMode: string;
    universalBuildFile: File | null;
    metaBuildFile: File | null;
    pokiBuildFile: File | null;
    msnBuildFile: File | null;
    crazyGamesBuildFile: File | null;
    actions: UploadWebBuildsAction;
}

const initialState = {
    uploadMode: SINGLE_UNIVERSAL_ZIP,
    universalBuildFile: null,
    metaBuildFile: null,
    pokiBuildFile: null,
    msnBuildFile: null,
    crazyGamesBuildFile: null,
}

const useUploadWebBuildsStore = create<UploadWebBuildsState>((set) => ({
    ...initialState,
    actions: {
        setUploadMode: (uploadMode: string) => set({ uploadMode }),
        setUniversalBuildFile: (universalBuildFile: File | null) => set({ universalBuildFile }),
        setMetaBuildFile: (metaBuildFile: File | null) => set({ metaBuildFile }),
        setPokiBuildFile: (pokiBuildFile: File | null) => set({ pokiBuildFile }),
        setMsnBuildFile: (msnBuildFile: File | null) => set({ msnBuildFile }),
        setCrazyGamesBuildFile: (crazyGamesBuildFile: File | null) => set({ crazyGamesBuildFile }),
        resetUploadWebBuildsStore: () => set(initialState),
    }
}));

export const useUniversalBuildFile = () => useUploadWebBuildsStore((state) => state.universalBuildFile);
export const useMetaBuildFile = () => useUploadWebBuildsStore((state) => state.metaBuildFile);
export const usePokiBuildFile = () => useUploadWebBuildsStore((state) => state.pokiBuildFile);
export const useMsnBuildFile = () => useUploadWebBuildsStore((state) => state.msnBuildFile);
export const useCrazyGamesBuildFile = () => useUploadWebBuildsStore((state) => state.crazyGamesBuildFile);
export const useUploadMode = () => useUploadWebBuildsStore((state) => state.uploadMode);
export const useUploadWebBuildsActions = () => useUploadWebBuildsStore((state) => state.actions);
