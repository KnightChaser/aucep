import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FlipNumbers from "react-flip-numbers";
import type { ExtendedTickerData } from "@/hooks/useTickerData";
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
}

export const TickerCard = ({ item }: TickerCardProps) => {
    const { changeIcon, changeColor, ariaLabel } = getChangeDisplay(
        item.change,
        item.signed_change_rate
    );

    return (
        <Card className="h-80 flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
            <CardHeader className="pt-4 px-4">
                <CardTitle className="text-lg font-semibold text-center tracking-wide">
                    {item.market.replace("KRW-", "")} ({item.english_name})
                </CardTitle>
            </CardHeader>

            <div className="flex-1 flex items-center px-4">
                <div className="w-full text-center">
                    <p
                        className="text-2xl font-extrabold text-gray-900 tabular-nums flex items-center justify-center"
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
                            <span aria-hidden className="leading-none">
                                ₩
                            </span>
                            <span
                                className="inline-flex items-center"
                                style={{ transform: "translateY(1px)" }}
                            >
                                <FlipNumbers
                                    height={24}
                                    width={14}
                                    color="currentColor"
                                    background="transparent"
                                    play
                                    duration={0.7}
                                    numbers={formatPrice(
                                        item.trade_price,
                                        item.market
                                    )}
                                />
                            </span>
                        </span>
                    </p>
                    <p
                        className={`mt-2 text-lg font-medium ${changeColor} tabular-nums flex items-center justify-center`}
                        aria-label={ariaLabel}
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <span aria-hidden className="leading-none">
                                {changeIcon}
                            </span>
                            <span
                                className="inline-flex items-center"
                                style={{ transform: "translateY(0.5px)" }}
                            >
                                <FlipNumbers
                                    height={18}
                                    width={10}
                                    color="currentColor"
                                    background="transparent"
                                    play
                                    duration={0.7}
                                    numbers={formatChange(
                                        item.signed_change_rate
                                    )}
                                />
                            </span>
                            <span aria-hidden className="leading-none">
                                %
                            </span>
                        </span>
                    </p>
                    <p
                        className="mt-1 text-sm text-gray-500 tabular-nums flex items-center justify-center"
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
                            <span aria-hidden className="leading-none">
                                ₩
                            </span>
                            <span
                                className="inline-flex items-center"
                                style={{ transform: "translateY(0.5px)" }}
                            >
                                <FlipNumbers
                                    height={14}
                                    width={7}
                                    color="currentColor"
                                    background="transparent"
                                    play
                                    duration={0.7}
                                    numbers={formatDelta(
                                        item.signed_change_price,
                                        item.market
                                    )}
                                />
                            </span>
                        </span>
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
                            <span className="inline-flex whitespace-nowrap">
                                <FlipNumbers
                                    height={16}
                                    width={10}
                                    color="currentColor"
                                    background="transparent"
                                    play
                                    duration={0.7}
                                    numbers={formatQuantity(
                                        item.acc_trade_volume_24h
                                    )}
                                />
                            </span>
                        </div>
                    </div>
                    <div
                        className="flex justify-between items-start"
                        style={{ fontFeatureSettings: "'tnum'" }}
                    >
                        <div className="text-left text-sm">24h Price</div>
                        <div className="text-right tabular-nums text-base font-medium break-words">
                            <span className="inline-flex whitespace-nowrap">
                                <FlipNumbers
                                    height={16}
                                    width={10}
                                    color="currentColor"
                                    background="transparent"
                                    play
                                    duration={0.7}
                                    numbers={formatInteger(
                                        Math.round(item.acc_trade_price_24h)
                                    )}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
