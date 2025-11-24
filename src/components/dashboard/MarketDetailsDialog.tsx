import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ExtendedTickerData } from "@/types";
import { formatPrice, formatQuantity, formatInteger, formatChange } from "@/utils/formatters";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MarketDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: ExtendedTickerData | null;
}

export const MarketDetailsDialog = ({
  isOpen,
  onClose,
  item,
}: MarketDetailsDialogProps) => {
  if (!item) return null;

  const isRise = item.change === "RISE";
  const isFall = item.change === "FALL";
  const changeColor = isRise ? "text-neon-green" : isFall ? "text-neon-red" : "text-gray-400";
  const ChangeIcon = isRise ? ArrowUp : isFall ? ArrowDown : Minus;

  // Calculate position of current price in 52-week range (0-100%)
  const range = item.highest_52_week_price - item.lowest_52_week_price;
  const currentPosition = range === 0 ? 50 : ((item.trade_price - item.lowest_52_week_price) / range) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a]/95 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="font-bold text-white">{item.market.replace("KRW-", "")}</span>
            <span className="text-sm font-normal text-gray-400 bg-white/5 px-2 py-1 rounded">
              {item.english_name}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Main Price Display */}
          <div className="flex items-end justify-between border-b border-white/5 pb-6">
            <div>
              <div className="text-sm text-gray-400 mb-1">Current Price</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
                  ₩{formatPrice(item.trade_price, item.market)}
                </span>
              </div>
            </div>
            <div className={`flex flex-col items-end ${changeColor}`}>
              <div className="flex items-center gap-1 text-xl font-bold">
                <ChangeIcon className="w-5 h-5" />
                {formatChange(item.signed_change_rate)}%
              </div>
              <div className="text-sm font-medium opacity-80">
                {item.signed_change_price > 0 ? "+" : ""}
                {formatInteger(item.signed_change_price)} KRW
              </div>
            </div>
          </div>

          {/* 52 Week Range Visualization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>52 Week Low</span>
              <span>52 Week High</span>
            </div>
            <div className="relative h-1.5 bg-white/5 rounded-full overflow-visible mt-8 mb-4">
              {/* Background Bar */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-red/20 via-gray-500/20 to-neon-green/20" />
              
              {/* Current Price Marker */}
              <div 
                className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-[#0a0a0a] transition-all duration-500 z-10"
                style={{ left: `${Math.min(Math.max(currentPosition, 0), 100)}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap backdrop-blur-md border border-white/10">
                  Current
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-300 tabular-nums">
              <span>₩{formatPrice(item.lowest_52_week_price, item.market)}</span>
              <span>₩{formatPrice(item.highest_52_week_price, item.market)}</span>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">
              {item.lowest_52_week_date} ~ {item.highest_52_week_date}
            </div>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Volume (24h)</div>
              <div className="text-lg font-bold text-white tabular-nums">
                {formatQuantity(item.acc_trade_volume_24h)}
                <span className="text-xs text-gray-500 ml-1 font-normal">{item.market.split('-')[1]}</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Trade Amount (24h)</div>
              <div className="text-lg font-bold text-white tabular-nums">
                ₩{formatInteger(Math.round(item.acc_trade_price_24h))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
