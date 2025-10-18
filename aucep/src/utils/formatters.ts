const krwFormatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
});

export const formatPrice = (price: number, market: string) => {
    if (market.startsWith("KRW")) {
        if (price < 1) {
            return `₩${price.toFixed(6)}`;
        } else {
            return krwFormatter.format(price);
        }
    }
    return price.toString();
};

export const formatQuantity = (quantity: number, decimals: number = 2) => {
    return quantity.toFixed(decimals);
};

export const formatChange = (change: string, price: number, rate: number) => {
    const pct = (rate * 100).toFixed(2);
    return `${rate >= 0 ? "+" : ""}${pct}%`;
};

export const formatDelta = (delta: number, market: string) => {
    if (market.startsWith("KRW")) {
        return krwFormatter.format(delta);
    }
    return delta.toString();
};
