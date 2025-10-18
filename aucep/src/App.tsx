import { useState, useEffect } from "react";

interface TickerData {
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

function App() {
    const [data, setData] = useState<TickerData[]>([]);

    useEffect(() => {
        const markets = [
            "KRW-BTC",
            "KRW-ETH",
            "KRW-BCH",
            "KRW-AAVE",
            "KRW-SOL",
            "KRW-COMP",
            "KRW-BSV",
            "KRW-AVAX",
            "KRW-LINK",
            "KRW-DOT",
            "KRW-SUI",
            "KRW-QTUM",
            "KRW-USDT",
            "KRW-WAVES",
            "KRW-ZBT",
            "KRW-SAND",
            "KRW-ZRX",
            "KRW-DOGE",
            "KRW-STRAX",
            "KRW-TFUEL",
            "KRW-FCT2",
            "KRW-ZIL",
            "KRW-IOST",
            "KRW-XEC",
            "KRW-SHIB",
            "KRW-PEPE",
            "KRW-BTT",
        ];
        const url = `https://api.upbit.com/v1/ticker?markets=${markets.join(
            ","
        )}`;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json: TickerData[] = await response.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price: number, market: string) => {
        if (market.startsWith("KRW")) {
            if (price < 1) {
                return `₩${price.toFixed(6)}`;
            } else {
                return `₩${price.toLocaleString()}`;
            }
        }
        return price.toString();
    };

    const formatChange = (change: string, price: number, rate: number) => {
        const sign = change === "RISE" ? "+" : change === "FALL" ? "-" : "";
        return `${sign}${Math.abs(price).toLocaleString()} (${(
            rate * 100
        ).toFixed(2)}%)`;
    };

    if (data.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Cryptocurrency Ticker</h1>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                            Market
                        </th>
                        <th
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                            Trade Price
                        </th>
                        <th
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                            Change
                        </th>
                        <th
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                            Trade Volume
                        </th>
                        <th
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                            24h Volume
                        </th>
                        <th
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                            24h Price
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.market}>
                            <td
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {item.market}
                            </td>
                            <td
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {formatPrice(item.trade_price, item.market)}
                            </td>
                            <td
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {formatChange(
                                    item.change,
                                    item.signed_change_price,
                                    item.signed_change_rate
                                )}
                            </td>
                            <td
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {item.trade_volume.toFixed(8)}
                            </td>
                            <td
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {item.acc_trade_volume_24h.toFixed(2)}
                            </td>
                            <td
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "8px",
                                }}
                            >
                                {formatPrice(
                                    item.acc_trade_price_24h,
                                    item.market
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
