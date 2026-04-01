import { gql } from "graphql-tag";

const UserFragment = gql`
  fragment UserFields on User {
    id
    name
    updatedAt
    additionalUserData
    createdAt
    isAnonymousUser
    email
    password
    gameId
  }
`;

const DeviceFragment = gql`
  fragment DeviceFields on Device {
    id
    deviceId
    name
    platformType
    processor
    memory
    os
    createdAt
    additionalDeviceData
    userId
  }
`;

const LinkFragment = gql`
  fragment LinkFields on LinkId {
    id
    deviceId
    linkType
    linkData
    createdAt
    updatedAt
  }
`;

const EventLogFragment = gql`
  fragment EventLogFields on EventLog {
    id
    linkId
    eventType
    eventData
    createdAt
  }
`;

const GamePlatformFragment = gql`
  fragment GamePlatformFields on GamePlatform {
    id
    name
    additionalGamePlatformData
    createdAt
    updatedAt
  }
`;

const GameFragment = gql`
  fragment GameFields on Game {
    id
    gamePlatformId
    name
    additionalGameData
    createdAt
    updatedAt
  }
`;

const DeviceList = gql`
  query {
    getAllDeviceData {
      ...DeviceFields
    }
  }
  ${DeviceFragment}
`;

const Device = gql`
  query {
    devices {
      ...DeviceFields
    }
  }
  ${DeviceFragment}
`;

const UserList = gql`
  query {
    getAllUserData {
      ...UserFields
    }
  }
  ${UserFragment}
`;

const LinkList = gql`
  query {
    getAllLinkData {
      ...LinkFields
    }
  }
  ${LinkFragment}
`;

const EventLogList = gql`
  query {
    getAllEventLogData {
      ...EventLogFields
    }
  }
  ${EventLogFragment}
`;

const GamePlatformList = gql`
  query {
    getAllGamePlatformData {
      ...GamePlatformFields
    }
  }
  ${GamePlatformFragment}
`;

const GameList = gql`
  query {
    getAllGameData {
      ...GameFields
    }
  }
  ${GameFragment}
`;

const GetAllDataByValue = gql`
  query GetAllDataByValue(
    $modelName: String!
    $fieldName: String!
    $value: String!
  ) {
    getAllDataByValue(
      modelName: $modelName
      fieldName: $fieldName
      value: $value
    ) {
      data
    }
  }
`;

const GetAllDataByUserNameOrValue = gql`
  query GetAllDataByUserNameOrValue(
    $modelName: String!
    $fieldName: String!
    $userName: String!
    $value: String!
  ) {
    getAllDataByUserNameOrValue(
      modelName: $modelName
      fieldName: $fieldName
      userName: $userName
      value: $value
    ) {
      data
    }
  }
`;

const GetAllDataSuggestion = gql`
  query GetAllDataSuggestion(
    $modelName: String!
    $fieldName: String!
    $value: String!
  ) {
    getAllDataSuggestion(
      modelName: $modelName
      fieldName: $fieldName
      value: $value
    ) {
      data
    }
  }
`;

const GetPlatformFilter = gql`
  query GetPlatformFilter {
    getPlatformFilter {
      data
    }
  }
`;

const GetSubPlatformFilter = gql`
  query GetSubPlatformFilter($platform: String) {
    getSubPlatformFilter(platform: $platform) {
      data
    }
  }
`;

const GetGameFilter = gql`
  query GetGameFilter($platform: String, $subPlatform: String) {
    getGameFilter(subPlatform: $subPlatform, platform: $platform) {
      data
    }
  }
`;

const GetAllDashboardData = gql`
  query GetAllDashboardData($filter: AnyInput) {
    getAllDashboardData(filter: $filter) {
      data
    }
  }
`;

const GetAllAdminDashboardData = gql`
  query GetAllAdminDashboardData($filter: AnyInput) {
    getAllDashboardData(filter: $filter) {
      data
    }
  }
`;

const IsDataAlreadyExist = gql`
  query CheckDataExistOrNot(
    $modelName: String!
    $fieldName: String!
    $value: String!
  ) {
    checkDataExistOrNot(
      modelName: $modelName
      fieldName: $fieldName
      value: $value
    )
  }
`;

const IsValidUser = gql`
  query Query($email: String!, $password: String!) {
    isValidUser(email: $email, password: $password)
  }
`;

const GetGameEventReport = gql`
  query GetGameEventReport {
    getGameEventReport {
      data
    }
}
`

const GetPlayerEventReport = gql`
  query GetPlayerEventReport($gameId: String, $limit: Int, $lastRecordId: String) {
  getPlayerEventReport(gameId: $gameId, limit: $limit, lastRecordId: $lastRecordId) {
    data
  }
}
`

const GetUserDetails = gql`
  query GetUserDetails($email: String!, $password: String!) {
    getUserDetails(email: $email, password: $password) {
      id
      name
      email
      roleId
      role {
        id
        name
        description
      }
      studio
      studioId
      studioRelation{
        id
        name
      }
    }
  }
`;

// New Dashboard Queries
const DashboardFilters = gql`
  query DashboardFilters($filters: DashboardFiltersInput) {
    dashboardFilters(filters: $filters) {
      platforms {
        id
        name
      }
      subPlatforms {
        id
        name
      }
      games {
        id
        name
      }
      studios {
        id
        name
      }
      dateRanges
    }
  }
`;

// Publisher-specific filter query (no user filtering)
const PublisherDashboardFilters = gql`
  query PublisherDashboardFilters {
    publisherDashboardFilters {
      platforms {
        id
        name
        additionalPlatformData
      }
      subPlatforms {
        id
        name
        platformId
        additionalGamePlatformData
      }
      games {
        id
        name
        icon
        dau
        installs
        cpi
        revenue
        studioId
        studio {
          id
          name
        }
      }
      studios {
        id
        name
        description
        additionalData
        isActive
      }
      dateRanges
    }
  }
`;

const PortfolioKPIs = gql`
  query PortfolioKPIs($filters: DashboardFiltersInput!) {
    portfolioKPIs(filters: $filters) {
      id
      games
      installs
      cpi
      revenue
      roasD7
      crashRate
      retentionD1
      dau
      mau
    }
  }
`;

const GamesList = gql`
  query GamesList($filters: DashboardFiltersInput!) {
    gamesList(filters: $filters) {
      id
      name
      icon
      dau
      installs
      cpi
      revenue
    }
  }
`;
// Note: GamesList component uses direct fetch, not useGetList, so this query is kept
// only as a reference. PortfolioKPIs still uses useGetList via the data provider.

// Publisher-specific games list query (no user filtering)
const PublisherGamesList = gql`
  query PublisherGamesList($filters: PublisherFiltersInput!) {
    publisherGamesList(filters: $filters) {
      id
      name
      icon
      dau
      installs
      cpi
      revenue
      studioId
      studio {
        id
        name
      }
    }
  }
`;

const PublisherKPIs = gql`
  query PublisherKPIs($filters: PublisherFiltersInput!) {
    publisherKPIs(filters: $filters) {
      grossRevenue
      netRevenue
      payoutDue
      ecpm
      fillRate
      impressions
      ivtFraudRate
      compliance
      crashRate
      retentionD1
      roasD7
    }
  }
`;

const RevenueByGeo = gql`
  query RevenueByGeo($filters: PublisherFiltersInput!) {
    revenueByGeo(filters: $filters) {
      country
      installs
      grossRevenue
      revenueShare
      netRevenue
      payoutDue
    }
  }
`;

const StudioPayoutSummaryQuery = gql`
  query StudioPayoutSummary($filters: PublisherFiltersInput!) {
    payoutSummary(filters: $filters) {
      totalNet
      totalPaid
      totalOutstanding
      currency
      studios {
        studioId
        studioName
        grossRevenue
        netRevenue
        paid
        outstanding
      }
    }
  }
`;

const ApprovalsQueue = gql`
  query ApprovalsQueue($filters: PublisherFiltersInput!) {
    approvalsQueue(filters: $filters) {
      id
      type
      studio
      game
      item
      reason
      status
    }
  }
`;

const StudiosGames = gql`
  query StudiosGames($filters: PublisherFiltersInput!) {
    studiosGames(filters: $filters) {
      studioId
      studioName
      games {
        id
        name
        icon
        dau
        installs
        cpi
        revenue
      }
    }
  }
`;

// Separate Dashboard Queries
const GetDeveloperDashboardData = gql`
  query GetDeveloperDashboardData($filters: DashboardFiltersInput) {
    getDeveloperDashboardData(filters: $filters) {
      id
      name
      icon
      dau
      installs
      cpi
      revenue
    }
  }
`;

const GetPublisherDashboardData = gql`
  query GetPublisherDashboardData {
    getPublisherDashboardData {
      id
      name
      icon
      dau
      installs
      cpi
      revenue
    }
  }
`;

// Core Data Queries
const Platforms = gql`
  query Platforms {
    platforms {
      id
      name
    }
  }
`;

const GamePlatforms = gql`
  query GamePlatforms {
    gamePlatforms {
      id
      name
    }
  }
`;

const Games = gql`
  query Games {
    games {
      id
      name
    }
  }
`;

const Players = gql`
  query Players {
    players {
      id
      name
      gameId
    }
  }
`;

const Devices = gql`
  query Devices {
    devices {
      id
      deviceId
      name
      platformType
    }
  }
`;

const LinkIds = gql`
  query LinkIds {
    linkIds {
      id
      deviceId
      linkType
    }
  }
`;

const EventLogs = gql`
  query EventLogs {
    eventLogs {
      id
      linkId
      eventName
      eventData
      createdAt
    }
  }
`;

const Users = gql`
  query Users {
    users {
      id
      name
      email
      studio
      roleId
    }
  }
`;

const Roles = gql`
  query Roles {
    roles {
      id
      name
      description
    }
  }
`;

const GetStudioList = gql`
  query Studios {
    studios {
      id
      name
    }
  }
`

// Publisher Feature Queries
const Studios = gql`
  query Studios {
    studios {
      id
      name
      description
      contactEmail
      contactPhone
      address
      country
      isActive
      createdAt
      updatedAt
    }
  }
`;

const Studio = gql`
  query Studio($id: ID!) {
    studio(id: $id) {
      id
      name
      description
      contactEmail
      contactPhone
      address
      country
      additionalData
      isActive
      createdAt
      updatedAt
    }
  }
`;

const Contracts = gql`
  query Contracts($studioId: ID) {
    contracts(studioId: $studioId) {
      id
      studioId
      gameId
      platformId
      contractType
      revenueShare
      minimumGuarantee
      startDate
      endDate
      isActive
      additionalData
      createdAt
      updatedAt
    }
  }
`;

const Contract = gql`
  query Contract($id: ID!) {
    contract(id: $id) {
      id
      studioId
      gameId
      platformId
      contractType
      revenueShare
      minimumGuarantee
      startDate
      endDate
      isActive
      additionalData
      createdAt
      updatedAt
    }
  }
`;

const Payouts = gql`
  query Payouts($studioId: ID) {
    payouts(studioId: $studioId) {
      id
      studioId
      gameId
      amount
      currency
      payoutType
      status
      scheduledDate
      paidDate
      paymentMethod
      paymentReference
      notes
      additionalData
      createdAt
      updatedAt
    }
  }
`;

const Payout = gql`
  query Payout($id: ID!) {
    payout(id: $id) {
      id
      studioId
      gameId
      amount
      currency
      payoutType
      status
      scheduledDate
      paidDate
      paymentMethod
      paymentReference
      notes
      additionalData
      createdAt
      updatedAt
    }
  }
`;

const PayoutSummary = gql`
  query PayoutSummary($studioId: ID) {
    payoutSummary(studioId: $studioId) {
      totalPending
      totalApproved
      totalPaid
      totalCancelled
      nextPayoutDate
      totalAmount
    }
  }
`;

const Approvals = gql`
  query Approvals($studioId: String) {
    approvals(studioId: $studioId) {
      id
      studioId
      gameId
      approvalType
      itemId
      itemName
      itemData
      reason
      status
      priority
      assignedTo
      reviewedBy
      reviewedAt
      notes
      additionalData
      createdAt
      updatedAt
    }
  }
`;

const Approval = gql`
  query Approval($id: ID!) {
    approval(id: $id) {
      id
      studioId
      gameId
      approvalType
      itemId
      itemName
      itemData
      reason
      status
      priority
      assignedTo
      reviewedBy
      reviewedAt
      notes
      additionalData
      createdAt
      updatedAt
    }
  }
`;


const Notifications = gql`
  query Notifications($userId: ID) {
    notifications(userId: $userId) {
      id
      userId
      type
      title
      message
      isRead
      priority
      actionUrl
      actionData
      expiresAt
      additionalData
      createdAt
      updatedAt
    }
  }
`;

const AlertRules = gql`
  query AlertRules($userId: ID) {
    alertRules(userId: $userId) {
      id
      userId
      name
      description
      ruleType
      conditions
      isActive
      lastTriggered
      triggerCount
      additionalData
      createdAt
      updatedAt
    }
  }
`;

const GetPlayStoreGameDetails = gql`
  query GetPlayStoreGameDetails($url: String!) {
    getPlayStoreGameDetails(url: $url) {
      data
    }
  }
`;

const GetAllGameRequests = gql`
  query GetAllGameRequests {
  getAllGameRequests {
    data
  }
}`;

const GetAllGameRequestByStudioId = gql`
  query GetAllGameRequestByStudioId($studioId: String!) {
  getAllGameRequestByStudioId(studioId: $studioId) {
    data
  }
}`;

const GetGameEventReportByDateRange = gql`
  query GetGameEventReportByDateRange($startDate: String, $endDate: String) {
  getGameEventReportByDateRange(startDate: $startDate, endDate: $endDate) {
    data
  }
}`;

const GetPlayerEventReportByDateRange = gql`
  query GetPlayerEventReportByDateRange($gameId: String, $limit: Int, $lastRecordId: String, $dateRange: AnyInput) {
    getPlayerEventReportByDateRange(gameId: $gameId, limit: $limit, lastRecordId: $lastRecordId, dateRange: $dateRange) {
      data
    }
}`;

export const Queries = {
  DeviceList,
  Device,
  UserList,
  LinkList,
  EventLogList,
  GamePlatformList,
  GameList,
  GetAllDataByValue,
  GetAllDataByUserNameOrValue,
  GetAllDataSuggestion,
  GetPlatformFilter,
  GetSubPlatformFilter,
  GetGameFilter,
  GetAllDashboardData,
  GetAllAdminDashboardData,
  IsDataAlreadyExist,
  IsValidUser,
  GetUserDetails,
  GetPlayStoreGameDetails,
  GetGameEventReport,
  GetPlayerEventReport,
  GetStudioList,
  // New Dashboard Queries
  DashboardFilters,
  PortfolioKPIs,
  GamesList,
  PublisherKPIs,
  ApprovalsQueue,
  StudiosGames,
  // Publisher-specific Queries
  PublisherDashboardFilters,
  PublisherGamesList,
  RevenueByGeo,
  StudioPayoutSummaryQuery,
  // Separate Dashboard Queries
  GetDeveloperDashboardData,
  GetPublisherDashboardData,
  // Core Data Queries
  Platforms,
  GamePlatforms,
  Games,
  Players,
  Devices,
  LinkIds,
  EventLogs,
  Users,
  Roles,
  // Publisher Feature Queries
  Studios,
  Studio,
  Contracts,
  Contract,
  Payouts,
  Payout,
  PayoutSummary,
  Approvals,
  Approval,
  Notifications,
  AlertRules,
  GetAllGameRequests,
  GetAllGameRequestByStudioId,
  GetGameEventReportByDateRange,
  GetPlayerEventReportByDateRange
};
