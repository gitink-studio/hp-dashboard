// Query Names
const GET_ALL_DEVICE_DATA = "getAllDeviceData";
const GET_ALL_USER_DATA = "getAllUserData";
const GET_ALL_LINK_DATA = "getAllLinkData";
const GET_ALL_EVENT_LOG_DATA = "getAllEventLogData";
const GET_ALL_GAME_PLATFORM_DATA = "getAllGamePlatformData";
const GET_ALL_GAME_DATA = "getAllGameData";
const GET_DEVICE_DATA = "devices";
const GET_EVENT_LOG_BY_USER_DATA = "getEventLogByUserData";
const GET_ALL_DATA_BY_VALUE = "getAllDataByValue";
const GET_ALL_DATA_BY_USERNAME_OR_VALUE = "getAllDataByUserNameOrValue";
const GET_ALL_DATA_SUGGESTION = "getAllDataSuggestion";
const GET_PLATFORM_FILTER = "getPlatformFilter";
const GET_SUB_PLATFORM_FILTER = "getSubPlatformFilter";
const GET_GAME_FILTER = "getGameFilter";
const GET_ALL_DASHBOARD_DATA = "getAllDashboardData";
const CHECK_DATA_EXIST_OR_NOT = "checkDataExistOrNot";

// URLs
const HR_WELOADIN_URL = "https://hr.weloadin.lol/";
const LOCAL_HOST_URL = "http://localhost:3000";

// Exports
export const ROOT_URL = LOCAL_HOST_URL;
export const DECIMAL_LENGTH = 2;
export const MIN_DATE = "2025-07-21";
export const CREATE_GAME_PLATFORM_URL = "/gamePlatforms/new";
export const GRAPHQL_CLIENT_OPTION = { uri: ROOT_URL + "/graphql" };
export const QueryNames = {
  GET_ALL_DEVICE_DATA,
  GET_ALL_USER_DATA,
  GET_ALL_LINK_DATA,
  GET_ALL_EVENT_LOG_DATA,
  GET_ALL_GAME_PLATFORM_DATA,
  GET_ALL_GAME_DATA,
  GET_DEVICE_DATA,
  GET_EVENT_LOG_BY_USER_DATA,
  GET_ALL_DATA_BY_VALUE,
  GET_ALL_DATA_BY_USERNAME_OR_VALUE,
  GET_ALL_DATA_SUGGESTION,
  GET_PLATFORM_FILTER,
  GET_SUB_PLATFORM_FILTER,
  GET_GAME_FILTER,
  GET_ALL_DASHBOARD_DATA,
  CHECK_DATA_EXIST_OR_NOT,
};

export const PLATFORMS = ["Play Store", "App Store", "Web"];
