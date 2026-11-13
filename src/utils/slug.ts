/**
 * Builds the URL slug for a product from its name.
 * Must stay in sync with the links rendered by the category sliders and the
 * lookup performed by `fetchProductBySlugServer`.
 */
export const slugify = (value: string): string =>
    value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
