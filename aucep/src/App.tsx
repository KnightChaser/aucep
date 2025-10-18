import { useTickerData } from "@/hooks/useTickerData";
import { TickerCard } from "@/components/TickerCard";

function App() {
    const { data, loading } = useTickerData();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Cryptocurrency Ticker</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((item, index) => (
                    <TickerCard key={item.market} item={item} index={index} />
                ))}
            </div>
        </div>
    );
}

export default App;
