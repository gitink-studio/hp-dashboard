import { create } from "zustand";

const progressValue = Math.floor(100 / 3);

const setProgressValue = (canAddProgressValue: boolean, progress: number): number => {
    let value = canAddProgressValue ? progress + progressValue : (progress === 100 ? progress - (progressValue + 1) : progress - progressValue);

    if (value > 90) value = 100;

    return value;
}

type FacebookSetupAction = {
    setNewAppStepCompleted: (isNewAppStepCompleted: boolean) => void;
    setBasicAppStepCompleted: (isBasicAppStepCompleted: boolean) => void;
    setAdvancedAppStepCompleted: (isAdvancedAppStepCompleted: boolean) => void;
    setAppId: (appId: string) => void;
    setClientToken: (clientToken: string) => void;
    setReferrerDecryptionKey: (referrerDecryptionKey: string) => void;
    resetFacebookSetupData: () => void;
}

type FacebookSetupState = {
    isNewAppStepCompleted: boolean;
    isBasicAppStepCompleted: boolean;
    isAdvancedAppStepCompleted: boolean;
    progress: number;
    appId: string;
    clientToken: string;
    referrerDecryptionKey: string;
    actions: FacebookSetupAction;
}

const initialState = {
    isNewAppStepCompleted: false,
    isBasicAppStepCompleted: false,
    isAdvancedAppStepCompleted: false,
    progress: 0,
    appId: "",
    clientToken: "",
    referrerDecryptionKey: "",
}

const useFacebookSetupStore = create<FacebookSetupState>((set) => ({
    ...initialState,
    actions: {
        setNewAppStepCompleted: (isNewAppStepCompleted: boolean) => set((state) => ({
            isNewAppStepCompleted: isNewAppStepCompleted,
            progress: setProgressValue(isNewAppStepCompleted, state.progress)
        })),
        setBasicAppStepCompleted: (isBasicAppStepCompleted: boolean) => set((state) => ({
            isBasicAppStepCompleted: isBasicAppStepCompleted,
            progress: setProgressValue(isBasicAppStepCompleted, state.progress)
        })),
        setAdvancedAppStepCompleted: (isAdvancedAppStepCompleted: boolean) => set((state) => ({
            isAdvancedAppStepCompleted: isAdvancedAppStepCompleted,
            progress: setProgressValue(isAdvancedAppStepCompleted, state.progress)
        })),
        setAppId: (appId: string) => set({ appId }),
        setClientToken: (clientToken: string) => set({ clientToken }),
        setReferrerDecryptionKey: (referrerDecryptionKey: string) => set({ referrerDecryptionKey }),
        resetFacebookSetupData: () => set(initialState),
    }
}))

export const useProgress = () => useFacebookSetupStore((state) => state.progress);
export const useNewAppStepCompleted = () => useFacebookSetupStore((state) => state.isNewAppStepCompleted);
export const useBasicAppStepCompleted = () => useFacebookSetupStore((state) => state.isBasicAppStepCompleted);
export const useAdvancedAppStepCompleted = () => useFacebookSetupStore((state) => state.isAdvancedAppStepCompleted);
export const useAppId = () => useFacebookSetupStore((state) => state.appId);
export const useClientToken = () => useFacebookSetupStore((state) => state.clientToken);
export const useReferrerDecryptionKey = () => useFacebookSetupStore((state) => state.referrerDecryptionKey);
export const useFacebookSetupActions = () => useFacebookSetupStore((state) => state.actions);
