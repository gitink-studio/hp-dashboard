import { fetchUtils } from "react-admin";
import { DECIMAL_LENGTH } from "./constants";
import { FetchData } from "../data-providers/data-provider";

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

  if (await FetchData.isDataAlreadyExist(modelName, fieldName, value)) {
    return "Name already taken";
  }
};

export const isUserAlreadyExist = async (value: string) => {
  return await FetchData.isDataAlreadyExist("user", "email", value);
};

export const formatNumber = (_value: number | string): string => {
  // Handle undefined, null, or invalid values
  if (_value === undefined || _value === null || _value === '') {
    return '0';
  }
  
  const value = typeof _value === "string" ? parseFloat(_value) : _value;
  
  // Handle NaN values
  if (isNaN(value)) {
    return '0';
  }

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
