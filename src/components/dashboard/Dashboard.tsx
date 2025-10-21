import type {
  ExtendedTickerData,
  CandleData,
  MarketTotals,
  MarketFilterState,
} from "@/types";
import { TickerCard } from "@/components/TickerCard";
import { MarketFilter } from "@/components/dashboard/MarketFilter";
import { formatTime } from "@/utils/formatters";

interface DashboardProps {
  data: ExtendedTickerData[];
  loading: boolean;
  lastUpdate: Date | null;
  candleData: { [market: string]: CandleData[] };
  marketTotals: MarketTotals;
  marketFilter: MarketFilterState;
}

export const Dashboard = ({
  data,
  loading,
  lastUpdate,
  candleData,
  marketTotals,
  marketFilter,
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
              <div className="mt-1 text-sm text-gray-500" aria-hidden>
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

            {/* Right: Filter and Last update */}
            <div className="justify-self-end flex items-center gap-4">
              <MarketFilter
                markets={allMarkets}
                visibleMarkets={visibleMarkets}
                onToggleMarket={onToggleMarket}
                onToggleAll={onToggleAll}
                onSetMarketVisible={onSetMarketVisible}
              />
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
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
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
};
