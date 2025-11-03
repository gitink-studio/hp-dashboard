import { create } from 'zustand';

type PlayTestsActions = {
    setDataSending: (isDataSending: boolean) => void;
    setReviewNotes: (reviewNotes: string) => void;
    setGameRequests: (gameRequests: any[]) => void;
    setGameRequestDetails: (gameRequestDetails: any) => void;
    setTestRequests: (testRequests: any[]) => void;
    setDisplayGameRequestDetails: (displayGameRequestDetails: boolean) => void;
    setDisplayGamePostSubmissionDetails: (displayGamePostSubmissionDetailedView: boolean) => void;
    resetPlayTestsStore: () => void;
}

type PlayTestsState = {
    isDataSending: boolean;
    reviewNotes: string;
    displayGameRequestDetails: boolean;
    displayGamePostSubmissionDetailedView: boolean;
    gameRequests: any[];
    gameRequestDetails: any;
    testRequests: any[];
    actions: PlayTestsActions;
}

const initialState = {
    isDataSending: false,
    reviewNotes: "",
    displayGameRequestDetails: false,
    displayGamePostSubmissionDetailedView: false,
    gameRequests: [],
    gameRequestDetails: null,
    testRequests: [],
}
const usePlayTestsStore = create<PlayTestsState>((set) => ({
    ...initialState,
    actions: {
        setDataSending: (isDataSending: boolean) => set({ isDataSending }),
        setReviewNotes: (reviewNotes: string) => set({ reviewNotes }),
        setGameRequests: (gameRequests: any[]) => set({ gameRequests: gameRequests }),
        setGameRequestDetails: (gameRequestDetails: any) => set({ gameRequestDetails: gameRequestDetails }),
        setTestRequests: (testRequests: any[]) => set({ testRequests }),
        setDisplayGameRequestDetails: (displayGameRequestDetails: boolean) => set({ displayGameRequestDetails }),
        setDisplayGamePostSubmissionDetails: (displayGamePostSubmissionDetailedView: boolean) => set({ displayGamePostSubmissionDetailedView }),
        resetPlayTestsStore: () => set(initialState),
    }
}))

export const useReviewNotes = () => usePlayTestsStore((state) => state.reviewNotes);
export const useDataSending = () => usePlayTestsStore((state) => state.isDataSending);
export const useDisplayGameRequestDetails = () => usePlayTestsStore((state) => state.displayGameRequestDetails);
export const useDisplayGamePostSubmissionDetails = () => usePlayTestsStore((state) => state.displayGamePostSubmissionDetailedView);
export const useGameRequests = () => usePlayTestsStore((state) => state.gameRequests);
export const useGameRequestDetails = () => usePlayTestsStore((state) => state.gameRequestDetails);
export const useTestRequests = () => usePlayTestsStore((state) => state.testRequests);
export const usePlayTestsActions = () => usePlayTestsStore((state) => state.actions);