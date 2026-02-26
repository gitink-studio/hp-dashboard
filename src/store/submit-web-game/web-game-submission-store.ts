import { create } from "zustand";

type WebGameSubmissionActions = {
    setWebGameTitle: (gameTitle: string) => void;
    setPlayableLink: (playableLink: string) => void;
    setControlsDescription: (controlsDescription: string) => void;
    setAdditionalNotes: (additionalNotes: string) => void;
    setShortGameplayVideoFile: (shortGameplayVideoFile: File | null) => void;
    setValidateInputs: (validateWebGameSubmissionInputs: boolean) => void;
    resetWebGameSubmissionStore: () => void;
}

type WebGameSubmissionState = {
    webGameTitle: string;
    playableLink: string;
    controlsDescription: string;
    additionalNotes: string;
    shortGameplayVideoFile: File | null;
    validateWebGameSubmissionInputs: boolean;
    actions: WebGameSubmissionActions;
}

const initialState = {
    webGameTitle: '',
    playableLink: '',
    controlsDescription: '',
    additionalNotes: '',
    shortGameplayVideoFile: null,
    validateWebGameSubmissionInputs: false,
}

const useWebGameSubmissionStore = create<WebGameSubmissionState>((set) => ({
    ...initialState,
    actions: {
        setWebGameTitle: (gameTitle: string) => set({ webGameTitle: gameTitle }),
        setPlayableLink: (playableLink: string) => set({ playableLink }),
        setControlsDescription: (controlsDescription: string) => set({ controlsDescription }),
        setAdditionalNotes: (additionalNotes: string) => set({ additionalNotes }),
        setShortGameplayVideoFile: (shortGameplayVideoFile: File | null) => set({ shortGameplayVideoFile }),
        setValidateInputs: (validateWebGameSubmissionInputs: boolean) => set({ validateWebGameSubmissionInputs }),
        resetWebGameSubmissionStore: () => set(initialState),
    }
}))

export const useWebGameTitle = () => useWebGameSubmissionStore((state) => state.webGameTitle);
export const usePlayableLink = () => useWebGameSubmissionStore((state) => state.playableLink);
export const useControlsDescription = () => useWebGameSubmissionStore((state) => state.controlsDescription);
export const useAdditionalNotes = () => useWebGameSubmissionStore((state) => state.additionalNotes);
export const useShortGameplayVideoFile = () => useWebGameSubmissionStore((state) => state.shortGameplayVideoFile);
export const useValidateWebGameSubmissionInputs = () => useWebGameSubmissionStore((state) => state.validateWebGameSubmissionInputs);
export const useWebGameSubmissionActions = () => useWebGameSubmissionStore((state) => state.actions);
