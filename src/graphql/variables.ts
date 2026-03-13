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

const GET_ALL_ADMIN_DASHBOARD_DATA = (params: any) => {
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

// New Dashboard Variables
const GET_DASHBOARD_FILTERS = (_params: any) => {
  const studioId = localStorage.getItem('studioId') || undefined;
  return {
    filters: { studioId }
  };
};

// Publisher-specific Variables
const GET_PUBLISHER_DASHBOARD_FILTERS = (_params: any) => {
  return {}; // No parameters needed for publisher filters
};

const GET_PUBLISHER_GAMES_LIST = (params: any) => {
  return {
    filters: {
      studio: params.filter?.studio ?? "All",
      platform: params.filter?.platform ?? "All",
      subPlatform: params.filter?.subPlatform ?? "All",
      game: params.filter?.game ?? "All",
      dateRange: params.filter?.dateRange ?? "30d"
    }
  };
};

const GET_PORTFOLIO_KPIS = (params: any) => {
  const studioId = params.filter?.studioId || localStorage.getItem('studioId') || undefined;
  return {
    filters: {
      studioId,
      platform: params.filter?.platform ?? "All",
      subPlatform: params.filter?.subPlatform ?? "All",
      game: params.filter?.game ?? "All",
      dateRange: params.filter?.dateRange ?? "Last 30d",
      startDate: params.filter?.startDate ?? getDateRange(30),
      endDate: params.filter?.endDate ?? getDateRange(0),
    },
  };
};

const GET_GAMES_LIST = (params: any) => {
  const studioId = params.filter?.studioId || localStorage.getItem('studioId') || undefined;
  return {
    filters: {
      studioId,
      platform: params.filter?.platform ?? "All",
      subPlatform: params.filter?.subPlatform ?? "All",
      game: params.filter?.game ?? "All",
      dateRange: params.filter?.dateRange ?? "Last 30d",
      startDate: params.filter?.startDate ?? getDateRange(30),
      endDate: params.filter?.endDate ?? getDateRange(0),
    },
  };
};

const GET_PUBLISHER_KPIS = (params: any) => {
  return {
    filters: {
      studio: params.filter?.studio ?? "All",
      platform: params.filter?.platform ?? "All",
      subPlatform: params.filter?.subPlatform ?? "All",
      game: params.filter?.game ?? "All",
      region: params.filter?.region ?? "All",
      currency: params.filter?.currency ?? "USD",
      dateRange: params.filter?.dateRange ?? "Last 30d",
      startDate: params.filter?.startDate ?? getDateRange(30),
      endDate: params.filter?.endDate ?? getDateRange(0),
    },
  };
};

// Separate Dashboard Variables
const GET_DEVELOPER_DASHBOARD_DATA = (_params: any) => {
  const studioId = localStorage.getItem('studioId') || undefined;
  return {
    filters: { studioId }
  };
};

const GET_PUBLISHER_DASHBOARD_DATA = () => {
  return {}; // No parameters needed for publisher dashboard
};

const GET_APPROVALS_QUEUE = (params: any) => {
  return {
    filters: {
      studio: params.filter?.studio ?? "All",
      platform: params.filter?.platform ?? "All",
      subPlatform: params.filter?.subPlatform ?? "All",
      game: params.filter?.game ?? "All",
      region: params.filter?.region ?? "All",
      currency: params.filter?.currency ?? "USD",
      dateRange: params.filter?.dateRange ?? "Last 30d",
      startDate: params.filter?.startDate ?? getDateRange(30),
      endDate: params.filter?.endDate ?? getDateRange(0),
    },
  };
};

const GET_STUDIOS_GAMES = (params: any) => {
  return {
    filters: {
      studio: params.filter?.studio ?? "All",
      platform: params.filter?.platform ?? "All",
      subPlatform: params.filter?.subPlatform ?? "All",
      game: params.filter?.game ?? "All",
      region: params.filter?.region ?? "All",
      currency: params.filter?.currency ?? "USD",
      dateRange: params.filter?.dateRange ?? "Last 30d",
      startDate: params.filter?.startDate ?? getDateRange(30),
      endDate: params.filter?.endDate ?? getDateRange(0),
    },
  };
};

// Publisher Feature Variables
const GET_STUDIOS = (_params: any) => {
  return {};
};

const GET_CONTRACTS = (params: any) => {
  return {
    studioId: params.filter?.studioId ?? undefined,
  };
};

const GET_PAYOUTS = (params: any) => {
  return {
    studioId: params.filter?.studioId ?? undefined,
  };
};

const GET_APPROVALS = (params: any) => {
  return {
    studioId: params.filter?.studioId ?? undefined,
  };
};

const GET_NOTIFICATIONS = (params: any) => {
  // Get roleName from params filter or from localStorage
  const roleName = params.filter?.roleName || localStorage.getItem('userRole');

  // If roleName is not available, return empty object (query will fail gracefully)
  if (!roleName) {
    console.warn('GET_NOTIFICATIONS: roleName not found in params or localStorage');
    return {
      roleName: '', // Empty string will cause backend to return empty array
    };
  }

  // Normalize role name (case-insensitive)
  const normalizedRoleName = roleName.toLowerCase().trim();

  return {
    roleName: normalizedRoleName,
  };
};

const GET_ALL_GAME_REQUEST_BY_STUDIO_ID = () => {
  return {
    studioId: localStorage.getItem('studioId') ?? undefined,
  };
};

export const Variables = {
  GET_ALL_DATA_BY_USERNAME_OR_VALUE,
  GET_ALL_DATA_SUGGESTION,
  GET_SUB_PLATFORM_FILTER,
  GET_GAMES_FILTER,
  GET_ALL_DASHBOARD_DATA,
  GET_ALL_ADMIN_DASHBOARD_DATA,
  // New Dashboard Variables
  GET_DASHBOARD_FILTERS,
  GET_PORTFOLIO_KPIS,
  GET_GAMES_LIST,
  GET_PUBLISHER_KPIS,
  GET_APPROVALS_QUEUE,
  GET_STUDIOS_GAMES,
  // Publisher-specific Variables
  GET_PUBLISHER_DASHBOARD_FILTERS,
  GET_PUBLISHER_GAMES_LIST,
  // Separate Dashboard Variables
  GET_DEVELOPER_DASHBOARD_DATA,
  GET_PUBLISHER_DASHBOARD_DATA,
  // Publisher Feature Variables
  GET_STUDIOS,
  GET_CONTRACTS,
  GET_PAYOUTS,
  GET_APPROVALS,
  GET_NOTIFICATIONS,
  GET_ALL_GAME_REQUEST_BY_STUDIO_ID
};
