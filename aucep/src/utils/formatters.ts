export const formatPrice = (price: number, market: string) => {
    if (market.startsWith("KRW")) {
        if (price < 1) {
            return `₩${price.toFixed(6)}`;
        } else {
            return `₩${price.toLocaleString()}`;
        }
    }
    return price.toString();
};

export const formatChange = (change: string, price: number, rate: number) => {
    const sign = change === "RISE" ? "+" : change === "FALL" ? "-" : "";
    return `${sign}${Math.abs(price).toLocaleString()} (${(rate * 100).toFixed(
        2
    )}%)`;
};
