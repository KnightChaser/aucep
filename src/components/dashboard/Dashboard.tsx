import { useState, useMemo } from "react";
import type {
  ExtendedTickerData,
  CandleData,
  MarketTotals,
  MarketFilterState,
} from "@/types";
import { TickerCard } from "@/components/TickerCard";
import { MarketFilter } from "@/components/dashboard/MarketFilter";
import { SortControls, type SortConfig } from "@/components/dashboard/SortControls";
import { MarketDetailsDialog } from "@/components/dashboard/MarketDetailsDialog";
import { formatTime } from "@/utils/formatters";
import { motion } from "framer-motion";

interface DashboardProps {
  data: ExtendedTickerData[];
  loading: boolean;
  lastUpdate: Date | null;
  candleData: { [market: string]: CandleData[] };
  marketTotals: MarketTotals;
  marketFilter: MarketFilterState;
  progress: { current: number; total: number };
}

export const Dashboard = ({
  data,
  loading,
  lastUpdate,
  candleData,
  marketTotals,
  marketFilter,
  progress,
}: DashboardProps) => {
  const {
    formattedKRWTotal,
    btcEquivalent,
    ethEquivalent,
    xrpEquivalent,
    formatCrypto,
  } = marketTotals;

  const {
    allMarkets,
    visibleMarkets,
    onToggleMarket,
    onToggleAll,
    onSetMarketVisible,
  } = marketFilter;

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'trade_price_24h',
    direction: 'desc'
  });

  const [selectedTicker, setSelectedTicker] = useState<ExtendedTickerData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleTickerClick = (item: ExtendedTickerData) => {
    setSelectedTicker(item);
    setIsDetailsOpen(true);
  };

  const sortedData = useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      if (sortConfig.field === 'change_rate') {
        aValue = a.signed_change_rate;
        bValue = b.signed_change_rate;
      } else if (sortConfig.field === 'trade_price_24h') {
        aValue = a.acc_trade_price_24h;
        bValue = b.acc_trade_price_24h;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  const isChartLoading = progress.total > 0 && progress.current < progress.total;
  
  let statusText = "SYSTEM_ONLINE";
  let statusColor = "text-neon-green";

  if (loading) {
    statusText = "CONNECTING_TO_EXCHANGE...";
    statusColor = "text-neon-red";
  } else if (isChartLoading) {
    statusText = `INITIALIZING_CHARTS [${progress.current}/${progress.total}]`;
    statusColor = "text-neon-yellow";
  }

  return (
    <div className="min-h-screen py-12 text-gray-200 font-sans selection:bg-neon-blue/30">
      <div className="max-w-screen-2xl mx-auto px-6">
        <header className="mb-12 relative">
          <div
            className="grid items-center gap-8"
            style={{ gridTemplateColumns: "1fr auto 1fr" }}
          >
            {/* Left: Title */}
            <div className="justify-self-start select-none">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-12 bg-gradient-to-b from-neon-blue to-neon-purple rounded-full"></div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight text-white">
                    AUCEP
                  </h1>
                  <div className="text-sm text-gray-400 font-medium tracking-wide">
                    AESTHETIC UPBIT CRYPTO EXCHANGE PANEL
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2 ml-6">
                <div className={`w-2 h-2 rounded-full ${statusColor === 'text-neon-green' ? 'bg-neon-green shadow-[0_0_8px_rgba(16,185,129,0.6)]' : statusColor === 'text-neon-yellow' ? 'bg-neon-yellow' : 'bg-neon-red'}`}></div>
                <span className={`text-xs font-medium tracking-wide ${statusColor}`}>
                  {statusText.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Center: Totals HUD */}
            <div className="justify-self-center text-center">
              <div className="glass-panel rounded-2xl p-8 min-w-[320px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue opacity-50"></div>
                
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-semibold">
                  Total Asset Value
                </div>
                <div
                  className="text-5xl font-bold text-white tabular-nums tracking-tight mb-4"
                  style={{ fontFeatureSettings: "'tnum'" }}
                >
                  <span className="text-2xl text-gray-500 mr-2 font-normal">₩</span>
                  {formattedKRWTotal}
                </div>
                
                <div className="flex justify-center gap-4 text-xs font-medium tabular-nums">
                  {btcEquivalent !== null && (
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                      <span className="text-neon-yellow">BTC</span>
                      <span className="text-gray-300">{formatCrypto(btcEquivalent)}</span>
                    </div>
                  )}
                  {ethEquivalent !== null && (
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                      <span className="text-neon-blue">ETH</span>
                      <span className="text-gray-300">{formatCrypto(ethEquivalent)}</span>
                    </div>
                  )}
                  {xrpEquivalent !== null && (
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                      <span className="text-neon-green">XRP</span>
                      <span className="text-gray-300">{formatCrypto(xrpEquivalent)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Filter and Last update */}
            <div className="justify-self-end flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <SortControls sortConfig={sortConfig} onSortChange={setSortConfig} />
                <MarketFilter
                  markets={allMarkets}
                  visibleMarkets={visibleMarkets}
                  onToggleMarket={onToggleMarket}
                  onToggleAll={onToggleAll}
                  onSetMarketVisible={onSetMarketVisible}
                />
              </div>
              {lastUpdate && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                  <span>LAST SYNC</span>
                  <span className="text-gray-300">{formatTime(lastUpdate)}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <motion.div
          layout
          className="grid gap-6 auto-rows-fr"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}
        >
          {loading
            ? Array.from({ length: 28 }, (_, i) => (
                <div
                  key={i}
                  className="h-64 glass-panel rounded-2xl animate-pulse"
                />
              ))
            : sortedData.map((item) => (
                <TickerCard
                  key={item.market}
                  item={item}
                  candleData={candleData[item.market]}
                  onClick={() => handleTickerClick(item)}
                />
              ))}
        </motion.div>

        <MarketDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          item={selectedTicker}
          allTickerData={data}
        />
      </div>
    </div>
  );
};
