import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchProducts } from "@/redux/features/productSlice";
import { buildQueryString } from "@/utils/queryBuilder";
import { debounce } from "@/utils/debounce";

export interface FilterState {
    brand_id: number | null;
    campaign_id: number | null;
    min_price: number | null;
    max_price: number | null;
    color: string[];
    storage: string[];
    grade: string[];
    screen_size: string[];
    battery_capacity: string[];
    network_support: string[];
    sim_slot: string[];
    in_stock: boolean | null;
    page: number;
}

const initialState: FilterState = {
    brand_id: null,
    campaign_id: null,
    min_price: null,
    max_price: null,
    color: [],
    storage: [],
    grade: [],
    screen_size: [],
    battery_capacity: [],
    network_support: [],
    sim_slot: [],
    in_stock: null,
    page: 1,
};

const parseParams = (params: URLSearchParams): FilterState => {
    const newFilters = { ...initialState };
    params.forEach((value, key) => {
        if (key === "brand_id" || key === "campaign_id" || key === "min_price" || key === "max_price" || key === "page") {
            (newFilters as any)[key] = Number(value);
        } else if (key === "in_stock") {
            newFilters.in_stock = value === "true";
        } else if (Array.isArray((initialState as any)[key])) {
            (newFilters as any)[key] = value.split(",");
        } else {
            (newFilters as any)[key] = value;
        }
    });
    return newFilters;
};

export const useProductFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();

    // Initialize state from URL immediately
    const [filters, setFilters] = useState<FilterState>(() => parseParams(new URLSearchParams(searchParams.toString())));

    // Sync state from URL when URL changes (e.g. back button)
    useEffect(() => {
        const fromURL = parseParams(new URLSearchParams(searchParams.toString()));
        // Use stringify for deep comparison to avoid infinite loop
        if (JSON.stringify(fromURL) !== JSON.stringify(filters)) {
            setFilters(fromURL);
        }
    }, [searchParams]);

    // Update URL when state changes (Debounced)
    // We handle the API fetch based on the URL change, not the state change directly.
    const debouncedUpdateURL = useCallback(
        debounce((currentFilters: FilterState) => {
            const query = buildQueryString(currentFilters);
            const currentQuery = searchParams.toString();

            if (query !== currentQuery) {
                router.push(`?${query}`, { scroll: false });
            }
        }, 500),
        [router, searchParams]
    );

    useEffect(() => {
        debouncedUpdateURL(filters);
    }, [filters, debouncedUpdateURL]);

    // Fetch products whenever the URL search params change
    useEffect(() => {
        const query = searchParams.toString();
        dispatch(fetchProducts(query));
    }, [searchParams, dispatch]);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to page 1 on filter change
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const clearAllFilters = () => {
        setFilters(initialState);
    };

    return {
        filters,
        handleFilterChange,
        handlePageChange,
        clearAllFilters,
    };
};
