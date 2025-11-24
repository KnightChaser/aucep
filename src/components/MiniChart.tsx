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
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-0.5 bg-gray-800 rounded overflow-hidden">
          <div className="h-full bg-gray-600 animate-progress w-1/2"></div>
        </div>
      </div>
    );
  }

  const strokeColor =
    changeType === "RISE"
      ? "#10b981" // Emerald-500
      : changeType === "FALL"
      ? "#ef4444" // Red-500
      : "#9ca3af"; // Gray-400

  return (
    <div className="w-full h-full relative overflow-hidden">
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="w-full h-full relative z-10"
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
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
