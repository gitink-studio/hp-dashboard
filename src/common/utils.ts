import { fetchUtils } from "react-admin";
import { DECIMAL_LENGTH } from "./constants";
import { FetchData } from "../data-providers/data-provider";
import { notify } from "../components/notify";
import { useState } from "react";
import { print } from "graphql";

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

export const sendGraphqlRequest = async (resource: string, queryName: string, params: any) => {
  const response = await fetch(resource, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: print(params.query),
      variables: params.variables,
    }),
  });

  const result = await response.json();
  console.log(`${queryName} response:`, result);

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    return null;
  }

  console.log(`${queryName} data:`, result.data[queryName]);
  return result.data[queryName];
}

export const waitForSeconds = (seconds: number) => {

  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const isValidVideoFileFormat = (file: File) => {
  return file.name.endsWith(".mp4");
};

const isValidZipFileFormat = (file: File) => {
  return file.name.endsWith(".zip");
};

const isValidFileFormat = (file: File, format: string) => {
  if (format === "video") {
    return isValidVideoFileFormat(file);
  } else if (format === "zip") {
    return isValidZipFileFormat(file);
  }
  return false;
};

const isValidFileSize = (file: File, maxFileSize: number) => {
  if (maxFileSize === 0) {
    return true;
  }

  let isValidSize = file.size > maxFileSize * 1024 * 1024;
  if (!isValidSize) {
    notify(`File size must be ${maxFileSize} MB or less`, { type: "warning" });
    return false;
  }

  return true;
}

export const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, width: number, height: number, maxfileSize: number, fileformat: string, setImageNameAction: (value: any) => void, setPreviewAction: (value: any) => void, maxFileSize: number = 0) => {
  const resetIconName = () => {
    setImageNameAction('');
    setPreviewAction('');
  }

  if (e.target.files && e.target.files[0]) {
    console.log("handleIconUpload")
    const file = e.target.files[0];
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      console.log("width: " + naturalWidth + " height: " + naturalHeight);

      if (width !== 0 && height !== 0) {
        const isValidResolution = naturalWidth === width && naturalHeight === height;

        if (!isValidResolution) {
          notify(`Image must be in ${width}x${height} pixels`, { type: 'warning' });
          URL.revokeObjectURL(objectUrl); // Clean up
          resetIconName();
          return;
        }
      }

      if (maxFileSize !== 0 && !isValidFileSize(file, maxFileSize)) {
        resetIconName();
        return;
      }

      setImageNameAction(file.name);
      console.log("File name: ", file.name);
      setPreviewAction(URL.createObjectURL(file));
    }
  }
}

export const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, action: (value: any) => void, format: string, maxFileSize: number) => {
  console.log("file name: ");
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];


    if (!isValidFileFormat(file, format)) {
      notify("Invalid file format", { type: "error" });
      return;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      notify(`File size must be ${maxFileSize} MB or less`, { type: "warning" });
      return;
    }

    console.log(file.name);
    action(file.name);
  }
};

export const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, action: (value: any) => void, format: string, maxFileSize: number) => {
  e.preventDefault();
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];

    if (!isValidFileFormat(file, format)) {
      notify("Invalid file format", { type: "error" });
      return;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      notify(`File size must be ${maxFileSize} MB or less`, { type: "warning" });
      return;
    }

    action(file.name);
  }
};