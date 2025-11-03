import { create } from "zustand";

type SubmitWebGameAction = {
    setCurrentStep: () => void;
    setCurrentStepWithIndex: (index: number) => void;
    setActiveStep: (activeStep: number) => void;
    isStepCompleted: (step: number) => boolean;
    setDataSending: (isDataSending: boolean) => void;
    setWebGameId: (gameId: string) => void;
    setDisableComponents: (canDisableAllComponents: boolean) => void;
    setCurrentSetupStateId: (currentSetupStateId: string) => void;
    setWebGameSubmissionDetails: (webGameSubmissionDetails: any[]) => void;
    setCurrentSetupGameDetails: (currentSetupGameDetails: any) => void;
    resetSubmitWebGameStore: () => void;
}

type SubmitWebGameState = {
    activeStep: number;
    currentStep: number;
    isDataSending: boolean;
    webGameId: string;
    currentSetupStateId: string;
    completedSteps: number[];
    canDisableAllComponents: boolean;
    webGameSubmissionDetails: any[];
    currentSetupGameDetails: any;
    actions: SubmitWebGameAction;
}

const initialState = {
    activeStep: 0,
    currentStep: 0,
    canDisableAllComponents: false,
    isDataSending: false,
    webGameId: "",
    currentSetupStateId: "",
    completedSteps: [],
    webGameSubmissionDetails: [],
    currentSetupGameDetails: "",
}

const useSubmitWebGameStore = create<SubmitWebGameState>((set, get) => ({
    ...initialState,
    actions: {
        setCurrentStep: () => set((state) => ({
            completedSteps: [...state.completedSteps, state.currentStep],
            currentStep: state.currentStep + 1,
            activeStep: state.activeStep + 1,
        })),
        setCurrentStepWithIndex: (index: number) => set((state) => ({ currentStep: index, activeStep: index })),
        setActiveStep: (activeStep: number) => set({ activeStep }),
        setDisableComponents: (canDisableAllComponents: boolean) => set({ canDisableAllComponents }),
        isStepCompleted: (step: number) => get().completedSteps.includes(step),
        setDataSending: (isDataSending: boolean) => set({ isDataSending }),
        setWebGameId: (gameId: string) => set({ webGameId: gameId }),
        setCurrentSetupStateId: (currentSetupStateId: string) => set({ currentSetupStateId }),
        setWebGameSubmissionDetails: (webGameSubmissionDetails: any[]) => set({ webGameSubmissionDetails }),
        setCurrentSetupGameDetails: (currentSetupGameDetails: any) => set({ currentSetupGameDetails }),
        resetSubmitWebGameStore: () => set(initialState),
    }
}))

export const useActiveStep = () => useSubmitWebGameStore((state) => state.activeStep);
export const useCurrentSetupGameDetails = () => useSubmitWebGameStore((state) => state.currentSetupGameDetails);
export const useDataSending = () => useSubmitWebGameStore((state) => state.isDataSending);
export const useCurrentStep = () => useSubmitWebGameStore((state) => state.currentStep);
export const useDisableComponents = () => useSubmitWebGameStore((state) => state.canDisableAllComponents);
export const useGameId = () => useSubmitWebGameStore((state) => state.webGameId);
export const useCurrentSetupStateId = () => useSubmitWebGameStore((state) => state.currentSetupStateId);
export const useWebGameSubmissionDetails = () => useSubmitWebGameStore((state) => state.webGameSubmissionDetails);
export const useSubmitWebGameActions = () => useSubmitWebGameStore((state) => state.actions);

