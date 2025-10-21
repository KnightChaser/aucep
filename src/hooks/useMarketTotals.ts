import { useMemo } from "react";
import type { ExtendedTickerData } from "@/types";

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

  // Find spot prices for conversions
  const btcPrice = useMemo(
    () => data.find((d) => d.market === "KRW-BTC")?.trade_price ?? null,
    [data]
  );
  const ethPrice = useMemo(
    () => data.find((d) => d.market === "KRW-ETH")?.trade_price ?? null,
    [data]
  );
  const xrpPrice = useMemo(
    () => data.find((d) => d.market === "KRW-XRP")?.trade_price ?? null,
    [data]
  );

  const formatCrypto = (v: number) =>
    v >= 1
      ? v.toLocaleString("en-US", { maximumFractionDigits: 4 })
      : v.toLocaleString("en-US", { maximumFractionDigits: 8 });

  const btcEquivalent = useMemo(
    () => (btcPrice ? totalAccTradePrice24h / btcPrice : null),
    [btcPrice, totalAccTradePrice24h]
  );
  const ethEquivalent = useMemo(
    () => (ethPrice ? totalAccTradePrice24h / ethPrice : null),
    [ethPrice, totalAccTradePrice24h]
  );
  const xrpEquivalent = useMemo(
    () => (xrpPrice ? totalAccTradePrice24h / xrpPrice : null),
    [xrpPrice, totalAccTradePrice24h]
  );

  return {
    formattedKRWTotal,
    btcEquivalent,
    ethEquivalent,
    xrpEquivalent,
    formatCrypto,
  };
};
