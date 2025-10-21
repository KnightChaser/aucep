export const UPBIT_API_BASE = "https://api.upbit.com/v1";

export const CANDLE_REQUEST_INTERVAL_MS = 200; // 5 req/sec
export const CANDLE_REFRESH_MS = 3 * 60 * 1000; // refresh every 3 minutes
export const CANDLE_COUNT = 120; // 6 hours of 3-minute candles

export const TICKER_UPDATE_INTERVAL_MS = 1000; // 1 second

export const CRYPTO_SYMBOLS = ["BTC", "ETH", "XRP"] as const;
