import { create } from "zustand";

type SDKIntegrationAction = {
    setCopied: (copied: boolean) => void;
    setShowPassword: (showPassword: boolean) => void;
    setPreRequirementsCompleted: (isPreRequirementsCompleted: boolean) => void;
    setStep1Completed: (isStep1Completed: boolean) => void;
    setStep2Completed: (isStep2Completed: boolean) => void;
    resetSDKIntegrationData: () => void;
}

type SDKIntegrationState = {
    isPreRequirementsCompleted: boolean
    isStep1Completed: boolean
    isStep2Completed: boolean
    copied: boolean
    showPassword: boolean
    actions: SDKIntegrationAction
}

const initialState = {
    isPreRequirementsCompleted: false,
    isStep1Completed: false,
    isStep2Completed: false,
    copied: false,
    showPassword: false,
}

const useSDKIntegrationStore = create<SDKIntegrationState>((set) => ({
    ...initialState,
    actions: {
        setCopied: (copied: boolean) => set({ copied }),
        setShowPassword: (showPassword: boolean) => set({ showPassword }),
        setPreRequirementsCompleted: (isPreRequirementsCompleted: boolean) => set({ isPreRequirementsCompleted }),
        setStep1Completed: (isStep1Completed: boolean) => set({ isStep1Completed }),
        setStep2Completed: (isStep2Completed: boolean) => set({ isStep2Completed }),
        resetSDKIntegrationData: () => set(initialState),
    }
}))

export const usePreRequirementsCompleted = () => useSDKIntegrationStore((state) => state.isPreRequirementsCompleted);
export const useStep1Completed = () => useSDKIntegrationStore((state) => state.isStep1Completed);
export const useStep2Completed = () => useSDKIntegrationStore((state) => state.isStep2Completed);
export const useCopied = () => useSDKIntegrationStore((state) => state.copied);
export const useShowPassword = () => useSDKIntegrationStore((state) => state.showPassword);
export const useSDKIntegrationActions = () => useSDKIntegrationStore((state) => state.actions);

