import { UPBIT_API_BASE } from "@/constants/api";

/**
 * Generic fetch wrapper with error handling
 */
export const apiFetch = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetches data from the Upbit API
 */
export const upbitFetch = async <T>(endpoint: string): Promise<T> => {
  return apiFetch<T>(`${UPBIT_API_BASE}${endpoint}`);
};

/**
 * Fetches all markets from Upbit
 */
export const fetchMarkets = () =>
  upbitFetch<
    Array<{
      market: string;
      korean_name: string;
      english_name: string;
    }>
  >("/market/all");

/**
 * Fetches ticker data for specified markets
 */
export const fetchTicker = (markets: string[]) => {
  const marketsParam = markets.join(",");
  return upbitFetch<Array<any>>(`/ticker?markets=${marketsParam}`);
};

/**
 * Fetches candle data for a specific market
 */
export const fetchCandles = (market: string, count: number) => {
  const toParam = new Date().toISOString();
  return apiFetch<Array<any>>(
    `/upbit/v1/candles/minutes/3?market=${market}&to=${encodeURIComponent(
      toParam
    )}&count=${count}`
  );
};
