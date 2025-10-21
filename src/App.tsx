import { useTickerData } from "@/hooks/useTickerData";
import { useCandleData } from "@/hooks/useCandleData";
import { useMarketTotals } from "@/hooks/useMarketTotals";
import { Dashboard } from "@/components/dashboard/Dashboard";

/**
 * Main App component that orchestrates data fetching and rendering.
 * Fetches ticker data, candle data, computes market totals, and renders the dashboard.
 */
function App() {
  // Fetch real-time ticker data for KRW markets
  const { data, loading, lastUpdate } = useTickerData();
  // Extract market codes for candle data fetching
  const markets = data.map((d) => d.market);
  // Fetch candle data for charts
  const { candleData } = useCandleData(markets);
  // Compute market totals and crypto equivalents
  const {
    formattedKRWTotal,
    btcEquivalent,
    ethEquivalent,
    xrpEquivalent,
    formatCrypto,
  } = useMarketTotals(data);

  return (
    <Dashboard
      data={data}
      loading={loading}
      lastUpdate={lastUpdate}
      candleData={candleData}
      formattedKRWTotal={formattedKRWTotal}
      btcEquivalent={btcEquivalent}
      ethEquivalent={ethEquivalent}
      xrpEquivalent={xrpEquivalent}
      formatCrypto={formatCrypto}
    />
  );
}

export default App;
