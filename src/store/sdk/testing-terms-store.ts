import { create } from "zustand";

type TestingTermsAction = {
    setAgreed: (agreed: boolean) => void;
}

type TestingTermsState = {
    agreed: boolean;
    actions: TestingTermsAction;
}

const useTestingTermsStore = create<TestingTermsState>((set) => ({
    agreed: false,
    actions: {
        setAgreed: (agreed: boolean) => set({ agreed })
    }
}))

export const useAgreed = () => useTestingTermsStore((state) => state.agreed);
export const useTestingTermActions = () => useTestingTermsStore((state) => state.actions);

