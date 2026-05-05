import { create } from 'zustand';
import { GameSubmissionPage } from '../../common/constants';

type GameSubmissionActions = {
    setOpenVideo: (openVideo: boolean) => void;
    setDataSending: (isDataSending: boolean) => void;
    setReviewNotes: (reviewNotes: string) => void;
    setGameRequests: (gameRequests: any[]) => void;
    setGameRequestDetails: (gameRequestDetails: any) => void;
    setTestRequests: (testRequests: any[]) => void;
    setDetailedView: (detailedView: boolean) => void;
    setDisplayGamePostSubmissionDetails: (displayGamePostSubmissionDetailedView: boolean) => void;
    setSelectedGameSubmissionPage: (selectedGameSubmissionPage: string) => void;
    setVideoUrl: (videoUrl: string) => void;
    setCurrentGameDetails: (currentGameDetails: any) => void;
    resetPlayTestsStore: () => void;
}

type GameSubmissionState = {
    openVideo: boolean;
    isDataSending: boolean;
    detailedView: boolean;
    displayGamePostSubmissionDetailedView: boolean;
    selectedGameSubmissionPage: string,
    reviewNotes: string;
    videoUrl: string;
    gameRequests: any[];
    gameRequestDetails: any;
    currentGameDetails: any;
    testRequests: any[];
    actions: GameSubmissionActions;
}

const initialState = {
    openVideo: false,
    detailedView: false,
    isDataSending: false,
    displayGamePostSubmissionDetailedView: false,
    selectedGameSubmissionPage: GameSubmissionPage.MOBILE_GAME_SUBMISSION_PAGE,
    videoUrl: '',
    reviewNotes: "",
    currentGameDetails: null,
    gameRequestDetails: null,
    gameRequests: [],
    testRequests: [],
}

const useGameSubmissionStore = create<GameSubmissionState>((set) => ({
    ...initialState,
    actions: {
        setOpenVideo: (openVideo: boolean) => set({ openVideo }),
        setDataSending: (isDataSending: boolean) => set({ isDataSending }),
        setReviewNotes: (reviewNotes: string) => set({ reviewNotes }),
        setGameRequests: (gameRequests: any[]) => set({ gameRequests: gameRequests }),
        setGameRequestDetails: (gameRequestDetails: any) => set({ gameRequestDetails: gameRequestDetails }),
        setTestRequests: (testRequests: any[]) => set({ testRequests }),
        setDetailedView: (detailedView: boolean) => set({ detailedView: detailedView }),
        setDisplayGamePostSubmissionDetails: (displayGamePostSubmissionDetailedView: boolean) => set({ displayGamePostSubmissionDetailedView }),
        setSelectedGameSubmissionPage: (selectedGameSubmissionPage: string) => set({ selectedGameSubmissionPage }),
        setVideoUrl: (videoUrl: string) => set({ videoUrl }),
        setCurrentGameDetails: (currentGameDetails: any) => set({ currentGameDetails }),
        resetPlayTestsStore: () => set(initialState),
    }
}))

export const useVideoUrl = () => useGameSubmissionStore((state) => state.videoUrl);
export const useCurrentGameDetails = () => useGameSubmissionStore((state) => state.currentGameDetails);
export const useOpenVideo = () => useGameSubmissionStore((state) => state.openVideo);
export const useReviewNotes = () => useGameSubmissionStore((state) => state.reviewNotes);
export const useDataSending = () => useGameSubmissionStore((state) => state.isDataSending);
export const useDetailedView = () => useGameSubmissionStore((state) => state.detailedView);
export const useDisplayGamePostSubmissionDetails = () => useGameSubmissionStore((state) => state.displayGamePostSubmissionDetailedView);
export const useGameRequests = () => useGameSubmissionStore((state) => state.gameRequests);
export const useGameRequestDetails = () => useGameSubmissionStore((state) => state.gameRequestDetails);
export const useTestRequests = () => useGameSubmissionStore((state) => state.testRequests);
export const useSelectedGameSubmissionPage = () => useGameSubmissionStore((state) => state.selectedGameSubmissionPage)
export const useGameSubmissionActions = () => useGameSubmissionStore((state) => state.actions);
