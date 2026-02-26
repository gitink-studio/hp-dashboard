import { create } from 'zustand'

type GameEventReportAction = {
    setSelectedGameId: (selectedGameId: string) => void;
    setStudioFilterValue: (studioFilterValue: string) => void;
    setGamePlatformFilterValue: (gamePlatformFilterValue: string) => void;
    setGameFilterValue: (gameFilterValue: string) => void;
    setDateRangeFilterValue: (dateRangeFilterValue: number) => void;
    setSelectedStartDate: (selectedStartDate: string) => void;
    setSelectedEndDate: (selectedEndDate: string) => void;
    setCanOpenDetailedReport: (canOpenDetailedReport: boolean) => void;
    setCanOpenPlayersReport: (canOpenPlayersReport: boolean) => void;
    setDetailedGameplayReportData: (detailedGameplayReportData: any) => void;
    setGameEventReportData: (gameEventReportData: any) => void;
    resetGameEventReportData: () => void;
}

type GameEventReportState = {
    selectedGameId: string,
    studioFilterValue: string,
    gamePlatformFilterValue: string,
    gameFilterValue: string,
    dateRangeFilterValue: number,
    selectedStartDate: string,
    selectedEndDate: string,
    gameEventReportData: any;
    canOpenPlayersReport: boolean;
    canOpenDetailedReport: boolean;
    detailedGameplayReportData: any;
    actions: GameEventReportAction;
}

const initialState = {
    selectedGameId: "",
    studioFilterValue: "All",
    gamePlatformFilterValue: "All",
    gameFilterValue: 'All',
    dateRangeFilterValue: 0,
    selectedStartDate: "",
    selectedEndDate: "",
    canOpenPlayersReport: false,
    canOpenDetailedReport: false,
    detailedGameplayReportData: [],
    gameEventReportData: [],
}

const useGameEventReportStore = create<GameEventReportState>((set) => ({
    ...initialState,
    actions: {
        setSelectedGameId: (selectedGameId: string) => set({ selectedGameId }),
        setStudioFilterValue: (studioFilterValue: string) => set({ studioFilterValue }),
        setGamePlatformFilterValue: (gamePlatformFilterValue: string) => set({ gamePlatformFilterValue }),
        setGameFilterValue: (gameFilterValue: string) => set({ gameFilterValue }),
        setDateRangeFilterValue: (dateRangeFilterValue: number) => set({ dateRangeFilterValue }),
        setSelectedStartDate: (selectedStartDate: string) => set({ selectedStartDate }),
        setSelectedEndDate: (selectedEndDate: string) => set({ selectedEndDate }),
        setCanOpenDetailedReport: (canOpenDetailedReport: boolean) => set({ canOpenDetailedReport }),
        setCanOpenPlayersReport: (canOpenPlayersReport: boolean) => set({ canOpenPlayersReport }),
        setDetailedGameplayReportData: (detailedGameplayReportData: any) => set({ detailedGameplayReportData }),
        setGameEventReportData: (gameEventReportData: any) => set({ gameEventReportData }),
        resetGameEventReportData: () => set(initialState),
    }
}))

export const useSelectedGameId = () => useGameEventReportStore((state) => state.selectedGameId);
export const useStudioFilterValue = () => useGameEventReportStore((state) => state.studioFilterValue);
export const useGamePlatformFilterValue = () => useGameEventReportStore((state) => state.gamePlatformFilterValue);
export const useGameFilterValue = () => useGameEventReportStore((state) => state.gameFilterValue);
export const useDateRangeFilterValue = () => useGameEventReportStore((state) => state.dateRangeFilterValue);
export const useSelectedStartDate = () => useGameEventReportStore((state) => state.selectedStartDate);
export const useSelectedEndDate = () => useGameEventReportStore((state) => state.selectedEndDate);
export const useDetailedGameplayReportData = () => useGameEventReportStore((state) => state.gameEventReportData);
export const useOpenDetailedReport = () => useGameEventReportStore((state) => state.canOpenDetailedReport);
export const useOpenPlayersReport = () => useGameEventReportStore((state) => state.canOpenPlayersReport);
export const useGameEventReportData = () => useGameEventReportStore((state) => state.gameEventReportData);
export const useGameEventReportActions = () => useGameEventReportStore((state) => state.actions);
