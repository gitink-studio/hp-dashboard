import { create } from "zustand";

type WebGameCreativesAction = {
    setWebCreativeList: (creativeList: ((prev: any[]) => any[])) => void;
}

type WebGameCreativesState = {
    creativeList: any[];
    actions: WebGameCreativesAction;
}

const initialState = {
    creativeList: []
}

const useWebGameCreativesStore = create<WebGameCreativesState>((set) => ({
    ...initialState,
    actions: {
        setWebCreativeList: (creativeList) => set((state: any) => ({ creativeList: creativeList(state.creativeList) }))
    }
}));

export const useWebCreativeListState = () => useWebGameCreativesStore((state) => state.creativeList);
export const useWebGameCreativesActions = () => useWebGameCreativesStore((state) => state.actions);
