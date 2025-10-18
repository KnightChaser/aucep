import { useTickerData } from "@/hooks/useTickerData";
import { TickerCard } from "@/components/TickerCard";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
    const { data, loading, lastUpdate } = useTickerData();

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", { hour12: false });
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
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
