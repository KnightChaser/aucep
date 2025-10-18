import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TickerData } from "@/hooks/useTickerData";
import {
    formatPrice,
    formatChange,
    formatQuantity,
    formatDelta,
    formatInteger,
} from "@/utils/formatters";

interface TickerCardProps {
    item: TickerData;
}

export const TickerCard = ({ item }: TickerCardProps) => {
    const changeIcon =
        item.change === "RISE" ? "▲" : item.change === "FALL" ? "▼" : "";
    const changeColor =
        item.change === "RISE"
            ? "text-green-600"
            : item.change === "FALL"
            ? "text-red-600"
            : "text-gray-600";
    const ariaLabel =
        item.change === "RISE"
            ? `up ${formatChange(
                  item.change,
                  item.signed_change_price,
                  item.signed_change_rate
              )}`
            : item.change === "FALL"
            ? `down ${formatChange(
                  item.change,
                  item.signed_change_price,
                  item.signed_change_rate
              )}`
            : "no change";

    return (
        <Card className="h-80 flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
            <CardHeader className="pt-4 px-4">
                <CardTitle className="text-lg font-semibold text-center tracking-wide">
                    {item.market.replace("KRW-", "")}
                </CardTitle>
            </CardHeader>

            <div className="flex-1 flex items-center px-4">
                <div className="w-full text-center">
                    <p
                        className="text-2xl font-extrabold text-gray-900 tabular-nums whitespace-nowrap"
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        {formatPrice(item.trade_price, item.market)}
                    </p>
                    <p
                        className={`mt-2 text-lg font-medium ${changeColor} tabular-nums`}
                        aria-label={ariaLabel}
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        {changeIcon}{" "}
                        {formatChange(
                            item.change,
                            item.signed_change_price,
                            item.signed_change_rate
                        )}
                    </p>
                    <p
                        className="mt-1 text-sm text-gray-500 tabular-nums"
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        {formatDelta(item.signed_change_price, item.market)}
                    </p>
                </div>
            </div>

            <CardContent className="py-4 px-4 bg-gray-50">
                <div className="text-sm text-gray-600 space-y-2">
                    <div
                        className="flex justify-between items-start"
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        <div className="text-left text-sm">24h Vol</div>
                        <div className="text-right tabular-nums text-base font-medium break-words">
                            {formatQuantity(item.acc_trade_volume_24h)}
                        </div>
                    </div>
                    <div
                        className="flex justify-between items-start"
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        <div className="text-left text-sm">24h Price</div>
                        <div className="text-right tabular-nums text-base font-medium break-words">
                            {formatInteger(
                                Math.round(item.acc_trade_price_24h)
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
