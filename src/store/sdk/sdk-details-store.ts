import { create } from "zustand";

type SDKDetailsAction = {
    setCurrentStep: () => void;
    setActiveStep: (activeStep: number) => void;
    isStepCompleted: (step: number) => boolean;
    setDataSending: (isDataSending: boolean) => void;
    setGameId: (gameId: string) => void;
    setDisableComponents: (canDisableAllComponents: boolean) => void;
    setCurrentSetupStateId: (currentSetupStateId: string) => void;
}

type SDKDetailsState = {
    activeStep: number;
    currentStep: number;
    isDataSending: boolean;
    gameId: string;
    currentSetupStateId: string;
    completedSteps: number[];
    canDisableAllComponents: boolean;
    actions: SDKDetailsAction;
}

const useSDKDetailsStore = create<SDKDetailsState>((set, get) => ({
    activeStep: 0,
    currentStep: 0,
    canDisableAllComponents: false,
    isDataSending: false,
    gameId: "",
    currentSetupStateId: "",
    completedSteps: [],
    actions: {
        setCurrentStep: () => set((state) => ({
            completedSteps: [...state.completedSteps, state.currentStep],
            currentStep: state.currentStep + 1,
            activeStep: state.activeStep + 1,
        })),
        setActiveStep: (activeStep: number) => set({ activeStep }),
        setDisableComponents: (canDisableAllComponents: boolean) => set({ canDisableAllComponents }),
        isStepCompleted: (step: number) => get().completedSteps.includes(step),
        setDataSending: (isDataSending: boolean) => set({ isDataSending }),
        setGameId: (gameId: string) => set({ gameId }),
        setCurrentSetupStateId: (currentSetupStateId: string) => set({ currentSetupStateId }),
    }
}))

export const useActiveStep = () => useSDKDetailsStore((state) => state.activeStep);
export const useDataSending = () => useSDKDetailsStore((state) => state.isDataSending);
export const useCurrentStep = () => useSDKDetailsStore((state) => state.currentStep);
export const useDisableComponents = () => useSDKDetailsStore((state) => state.canDisableAllComponents);
export const useGameId = () => useSDKDetailsStore((state) => state.gameId);
export const useCurrentSetupStateId = () => useSDKDetailsStore((state) => state.currentSetupStateId);
export const useSDKDetailActions = () => useSDKDetailsStore((state) => state.actions);

