import buildGraphQLProvider, { BuildQueryResult } from "ra-data-graphql";
import { Queries } from "../graphql/queries";
import { GRAPHQL_CLIENT_OPTION, QueryNames } from "../common/constants";
import { Variables } from "../graphql/variables";

let resource = "";

// Cache for request deduplication
const requestCache = new Map<string, { timestamp: number; promise: Promise<any> }>();
const CACHE_DURATION = 1000; // 1 second cache to prevent duplicate requests

// Helper function to check if response data has nested data structure
const isResponseJsonData = (responseData: any, fieldName?: string): boolean => {
  if (!responseData || typeof responseData !== 'object') {
    return false;
  }
  if (fieldName && responseData[fieldName]) {
    return typeof responseData[fieldName] === 'object' && 'data' in responseData[fieldName];
  }
  return false;
};

// Map resource names to their actual GraphQL field names
const getGraphQLFieldName = (resourceName: string): string => {
  const fieldMapping: { [key: string]: string } = {
    [QueryNames.PORTFOLIO_KPIS]: 'portfolioKPIs',
    [QueryNames.GAMES_LIST]: 'gamesList',
    [QueryNames.PUBLISHER_KPIS]: 'publisherKPIs',
    [QueryNames.APPROVALS_QUEUE]: 'approvalsQueue',
    [QueryNames.STUDIOS_GAMES]: 'studiosGames',
    [QueryNames.APPROVALS]: 'approvals',
    [QueryNames.STUDIOS]: 'studios',
    [QueryNames.CONTRACTS]: 'contracts',
    [QueryNames.PAYOUTS]: 'payouts',
    [QueryNames.NOTIFICATIONS]: 'notifications',
    [QueryNames.GET_DEVELOPER_DASHBOARD_DATA]: 'getDeveloperDashboardData',
    [QueryNames.GET_PUBLISHER_DASHBOARD_DATA]: 'getPublisherDashboardData',
    [QueryNames.DASHBOARD_FILTERS]: 'dashboardFilters',
    [QueryNames.PUBLISHER_DASHBOARD_FILTERS]: 'publisherDashboardFilters',
    [QueryNames.PUBLISHER_GAMES_LIST]: 'publisherGamesList'
  };
  return fieldMapping[resourceName] || resourceName;
};

const getQuery: any = (resource: string) => {
  switch (resource) {
    case QueryNames.GET_PLATFORM_FILTER:
      return Queries.GetPlatformFilter;
    case QueryNames.GET_SUB_PLATFORM_FILTER:
      return Queries.GetSubPlatformFilter;
    case QueryNames.GET_GAME_FILTER:
      return Queries.GetGameFilter;
    case QueryNames.GET_ALL_DASHBOARD_DATA:
      return Queries.GetAllDashboardData;
    case QueryNames.GET_ALL_ADMIN_DASHBOARD_DATA:
      return Queries.GetAllAdminDashboardData;
    case QueryNames.GET_DEVELOPER_DASHBOARD_DATA:
      return Queries.GetDeveloperDashboardData;
    case QueryNames.GET_PUBLISHER_DASHBOARD_DATA:
      return Queries.GetPublisherDashboardData;
    case QueryNames.GET_ALL_DEVICE_DATA:
      return Queries.DeviceList;
    case QueryNames.GET_DEVICE_DATA:
      return Queries.Device;
    case QueryNames.GET_ALL_USER_DATA:
      return Queries.UserList;
    case QueryNames.GET_ALL_LINK_DATA:
      return Queries.LinkList;
    case QueryNames.GET_ALL_EVENT_LOG_DATA:
      return Queries.EventLogList;
    case QueryNames.GET_ALL_GAME_PLATFORM_DATA:
      return Queries.GamePlatformList;
    case QueryNames.GET_ALL_GAME_DATA:
      return Queries.GameList;
    case QueryNames.GET_ALL_DATA_SUGGESTION:
      return Queries.GetAllDataSuggestion;
    case QueryNames.GET_ALL_DATA_BY_USERNAME_OR_VALUE:
      return Queries.GetAllDataByUserNameOrValue;
    case QueryNames.GET_GAME_EVENT_REPORT:
      return Queries.GetGameEventReport;
    case QueryNames.GET_PLAYER_EVENT_REPORT:
      return Queries.GetPlayerEventReport;
    // New Dashboard Queries
    case QueryNames.DASHBOARD_FILTERS:
      return Queries.DashboardFilters;
    case QueryNames.PORTFOLIO_KPIS:
      return Queries.PortfolioKPIs;
    case QueryNames.GAMES_LIST:
      return Queries.GamesList;
    // Publisher-specific Queries
    case QueryNames.PUBLISHER_DASHBOARD_FILTERS:
      return Queries.PublisherDashboardFilters;
    case QueryNames.PUBLISHER_GAMES_LIST:
      return Queries.PublisherGamesList;
    case QueryNames.PUBLISHER_KPIS:
      return Queries.PublisherKPIs;
    case QueryNames.APPROVALS_QUEUE:
      return Queries.ApprovalsQueue;
    case QueryNames.STUDIOS_GAMES:
      return Queries.StudiosGames;
    // Core Data Queries
    case QueryNames.PLATFORMS:
      return Queries.Platforms;
    case QueryNames.GAME_PLATFORMS:
      return Queries.GamePlatforms;
    case QueryNames.GAMES:
      return Queries.Games;
    case QueryNames.PLAYERS:
      return Queries.Players;
    case QueryNames.DEVICES:
      return Queries.Devices;
    case QueryNames.LINK_IDS:
      return Queries.LinkIds;
    case QueryNames.EVENT_LOGS:
      return Queries.EventLogs;
    case QueryNames.USERS:
      return Queries.Users;
    case QueryNames.ROLES:
      return Queries.Roles;
    // Publisher Feature Queries
    case QueryNames.STUDIOS:
      return Queries.Studios;
    case QueryNames.CONTRACTS:
      return Queries.Contracts;
    case QueryNames.PAYOUTS:
      return Queries.Payouts;
    case QueryNames.APPROVALS:
      return Queries.Approvals;
    case QueryNames.NOTIFICATIONS:
      return Queries.Notifications;
    default:
      console.log(`Unable to find the query: ${resource}`);
  }
};

const getVariable: any = (resource: string, params: any) => {
  switch (resource) {
    case QueryNames.GET_ALL_DATA_BY_USERNAME_OR_VALUE:
      return Variables.GET_ALL_DATA_BY_USERNAME_OR_VALUE(resource, params);
    case QueryNames.GET_ALL_DATA_SUGGESTION:
      return Variables.GET_ALL_DATA_SUGGESTION(params);
    case QueryNames.GET_SUB_PLATFORM_FILTER:
      return Variables.GET_SUB_PLATFORM_FILTER(params);
    case QueryNames.GET_GAME_FILTER:
      return Variables.GET_GAMES_FILTER(params);
    case QueryNames.GET_ALL_DASHBOARD_DATA:
      return Variables.GET_ALL_DASHBOARD_DATA(params);
    case QueryNames.GET_ALL_ADMIN_DASHBOARD_DATA:
      return Variables.GET_ALL_ADMIN_DASHBOARD_DATA(params);
    case QueryNames.GET_DEVELOPER_DASHBOARD_DATA:
      return Variables.GET_DEVELOPER_DASHBOARD_DATA(params);
    case QueryNames.GET_PUBLISHER_DASHBOARD_DATA:
      return Variables.GET_PUBLISHER_DASHBOARD_DATA();
    // New Dashboard Variables
    case QueryNames.DASHBOARD_FILTERS:
      return Variables.GET_DASHBOARD_FILTERS(params);
    case QueryNames.PORTFOLIO_KPIS:
      return Variables.GET_PORTFOLIO_KPIS(params);
    case QueryNames.GAMES_LIST:
      return Variables.GET_GAMES_LIST(params);
    // Publisher-specific Variables
    case QueryNames.PUBLISHER_DASHBOARD_FILTERS:
      return Variables.GET_PUBLISHER_DASHBOARD_FILTERS(params);
    case QueryNames.PUBLISHER_GAMES_LIST:
      return Variables.GET_PUBLISHER_GAMES_LIST(params);
    case QueryNames.PUBLISHER_KPIS:
      return Variables.GET_PUBLISHER_KPIS(params);
    case QueryNames.APPROVALS_QUEUE:
      return Variables.GET_APPROVALS_QUEUE(params);
    case QueryNames.STUDIOS_GAMES:
      return Variables.GET_STUDIOS_GAMES(params);
    // Publisher Feature Variables
    case QueryNames.STUDIOS:
      return Variables.GET_STUDIOS(params);
    case QueryNames.CONTRACTS:
      return Variables.GET_CONTRACTS(params);
    case QueryNames.PAYOUTS:
      return Variables.GET_PAYOUTS(params);
    case QueryNames.APPROVALS:
      return Variables.GET_APPROVALS(params);
    case QueryNames.NOTIFICATIONS:
      return Variables.GET_NOTIFICATIONS(params);
    case QueryNames.GET_ALL_GAME_REQUEST_BY_STUDIO_ID:
      return Variables.GET_ALL_GAME_REQUEST_BY_STUDIO_ID();
    default:
      return {};
  }
};

// Custom data provider with request deduplication
export const graphqlDataProvider = buildGraphQLProvider({
  clientOptions: GRAPHQL_CLIENT_OPTION,
  buildQuery:
    () =>
      (fetchType: string, _resource: string, params: any): BuildQueryResult => {
        resource = _resource;
        const customVariables = getVariable(resource, params);
        // console.log("Fetch Type: ", fetchType, resource);

        if (fetchType == "GET_LIST" || fetchType == "GET_MANY") {
          // console.log(`params : ${JSON.stringify(params)} resource: ${resource}`);
          return {
            query: getQuery(resource),
            variables: customVariables,
            parseResponse: (res) => {
              const fieldName = getGraphQLFieldName(resource);

              // Debug logging for publisher dashboard filters
              if (resource === QueryNames.PUBLISHER_DASHBOARD_FILTERS) {
                console.log('🔍 Publisher Dashboard Filters Response:', res);
                console.log('Field name:', fieldName);
                console.log('Response data:', res.data);
                console.log('Field data:', res.data?.[fieldName]);
              }

              // Debug logging for notifications
              if (resource === QueryNames.NOTIFICATIONS) {
                console.log('🔔 Notifications Query Response:', res);
                console.log('Field name:', fieldName);
                console.log('Response data:', res.data);
                console.log('Field data:', res.data?.[fieldName]);
                console.log('Variables:', customVariables);
                console.log('Is array:', Array.isArray(res.data?.[fieldName]));
                console.log('Data type:', typeof res.data?.[fieldName]);
              }

              // Check for GraphQL errors
              if (res.errors) {
                console.error(`GraphQL errors for resource '${resource}':`, res.errors);
                return {
                  data: [],
                  total: 0,
                };
              }

              // Check if the field exists in the response
              if (!res.data || !res.data[fieldName]) {
                console.warn(`Resource '${resource}' (field: '${fieldName}') not found in response:`, res.data);
                return {
                  data: [],
                  total: 0,
                };
              }

              let data = isResponseJsonData(res.data)
                ? res.data[fieldName].data
                : res.data[fieldName];

              // Handle array responses (like notifications)
              if (Array.isArray(data)) {
                // Data is already an array, use it directly
                console.log(`✅ Data is array with ${data.length} items`);
              } else if (data && Array.isArray(data.data)) {
                // Data is wrapped in a data property
                data = data.data;
                console.log(`✅ Unwrapped data array with ${data.length} items`);
              } else if (data && typeof data === 'object' && !Array.isArray(data)) {
                // Data might be an object, try to extract array
                console.warn(`⚠️ Data is object, not array:`, data);
                data = [];
              } else {
                // Ensure data is an array
                if (!Array.isArray(data)) {
                  console.warn(`⚠️ Data is not an array, converting:`, typeof data, data);
                  data = data ? [data] : [];
                }
              }

              let total = isResponseJsonData(res.data)
                ? res.data[fieldName].data?.total || 0
                : res.data[fieldName]?.total || 0;

              // For array responses, use array length as total if total is 0
              if (Array.isArray(data)) {
                if (total === 0) {
                  total = data.length;
                }
                // Ensure data is properly formatted
                if (resource === QueryNames.NOTIFICATIONS) {
                  console.log(`📊 Notifications parsed: ${data.length} items, total: ${total}`);
                }
              }

              // Debug logging for portfolio KPIs
              if (resource === QueryNames.PORTFOLIO_KPIS) {
                console.log('🔍 Portfolio KPIs Response:', res.data);
                console.log('🔍 Field name:', fieldName);
                console.log('🔍 Raw data:', res.data[fieldName]);
                console.log('🔍 Is response JSON data:', isResponseJsonData(res.data));
                console.log('🔍 Processed data:', data);
              }

              // Debug logging for publisher dashboard filters
              if (resource === QueryNames.PUBLISHER_DASHBOARD_FILTERS) {
                console.log('🔍 Parsed data:', data);
                console.log('🔍 Is response JSON data:', isResponseJsonData(res.data));
                console.log('🔍 Data type:', typeof data);
                console.log('🔍 Is array:', Array.isArray(data));
              }

              // Handle cases where data might be undefined
              if (!data) {
                data = [];
                total = 0;
              }

              // Handle single object responses (like Portfolio KPIs) by wrapping in array
              if (data && !Array.isArray(data)) {
                data = [data];
                total = 1;
              }

              // Debug logging for publisher dashboard filters after processing
              if (resource === QueryNames.PUBLISHER_DASHBOARD_FILTERS) {
                console.log('🔍 Final processed data:', data);
                console.log('🔍 Final total:', total);
              }

              return {
                data: data || [],
                total: total || 0,
              };
            },
          };
        } else {
          return {
            query: getQuery(resource),
            variables: customVariables,
            parseResponse: (res) => {
              const fieldName = getGraphQLFieldName(resource);

              // Check for GraphQL errors
              if (res.errors) {
                console.error(`GraphQL errors for resource '${resource}':`, res.errors);
                return {
                  data: null,
                  total: 0,
                };
              }

              if (!res.data || !res.data[fieldName]) {
                console.warn(`Resource '${resource}' (field: '${fieldName}') not found in response:`, res.data);
                return {
                  data: null,
                  total: 0,
                };
              }

              return {
                data: res.data[fieldName],
                total: 1,
              };
            },
          };
        }
      },
});
