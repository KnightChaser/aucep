import { useState, useEffect, useRef, useMemo } from "react";
import type { CandleData } from "@/types";
import {
  CANDLE_REQUEST_INTERVAL_MS,
  CANDLE_REFRESH_MS,
  CANDLE_COUNT,
} from "@/constants/api";
import { fetchCandles } from "@/lib/api";

interface CandleDataMap {
  [market: string]: CandleData[];
}

export const useCandleData = (markets: string[]) => {
  const [candleData, setCandleData] = useState<CandleDataMap>({});
  const [loading, setLoading] = useState(true);
  const queueRef = useRef<string[]>([]);
  // Stable key ignores ordering; prevents restarts when only sort order changes
  const stableKey = useMemo(
    () => Array.from(new Set(markets)).sort().join(","),
    [markets]
  );

  useEffect(() => {
    if (!markets || markets.length === 0) return;
    queueRef.current = Array.from(new Set(markets));

    let cancelled = false;

    const fetchOne = async (market: string) => {
      try {
        const json = await fetchCandles(market, CANDLE_COUNT);
        return json.reverse();
      } catch (error) {
        console.error(`Error fetching candles for ${market}:`, error);
        return null;
      }
    };

    const runSequential = async () => {
      setLoading(true);
      console.log(`[candle] run start: ${queueRef.current.length} markets`);
      for (let i = 0; i < queueRef.current.length; i++) {
        if (cancelled) break;
        const market = queueRef.current[i];
        console.log(
          `[candle] ${i + 1}/${
            queueRef.current.length
          } fetching ${market}; next in ${CANDLE_REQUEST_INTERVAL_MS}ms`
        );
        const candles = await fetchOne(market);
        if (candles) {
          // apply update incrementally so panels render one-by-one
          setCandleData((prev) => ({
            ...prev,
            [market]: candles,
          }));
          console.log(`[candle] done ${market} (${candles.length} pts)`);
        }
        // throttle to 5 req/sec
        await new Promise((r) => setTimeout(r, CANDLE_REQUEST_INTERVAL_MS));
      }
      if (!cancelled) {
        setLoading(false);
        console.log("[candle] run complete");
      }
    };

    runSequential();

    const interval = setInterval(() => {
      if (cancelled) return;
      queueRef.current = Array.from(new Set(markets));
      runSequential();
    }, CANDLE_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableKey]);

  return { candleData, loading };
};
