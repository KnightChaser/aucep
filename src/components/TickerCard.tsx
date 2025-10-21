import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface TickerCardProps {
  item: ExtendedTickerData;
  candleData?: CandleData[];
}

export const TickerCard = ({ item, candleData }: TickerCardProps) => {
  const { changeIcon, changeColor, ariaLabel } = getChangeDisplay(
    item.change,
    item.signed_change_rate
  );

  return (
    <Card className="h-auto flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
      <CardHeader className="pt-4 px-4 pb-3">
        <CardTitle className="text-lg font-semibold text-center tracking-wide">
          {item.market.replace("KRW-", "")} ({item.english_name})
        </CardTitle>
      </CardHeader>

      <div className="px-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p
              className="text-2xl font-extrabold text-gray-900 tabular-nums"
              style={{ fontFeatureSettings: "'tnum'" }}
            >
              <span className="inline-flex items-baseline gap-0.5">
                <span aria-hidden className="text-lg">
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
            <p
              className={`mt-1 text-base font-medium ${changeColor} tabular-nums flex items-center gap-1`}
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
              className="text-xs text-gray-500 tabular-nums mt-0.5"
              style={{ fontFeatureSettings: "'tnum'" }}
            >
              <span
                className="animate-fade-in"
                key={formatDelta(item.signed_change_price, item.market)}
              >
                ₩{formatDelta(item.signed_change_price, item.market)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <MiniChart data={candleData || []} changeType={item.change} />
      </div>

      <CardContent className="py-3 px-4 bg-gray-50 border-t border-gray-100">
        <div className="text-sm text-gray-600 space-y-2">
          <div
            className="flex justify-between items-start"
            style={{ fontFeatureSettings: "'tnum'" }}
          >
            <div className="text-left text-sm">24h Vol</div>
            <div className="text-right tabular-nums text-base font-medium break-words">
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
            <div className="text-left text-sm">24h Price</div>
            <div className="text-right tabular-nums text-base font-medium break-words">
              <span
                className="inline-flex whitespace-nowrap animate-fade-in"
                key={formatInteger(Math.round(item.acc_trade_price_24h))}
              >
                {formatInteger(Math.round(item.acc_trade_price_24h))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
