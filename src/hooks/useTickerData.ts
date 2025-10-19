import { useState, useEffect } from "react";
import { MARKETS } from "@/constants/markets";

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

export const useTickerData = () => {
    const [data, setData] = useState<TickerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        const markets = MARKETS;
        const url = `https://api.upbit.com/v1/ticker?markets=${markets.join(
            ","
        )}`;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json: TickerData[] = await response.json();
                setData(json);
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
    }, []);

    return { data, loading, lastUpdate };
};
