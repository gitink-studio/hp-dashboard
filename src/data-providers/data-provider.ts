import { DataProvider } from "react-admin";
import { graphqlDataProvider } from "./graphql-data-provider";
import { restDataProvider } from "./rest-data-provider";
import { QueryNames, ROOT_URL } from "../common/constants";
import { Queries } from "../graphql/queries";
import { print } from "graphql";

let webPlatformId: string = "";
let dateOptionList: any[] = [];

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
  isValidUser: async (resource: string, params: any) => {
    const response = await fetch(resource, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: params.query,
        variables: params.variables,
      }),
    });

    const { data } = await response.json();
    console.log("Is valid user", data);
    return data[QueryNames.IS_VALID_USER];
  },
};

const isDataAlreadyExist = (_modelName: string, _fieldName: string, _value: string,) => {
  const query = print(Queries.IsDataAlreadyExist);
  const variables = { modelName: _modelName, fieldName: _fieldName, value: _value.trim(), };
  const isDataExist = dataProvider.isDataExistOrNot(ROOT_URL + "/graphql", { query: query, variables: variables, });

  return isDataExist;
};

const isValidUser = (_email: string, _password: string) => {
  console.log("isValidUser");
  const query = print(Queries.IsValidUser);
  const variables = { email: _email, password: _password, };
  const isValidUser = dataProvider.isValidUser(ROOT_URL + "/graphql", { query: query, variables: variables, });

  return isValidUser;
};

const getWebPlatformId = (): any => {
  return webPlatformId === "" ? getPlatformId("Web") : webPlatformId;
}

const getPlatformId = async (platformName: string) => {
  let responseData = await dataProvider.getList(QueryNames.GET_PLATFORM_FILTER, {});
  // console.log(`ResponseDataPlatform: ${JSON.stringify(responseData)}`);

  let platformData = responseData?.data.find(data => data.name === platformName);

  if (platformData) {
    webPlatformId = platformData?.id;
    return webPlatformId;
  }
  else {
    return "All";
  }

}

const setDateOptionList = async () => {
  if (dateOptionList.length === 0) {
    dateOptionList = (await dataProvider.getList(QueryNames.GET_ALL_DATE_OPTION_DATA, {})).data;
  }
}

const getDateOptionValue = (dateOptionName: string) => {
  if (dateOptionList.length === 0) setDateOptionList();

  let dateOptionData = dateOptionList.find(data => data.name === dateOptionName);
  return dateOptionData ? dateOptionData.numberOfDays : 0;
}

export const FetchData = {
  isDataAlreadyExist,
  isValidUser,
  getWebPlatformId,
  getDateOptionValue,
};
