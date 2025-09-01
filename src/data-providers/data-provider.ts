import { DataProvider } from "react-admin";
import { graphqlDataProvider } from "./graphql-data-provider";
import { restDataProvider } from "./rest-data-provider";
import { QueryNames } from "../common/constants";

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
};
