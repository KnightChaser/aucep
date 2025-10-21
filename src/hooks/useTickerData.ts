import { useState, useEffect } from "react";
import type { Market, TickerData, ExtendedTickerData } from "@/types";
import { TICKER_UPDATE_INTERVAL_MS } from "@/constants/api";
import { fetchMarkets, fetchTicker } from "@/lib/api";

export const useTickerData = () => {
  const [data, setData] = useState<ExtendedTickerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const allMarkets = await fetchMarkets();
        const krwMarkets = allMarkets.filter((m) =>
          m.market.startsWith("KRW-")
        );
        setMarkets(krwMarkets);
      } catch (error) {
        console.error("Error fetching markets:", error);
      }
    };

    loadMarkets();
  }, []);

  useEffect(() => {
    if (markets.length === 0) return;

    const fetchData = async () => {
      try {
        const marketCodes = markets.map((m) => m.market);
        const json: TickerData[] = await fetchTicker(marketCodes);
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
