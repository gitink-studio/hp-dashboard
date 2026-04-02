import { fetchUtils } from "react-admin";
import { DECIMAL_LENGTH, FileTypes, GRAPHQL_URL, HttpMethod } from "./constants";
import { FetchData } from "../data-providers/data-provider";
import { notify } from "../components/notify";
import { print } from "graphql";
import React from "react";

const imageFormats = ['.png', '.jpg', '.jpeg'];
const videoFormats = ['.mp4', '.mov', '.mkv', '.webm', '.m4a'];
const buildFormats = ['.zip'];

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

/** YYYY-MM-DD in the user's local calendar (avoids UTC shifting from `toISOString().split('T')[0]`). */
export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Latest local calendar day expected to have complete daily metrics (not “today”). */
export function getLatestDashboardDataDateYmd(): string {
  const n = new Date();
  return toLocalDateString(new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1));
}

/**
 * Bounds for developer dashboard GraphQL / REST from preset `dateRange`.
 * "Yesterday" is a single local calendar day (startDate === endDate).
 * Returns undefined for Custom — caller should supply explicit dates if supported.
 */
export function getDashboardDateBounds(
  dateRange: string | undefined,
): { startDate: string; endDate: string } | undefined {
  const dr = dateRange ?? 'Last 30d';
  if (dr === 'Custom') {
    return undefined;
  }

  const now = new Date();

  if (dr === 'Yesterday') {
    const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const s = toLocalDateString(y);
    return { startDate: s, endDate: s };
  }

  if (dr === 'Today') {
    const s = toLocalDateString(now);
    return { startDate: s, endDate: s };
  }

  let startDate: Date;

  switch (dr) {
    case 'Last 7d':
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 14d':
    case '14d':
      startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 30d':
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: toLocalDateString(startDate),
    endDate: toLocalDateString(now),
  };
}

/** Default Custom range: last ~30d through latest data day (yesterday), not today. */
export function getDefaultCustomDashboardRange(): { startDate: string; endDate: string } {
  const b = getDashboardDateBounds('Last 30d')!;
  const maxEnd = getLatestDashboardDataDateYmd();
  let endDate = b.endDate > maxEnd ? maxEnd : b.endDate;
  let startDate = b.startDate;
  if (startDate > endDate) startDate = endDate;
  return { startDate, endDate };
}

export type DashboardFilterDates = {
  dateRange: string;
  startDate?: string;
  endDate?: string;
};

/** Preset bounds from `dateRange`, or explicit `startDate`/`endDate` when `dateRange === 'Custom'`. */
export function getDashboardQueryDateBounds(
  filters: DashboardFilterDates,
): { startDate: string; endDate: string } | undefined {
  if (filters.dateRange === 'Custom') {
    const s = filters.startDate?.trim();
    const e = filters.endDate?.trim();
    if (s && e) {
      const maxEnd = getLatestDashboardDataDateYmd();
      let start = s <= e ? s : e;
      let end = s <= e ? e : s;
      if (end > maxEnd) end = maxEnd;
      if (start > maxEnd) start = maxEnd;
      if (start > end) start = end;
      return { startDate: start, endDate: end };
    }
    return undefined;
  }
  return getDashboardDateBounds(filters.dateRange);
}

export const formatDecimalNumber = (_value: number | string): string => {
  if (_value === undefined || _value === null || _value === '') {
    return '0';
  }

  const value = typeof _value === "string" ? parseFloat(_value) : _value;

  if (isNaN(value)) {
    return '0';
  }

  const hasDecimals = value % 1 !== 0;
  return value.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? DECIMAL_LENGTH : 0,
    maximumFractionDigits: DECIMAL_LENGTH,
  });
};

export const sendRequest = async (method: string, url: string, data: any) => {
  const options: any = {
    method: method,
    headers: new Headers({ "Content-Type": "application/json" }),
  };

  if (method !== HttpMethod.GET) {
    options.body = JSON.stringify(data);
  }

  const { json } = await fetchUtils.fetchJson(url, options);

  return json;
};

export const sendRequestForDownloadFiles = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: HttpMethod.POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(`Download Response: ${JSON.stringify(response)}`);
  if (!response.ok) throw new Error("Download failed");

  const blob = await response.blob();
  return blob;
};

export const openDownloadPopupWindow = (blob: any, fileNameWithExtension: any) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileNameWithExtension;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const sendFormDataRequest = async (name: string, url: string, fileList: any[], data: any) => {
  try {
    const formData = new FormData();

    for (let i = 0; i < fileList.length; i++) {
      formData.append(name, fileList[i]);
    }

    if (data) {
      formData.append('metadata', JSON.stringify(data));
    }

    const response = await fetch(url, {
      method: HttpMethod.POST,
      body: formData
    })

    const responseData = await response.json();
    console.log("Response data: ", responseData);
    return responseData;
  }
  catch (error) {
    console.log(error);
  }
}

export const sendGraphqlRequest = async (queryName: string, params: any) => {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: print(params.query),
      variables: params.variables,
    }),
  });

  const result = await response.json();
  // console.log(`${queryName} response:`, result);

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    return null;
  }

  // console.log(`${queryName} data:`, result.data[queryName]);
  return result.data[queryName];
}

const getFileLocation = (fileExtension: string) => {

  if (imageFormats.includes(fileExtension)) {
    return FileTypes.images;
  }

  if (videoFormats.includes(fileExtension)) {
    return FileTypes.videos;
  }

  if (buildFormats.includes(fileExtension)) {
    return "builds";
  }

  return "unknown-type";
}

export const slugify = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
}

export const getFilesInfo = (commonFilePath: string, files: File[]) => {
  let fileInfoList: any = [];
  files.forEach(file => {
    let fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    fileInfoList.push({
      filePath: `${commonFilePath}/${getFileLocation(fileExtension)}`,
      fileType: encodeURI(file.type)
    })
  })

  return fileInfoList;
}

export const getBuildFilesInfo = (commonFilePath: string, file: File) => {
  let fileInfo: any;
  let fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

  fileInfo = {
    filePath: `${commonFilePath}/${getFileLocation(fileExtension)}`,
    fileType: encodeURI(file.type)
  }

  return fileInfo;
}

export const waitForSeconds = (seconds: number) => {

  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const isValidVideoFileFormat = (file: File) => {
  const fileName = file.name.toLowerCase();
  return videoFormats.some(ext => fileName.endsWith(ext));
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

export const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, width: number, height: number, fileformat: string, setImageFileAction: (value: any) => void, maxFileSize: number = 0) => {
  const resetIconName = () => {
    setImageFileAction(null);
  }
  console.log(e.target.files);
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
          URL.revokeObjectURL(objectUrl);
          resetIconName();
          return;
        }
      }

      if (maxFileSize !== 0 && !isValidFileSize(file, maxFileSize)) {
        resetIconName();
        return;
      }

      setImageFileAction(file);
    }
  }
}

const setVideoFile = (format: string, maxFileSize: number, files: FileList, action: (value: any) => void) => {
  console.log("file name: ", files);
  if (files && files[0]) {
    const file = files[0];

    if (!isValidFileFormat(file, format)) {
      notify(`Please upload ${format} file format`, { type: "warning" });
      return;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      notify(`File size must be ${maxFileSize} MB or less`, { type: "warning" });
      return;
    }

    console.log(file.name);
    action(file);
  }
}

export const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, action: (value: any) => void, format: string, maxFileSize: number) => {
  const files: FileList = e.target.files as FileList;
  setVideoFile(format, maxFileSize, files, action);
};

export const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, action: (value: any) => void, format: string, maxFileSize: number) => {
  e.preventDefault();
  const files: FileList = e.dataTransfer.files as FileList;
  setVideoFile(format, maxFileSize, files, action);
};


export const formatTime = (_milliSeconds: string) => {
  const milliSeconds = Number(_milliSeconds);
  const totalSeconds = Math.floor(milliSeconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const time: string[] = [];

  if (hours > 0) time.push(`${hours} hr${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) time.push(`${minutes} min${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0 || time.length === 0)
    time.push(`${seconds} sec${seconds !== 1 ? 's' : ''}`);

  // console.log(`Formatted Time: ${time.join(' ')}`);
  return time.join(' ');
}

export const isObjectEmpty = (obj: object) => {
  if (!obj) return true

  return Object.keys(obj).length === 0;
}

export const getISODateStringByDay = (day: string) => {
  const date = new Date();
  date.setDate(date.getDate() - Number(day));
  return date.toISOString();
}

export const getISODateStringByDate = (_date: string) => {
  const date = new Date(_date);
  return date.toISOString();
}

export const convertToUTCBoundary = (_date: string, isEndDate: boolean = false) => {
  const date = new Date(_date);

  isEndDate
    ? date.setUTCHours(23, 59, 59, 999)
    : date.setUTCHours(0, 0, 0, 0);

  return date.toISOString();
};

export const isEmptyContent = (node: any): boolean => React.Children.count(node) === 0;
export const isEmptyObject = (object: Record<string, any>): boolean => object && Object.keys(object).length === 0;
export const removeWhiteSpace = (data: string) => data.replace(/\s+/g, '');
export const goToPage = (pageUrl: string) => window.location.href = '/#' + pageUrl;
export const cloneObject = (object: any) => JSON.parse(JSON.stringify(object));

export const setElementId = (data: any) => {
  return data.map((data: any, index: any) => {
    return {
      ...data,
      id: index + 1
    }
  });
}
