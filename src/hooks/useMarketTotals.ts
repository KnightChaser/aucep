import { useMemo } from "react";
import type { ExtendedTickerData } from "@/types";

/**
 * Finds the trading price for a specific cryptocurrency
 */
const getCryptoPrice = (
  data: ExtendedTickerData[],
  symbol: string
): number | null => {
  return data.find((d) => d.market === `KRW-${symbol}`)?.trade_price ?? null;
};

/**
 * Calculates the equivalent amount of cryptocurrency for a given KRW total
 */
const calculateCryptoEquivalent = (
  krwTotal: number,
  cryptoPrice: number | null
): number | null => {
  return cryptoPrice ? krwTotal / cryptoPrice : null;
};

/**
 * Formats cryptocurrency amounts with appropriate decimal places
 */
const formatCrypto = (v: number) =>
  v >= 1
    ? v.toLocaleString("en-US", { maximumFractionDigits: 4 })
    : v.toLocaleString("en-US", { maximumFractionDigits: 8 });

export const useMarketTotals = (data: ExtendedTickerData[]) => {
  // 24h KRW total across all markets
  const totalAccTradePrice24h = useMemo(
    () => data.reduce((sum, d) => sum + (d.acc_trade_price_24h || 0), 0),
    [data]
  );

  const formattedKRWTotal = useMemo(
    () =>
      new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(
        Math.round(totalAccTradePrice24h)
      ),
    [totalAccTradePrice24h]
  );

  // Get crypto prices for conversion
  const cryptoPrices = useMemo(
    () => ({
      BTC: getCryptoPrice(data, "BTC"),
      ETH: getCryptoPrice(data, "ETH"),
      XRP: getCryptoPrice(data, "XRP"),
    }),
    [data]
  );

  // Calculate crypto equivalents
  const btcEquivalent = useMemo(
    () => calculateCryptoEquivalent(totalAccTradePrice24h, cryptoPrices.BTC),
    [totalAccTradePrice24h, cryptoPrices.BTC]
  );

  const ethEquivalent = useMemo(
    () => calculateCryptoEquivalent(totalAccTradePrice24h, cryptoPrices.ETH),
    [totalAccTradePrice24h, cryptoPrices.ETH]
  );

  const xrpEquivalent = useMemo(
    () => calculateCryptoEquivalent(totalAccTradePrice24h, cryptoPrices.XRP),
    [totalAccTradePrice24h, cryptoPrices.XRP]
  );

  return {
    formattedKRWTotal,
    btcEquivalent,
    ethEquivalent,
    xrpEquivalent,
    formatCrypto,
  };
};
