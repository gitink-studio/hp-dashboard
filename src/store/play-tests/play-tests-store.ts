import { create } from 'zustand';
import { Platform, GameSubmissionPage } from '../../common/constants';

type PlayTestsActions = {
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

type PlayTestsState = {
    isRolePublisher: boolean,
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
    actions: PlayTestsActions;
}

const checkRoleIsPublisher = () => {
  const userRole = localStorage.getItem('userRole');
  if (!userRole) return false;
  const normalizedRole = userRole.toLowerCase().trim();
  return normalizedRole === 'publisher' || normalizedRole.includes('publisher');
};

const initialState = {
    isRolePublisher: checkRoleIsPublisher(),
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

const usePlayTestsStore = create<PlayTestsState>((set) => ({
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

export const useVideoUrl = () => usePlayTestsStore((state) => state.videoUrl);
export const useCurrentGameDetails = () => usePlayTestsStore((state) => state.currentGameDetails);
export const useRolePublisher = () => usePlayTestsStore((state) => state.isRolePublisher);
export const useOpenVideo = () => usePlayTestsStore((state) => state.openVideo);
export const useReviewNotes = () => usePlayTestsStore((state) => state.reviewNotes);
export const useDataSending = () => usePlayTestsStore((state) => state.isDataSending);
export const useDetailedView = () => usePlayTestsStore((state) => state.detailedView);
export const useDisplayGamePostSubmissionDetails = () => usePlayTestsStore((state) => state.displayGamePostSubmissionDetailedView);
export const useGameRequests = () => usePlayTestsStore((state) => state.gameRequests);
export const useGameRequestDetails = () => usePlayTestsStore((state) => state.gameRequestDetails);
export const useTestRequests = () => usePlayTestsStore((state) => state.testRequests);
export const useSelectedGameSubmissionPage = () => usePlayTestsStore((state) => state.selectedGameSubmissionPage)
export const usePlayTestsActions = () => usePlayTestsStore((state) => state.actions);
