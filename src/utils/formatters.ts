/**
 * Determines the appropriate number of decimal places based on the magnitude of a number.
 * Larger numbers get fewer decimals for better readability.
 */
const getDecimalPlaces = (value: number): number => {
  const abs = Math.abs(value);
  if (abs >= 1000) return 0;
  if (abs >= 100) return 1;
  if (abs >= 10) return 2;
  if (abs >= 1) return 3;
  return 6;
};

/**
 * Formats a number with dynamic decimal places based on its magnitude.
 * @param value - The number to format
 * @param options - Optional formatting configuration
 */
const formatNumber = (
  value: number,
  options?: { minimumFractionDigits?: number; locale?: string }
) => {
  const { minimumFractionDigits, locale = "ko-KR" } = options || {};
  const maximumFractionDigits = getDecimalPlaces(value);

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

export const formatPrice = (price: number, market: string) => {
  if (market.startsWith("KRW")) {
    return formatNumber(price);
  }
  return price.toString();
};

export const formatQuantity = (quantity: number) => {
  const abs = Math.abs(quantity);
  let minimumFractionDigits: number | undefined;

  // For quantities, we want to show minimum decimals for consistency
  if (abs >= 1000) {
    minimumFractionDigits = 0;
  } else if (abs >= 100) {
    minimumFractionDigits = 1;
  } else if (abs >= 10) {
    minimumFractionDigits = 2;
  } else if (abs >= 1) {
    minimumFractionDigits = 3;
  } else {
    minimumFractionDigits = 6;
  }

  return formatNumber(quantity, { minimumFractionDigits });
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
    return formatNumber(delta);
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
