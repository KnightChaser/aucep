import { useMemo } from "react";
import { useTickerData } from "@/hooks/useTickerData";
import { useCandleData } from "@/hooks/useCandleData";
import { useMarketTotals } from "@/hooks/useMarketTotals";
import { useMarketFilter } from "@/hooks/useMarketFilter";
import { Dashboard } from "@/components/dashboard/Dashboard";

/**
 * Main App component that orchestrates data fetching and rendering.
 * Fetches ticker data, candle data, computes market totals, and renders the dashboard.
 */
function App() {
  // Fetch real-time ticker data for KRW markets
  const { data, loading, lastUpdate } = useTickerData();

  // Extract market codes for candle data fetching (memoized to prevent unnecessary re-renders)
  const markets = useMemo(() => data.map((d) => d.market), [data]);

  // Fetch candle data for charts
  const { candleData } = useCandleData(markets);

  // Compute market totals and crypto equivalents
  const marketTotals = useMarketTotals(data);

  // Market filtering
  const {
    visibleMarkets,
    toggleMarket,
    toggleAll,
    filteredData,
    setMarketVisible,
  } = useMarketFilter(markets);

  const filteredTickerData = useMemo(
    () => filteredData(data),
    [filteredData, data]
  );

  // Aggregate filter state for cleaner prop passing
  const marketFilter = useMemo(
    () => ({
      allMarkets: markets,
      visibleMarkets,
      onToggleMarket: toggleMarket,
      onToggleAll: toggleAll,
      onSetMarketVisible: setMarketVisible,
    }),
    [markets, visibleMarkets, toggleMarket, toggleAll, setMarketVisible]
  );

  return (
    <Dashboard
      data={filteredTickerData}
      loading={loading}
      lastUpdate={lastUpdate}
      candleData={candleData}
      marketTotals={marketTotals}
      marketFilter={marketFilter}
    />
  );
}
export default App;
