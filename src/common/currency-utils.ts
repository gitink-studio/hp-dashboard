import { formatDecimalNumber } from './utils';

/**
 * Publisher dashboard API aggregates (games list, KPIs, geo/payout queries) use INR as the base unit.
 * Selecting another currency converts for display using static FX (approximate; replace with live rates if needed).
 */
export const PUBLISHER_MONETARY_BASE_CURRENCY = 'INR';

/** INR per 1 unit of foreign currency */
const INR_PER_FOREIGN_UNIT: Record<string, number> = {
  INR: 1,
  USD: 83,
  EUR: 91,
  GBP: 107,
  JPY: 0.56,
  CAD: 61,
  AUD: 55,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

export function convertFromInr(amountInr: number, toCurrency: string): number {
  const code = (toCurrency || PUBLISHER_MONETARY_BASE_CURRENCY).toUpperCase();
  if (code === 'INR' || !Number.isFinite(amountInr)) return amountInr;
  const rate = INR_PER_FOREIGN_UNIT[code];
  if (!rate) return amountInr;
  return amountInr / rate;
}

export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[(code || PUBLISHER_MONETARY_BASE_CURRENCY).toUpperCase()] || `${code} `;
}

export function formatPublisherMoney(amountInr: number, currencyCode: string): string {
  const code = (currencyCode || PUBLISHER_MONETARY_BASE_CURRENCY).toUpperCase();
  const converted = convertFromInr(amountInr, code);
  return `${getCurrencySymbol(code)}${formatDecimalNumber(converted)}`;
}

export function formatPublisherMoneyFixed(
  amountInr: number,
  currencyCode: string,
  fractionDigits: number = 2
): string {
  const code = (currencyCode || PUBLISHER_MONETARY_BASE_CURRENCY).toUpperCase();
  const converted = convertFromInr(amountInr, code);
  const n = converted.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return `${getCurrencySymbol(code)}${n}`;
}
