import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TickerData } from "@/hooks/useTickerData";
import { formatPrice, formatChange } from "@/utils/formatters";

interface TickerCardProps {
    item: TickerData;
    index: number;
}

export const TickerCard = ({ item, index }: TickerCardProps) => {
    return (
        <Card
            key={item.market}
            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
        >
            <CardHeader>
                <CardTitle>{item.market}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Trade Price: {formatPrice(item.trade_price, item.market)}</p>
                <p>
                    Change:{" "}
                    {formatChange(
                        item.change,
                        item.signed_change_price,
                        item.signed_change_rate
                    )}
                </p>
                <p>Trade Volume: {item.trade_volume.toFixed(8)}</p>
                <p>24h Volume: {item.acc_trade_volume_24h.toFixed(2)}</p>
                <p>
                    24h Price:{" "}
                    {formatPrice(item.acc_trade_price_24h, item.market)}
                </p>
            </CardContent>
        </Card>
    );
};
