import { fetchUtils } from "react-admin";
import { dataProvider } from "../data-providers/data-provider";
import { Queries } from "../graphql/queries";
import { DECIMAL_LENGTH, ROOT_URL } from "./constants";
import { print } from "graphql";

const isDataAlreadyExist = (
  _modelName: string,
  _fieldName: string,
  _value: string,
) => {
  const query = print(Queries.IsDataAlreadyExist);
  const variables = {
    modelName: _modelName,
    fieldName: _fieldName,
    value: _value.trim(),
  };
  const isDataExist = dataProvider.isDataExistOrNot(ROOT_URL + "/graphql", {
    query: query,
    variables: variables,
  });

  return isDataExist;
};

export const isValidUser = (_email: string, _password: string) => {
  const query = print(Queries.IsValidUser);
  const variables = {
    email: _email,
    password: _password,
  };
  const isValidUser = dataProvider.isValidUser(ROOT_URL + "/graphql", {
    query: query,
    variables: variables,
  });

  return isValidUser;
};

export const validateValue = async (
  modelName: string,
  fieldName: string,
  value: string,
) => {
  console.log(value);

  if (!value) {
    return `Name is required`;
  }

  if (value.length < 3) {
    return `Name must be at least 3 characters`;
  }

  if (await isDataAlreadyExist(modelName, fieldName, value)) {
    return "Name already taken";
  }
};

export const isUserAlreadyExist = async (value: string) => {
  return await isDataAlreadyExist("user", "email", value);
};

export const formatNumber = (_value: number | string): string => {
  const value = typeof _value === "string" ? parseFloat(_value) : _value;

  if (Math.abs(value) >= 1.0e9) {
    return (value / 1.0e9).toFixed(DECIMAL_LENGTH).replace(/\.00$/, "") + "b";
  } else if (Math.abs(value) >= 1.0e6) {
    return (value / 1.0e6).toFixed(DECIMAL_LENGTH).replace(/\.00$/, "") + "m";
  } else if (Math.abs(value) >= 1.0e3) {
    return (value / 1.0e3).toFixed(DECIMAL_LENGTH).replace(/\.00$/, "") + "k";
  } else {
    return value.toFixed(2).replace(/\.00$/, "");
  }
};

export const sendRequest = async (method: string, url: string, data: any) => {
  const options = {
    method: method,
    body: JSON.stringify(data),
    headers: new Headers({ "Content-Type": "application/json" }),
  };

  const { json } = await fetchUtils.fetchJson(url, options);

  return json;
};
