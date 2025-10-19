import { useState, useEffect } from "react";

export interface Market {
    market: string;
    korean_name: string;
    english_name: string;
}

export interface TickerData {
    market: string;
    trade_price: number;
    change: string;
    change_price: number;
    change_rate: number;
    signed_change_price: number;
    signed_change_rate: number;
    trade_volume: number;
    acc_trade_price: number;
    acc_trade_price_24h: number;
    acc_trade_volume: number;
    acc_trade_volume_24h: number;
    highest_52_week_price: number;
    highest_52_week_date: string;
    lowest_52_week_price: number;
    lowest_52_week_date: string;
    timestamp: number;
}

export interface ExtendedTickerData extends TickerData {
    english_name: string;
}

export const useTickerData = () => {
    const [data, setData] = useState<ExtendedTickerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [markets, setMarkets] = useState<Market[]>([]);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const response = await fetch(
                    "https://api.upbit.com/v1/market/all"
                );
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
                    `https://api.upbit.com/v1/ticker?markets=${marketsParam}`
                );
                const json: TickerData[] = await response.json();
                const merged: ExtendedTickerData[] = json.map((ticker) => {
                    const marketInfo = markets.find(
                        (m) => m.market === ticker.market
                    );
                    return {
                        ...ticker,
                        english_name:
                            marketInfo?.english_name ||
                            ticker.market.replace("KRW-", ""),
                    };
                });
                setData(
                    merged.sort(
                        (a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h
                    )
                );
                setLoading(false);
                setLastUpdate(new Date());
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, [markets]);

    return { data, loading, lastUpdate };
};
