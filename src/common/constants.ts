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
const GET_PLAY_STORE_GAME_DETAILS = "getPlayStoreGameDetails";
const GET_ALL_GAME_REQUESTS = "getAllGameRequests";
const GET_ALL_GAME_REQUEST_BY_STUDIO_ID = "getAllGameRequestByStudioId";
const GET_GAME_EVENT_REPORT = "getGameEventReport";
const GET_PLAYER_EVENT_REPORT = "getPlayerEventReport";

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
const PUT = "PUT";

// URLs
const LOCAL_HOST_URL = "http://localhost:3000";
const HR_WELOADIN_URL = "https://hr.weloadin.lol";
const HR_RENDER = 'https://hr-backend-render.onrender.com';
const AWS = 'https://qpbw9zk7uk.ap-south-1.awsapprunner.com';

// Exports
export const ROOT_URL = AWS;
export const GRAPHQL_URL = ROOT_URL + "/graphql";
export const DECIMAL_LENGTH = 2;
export const MIN_DATE = "2025-07-21";
export const CREATE_GAME_PLATFORM_URL = "/gamePlatforms/new";
export const GRAPHQL_CLIENT_OPTION = { uri: ROOT_URL + "/graphql" };
export const CREATE_USER_URL = ROOT_URL + "/users/new";
export const CREATE_GAME_SUBMISSION_DATA_URL = ROOT_URL + "/sdk/game-submission/new"
export const CREATE_TESTING_TERMS_URL = ROOT_URL + "/sdk/testing-terms/new"
export const UPDATE_FB_DATA_URL = ROOT_URL + "/sdk/facebook-setup/update"
export const CREATE_SDK_INTEGRATION_DATA_URL = ROOT_URL + "/sdk/sdk-integration/new"
export const CREATE_STORE_DATA_URL = ROOT_URL + "/sdk/store-setup/new"
export const CREATE_TEST_SETUP_DATA_URL = ROOT_URL + "/sdk/test-setup/new"
export const SDK_STATUS_UPDATE_URL = ROOT_URL + "/sdk/update/status";
export const SDK_LAUNCH_URL = ROOT_URL + "/sdk/launch";
export const CREATE_WEB_GAME_SUBMISSION_DATA_URL = ROOT_URL + "/web-game-submission/new"
export const REVIEW_AND_SUBMISSION_URL = ROOT_URL + "/web-game-submission/review-and-launch"
export const WEB_GAME_SUBMISSION_STATUS_UPDATE_URL = ROOT_URL + "/web-game-submission/update/status"
export const WEB_GAME_SUBMISSION_SETUP_CURRENT_STATE_UPDATE_URL = ROOT_URL + "/web-game-submission/update/state"
export const CREATE_WEB_SUBMISSION_SELECT_PLATFORMS_URL = ROOT_URL + "/web-game-submission/select-platforms/new"
export const CREATE_UPLOAD_WEB_BUILDS_URL = ROOT_URL + "/web-game-submission/upload-web-builds/new"
export const CREATE_CREATIVES_DATA_URL = ROOT_URL + "/web-game-submission/creatives/new"
export const CREATE_METADATA_AND_RATINGS_DATA_URL = ROOT_URL + "/web-game-submission/metadata-and-ratings/new"
export const REVIEW_AND_LAUNCH_URL = ROOT_URL + "/web-game-submission/review-and-launch"
export const LAUNCH_GAME_URL = ROOT_URL + "/web-game-submission/launch-game"
export const UPLOAD_FILES_URL = ROOT_URL + "/files/upload"
export const UPDATE_FB_AD_ACCOUNT_ID_URL = ROOT_URL + "/sdk/facebook-details/update/fbAdAccountId"
export const FORGOT_PASSWORD_URL = ROOT_URL + "/users/forgot-password";
export const RESET_PASSWORD_URL = ROOT_URL + "/users/reset-password";
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
  GET_PLAY_STORE_GAME_DETAILS,
  GET_GAME_EVENT_REPORT,
  GET_PLAYER_EVENT_REPORT,
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
  GET_ALL_GAME_REQUESTS,
  GET_ALL_GAME_REQUEST_BY_STUDIO_ID,
};

export const DATE_RANGE_NAMES = [0, 1, 7, 14, 30, "Custom"];
export const SUB_PLATFORMS = ["All", "Poki", "CrazyGames"];
export const GAME_NAMES = ["All", "PickleBall", "FoodJam"];
export const HttpMethod = { GET, POST, PUT };

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

export const PlayStoreDataFetchState = {
  INPROGRESS: "inprogress",
  COMPLETED: "completed"
}

export const ImageSize = '&sz=w1000';
export const MINIMUM_FB_CLIENT_TOKEN_LENGTH = 8;
export const FB_APP_ID_LENGTH = 15;
export const MINIMUM_FB_REFERRER_DECRYPTION_KEY = 15;
export const CURRENT_SDK_SETUP_STATE_ID = "currentSdkSetupStateId";
export const SDK_SETUP_GAME_ID = "sdkSetupGameId";
export const STUDIO_TOKEN = "studioToken";
export const STUDIO_ID = "studioId";
export const USER_NAME = "userName";
export const TOTAL_MOBILE_GAME_SUBMISSION_STEPS = 6;
export const TOTAL_WEB_GAME_SUBMISSION_STEPS = 7;


export const Regions = [
  "All",
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Antarctica",
  "Europe",
  "Australia"
]

export const Genres = [
  'Hole',
  'Idle clicker',
  'Idle resource management (Arcade)',
  'Idle Tycoon',
  '.io',
  'Merge',
  'Other',
  'Platformer',
  'Puzzle',
  'Racing/competition',
  'RPG',
  'Runner',
  'Shooter/FPS',
  'Simulation',
  'Tower Defense',
  'Sports'
]

export const SubGenres = [
  '2D',
  '3D',
  'Cartoon',
  'Minimal',
  'Pixel',
  'Realistic',
  'First Person',
  'Isometric',
  'Side View',
  'Top View',
  '2D Cartoon',
  '3D Cartoon',
  'Animals',
  'Geometric Shapes',
  'Hand Avatar',
  'Realistic',
  'Ropes',
  'Stickman',
  'Adventure',
  'Aiming',
  'ASMR',
  'ASMR-Multi Step',
  'Competition Side View',
  'Decision Making',
  'Drawing',
  'Fighting',
  'First Person Experiences',
  'Hiding and/or elimination',
  'Idle Simulation',
  'Jam Puzzle',
  'Matching',
  'Merging',
  'Platformer',
  'Racing',
  'Runners',
  'Shooters',
  'Shooting',
  'Sorting',
  'Word',
  'Airecraft',
  'Animal',
  'Art',
  'Beauty',
  'Cars',
  'Constructions',
  'Cops',
  'Dating',
  'DIY',
  'Food',
  'Humor',
  'Jewelry',
  'Medical',
  'School',
  'Shooting',
  'Sniper',
  'Space',
  'Sports',
  'Tiktok',
  'Weather',
  'Arcade'
]

export const Languages = [
  "All",
  "EN",
  "ES",
  "FR",
  "AR",
  "ZH",
  "DE",
  "JA",
  "KO",
  "PT",
  "RU",
  "HI",
  "IT",
  "NL",
  "TR",
  "VI"
]

const S3_PUBLIC_URL = "https://hr-bucket-a3189cd.s3.amazonaws.com";
const IMAGE_ROOT_URL = S3_PUBLIC_URL + "/uploads/public/images";
export const CREATIVES_ROOT_URL = "uploads/private/creatives";
export const BUILDS_ROOT_URL = "uploads/private/builds";

const FB_NEW_APP_IMAGE_PATH = "/facebook-setup/new-app";
const FB_BASICS_IMAGE_PATH = "/facebook-setup/basics";
const FB_ADVANCED_IMAGE_PATH = "/facebook-setup/advanced";
const SDK_INTEGRATION_IMAGE_PATH = "/sdk-integration-setup";
const STORE_PRIVACY_GUIDE_IMAGE_PATH = "/store-setup/privacy-guide";
const STORE_ADVERTISING_ID_IMAGE_PATH = "/store-setup/advertising-id";

export const UNITY_SDK_PACKAGE_URL = S3_PUBLIC_URL + "/uploads/public/sdk/unity/hyper-rabbit-sdk-v0.0.4.unitypackage"
export const HR_SDK_DOCUMENTATION_URL = S3_PUBLIC_URL + "/uploads/public/sdk/documentation/hyper-rabbit-sdk-documentation.pdf";
export const Images = {
  fbSetup: {
    newApp: {
      image1: `${IMAGE_ROOT_URL}${FB_NEW_APP_IMAGE_PATH}/fb-guide-1-1_v3.png`,
      image2: `${IMAGE_ROOT_URL}${FB_NEW_APP_IMAGE_PATH}/fb-guide-1-2.png`,
      image3: `${IMAGE_ROOT_URL}${FB_NEW_APP_IMAGE_PATH}/fb-guide-1-3.png`,
    },
    basics: {
      image1: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-1.png`,
      image2: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-2-v2.png`,
      image3: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-4.png`,
      image4: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-5.png`,
      image5: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-6.png`,
      image6: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-7-android.png`,
      image7: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-8-android.png`,
      image8: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-9-android.png`,
      image9: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-10-android.png`,
      image10: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-11-android.png`,
      image11: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-13-android.png`,
      image12: `${IMAGE_ROOT_URL}${FB_BASICS_IMAGE_PATH}/fb-guide-2-12-android.png`,
    },
    advanced: {
      image1: `${IMAGE_ROOT_URL}${FB_ADVANCED_IMAGE_PATH}/fb-guide-3-1.png`,
      image2: `${IMAGE_ROOT_URL}${FB_ADVANCED_IMAGE_PATH}/fb-guide-3-2.png`,
      image3: `${IMAGE_ROOT_URL}${FB_ADVANCED_IMAGE_PATH}/fb-guide-client-token.png`,
      image4: `${IMAGE_ROOT_URL}${FB_ADVANCED_IMAGE_PATH}/fb-guide-3-3.png`,
      image5: `${IMAGE_ROOT_URL}${FB_ADVANCED_IMAGE_PATH}/fb-guide-3-4.png`,
      image6: `${IMAGE_ROOT_URL}${FB_ADVANCED_IMAGE_PATH}/fb-guide-3-5.png`,
    }
  },
  sdkIntegration: {
    image1: `${IMAGE_ROOT_URL}${SDK_INTEGRATION_IMAGE_PATH}/sdk-step-1.png`,
    image2: `${IMAGE_ROOT_URL}${SDK_INTEGRATION_IMAGE_PATH}/sdk-step-2.png`,
  },
  storeSetup: {
    privacyGuide: {
      image1: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-1.jpg`,
      image2: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-2.1-new.jpg`,
      image3: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-2.2.jpg`,
      image4: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-3.jpg`,
      image5: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-4.jpg`,
      image6: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-5.a.jpg`,
      image7: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-5.b.jpg`,
      image8: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-5.c.jpg`,
      image9: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-5.d.jpg`,
      image10: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-get-started-5.e.jpg`,
      image11: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-define-data-1.jpg`,
      image12: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-define-data-2.jpg`,
      image13: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-define-data-4.1.jpg`,
      image14: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-define-data-4.2.jpg`,
      image15: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-define-data-4.3.jpg`,
      image16: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-data-safety-1.1.jpg`,
      image17: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-data-safety-1.2.jpg`,
      image18: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-data-safety-1.3.jpg`,
      image19: `${IMAGE_ROOT_URL}${STORE_PRIVACY_GUIDE_IMAGE_PATH}/google-guide-data-safety-2.jpg`,
    },
    advertisingId: {
      image1: `${IMAGE_ROOT_URL}${STORE_ADVERTISING_ID_IMAGE_PATH}/google-advertising-id-1.png`,
      image2: `${IMAGE_ROOT_URL}${STORE_ADVERTISING_ID_IMAGE_PATH}/google-advertising-id-2.png`,
      image3: `${IMAGE_ROOT_URL}${STORE_ADVERTISING_ID_IMAGE_PATH}/google-advertising-id-3.png`,
      image4: `${IMAGE_ROOT_URL}${STORE_ADVERTISING_ID_IMAGE_PATH}/google-advertising-id-4.png`,
      image5: `${IMAGE_ROOT_URL}${STORE_ADVERTISING_ID_IMAGE_PATH}/google-advertising-id-5.png`,
      image6: `${IMAGE_ROOT_URL}${STORE_ADVERTISING_ID_IMAGE_PATH}/google-advertising-id-6.png`,
    },
  }
}

export const FileTypes = {
  images: "images",
  videos: "videos",
  zips: "zips",
}

export const SINGLE_UNIVERSAL_ZIP = "Single universal zip";
export const PLATFORM_SPECIFIC_ZIP = "Platform-specific zip";

export const TEST_SUBMISSION = "test-submission"
export const FINAL_SUBMISSION = "final-submission"
export const MARKETINGS = 'marketings'

export const META = 'Meta';
export const POKI = 'Poki';
export const MSN = 'MSN';
export const CRAZY_GAMES = 'Crazy Games';

const PENDING = 'Pending';
const ACCEPTED = 'Accepted';
const REJECTED = 'Rejected';
const WAITING_FOR_APPROVAL = 'Wait for Approval';
const LAUNCHED = 'Launched';

export const GameRequestStatus = {
  PENDING,
  ACCEPTED,
  REJECTED,
  WAITING_FOR_APPROVAL,
  LAUNCHED
}

const ANDROID = 'Android'
const IOS = 'iOS'
const WEB = 'Web'

export const Platform = {
  ANDROID,
  IOS,
  WEB
}

const WEB_GAME_SUBMISSION_PAGE = 'WebSubmissionPage'
const MOBILE_GAME_SUBMISSION_PAGE = 'MobileSubmissionPage'

export const GameSubmissionPage = {
  WEB_GAME_SUBMISSION_PAGE,
  MOBILE_GAME_SUBMISSION_PAGE
}

export const WebGameSubmissionSetup = {
  WEB_GAME_SUBMISSION: 0,
  SELECT_PLATFORMS: 1,
  UPLOAD_WEB_BUILDS: 2,
  PLATFORM_REQUIREMENTS: 3,
  CREATIVES: 4,
  METADATA_AND_RATINGS: 5,
  REVIEW_AND_LAUNCH_URL: 6
}

export const MobileGameSubmissionSetup = {
  GAME_SUBMISSION: 0,
  APPROVAL: 1,
  FACEBOOK_SETUP: 2,
  SDK_INTEGRATION: 3,
  STORE_SETUP: 4,
  TEST_SETUP: 5,
}

export const GameplayEventReportType = {
  GAMEPLAY_DATA: 'Gameplay Data',
  IN_APP_PURCHASE_DATA: 'In App Purchase Data',
  AD_DATA: 'Ad Data',
  ECONOMY_DATA: 'Economy Data',
  LOG_DATA: 'Log Data',
  FPS_DATA: 'FPS Data',
  MEMORY_USAGE_DATA: 'Memory Usage Data',
}