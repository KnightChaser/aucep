import { useState, useEffect } from "react";
import type { Market, TickerData, ExtendedTickerData } from "@/types";
import { UPBIT_API_BASE, TICKER_UPDATE_INTERVAL_MS } from "@/constants/api";

export const useTickerData = () => {
  const [data, setData] = useState<ExtendedTickerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch(`${UPBIT_API_BASE}/market/all`);
        const allMarkets: Market[] = await response.json();
        const krwMarkets = allMarkets.filter((m) =>
          m.market.startsWith("KRW-")
        );
        setMarkets(krwMarkets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    fetchMarkets();
  }, []);

  useEffect(() => {
    if (markets.length === 0) return;

    const fetchData = async () => {
      try {
        const marketsParam = markets.map((m) => m.market).join(",");
        const response = await fetch(
          `${UPBIT_API_BASE}/ticker?markets=${marketsParam}`
        );
        const json: TickerData[] = await response.json();
        const merged: ExtendedTickerData[] = json.map((ticker) => {
          const marketInfo = markets.find((m) => m.market === ticker.market);
          return {
            ...ticker,
            english_name:
              marketInfo?.english_name || ticker.market.replace("KRW-", ""),
          };
        });
        setData(
          merged.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
        );
        setLoading(false);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, TICKER_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [markets]);

  return { data, loading, lastUpdate };
};
