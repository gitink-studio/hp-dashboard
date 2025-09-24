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
const GET_ALL_ADMIN_DASHBOARD_DATA = "getAllAdminDashboardData";
const GET_DEVELOPER_DASHBOARD_DATA = "getDeveloperDashboardData";
const GET_PUBLISHER_DASHBOARD_DATA = "getPublisherDashboardData";
const CHECK_DATA_EXIST_OR_NOT = "checkDataExistOrNot";
const IS_VALID_USER = "isValidUser";
const GET_USER_DETAILS = "getUserDetails";

// New Dashboard Query Names
const DASHBOARD_FILTERS = "dashboardFilters";
const PORTFOLIO_KPIS = "portfolioKPIs";
const GAMES_LIST = "gamesList";
const PUBLISHER_KPIS = "publisherKPIs";
const APPROVALS_QUEUE = "approvalsQueue";
const STUDIOS_GAMES = "studiosGames";

// Publisher-specific Filter Queries
const PUBLISHER_DASHBOARD_FILTERS = "publisherDashboardFilters";
const PUBLISHER_GAMES_LIST = "publisherGamesList";
const PLATFORMS = "platforms";
const GAME_PLATFORMS = "gamePlatforms";
const GAMES = "games";
const PLAYERS = "players";
const DEVICES = "devices";
const LINK_IDS = "linkIds";
const EVENT_LOGS = "eventLogs";
const USERS = "users";
const ROLES = "roles";

// Publisher Feature Query Names
const STUDIOS = "studios";
const STUDIO = "studio";
const CONTRACTS = "contracts";
const CONTRACT = "contract";
const PAYOUTS = "payouts";
const PAYOUT = "payout";
const PAYOUT_SUMMARY = "payoutSummary";
const APPROVALS = "approvals";
const APPROVAL = "approval";
const NOTIFICATIONS = "notifications";
const ALERT_RULES = "alertRules";

const POST = "POST";
const GET = "GET";

// URLs
const LOCAL_HOST_URL = "http://localhost:3000";

// Exports
export const ROOT_URL = LOCAL_HOST_URL;
export const DECIMAL_LENGTH = 2;
export const MIN_DATE = "2025-07-21";
export const CREATE_GAME_PLATFORM_URL = "/gamePlatforms/new";
export const GRAPHQL_CLIENT_OPTION = { uri: ROOT_URL + "/graphql" };
export const CREATE_USER_URL = ROOT_URL + "/users/new";
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
  GET_ALL_ADMIN_DASHBOARD_DATA,
  GET_DEVELOPER_DASHBOARD_DATA,
  GET_PUBLISHER_DASHBOARD_DATA,
  CHECK_DATA_EXIST_OR_NOT,
  IS_VALID_USER,
  GET_USER_DETAILS,
  // New Dashboard Query Names
  DASHBOARD_FILTERS,
  PORTFOLIO_KPIS,
  GAMES_LIST,
  PUBLISHER_KPIS,
  APPROVALS_QUEUE,
  STUDIOS_GAMES,
  // Publisher-specific Filter Queries
  PUBLISHER_DASHBOARD_FILTERS,
  PUBLISHER_GAMES_LIST,
  PLATFORMS,
  GAME_PLATFORMS,
  GAMES,
  PLAYERS,
  DEVICES,
  LINK_IDS,
  EVENT_LOGS,
  USERS,
  ROLES,
  // Publisher Feature Query Names
  STUDIOS,
  STUDIO,
  CONTRACTS,
  CONTRACT,
  PAYOUTS,
  PAYOUT,
  PAYOUT_SUMMARY,
  APPROVALS,
  APPROVAL,
  NOTIFICATIONS,
  ALERT_RULES,
};

export const DATE_RANGE_NAMES = [0, 1, 7, 14, 30, "Custom"];
export const SUB_PLATFORMS = ["All", "Poki", "CrazyGames"];
export const GAME_NAMES = ["All", "PickleBall", "FoodJam"];
export const HTTP_METHODS = { GET, POST };

// Publisher-specific constants
export const CONTRACT_TYPES = ["revenue_share", "minimum_guarantee", "hybrid"];
export const PAYOUT_TYPES = ["revenue_share", "minimum_guarantee", "adjustment"];
export const PAYOUT_STATUSES = ["pending", "approved", "paid", "cancelled"];
export const APPROVAL_TYPES = ["creative", "test", "campaign", "budget"];
export const APPROVAL_STATUSES = ["pending", "approved", "rejected", "hold"];
export const APPROVAL_PRIORITIES = ["low", "normal", "high", "urgent"];
export const NOTIFICATION_TYPES = ["approval", "payout", "alert", "system"];
export const NOTIFICATION_PRIORITIES = ["low", "normal", "high", "urgent"];
export const ALERT_RULE_TYPES = ["kpi_threshold", "anomaly", "compliance"];
