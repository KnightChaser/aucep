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
  
  const textColor = isRise ? "text-neon-green" : isFall ? "text-neon-red" : "text-gray-400";
  const glowClass = isRise ? "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-neon-green/30" : isFall ? "hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:border-neon-red/30" : "hover:border-gray-500/30";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, translateY: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`h-auto flex flex-col glass-panel rounded-2xl overflow-hidden relative group transition-all duration-300 ${glowClass}`}
    >
      <div className="pt-5 px-6 pb-2 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white">
            {item.market.replace("KRW-", "")}
          </h3>
          <p className="text-xs text-gray-500 font-medium">{item.english_name}</p>
        </div>
        <div 
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${isRise ? 'bg-neon-green/10 text-neon-green' : isFall ? 'bg-neon-red/10 text-neon-red' : 'bg-gray-800 text-gray-400'}`}
          aria-label={ariaLabel}
        >
          <span>{changeIcon}</span>
          <span>{formatChange(item.signed_change_rate)}%</span>
        </div>
      </div>

      <div className="px-6 py-2 flex-1">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-gray-500 font-medium">₩</span>
          <span
            className="text-3xl font-bold text-white tabular-nums tracking-tight"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            <span
              className="animate-fade-in"
              key={formatPrice(item.trade_price, item.market)}
            >
              {formatPrice(item.trade_price, item.market)}
            </span>
          </span>
        </div>
        
        <p
          className={`text-sm font-medium mt-1 tabular-nums ${textColor}`}
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

      <div className="px-0 h-24 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
        <MiniChart data={candleData || []} changeType={item.change} />
      </div>

      <div className="py-3 px-6 bg-black/20 border-t border-white/5 text-xs font-medium text-gray-500">
        <div className="flex justify-between items-center">
          <span>Vol (24h)</span>
          <span className="text-gray-300 tabular-nums">
            {formatQuantity(item.acc_trade_volume_24h)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span>Amt (24h)</span>
          <span className="text-gray-300 tabular-nums">
            {formatInteger(Math.round(item.acc_trade_price_24h))}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
