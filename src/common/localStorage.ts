import { authProvider } from "../auth-providers/auth-provider";
import { STUDIO_ID, USER_NAME } from "./constants";

const getStudioId = () => {
    let studioId = localStorage.getItem(STUDIO_ID);

    if (studioId === null || studioId === '') {
        let userName = localStorage.getItem(USER_NAME);
        studioId = userName?.split('@')[1] || '';
    }

    return studioId;
}

export const localStorageData = {
    studioId: getStudioId(),
}
