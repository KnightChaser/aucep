import { useMemo } from "react";
import { useTickerData } from "@/hooks/useTickerData";
import { useCandleData } from "@/hooks/useCandleData";
import { TickerCard } from "@/components/TickerCard";
import { formatTime } from "@/utils/formatters";

function App() {
    const { data, loading, lastUpdate } = useTickerData();
    const markets = data.map((d) => d.market);
    const { candleData } = useCandleData(markets);

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

    // (old duplicate aggregate calculations removed)

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-screen-2xl mx-auto px-6">
                <div className="mb-8">
                    <div
                        className="grid items-start gap-4"
                        style={{ gridTemplateColumns: "1fr auto 1fr" }}
                    >
                        {/* Left: Title */}
                        <div className="justify-self-start select-none">
                            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                                AUCEP
                            </h1>
                            <div
                                className="mt-1 text-sm text-gray-500"
                                aria-hidden
                            >
                                Aesthetic Upbit Cryptocurrency Exchange Panel
                            </div>
                        </div>

                        {/* Center: Totals */}
                        <div className="justify-self-center text-center">
                            <div className="text-xs text-gray-500 mb-1">
                                24h KRW market trading price
                            </div>
                            <div
                                className="text-3xl md:text-4xl font-extrabold text-gray-900 tabular-nums"
                                style={{ fontFeatureSettings: "'tnum'" }}
                            >
                                <span aria-hidden className="mr-1">
                                    ₩
                                </span>
                                {formattedKRWTotal}
                            </div>
                            <div
                                className="mt-1 space-x-4 text-xs text-gray-500 tabular-nums"
                                style={{ fontFeatureSettings: "'tnum'" }}
                            >
                                {btcEquivalent !== null && (
                                    <span>
                                        <span aria-hidden className="mr-1">
                                            BTC
                                        </span>
                                        {formatCrypto(btcEquivalent)}
                                    </span>
                                )}
                                {ethEquivalent !== null && (
                                    <span>
                                        <span aria-hidden className="mr-1">
                                            ETH
                                        </span>
                                        {formatCrypto(ethEquivalent)}
                                    </span>
                                )}
                                {xrpEquivalent !== null && (
                                    <span>
                                        <span className="mr-1">XRP</span>
                                        {formatCrypto(xrpEquivalent)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Last update */}
                        <div className="justify-self-end">
                            {lastUpdate && (
                                <p className="text-sm text-gray-600">
                                    Last update: {formatTime(lastUpdate)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className="grid gap-8 auto-rows-fr"
                    style={{
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(340px, 1fr))",
                    }}
                >
                    {loading
                        ? Array.from({ length: 28 }, (_, i) => (
                              <div
                                  key={i}
                                  className="h-full bg-white shadow rounded-lg p-4"
                              />
                          ))
                        : data.map((item) => (
                              <TickerCard
                                  key={item.market}
                                  item={item}
                                  candleData={candleData[item.market]}
                              />
                          ))}
                </div>
            </div>
        </div>
    );
}

export default App;
