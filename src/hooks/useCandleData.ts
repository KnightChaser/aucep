import { useState, useEffect, useRef, useMemo } from "react";

export interface CandleData {
    market: string;
    candle_date_time_utc: string;
    candle_date_time_kst: string;
    opening_price: number;
    high_price: number;
    low_price: number;
    trade_price: number;
    timestamp: number;
    candle_acc_trade_price: number;
    candle_acc_trade_volume: number;
    unit: number;
}

interface CandleDataMap {
    [market: string]: CandleData[];
}

const REQUEST_INTERVAL_MS = 200; // 5 req/sec
const REFRESH_MS = 3 * 60 * 1000; // refresh every 3 minutes

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
            // 3-minute candles, 6 hours -> 6*60/3 = 120 data points
            const count = 120;
            const toParam = new Date().toISOString();
            const url = `/upbit/v1/candles/minutes/3?market=${market}&to=${encodeURIComponent(
                toParam
            )}&count=${count}`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const json: CandleData[] = await res.json();
            return json.reverse();
        };

        const runSequential = async () => {
            setLoading(true);
            console.log(
                `[candle] run start: ${queueRef.current.length} markets`
            );
            for (let i = 0; i < queueRef.current.length; i++) {
                if (cancelled) break;
                const market = queueRef.current[i];
                try {
                    console.log(
                        `[candle] ${i + 1}/${
                            queueRef.current.length
                        } fetching ${market}; next in ${REQUEST_INTERVAL_MS}ms`
                    );
                    const candles = await fetchOne(market);
                    if (candles) {
                        // apply update incrementally so panels render one-by-one
                        setCandleData((prev) => ({
                            ...prev,
                            [market]: candles,
                        }));
                        console.log(
                            `[candle] done ${market} (${candles.length} pts)`
                        );
                    }
                } catch (e) {
                    console.error("candle fetch error", market, e);
                }
                // throttle to 5 req/sec
                await new Promise((r) => setTimeout(r, REQUEST_INTERVAL_MS));
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
        }, REFRESH_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stableKey]);

    return { candleData, loading };
};
