import { useTickerData } from "@/hooks/useTickerData";
import { useCandleData } from "@/hooks/useCandleData";
import { TickerCard } from "@/components/TickerCard";
import { formatTime } from "@/utils/formatters";

function App() {
    const { data, loading, lastUpdate } = useTickerData();
    const markets = data.map((d) => d.market);
    const { candleData } = useCandleData(markets);

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-screen-2xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="inline-block select-none">
                        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                            AUCEP
                        </h1>
                        <div className="mt-1 text-sm text-gray-500" aria-hidden>
                            Aesthetic Upbit Cryptocurrency Exchange Panel
                        </div>
                    </div>
                    {lastUpdate && (
                        <p className="text-sm text-gray-600">
                            Last update: {formatTime(lastUpdate)}
                        </p>
                    )}
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
