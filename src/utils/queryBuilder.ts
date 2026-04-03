/**
 * Builds a query string from a filter object.
 * - Ignores null, undefined, or empty strings.
 * - Converts arrays to comma-separated strings.
 * - Handles 'page' specifically.
 */
export const buildQueryString = (filters: Record<string, any>): string => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        // Skip null, undefined, or empty strings
        if (value === null || value === undefined || value === "") return;

        // Handle arrays (comma-separated)
        if (Array.isArray(value)) {
            if (value.length > 0) {
                params.append(key, value.join(","));
            }
        }
        // Handle numbers/booleans/strings
        else {
            params.append(key, value.toString());
        }
    });

    const queryString = params.toString();
    return queryString ? queryString : "";
};
