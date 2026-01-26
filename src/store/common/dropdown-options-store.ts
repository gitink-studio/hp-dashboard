import { create } from "zustand";
import { sendGraphqlRequest } from "../../common/utils";
import { QueryNames } from "../../common/constants";
import { Queries } from "../../graphql/queries";

const dateRangeOptions = [
    { name: 'Today', value: '0' },
    { name: 'Yesterday', value: '1' },
    { name: 'Last 7d', value: '7' },
    { name: 'Last 14d', value: '14' },
    { name: 'Last 30d', value: '30' },
    { name: 'Custom', value: 'custom' },
]

type DropdownOptionsAction = {
    fetchStudioOptions: () => Promise<void>;
    fetchPlatformOptions: () => Promise<void>;
    fetchGamePlatformOptions: () => Promise<void>;
    fetchGameOptions: () => Promise<void>;
    setStudioOptions: (studioOptions: any) => void;
    setPlatformOptions: (platformOptions: any) => void;
    setGamePlatformOptions: (gamePlatformOptions: any) => void;
    setGameOptions: (gameOptions: any) => void;
    resetAllDropdownOptions: () => void;
}

type DropdownOptionsState = {
    defaultOption: any;
    studioOptions: any;
    platformOptions: any;
    gamePlatformOptions: any;
    gameOptions: any;
    actions: DropdownOptionsAction;
}

const initialState = {
    defaultOption: [{ id: 'All', name: 'All' }],
    studioOptions: [],
    platformOptions: [],
    gamePlatformOptions: [],
    gameOptions: [],
}

const fetchAndSetOptionData = async (queryName: string, query: any) => {
    try {
        // console.log(`Fetching studio options data...`);
        const response = await sendGraphqlRequest(queryName, {
            query: query,
            variables: {}
        });
        // console.log(`Response: ${JSON.stringify(response)}`);
        return response;
    } catch (err) {
        console.log(err);
        return [];
    }
}

const getOptionData = (stateName: string, actionName: string) => {
    const options = useDropdownOptionsStore((state: any) => state[stateName]);
    const fetchOptions = useDropdownOptionsStore((state: any) => state.actions[actionName]);

    if (options.length === 0) fetchOptions();
    return options;
}

const useDropdownOptionsStore = create<DropdownOptionsState>((set) => ({
    ...initialState,
    actions: {
        fetchStudioOptions: async () => set({ studioOptions: await fetchAndSetOptionData(QueryNames.STUDIOS, Queries.GetStudioList) }),
        fetchPlatformOptions: async () => set({ platformOptions: await fetchAndSetOptionData(QueryNames.PLATFORMS, Queries.Platforms) }),
        fetchGamePlatformOptions: async () => set({ gamePlatformOptions: await fetchAndSetOptionData(QueryNames.GAME_PLATFORMS, Queries.GamePlatforms) }),
        fetchGameOptions: async () => set({ gameOptions: await fetchAndSetOptionData(QueryNames.GAMES, Queries.Games) }),
        setStudioOptions: (studioOptions: any) => set({ studioOptions }),
        setPlatformOptions: (platformOptions: any) => set({ platformOptions }),
        setGamePlatformOptions: (gamePlatformOptions: any) => set({ gamePlatformOptions }),
        setGameOptions: (gameOptions: any) => set({ gameOptions }),
        resetAllDropdownOptions: () => set(initialState),
    }
}))

export const useDefaultOptions = () => useDropdownOptionsStore((state) => state.defaultOption);
export const useStudioOptions = () => getOptionData('studioOptions', 'fetchStudioOptions');
export const usePlatformsOptions = () => getOptionData('platformOptions', 'fetchPlatformOptions');
export const useGamePlatformOptions = () => getOptionData('gamePlatformOptions', 'fetchGamePlatformOptions');
export const useGameOptions = () => getOptionData('gameOptions', 'fetchGameOptions');
export const useDateRangeOptions = () => dateRangeOptions;
export const useDropdownOptionsActions = () => useDropdownOptionsStore((state) => state.actions);
