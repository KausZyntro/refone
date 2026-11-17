export const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

export interface GeoapifyProperties {
    formatted?: string;
    name?: string;
    address_line1?: string;
    address_line2?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state_district?: string;
    district?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    lat?: number;
    lon?: number;
    result_type?: string;
}

export interface GeoapifyFeature {
    type: "Feature";
    properties: GeoapifyProperties;
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
}

interface GeoapifyResponse {
    features?: GeoapifyFeature[];
}

interface SearchOptions {
    limit?: number;
    type?: string;
    signal?: AbortSignal;
}

const assertApiKey = () => {
    if (!GEOAPIFY_API_KEY) {
        throw new Error(
            "Geoapify API key is missing. Set NEXT_PUBLIC_GEOAPIFY_API_KEY in your environment."
        );
    }
    return GEOAPIFY_API_KEY;
};

const requestGeoapify = async (url: string, signal?: AbortSignal): Promise<GeoapifyFeature[]> => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Geoapify request failed with status ${response.status}.`);
    }

    const data: GeoapifyResponse = await response.json();
    return data.features || [];
};

/**
 * Address / place autocomplete restricted to India.
 */
export const searchAddresses = async (
    text: string,
    { limit = 5, type, signal }: SearchOptions = {}
): Promise<GeoapifyFeature[]> => {
    const apiKey = assertApiKey();
    const params = new URLSearchParams({
        text,
        format: "geojson",
        lang: "en",
        limit: String(limit),
        filter: "countrycode:in",
        apiKey,
    });

    if (type) params.set("type", type);

    return requestGeoapify(
        `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`,
        signal
    );
};

/**
 * Finds the address for a pair of coordinates.
 */
export const reverseGeocode = async (
    lat: number,
    lon: number,
    signal?: AbortSignal
): Promise<GeoapifyFeature | null> => {
    const apiKey = assertApiKey();
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lon),
        format: "geojson",
        lang: "en",
        limit: "1",
        apiKey,
    });

    const features = await requestGeoapify(
        `https://api.geoapify.com/v1/geocode/reverse?${params.toString()}`,
        signal
    );
    return features[0] || null;
};

/**
 * Maps Geoapify result properties onto the fields the address form needs.
 */
export const toMapAddressDetails = (properties: GeoapifyProperties) => {
    const streetLine = [properties.housenumber, properties.street].filter(Boolean).join(" ");

    const addressLine =
        properties.address_line1 ||
        streetLine ||
        properties.name ||
        (properties.formatted ? properties.formatted.split(",")[0].trim() : "");

    const city =
        properties.city ||
        properties.town ||
        properties.village ||
        properties.municipality ||
        properties.county ||
        properties.state_district ||
        properties.district ||
        "";

    return {
        address_line1: addressLine,
        city,
        state: properties.state || "",
        pincode: (properties.postcode || "").replace(/\D/g, "").slice(0, 6),
    };
};

/**
 * Best human-readable city name for a Geoapify result.
 */
export const getCityName = (properties: GeoapifyProperties) => {
    return (
        properties.city ||
        properties.town ||
        properties.village ||
        properties.municipality ||
        properties.county ||
        properties.state_district ||
        properties.district ||
        properties.state ||
        ""
    );
};
