import { DataProvider } from "react-admin";
import { graphqlDataProvider } from "./graphql-data-provider";
import { restDataProvider } from "./rest-data-provider";
import { QueryNames, GRAPHQL_URL } from "../common/constants";
import { Queries } from "../graphql/queries";
import { print } from "graphql";

export const dataProvider: DataProvider = {
  getOne: (resource, params) => {
    return graphqlDataProvider.getOne(resource, params);
  },
  getList: (resource, params) => {
    return graphqlDataProvider.getList(resource, params);
  },
  getMany: (resource, params) => {
    return graphqlDataProvider.getMany(resource, params);
  },
  getManyReference: (resource, params) => {
    return graphqlDataProvider.getManyReference(resource, params);
  },
  create: (resource, params) => {
    return restDataProvider.create(resource, params);
  },
  update: (resource, params) => {
    return restDataProvider.update(resource, params);
  },
  updateMany: (resource, params) => {
    return restDataProvider.updateMany(resource, params);
  },
  delete: (resource, params) => {
    return restDataProvider.delete(resource, params);
  },
  deleteMany: (resource, params) => {
    return restDataProvider.deleteMany(resource, params);
  },
  isDataExistOrNot: async (resource: string, params: any) => {
    console.log(resource, params);
    const response = await fetch(resource, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: params.query,
        variables: params.variables,
      }),
    });

    const { data } = await response.json();
    return data[QueryNames.CHECK_DATA_EXIST_OR_NOT];
  },
  isValidUser: async (resource: string, params: any) => {
    console.log("isValidUser called with:", resource, params);
    const response = await fetch(resource, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: params.query,
        variables: params.variables,
      }),
    });

    const result = await response.json();
    console.log("isValidUser response:", result);

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return false;
    }

    const { data } = result;
    console.log("isValidUser data:", data);
    console.log("QueryNames.IS_VALID_USER:", QueryNames.IS_VALID_USER);
    console.log("Accessing data[QueryNames.IS_VALID_USER]:", data[QueryNames.IS_VALID_USER]);

    return data[QueryNames.IS_VALID_USER];
  },
  getUserDetails: async (resource: string, params: any) => {
    console.log("getUserDetails called with:", resource, params);
    const response = await fetch(resource, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: params.query,
        variables: params.variables,
      }),
    });

    const result = await response.json();
    console.log("getUserDetails response:", result);

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    const { data } = result;
    console.log("getUserDetails data:", data);
    console.log("QueryNames.GET_USER_DETAILS:", QueryNames.GET_USER_DETAILS);
    console.log("Accessing data[QueryNames.GET_USER_DETAILS]:", data[QueryNames.GET_USER_DETAILS]);

    return data[QueryNames.GET_USER_DETAILS];
  },
  getPlayStoreGameDetails: async (resource: string, params: any) => {
    console.log("getPlayStoreGameDetails called with:", resource, params);
    const response = await fetch(resource, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: params.query,
        variables: params.variables,
      }),
    });

    const result = await response.json();
    console.log("getPlayStoreGameDetails response:", result);

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    const { data } = result;
    console.log("getPlayStoreGameDetails data:", data);
    return data[QueryNames.GET_PLAY_STORE_GAME_DETAILS];
  },


}

const isDataAlreadyExist = async (_modelName: string, _fieldName: string, _value: string,) => {
  const query = print(Queries.IsDataAlreadyExist);
  const variables = { modelName: _modelName, fieldName: _fieldName, value: _value.trim(), };
  const isDataExist = await dataProvider.isDataExistOrNot(GRAPHQL_URL, { query: query, variables: variables, });

  return isDataExist;
}

const isValidUser = async (_email: string, _password: string) => {
  console.log("login auth-provider")
  const query = print(Queries.IsValidUser);
  const variables = { email: _email, password: _password, };
  const isValidUser = await dataProvider.isValidUser(GRAPHQL_URL, { query: query, variables: variables, });

  return isValidUser;
}

const getUserDetails = async (_email: string, _password: string) => {
  const query = print(Queries.GetUserDetails);
  const variables = { email: _email, password: _password };
  const userDetails = await dataProvider.getUserDetails(GRAPHQL_URL, { query: query, variables: variables });
  return userDetails;
};

const getPlayStoreGameDetails = async (_url: string) => {
  const query = print(Queries.GetPlayStoreGameDetails);
  const variables = { url: _url };
  const playStoreDetails = await dataProvider.getPlayStoreGameDetails(GRAPHQL_URL, { query: query, variables: variables });
  return playStoreDetails;
}

export const FetchData = {
  isDataAlreadyExist,
  isValidUser,
  getUserDetails,
  getPlayStoreGameDetails,
};