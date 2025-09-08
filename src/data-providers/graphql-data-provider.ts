import buildGraphQLProvider, { BuildQueryResult } from "ra-data-graphql";
import { Queries } from "../graphql/queries";
import { GRAPHQL_CLIENT_OPTION, QueryNames } from "../common/constants";
import { Variables } from "../graphql/variables";

let resource = "";
let responseJsonDataQueryList = [
  QueryNames.GET_ALL_DATA_BY_USERNAME_OR_VALUE,
  QueryNames.GET_ALL_DATA_SUGGESTION,
  QueryNames.GET_PLATFORM_FILTER,
  QueryNames.GET_SUB_PLATFORM_FILTER,
  QueryNames.GET_GAME_FILTER,
  QueryNames.GET_ALL_DASHBOARD_DATA,
];

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
    default:
      return {};
  }
};

const isResponseJsonData = (data: any) => {
  // console.log("Response: ", data);
  return responseJsonDataQueryList.includes(resource);
};

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
            // console.log(`response data: ${JSON.stringify(res)}`);
            return {
              data: isResponseJsonData(res.data)
                ? res.data[resource].data
                : res.data[resource],
              total: isResponseJsonData(res.data)
                ? res.data[resource].data.total
                : res.data[resource].total,
            };
          },
        };
      } else {
        return {
          query: getQuery(resource),
          variables: customVariables,
          parseResponse: () => {
            data: "";
            total: 0;
          },
        };
      }
    },
});
