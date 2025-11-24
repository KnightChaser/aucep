import type {
  ExtendedTickerData,
  CandleData,
  MarketTotals,
  MarketFilterState,
} from "@/types";
import { TickerCard } from "@/components/TickerCard";
import { MarketFilter } from "@/components/dashboard/MarketFilter";
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
    <div className="min-h-screen py-8 text-gray-100 font-mono">
      <div className="max-w-screen-2xl mx-auto px-6">
        <header className="mb-12 border-b-4 border-neon-green pb-6 relative">
          <div className="absolute -bottom-2 left-0 w-32 h-4 bg-neon-green skew-x-12"></div>
          <div
            className="grid items-end gap-8"
            style={{ gridTemplateColumns: "1fr auto 1fr" }}
          >
            {/* Left: Title */}
            <div className="justify-self-start select-none relative group">
              <h1 className="text-6xl font-black tracking-tighter text-white uppercase relative z-10 mix-blend-difference">
                AUCEP
                <span className="text-neon-green text-6xl absolute top-0 left-1 -z-10 opacity-70 animate-pulse">
                  AUCEP
                </span>
                <span className="text-neon-red text-6xl absolute top-0 -left-1 -z-10 opacity-70 animate-pulse delay-75">
                  AUCEP
                </span>
              </h1>
              <div className="mt-2 text-sm text-neon-blue font-bold tracking-widest uppercase border-l-2 border-neon-blue pl-2">
                STATUS: <span className={`${statusColor} animate-pulse`}>{statusText}</span>
                {isChartLoading && !loading && <span className="ml-2 text-xs text-gray-500 normal-case">(Performance may be degraded)</span>}
              </div>
            </div>

            {/* Center: Totals HUD */}
            <div className="justify-self-center text-center relative">
              <div className="absolute inset-0 border-2 border-neon-purple opacity-30 transform skew-x-12"></div>
              <div className="bg-bg-card border-2 border-neon-purple p-6 relative z-10 neo-brutal-shadow">
                <div className="text-[10px] text-neon-purple uppercase tracking-widest mb-2 font-bold">
                  Total Asset Value (KRW)
                </div>
                <div
                  className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight text-glow"
                  style={{ fontFeatureSettings: "'tnum'" }}
                >
                  <span aria-hidden className="mr-2 text-neon-purple">
                    ₩
                  </span>
                  {formattedKRWTotal}
                </div>
                <div className="mt-4 flex justify-center gap-6 text-xs font-bold tabular-nums">
                  {btcEquivalent !== null && (
                    <div className="flex flex-col items-center">
                      <span className="text-neon-yellow mb-1">BTC</span>
                      <span className="bg-gray-900 px-2 py-1 border border-gray-700">
                        {formatCrypto(btcEquivalent)}
                      </span>
                    </div>
                  )}
                  {ethEquivalent !== null && (
                    <div className="flex flex-col items-center">
                      <span className="text-neon-blue mb-1">ETH</span>
                      <span className="bg-gray-900 px-2 py-1 border border-gray-700">
                        {formatCrypto(ethEquivalent)}
                      </span>
                    </div>
                  )}
                  {xrpEquivalent !== null && (
                    <div className="flex flex-col items-center">
                      <span className="text-neon-green mb-1">XRP</span>
                      <span className="bg-gray-900 px-2 py-1 border border-gray-700">
                        {formatCrypto(xrpEquivalent)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Filter and Last update */}
            <div className="justify-self-end flex flex-col items-end gap-2">
              <MarketFilter
                markets={allMarkets}
                visibleMarkets={visibleMarkets}
                onToggleMarket={onToggleMarket}
                onToggleAll={onToggleAll}
                onSetMarketVisible={onSetMarketVisible}
              />
              {lastUpdate && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-black px-2 py-1 border border-gray-800">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-ping"></div>
                  SYNC: {formatTime(lastUpdate)}
                </div>
              )}
            </div>
          </div>
        </header>

        <motion.div
          layout
          className="grid gap-8 auto-rows-fr"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          }}
        >
          {loading
            ? Array.from({ length: 28 }, (_, i) => (
                <div
                  key={i}
                  className="h-64 bg-bg-card border-2 border-gray-800 animate-pulse"
                />
              ))
            : data.map((item) => (
                <TickerCard
                  key={item.market}
                  item={item}
                  candleData={candleData[item.market]}
                />
              ))}
        </motion.div>
      </div>
    </div>
  );
};
