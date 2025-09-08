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
  console.log("Sub Platform Params: ", params.filter);
  return { platform: params.filter?.platform ?? "All" };
};

const GET_GAMES_FILTER = (params: any) => {
  // console.log("Game Filter:", params);
  return {
    platform: params.filter.platform ?? "All",
    subPlatform: params.filter.subPlatform ?? "All",
  };
};

const getDateRange = (dateRange: any) => {
  if (dateRange !== "Custom") {
    let date = new Date();
    date.setDate(date.getDate() - dateRange);
    return date.toISOString().split("T")[0];
  }
};

const GET_ALL_DASHBOARD_DATA = (params: any) => {
  return {
    filter: {
      data: {
        platform: params.filter.platform ?? "All",
        subPlatform: params.filter.subPlatform ?? "All",
        game: params.filter.game ?? "All",
        startDate:
          params.filter.dateRange ??
          params.filter.startDate ??
          getDateRange(30),
        endDate:
          params.filter.dateRange ?? params.filter.startDate ?? getDateRange(0),
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
