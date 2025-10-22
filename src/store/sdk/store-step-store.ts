import { create } from "zustand";

type StoreStepAction = {
    setDisplayPrivacyGuide: (canDisplayPrivacyGuide: boolean) => void;
    setDisplayAdvertisingID: (canDisplayAdvertisingID: boolean) => void;
    setIsAppAvailableInAllStores: (isAppAvailableInAllStores: boolean) => void;
    setIsPrivacyGuideAnswered: (isPrivacyGuideAnswered: boolean) => void;
    setIsAdvertisingIDAnswered: (isAdvertisingIDAnswered: boolean) => void;
    setIsAllFieldsFilled: (isAllFieldsFilled: boolean) => void;
}

type StoreStepState = {
    isAppAvailableInAllStores: boolean;
    isPrivacyGuideAnswered: boolean;
    isAdvertisingIDAnswered: boolean;
    isAllFieldsFilled: boolean;
    canDisplayPrivacyGuide: boolean;
    canDisplayAdvertisingID: boolean;
    actions: StoreStepAction;
}

const useStoreStepStore = create<StoreStepState>((set) => ({
    isAppAvailableInAllStores: false,
    isPrivacyGuideAnswered: false,
    isAdvertisingIDAnswered: false,
    isAllFieldsFilled: false,
    canDisplayPrivacyGuide: false,
    canDisplayAdvertisingID: false,
    actions: {
        setDisplayPrivacyGuide: (canDisplayPrivacyGuide: boolean) => set({ canDisplayPrivacyGuide }),
        setDisplayAdvertisingID: (canDisplayAdvertisingID: boolean) => set({ canDisplayAdvertisingID }),
        setIsAppAvailableInAllStores: (isAppAvailableInAllStores: boolean) => set({ isAppAvailableInAllStores }),
        setIsPrivacyGuideAnswered: (isPrivacyGuideAnswered: boolean) => set({ isPrivacyGuideAnswered }),
        setIsAdvertisingIDAnswered: (isAdvertisingIDAnswered: boolean) => set({ isAdvertisingIDAnswered }),
        setIsAllFieldsFilled: (isAllFieldsFilled: boolean) => set({ isAllFieldsFilled }),
    }
}))

export const useIsAppAvailableInAllStores = () => useStoreStepStore((state) => state.isAppAvailableInAllStores);
export const useIsPrivacyGuideAnswered = () => useStoreStepStore((state) => state.isPrivacyGuideAnswered);
export const useIsAdvertisingIDAnswered = () => useStoreStepStore((state) => state.isAdvertisingIDAnswered);
export const useIsAllFieldsFilled = () => useStoreStepStore((state) => state.isAllFieldsFilled);
export const useDisplayPrivacyGuide = () => useStoreStepStore((state) => state.canDisplayPrivacyGuide);
export const useDisplayAdvertisingID = () => useStoreStepStore((state) => state.canDisplayAdvertisingID);
export const useStoreStepActions = () => useStoreStepStore((state) => state.actions);

