export const formatPrice = (price: number, market: string) => {
    if (market.startsWith("KRW")) {
        const abs = Math.abs(price);
        let maximumFractionDigits = 0;
        if (abs >= 1000) {
            maximumFractionDigits = 0;
        } else if (abs >= 100) {
            maximumFractionDigits = 1;
        } else if (abs >= 10) {
            maximumFractionDigits = 2;
        } else if (abs >= 1) {
            maximumFractionDigits = 3;
        } else {
            maximumFractionDigits = 6;
        }
        return new Intl.NumberFormat("ko-KR", {
            maximumFractionDigits,
        }).format(price);
    }
    return price.toString();
};

export const formatQuantity = (quantity: number) => {
    const abs = Math.abs(quantity);
    if (abs >= 1000) {
        // 1,000 and up: integer
        return new Intl.NumberFormat("ko-KR", {
            maximumFractionDigits: 0,
        }).format(quantity);
    }
    if (abs >= 100) {
        // 100 - 999: 1 decimal
        return new Intl.NumberFormat("ko-KR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(quantity);
    }
    if (abs >= 10) {
        // 10 - 99: 2 decimals
        return new Intl.NumberFormat("ko-KR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(quantity);
    }
    if (abs >= 1) {
        // 1 - 9: 3 decimals
        return new Intl.NumberFormat("ko-KR", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        }).format(quantity);
    }
    // less than 1: 6 decimals
    return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
    }).format(quantity);
};

export const formatInteger = (value: number) => {
    return new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(
        value
    );
};

export const formatChange = (rate: number) => {
    const pct = (rate * 100).toFixed(2);
    return pct;
};

export const formatDelta = (delta: number, market: string) => {
    if (market.startsWith("KRW")) {
        const abs = Math.abs(delta);
        let maximumFractionDigits = 0;
        if (abs >= 1000) {
            maximumFractionDigits = 0;
        } else if (abs >= 100) {
            maximumFractionDigits = 1;
        } else if (abs >= 10) {
            maximumFractionDigits = 2;
        } else if (abs >= 1) {
            maximumFractionDigits = 3;
        } else {
            maximumFractionDigits = 6;
        }
        return new Intl.NumberFormat("ko-KR", {
            maximumFractionDigits,
        }).format(delta);
    }
    return delta.toString();
};

export const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour12: false });
};

export const getChangeDisplay = (change: string, signedChangeRate: number) => {
    const changeIcon = change === "RISE" ? "▲" : change === "FALL" ? "▼" : "";
    const changeColor =
        change === "RISE"
            ? "text-green-600"
            : change === "FALL"
            ? "text-red-600"
            : "text-gray-600";
    const ariaLabel =
        change === "RISE"
            ? `up +${formatChange(signedChangeRate)}%`
            : change === "FALL"
            ? `down ${formatChange(signedChangeRate)}%`
            : "no change";

    return { changeIcon, changeColor, ariaLabel };
};
