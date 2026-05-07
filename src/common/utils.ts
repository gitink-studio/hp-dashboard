import { fetchUtils } from "react-admin";
import { clampPublisherCustomRange } from "./publisher-custom-dates";
import { DECIMAL_LENGTH, FileType, GRAPHQL_URL, HttpMethod } from "./constants";
import { FetchData } from "../data-providers/data-provider";
import { notify } from "../components/notify";
import { print } from "graphql";
import React from "react";
import Resizer from "react-image-file-resizer";

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

/** Parse `YYYY-MM-DD` as a local-calendar Date (noon avoids DST edge cases). */
export function parseLocalYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function addCalendarDaysLocal(base: Date, deltaDays: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + deltaDays, 12, 0, 0, 0);
}

/**
 * Inclusive end date for rolling presets (Last 7d / 14d / 30d) relative to the daily metrics job.
 *
 * - **Before** `VITE_DAILY_METRICS_READY_HOUR_LOCAL` (default 8): assume yesterday’s run is not
 *   available yet → end is **two calendar days before today** (e.g. on Apr 6 → Apr 4).
 * - **On/after** that hour: end is **yesterday** (e.g. Apr 6 → Apr 5 after the schedule).
 *
 * Uses the browser’s local calendar and local clock. Override hour with
 * `VITE_DAILY_METRICS_READY_HOUR_LOCAL` (0–23), e.g. `6` if the job finishes by 6:00 local.
 */
export function getDailyMetricsRollingEndYmd(now: Date = new Date()): string {
  const readyHour = Number(
    import.meta.env.VITE_DAILY_METRICS_READY_HOUR_LOCAL ?? '8',
  );
  const h = Number.isFinite(readyHour) ? readyHour : 8;
  const afterCutoff = now.getHours() >= h;
  const offsetFromToday = afterCutoff ? 1 : 2;

  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - offsetFromToday,
  );
  return toLocalDateString(d);
}

/**
 * Bounds for developer dashboard GraphQL / REST from preset `dateRange`.
 * "Yesterday" is a single local calendar day (startDate === endDate).
 *
 * Last 7d / 14d / 30d use {@link getDailyMetricsRollingEndYmd} as **endDate** (aligned with when
 * yesterday’s DailyMetrics row exists). **Last 30d** uses **31** inclusive calendar cohort days
 * (start = end − 30), e.g. on Apr 6 after cutoff → Mar 6–Apr 5; before cutoff → Mar 5–Apr 4.
 * Last 7d / 14d use N inclusive days (start = end − (N − 1)).
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

  const endYmd = getDailyMetricsRollingEndYmd(now);
  const endBase = parseLocalYmd(endYmd);

  let spanInclusive: number;
  let startOffsetFromEnd: number;
  switch (dr) {
    case 'Last 7d':
    case '7d':
      spanInclusive = 7;
      startOffsetFromEnd = spanInclusive - 1;
      break;
    case 'Last 14d':
    case '14d':
      spanInclusive = 14;
      startOffsetFromEnd = spanInclusive - 1;
      break;
    case 'Last 30d':
    case '30d':
      spanInclusive = 31;
      startOffsetFromEnd = 30;
      break;
    default:
      spanInclusive = 31;
      startOffsetFromEnd = 30;
  }

  const startBase = addCalendarDaysLocal(endBase, -startOffsetFromEnd);
  return {
    startDate: toLocalDateString(startBase),
    endDate: endYmd,
  };
}

/** Default Custom range: same span as Last 30d (31 inclusive days) through rolling metrics end. */
export function getDefaultCustomDashboardRange(): { startDate: string; endDate: string } {
  const endYmd = getDailyMetricsRollingEndYmd();
  const endBase = parseLocalYmd(endYmd);
  const startBase = addCalendarDaysLocal(endBase, -30);
  return {
    startDate: toLocalDateString(startBase),
    endDate: endYmd,
  };
}

export type DashboardFilterDates = {
  dateRange: string;
  startDate?: string;
  endDate?: string;
};

/** GraphQL / chips: strip time zone suffix from daily-metrics range strings. */
export function toDateOnlyYmd(isoOrYmd: string): string {
  return String(isoOrYmd).split('T')[0];
}

/** Filters for `GET /hyper-rabbit/metrics/daily/:gameId` (developer + publisher). */
export type HyperRabbitDailyMetricsFilters = {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  customStartDate?: string;
  customEndDate?: string;
};

/**
 * Query params for Hyper Rabbit REST daily (and aggregate) metrics.
 * Matches publisher `publisher-games-list` date rules: UTC calendar for Today/Yesterday,
 * rolling presets from {@link getDashboardDateBounds}, Custom via publisher UTC max-end clamp
 * and `…T23:59:59.999Z` on end (EventLog-style upper bound where used).
 */
export function getHyperRabbitDailyMetricsRange(
  filters: HyperRabbitDailyMetricsFilters,
): { startDate: string; endDate: string } {
  const dr = filters.dateRange ?? 'Last 30d';

  if (dr === 'Yesterday') {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth();
    const d = now.getUTCDate();
    const dayStr = new Date(Date.UTC(y, m, d - 1)).toISOString().split('T')[0];
    return { startDate: dayStr, endDate: `${dayStr}T23:59:59.999Z` };
  }

  if (dr === 'Today') {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth();
    const d = now.getUTCDate();
    const dayStr = new Date(Date.UTC(y, m, d)).toISOString().split('T')[0];
    return { startDate: dayStr, endDate: `${dayStr}T23:59:59.999Z` };
  }

  if (dr === 'Custom') {
    const s = (filters.startDate ?? filters.customStartDate)?.trim();
    const e = (filters.endDate ?? filters.customEndDate)?.trim();
    if (s && e) {
      const { start, end } = clampPublisherCustomRange(s, e);
      return { startDate: start, endDate: `${end}T23:59:59.999Z` };
    }
    const b = getDashboardDateBounds('Last 30d')!;
    return { startDate: b.startDate, endDate: b.endDate };
  }

  const b = getDashboardDateBounds(dr) ?? getDashboardDateBounds('Last 30d')!;
  return { startDate: b.startDate, endDate: b.endDate };
}

/** Preset bounds from `dateRange`, or explicit `startDate`/`endDate` when `dateRange === 'Custom'`. */
export function getDashboardQueryDateBounds(
  filters: DashboardFilterDates,
): { startDate: string; endDate: string } | undefined {
  if (filters.dateRange === 'Custom') {
    const s = filters.startDate?.trim();
    const e = filters.endDate?.trim();
    if (s && e) {
      const { start, end } = clampPublisherCustomRange(s, e);
      return { startDate: start, endDate: end };
    }
    return undefined;
  }
  if (filters.dateRange === 'Yesterday' || filters.dateRange === 'Today') {
    const r = getHyperRabbitDailyMetricsRange(filters);
    return {
      startDate: toDateOnlyYmd(r.startDate),
      endDate: toDateOnlyYmd(r.endDate),
    };
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
    return "images";
  }

  if (videoFormats.includes(fileExtension)) {
    return "videos";
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

export const getFileInfo = (filePath: string, file: File, prefix: string = "") => {
  let fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  return {
    filePath: `${filePath}/${getFileLocation(fileExtension)}`,
    fileType: encodeURI(file.type),
    prefix: prefix
  }
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

export const resizeImage = (props: any) => {
  const { file, maxWidth, maxHeight, onResize } = props;
  let resizedFile: any = null;

  if (file) {
    console.log(`File resizing... ${maxWidth}x${maxHeight}`);
    resizedFile = Resizer.imageFileResizer(file, maxWidth, maxHeight, 'JPEG', 100, 0, (uri) => onResize(uri));
  }

  return resizedFile;
}

export const convertBase64ToImageFile = (base64String: string, filename: string) => {
  const parts = base64String.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mimeType = mimeMatch?.[1] || 'image/jpeg';
  const base64Data = parts[1];
  const binaryString = atob(base64Data);
  const byteLength = binaryString.length;
  const byteArray = new Uint8Array(byteLength);

  for (let i = 0; i < byteLength; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return new File([byteArray], filename, { type: mimeType });
};

export const isSameAspectRatio = (resolution1: any, resolution2: any) => {
  const aspectRatio1 = resolution1.width / resolution1.height;
  const aspectRatio2 = resolution2.width / resolution2.height;

  console.log(`Aspect Ratio 1: ${aspectRatio1}, Aspect Ratio 2: ${aspectRatio2}`);

  return aspectRatio1 === aspectRatio2;
}

export const isImageFile = (file: any) => {
  return file?.type?.startsWith(`${FileType.image}/`)
}

