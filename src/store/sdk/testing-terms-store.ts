import { create } from "zustand";

type TestingTermsAction = {
    setAgreed: (agreed: boolean) => void;
    resetTestingTermsData: () => void;
}

type TestingTermsState = {
    agreed: boolean;
    actions: TestingTermsAction;
}

const initialState = {
    agreed: false,
}

const useTestingTermsStore = create<TestingTermsState>((set) => ({
    ...initialState,
    actions: {
        setAgreed: (agreed: boolean) => set({ agreed }),
        resetTestingTermsData: () => set(initialState),
    }
}))

export const useAgreed = () => useTestingTermsStore((state) => state.agreed);
export const useTestingTermActions = () => useTestingTermsStore((state) => state.actions);

