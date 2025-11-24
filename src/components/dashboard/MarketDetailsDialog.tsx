import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ExtendedTickerData } from "@/types";
import { formatPrice, formatQuantity, formatInteger, formatChange } from "@/utils/formatters";
import { ArrowUp, ArrowDown, Minus, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from "recharts";

interface MarketDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: ExtendedTickerData | null;
  allTickerData: ExtendedTickerData[];
}

export const MarketDetailsDialog = ({
  isOpen,
  onClose,
  item,
  allTickerData,
}: MarketDetailsDialogProps) => {
  if (!item) return null;

  const isRise = item.change === "RISE";
  const isFall = item.change === "FALL";
  const changeColor = isRise ? "text-neon-green" : isFall ? "text-neon-red" : "text-gray-400";
  const ChangeIcon = isRise ? ArrowUp : isFall ? ArrowDown : Minus;

  // Calculate position of current price in 52-week range (0-100%)
  const range = item.highest_52_week_price - item.lowest_52_week_price;
  const currentPosition = range === 0 ? 50 : ((item.trade_price - item.lowest_52_week_price) / range) * 100;

  // Ranking Logic
  const volumeRank = useMemo(() => {
    if (!allTickerData || allTickerData.length === 0) return null;
    const sortedByVol = [...allTickerData].sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h);
    return sortedByVol.findIndex(t => t.market === item.market) + 1;
  }, [allTickerData, item.market]);

  const changeRankInfo = useMemo(() => {
    if (!allTickerData || allTickerData.length === 0) return null;
    if (item.signed_change_rate > 0) {
      // Gainer ranking
      const sortedByChangeDesc = [...allTickerData].sort((a, b) => b.signed_change_rate - a.signed_change_rate);
      const rank = sortedByChangeDesc.findIndex(t => t.market === item.market) + 1;
      return { type: 'gainer', rank };
    } else if (item.signed_change_rate < 0) {
      // Loser ranking (most negative first)
      const sortedByChangeAsc = [...allTickerData].sort((a, b) => a.signed_change_rate - b.signed_change_rate);
      const rank = sortedByChangeAsc.findIndex(t => t.market === item.market) + 1;
      return { type: 'loser', rank };
    }
    return null;
  }, [allTickerData, item.market, item.signed_change_rate]);

  // Histogram Logic
  const histogramData = useMemo(() => {
    if (!allTickerData || allTickerData.length === 0) return [];

    const rates = allTickerData.map((t) => t.signed_change_rate * 100);
    const minRate = Math.floor(Math.min(...rates));
    const maxRate = Math.ceil(Math.max(...rates));
    
    const binWidth = 1; // 1%
    const bins = [];
    
    const start = Math.floor(minRate / binWidth) * binWidth;
    const end = Math.ceil(maxRate / binWidth) * binWidth;

    // Helper for color interpolation
    const interpolateColor = (startColor: number[], endColor: number[], factor: number) => {
      const result = startColor.map((start, i) => {
        const end = endColor[i];
        return Math.round(start + (end - start) * factor);
      });
      return `rgb(${result.join(",")})`;
    };

    const gray = [220, 220, 220]; // Much brighter gray/white
    const red = [255, 30, 30];    // Intense bright red
    const green = [30, 255, 80];  // Intense bright green
    const saturationLimit = 15;   // Full color at 15% change

    for (let i = start; i < end; i += binWidth) {
      const binMin = i;
      const binMax = i + binWidth;
      const binMid = (binMin + binMax) / 2;
      const count = rates.filter((r) => r >= binMin && r < binMax).length;
      
      // Calculate color intensity
      const intensity = Math.min(Math.abs(binMid) / saturationLimit, 1);
      let fill;
      
      if (binMid < 0) {
        fill = interpolateColor(gray, red, intensity);
      } else {
        fill = interpolateColor(gray, green, intensity);
      }
      
      bins.push({ 
        name: `${binMin}%`, 
        min: binMin,
        max: binMax,
        count,
        fill
      });
    }
    return bins;
  }, [allTickerData]);

  const currentRate = item.signed_change_rate * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-[#0a0a0a]/95 border-white/10 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-2xl">
              <span className="font-bold text-white">{item.market.replace("KRW-", "")}</span>
              <span className="text-sm font-normal text-gray-400 bg-white/5 px-2 py-1 rounded">
                {item.english_name}
              </span>
            </div>
            
            <div className="flex gap-2 mt-1">
              {volumeRank && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-neon-blue/10 text-neon-blue px-2 py-1 rounded border border-neon-blue/20">
                  <Trophy className="w-3 h-3" />
                  #{volumeRank} Traded Most
                </div>
              )}
              {changeRankInfo && (
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                  changeRankInfo.type === 'gainer' 
                    ? 'bg-neon-green/10 text-neon-green border-neon-green/20' 
                    : 'bg-neon-red/10 text-neon-red border-neon-red/20'
                }`}>
                  {changeRankInfo.type === 'gainer' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  #{changeRankInfo.rank} {changeRankInfo.type === 'gainer' ? 'Gainer' : 'Loser'}
                </div>
              )}
            </div>
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

          {/* Market Distribution Histogram */}
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Market Performance Distribution (24h %)</div>
            <div className="h-48 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} barCategoryGap={1}>
                  <XAxis 
                    dataKey="min" 
                    tick={{ fill: '#6b7280', fontSize: 10 }} 
                    tickFormatter={(val) => `${val}%`}
                    interval="preserveStartEnd"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
                    itemStyle={{ color: '#f3f4f6' }}
                    labelStyle={{ color: '#9ca3af' }}
                    formatter={(value: number) => [`${value} markets`, 'Count']}
                    labelFormatter={(label) => `Range: ${label}`}
                  />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {histogramData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.6} />
                    ))}
                  </Bar>
                  <ReferenceLine x={Math.floor(currentRate)} stroke="white" strokeDasharray="3 3">
                    <Label 
                      value="Current" 
                      position="top" 
                      fill="white" 
                      fontSize={10} 
                      offset={10}
                      className="bg-black"
                    />
                  </ReferenceLine>
                </BarChart>
              </ResponsiveContainer>
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
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-red/60 via-white/30 to-neon-green/60" />
              
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
