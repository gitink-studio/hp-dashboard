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

const GetAllDateOptionData = gql`
  query GetAllDateOptionData {
    getAllDateOptionData {
      id
      name 
      numberOfDays
      additionalDateOptionData
      createdAt
      updatedAt
    }
  }
`

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
  GetAllDateOptionData,
  GetPlatformFilter,
  GetSubPlatformFilter,
  GetGameFilter,
  GetAllDashboardData,
  IsDataAlreadyExist,
  IsValidUser,
};
