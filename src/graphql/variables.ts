import { FetchData } from "../data-providers/data-provider";

const GET_ALL_DATA_BY_USERNAME_OR_VALUE = (resource: string, params: any) => {
  return params?.filter?.[resource] || params?.filter?.name
    ? {
      modelName: "eventLog",
      fieldName: "eventType",
      userName: params?.filter?.name ? params?.filter?.name : "",
      value: params?.filter?.[resource] ? params?.filter?.[resource] : "",
    }
    : {
      modelName: "eventLog",
      fieldName: "",
      userName: "",
      value: "",
    };
};

const GET_ALL_DATA_SUGGESTION = (params: any) => {
  return params?.filter?.q
    ? {
      modelName: "user",
      fieldName: "name",
      value: params?.filter?.q ? params?.filter?.q : "",
    }
    : {
      modelName: "user",
      fieldName: "name",
      value: "",
    };
};

const GET_SUB_PLATFORM_FILTER = (params: any) => {
  return { platform: params.filter?.platform ?? "All" };
};

const GET_GAMES_FILTER = (params: any) => {
  return {
    platform: params.filter.platform ?? "All",
    subPlatform: params.filter.subPlatform ?? "All",
  };
};

const getDateRange = (filter: any, isEndDate: boolean) => {
  let dateRange: any = FetchData.getDateOptionValue(filter.dateRange);

  if (filter.dateRange !== "Custom") {
    let date = new Date();

    if (isEndDate) return date.toISOString().split('T')[0];

    date.setDate(date.getDate() - dateRange);
    return date.toISOString().split('T')[0];
  } else {
    return isEndDate ? filter.endDate : filter.startDate;
  }
};

const GET_ALL_DASHBOARD_DATA = (params: any) => {
  return {
    filter: {
      data: {
        platform: params.filter.platform ?? "All",
        subPlatform: params.filter.subPlatform ?? "All",
        game: params.filter.game ?? "All",
        startDate: getDateRange(params.filter, false),
        endDate: getDateRange(params.filter, true),
      },
    },
  };
};

export const Variables = {
  GET_ALL_DATA_BY_USERNAME_OR_VALUE,
  GET_ALL_DATA_SUGGESTION,
  GET_SUB_PLATFORM_FILTER,
  GET_GAMES_FILTER,
  GET_ALL_DASHBOARD_DATA,
};
