import { useTickerData } from "@/hooks/useTickerData";
import { TickerCard } from "@/components/TickerCard";
import { formatTime } from "@/utils/formatters";

function App() {
    const { data, loading, lastUpdate } = useTickerData();

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-screen-2xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Cryptocurrency Ticker
                    </h1>
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
                              <TickerCard key={item.market} item={item} />
                          ))}
                </div>
            </div>
        </div>
    );
}

export default App;
