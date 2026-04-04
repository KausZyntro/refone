/**
 * Parses a price string or number into a clean float.
 * Handles currency symbols (₹), commas, and whitespace.
 * e.g., "₹ 75,000" -> 75000.00
 */
export const parsePrice = (price: string | number | undefined | null): number => {
    if (typeof price === "number") return price;
    if (!price) return 0;
    const cleanPrice = price.toString().replace(/[₹\s,]/g, "");
    return parseFloat(cleanPrice) || 0;
};

/**
 * Formats a numeric amount into a currency string (INR).
 * @param amount The numeric amount to format.
 * @param includeSymbol Whether to include the ₹ symbol.
 * @returns Formatted string, e.g., "₹ 75,000.00"
 */
export const formatPrice = (amount: number, includeSymbol: boolean = true): string => {
    const formatted = amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return includeSymbol ? `₹ ${formatted}` : formatted;
};
