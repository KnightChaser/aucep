import type { ExtendedTickerData, CandleData } from "@/types";
import { MiniChart } from "@/components/MiniChart";
import {
  formatPrice,
  formatChange,
  formatQuantity,
  formatDelta,
  formatInteger,
  getChangeDisplay,
} from "@/utils/formatters";
import { motion } from "framer-motion";

interface TickerCardProps {
  item: ExtendedTickerData;
  candleData?: CandleData[];
}

export const TickerCard = ({ item, candleData }: TickerCardProps) => {
  const { changeIcon, ariaLabel } = getChangeDisplay(
    item.change,
    item.signed_change_rate
  );

  const isRise = item.change === "RISE";
  const isFall = item.change === "FALL";
  
  const borderColor = isRise ? "border-neon-green" : isFall ? "border-neon-red" : "border-gray-600";
  const textColor = isRise ? "text-neon-green" : isFall ? "text-neon-red" : "text-gray-400";
  const shadowColor = isRise ? "shadow-[4px_4px_0px_0px_#00ff41]" : isFall ? "shadow-[4px_4px_0px_0px_#ff003c]" : "shadow-[4px_4px_0px_0px_#666]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, translateY: -4, translateX: -4, boxShadow: isRise ? "8px 8px 0px 0px #00ff41" : isFall ? "8px 8px 0px 0px #ff003c" : "8px 8px 0px 0px #666" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`h-auto flex flex-col bg-bg-card border-2 ${borderColor} ${shadowColor} overflow-hidden relative group`}
    >
      {/* Decorative corner */}
      <div className={`absolute top-0 right-0 w-4 h-4 border-b-2 border-l-2 ${borderColor} bg-bg-dark z-10`}></div>

      <div className="pt-4 px-4 pb-3 border-b-2 border-gray-800 bg-gray-900/50">
        <h3 className="text-lg font-black text-center tracking-widest uppercase text-white">
          {item.market.replace("KRW-", "")} <span className="text-xs text-gray-500 font-normal">({item.english_name})</span>
        </h3>
      </div>

      <div className="px-4 py-4 flex-1">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p
              className="text-3xl font-black text-white tabular-nums tracking-tighter"
              style={{ fontFeatureSettings: "'tnum'" }}
            >
              <span className="inline-flex items-baseline gap-0.5">
                <span aria-hidden className="text-lg text-gray-500 font-bold">
                  ₩
                </span>
                <span
                  className="animate-fade-in"
                  key={formatPrice(item.trade_price, item.market)}
                >
                  {formatPrice(item.trade_price, item.market)}
                </span>
              </span>
            </p>
            <div className="flex items-center gap-4 mt-2">
                <p
                className={`text-lg font-bold ${textColor} tabular-nums flex items-center gap-1 bg-black/30 px-2 py-0.5 border border-gray-800`}
                aria-label={ariaLabel}
                style={{ fontFeatureSettings: "'tnum'" }}
                >
                <span aria-hidden>{changeIcon}</span>
                <span
                    className="animate-fade-in"
                    key={formatChange(item.signed_change_rate)}
                >
                    {formatChange(item.signed_change_rate)}%
                </span>
                </p>
                <p
                className="text-sm text-gray-400 tabular-nums font-mono"
                style={{ fontFeatureSettings: "'tnum'" }}
                >
                <span
                    className="animate-fade-in"
                    key={formatDelta(item.signed_change_price, item.market)}
                >
                    {item.signed_change_price > 0 ? "+" : ""}
                    {formatDelta(item.signed_change_price, item.market)}
                </span>
                </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3 h-24">
        <MiniChart data={candleData || []} changeType={item.change} />
      </div>

      <div className="py-3 px-4 bg-black/40 border-t-2 border-gray-800 text-xs font-mono uppercase tracking-wider">
        <div className="space-y-1">
          <div
            className="flex justify-between items-start"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            <div className="text-left text-gray-500">Vol (24h)</div>
            <div className="text-right tabular-nums text-gray-300 font-bold">
              <span
                className="inline-flex whitespace-nowrap animate-fade-in"
                key={formatQuantity(item.acc_trade_volume_24h)}
              >
                {formatQuantity(item.acc_trade_volume_24h)}
              </span>
            </div>
          </div>
          <div
            className="flex justify-between items-start"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            <div className="text-left text-gray-500">Amt (24h)</div>
            <div className="text-right tabular-nums text-gray-300 font-bold">
              <span
                className="inline-flex whitespace-nowrap animate-fade-in"
                key={formatInteger(Math.round(item.acc_trade_price_24h))}
              >
                {formatInteger(Math.round(item.acc_trade_price_24h))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
