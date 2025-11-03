import { create } from "zustand";

type WebGameSubmissionActions = {
    setWebGameTitle: (gameTitle: string) => void;
    setPlayableLink: (playableLink: string) => void;
    setControlsDescription: (controlsDescription: string) => void;
    setAdditionalNotes: (additionalNotes: string) => void;
    setShortGameplayVideoName: (shortGameplayVideoName: string) => void;
    setValidateInputs: (validateWebGameSubmissionInputs: boolean) => void;
    resetWebGameSubmissionStore: () => void;
}

type WebGameSubmissionState = {
    webGameTitle: string;
    playableLink: string;
    controlsDescription: string;
    additionalNotes: string;
    shortGameplayVideoName: string;
    validateWebGameSubmissionInputs: boolean;
    actions: WebGameSubmissionActions;
}

const initialState = {
    webGameTitle: '',
    playableLink: '',
    controlsDescription: '',
    additionalNotes: '',
    shortGameplayVideoName: '',
    validateWebGameSubmissionInputs: false,
}

const useWebGameSubmissionStore = create<WebGameSubmissionState>((set) => ({
    ...initialState,
    actions: {
        setWebGameTitle: (gameTitle: string) => set({ webGameTitle: gameTitle }),
        setPlayableLink: (playableLink: string) => set({ playableLink }),
        setControlsDescription: (controlsDescription: string) => set({ controlsDescription }),
        setAdditionalNotes: (additionalNotes: string) => set({ additionalNotes }),
        setShortGameplayVideoName: (shortGameplayVideoName: string) => set({ shortGameplayVideoName }),
        setValidateInputs: (validateWebGameSubmissionInputs: boolean) => set({ validateWebGameSubmissionInputs }),
        resetWebGameSubmissionStore: () => set(initialState),
    }
}))

export const useWebGameTitle = () => useWebGameSubmissionStore((state) => state.webGameTitle);
export const usePlayableLink = () => useWebGameSubmissionStore((state) => state.playableLink);
export const useControlsDescription = () => useWebGameSubmissionStore((state) => state.controlsDescription);
export const useAdditionalNotes = () => useWebGameSubmissionStore((state) => state.additionalNotes);
export const useShortGameplayVideoName = () => useWebGameSubmissionStore((state) => state.shortGameplayVideoName);
export const useValidateWebGameSubmissionInputs = () => useWebGameSubmissionStore((state) => state.validateWebGameSubmissionInputs);
export const useWebGameSubmissionActions = () => useWebGameSubmissionStore((state) => state.actions);