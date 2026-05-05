import { create } from "zustand";

type MobileGameSubmissionAction = {
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

type MobileGameSubmissionState = {
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
    actions: MobileGameSubmissionAction;
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

const useMobileGameSubmissionStore = create<MobileGameSubmissionState>((set, get) => ({
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

export const useFacebookAppAccountId = () => useMobileGameSubmissionStore((state) => state.facebookAdAccountId);
export const useCurrentGameSetupDetails = () => useMobileGameSubmissionStore((state) => state.currentGameSetupDetails);
export const useActiveStep = () => useMobileGameSubmissionStore((state) => state.activeStep);
export const useDataSending = () => useMobileGameSubmissionStore((state) => state.isDataSending);
export const useCurrentStep = () => useMobileGameSubmissionStore((state) => state.currentStep);
export const useDisableComponents = () => useMobileGameSubmissionStore((state) => state.canDisableAllComponents);
export const useGameId = () => useMobileGameSubmissionStore((state) => state.gameId);
export const useCurrentSetupStateId = () => useMobileGameSubmissionStore((state) => state.currentSetupStateId);
export const useMobileGameSubmission = () => useMobileGameSubmissionStore((state) => state.mobileGameSubmissionDetails);
export const useMobileGameSubmissionActions = () => useMobileGameSubmissionStore((state) => state.actions);

