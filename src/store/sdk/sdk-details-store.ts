import { create } from "zustand";

type SDKDetailsAction = {
    setCurrentStep: () => void;
    setActiveStep: (activeStep: number) => void;
    isStepCompleted: (step: number) => boolean;
    setCurrentStepWithIndex: (index: number) => void;
    setDataSending: (isDataSending: boolean) => void;
    setGameId: (gameId: string) => void;
    setDisableComponents: (canDisableAllComponents: boolean) => void;
    setCurrentSetupStateId: (currentSetupStateId: string) => void;
    setCurrentGameSetupDetails: (currentGameSetupDetails: string) => void;
    setMobileGameSubmissionDetails: (mobileGameSubmission: string[]) => void;
    setFacebookAdAccountId: (facebookAdAccountId: string) => void;
    resetSDKDetailsData: () => void;
}

type SDKDetailsState = {
    activeStep: number;
    currentStep: number;
    isDataSending: boolean;
    gameId: string;
    facebookAdAccountId: string;
    currentSetupStateId: string;
    currentGameSetupDetails: any;
    mobileGameSubmissionDetails: any[];
    completedSteps: number[];
    canDisableAllComponents: boolean;
    actions: SDKDetailsAction;
}

const initialState = {
    activeStep: 0,
    currentStep: 0,
    canDisableAllComponents: false,
    isDataSending: false,
    gameId: "",
    facebookAdAccountId: '',
    currentSetupStateId: "",
    currentGameSetupDetails: null,
    mobileGameSubmissionDetails: [],
    completedSteps: [],
}

const useSDKDetailsStore = create<SDKDetailsState>((set, get) => ({
    ...initialState,
    actions: {
        setCurrentStep: () => set((state) => ({
            completedSteps: [...state.completedSteps, state.currentStep],
            currentStep: state.currentStep + 1,
            activeStep: state.activeStep + 1,
        })),
        setActiveStep: (activeStep: number) => set({ activeStep }),
        setCurrentStepWithIndex: (index: number) => set((state) => ({ currentStep: index, activeStep: index })),
        setDisableComponents: (canDisableAllComponents: boolean) => set({ canDisableAllComponents }),
        isStepCompleted: (step: number) => get().completedSteps.includes(step),
        setDataSending: (isDataSending: boolean) => set({ isDataSending }),
        setGameId: (gameId: string) => set({ gameId }),
        setCurrentSetupStateId: (currentSetupStateId: string) => set({ currentSetupStateId }),
        setCurrentGameSetupDetails: (currentGameSetupDetails: any) => set({ currentGameSetupDetails }),
        setMobileGameSubmissionDetails: (mobileGameSubmissionDetails: any[]) => set({ mobileGameSubmissionDetails }),
        setFacebookAdAccountId: (facebookAdAccountId: string) => set({ facebookAdAccountId }),
        resetSDKDetailsData: () => set(initialState),
    }
}))

export const useFacebookAppAccountId = () => useSDKDetailsStore((state) => state.facebookAdAccountId);
export const useCurrentGameSetupDetails = () => useSDKDetailsStore((state) => state.currentGameSetupDetails);
export const useActiveStep = () => useSDKDetailsStore((state) => state.activeStep);
export const useDataSending = () => useSDKDetailsStore((state) => state.isDataSending);
export const useCurrentStep = () => useSDKDetailsStore((state) => state.currentStep);
export const useDisableComponents = () => useSDKDetailsStore((state) => state.canDisableAllComponents);
export const useGameId = () => useSDKDetailsStore((state) => state.gameId);
export const useCurrentSetupStateId = () => useSDKDetailsStore((state) => state.currentSetupStateId);
export const useMobileGameSubmissionDetails = () => useSDKDetailsStore((state) => state.mobileGameSubmissionDetails);
export const useSDKDetailActions = () => useSDKDetailsStore((state) => state.actions);

