import { create } from "zustand";

type CreativesAction = {

}

type CreativesState = {
    actions: CreativesAction;
}


const useCreativesStore = create<CreativesState>((set) => ({
    actions: {

    }
}));


export const useCreativesActions = () => useCreativesStore((state) => state.actions);
