import { useMemo } from "react";
import type { CandleData } from "@/types";

interface MiniChartProps {
  data: CandleData[];
  changeType: string; // "RISE", "FALL", or "EVEN"
  isLoading?: boolean;
}

export const MiniChart = ({ data, changeType, isLoading }: MiniChartProps) => {
  const points = useMemo(() => {
    if (!data || data.length === 0) {
      return "";
    }

    const prices = data.map((d) => d.trade_price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1; // Avoid division by zero

    // SVG viewBox dimensions
    const width = 100;
    const height = 40;
    const padding = 2;

    // Calculate points for polyline
    const pointsArray = data.map((candle, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
      const y =
        height -
        padding -
        ((candle.trade_price - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return pointsArray.join(" ");
  }, [data]);

  if (isLoading || !data || data.length === 0) {
    return (
      <div className="w-full h-20 flex items-center justify-center bg-black/20 rounded border border-gray-800">
        <span className="text-xs text-gray-600 font-mono animate-pulse">LOADING_DATA...</span>
      </div>
    );
  }

  const strokeColor =
    changeType === "RISE"
      ? "#00ff41" // Neon Green
      : changeType === "FALL"
      ? "#ff003c" // Neon Red
      : "#666666"; // Gray

  return (
    <div className="w-full bg-black/20 border border-gray-800 relative overflow-hidden">
      {/* Grid lines background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
             backgroundSize: '10px 10px'
           }}>
      </div>
      
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="w-full h-16 relative z-10"
      >
        {/* Area fill */}
        <defs>
          <linearGradient
            id={`gradient-${changeType}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
          <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M0,2 L4,2" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Fill area under the line */}
        <polygon
          points={`0,40 ${points} 100,40`}
          fill={`url(#gradient-${changeType})`}
        />

        {/* Price line */}
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
      </svg>
      <div className="flex justify-between px-2 pt-1 pb-1 text-[9px] text-gray-600 font-mono uppercase tracking-wider border-t border-gray-800 bg-black/40">
        <span>-24h</span>
        <span>-12h</span>
        <span>now</span>
      </div>
    </div>
  );
};
