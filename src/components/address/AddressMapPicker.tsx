'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { MdMyLocation } from 'react-icons/md';
import 'leaflet/dist/leaflet.css';
import {
    GEOAPIFY_API_KEY,
    GeoapifyFeature,
    reverseGeocode,
    searchAddresses,
    toMapAddressDetails,
} from '@/lib/geoapify';

export interface MapAddressDetails {
    address_line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

interface AddressMapPickerProps {
    onAddressSelect: (details: MapAddressDetails) => void;
}

// Fallback view (centre of India) until the user searches or picks a location
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const MAP_ATTRIBUTION =
    'Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener noreferrer">Geoapify</a> | ' +
    '© <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> | ' +
    '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

const AddressMapPicker: React.FC<AddressMapPickerProps> = ({ onAddressSelect }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const searchWrapRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<import('leaflet').Map | null>(null);
    const markerRef = useRef<import('leaflet').Marker | null>(null);
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchAbortRef = useRef<AbortController | null>(null);

    // Kept in a ref so a re-rendered parent callback never re-creates the map
    const onAddressSelectRef = useRef(onAddressSelect);
    useEffect(() => {
        onAddressSelectRef.current = onAddressSelect;
    }, [onAddressSelect]);

    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocating, setIsLocating] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const reverseGeocodeAt = useCallback(async (lat: number, lon: number) => {
        try {
            const feature = await reverseGeocode(lat, lon);

            if (!feature) {
                toast.error('Could not find an address for this location.');
                return;
            }

            onAddressSelectRef.current(toMapAddressDetails(feature.properties));
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            toast.error('Could not find an address for this location.');
        }
    }, []);

    const moveMarker = useCallback((lat: number, lon: number, zoom?: number) => {
        const map = mapRef.current;
        const marker = markerRef.current;

        if (!map || !marker) return;

        marker.setLatLng([lat, lon]);
        map.panTo([lat, lon]);

        if (zoom) {
            map.setZoom(zoom);
        }
    }, []);

    const applyFeature = useCallback(
        (feature: GeoapifyFeature) => {
            const [lon, lat] = feature.geometry.coordinates;

            moveMarker(lat, lon, 17);
            setSearchValue(feature.properties.formatted || '');
            setShowSuggestions(false);
            onAddressSelectRef.current(toMapAddressDetails(feature.properties));
        },
        [moveMarker]
    );

    useEffect(() => {
        let cancelled = false;

        const initialise = async () => {
            if (!GEOAPIFY_API_KEY) {
                setLoadError(
                    'Geoapify API key is missing. Set NEXT_PUBLIC_GEOAPIFY_API_KEY in your environment.'
                );
                setIsLoading(false);
                return;
            }

            try {
                const L = (await import('leaflet')).default;

                if (cancelled || !mapContainerRef.current) return;

                const map = L.map(mapContainerRef.current, {
                    center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
                    zoom: 5,
                    zoomControl: true,
                    attributionControl: true,
                });

                const tileUrl = L.Browser.retina
                    ? 'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png'
                    : 'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png';

                L.tileLayer(`${tileUrl}?apiKey=${GEOAPIFY_API_KEY}`, {
                    attribution: MAP_ATTRIBUTION,
                    maxZoom: 20,
                }).addTo(map);

                const icon = L.divIcon({
                    className: 'geoapify-pin',
                    html: '<span class="geoapify-pin-dot"></span>',
                    iconSize: [22, 22],
                    iconAnchor: [11, 11],
                });

                const marker = L.marker([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], {
                    icon,
                    draggable: true,
                    title: 'Drag the marker to adjust your location',
                }).addTo(map);

                map.on('click', (event: import('leaflet').LeafletMouseEvent) => {
                    const { lat, lng } = event.latlng;
                    moveMarker(lat, lng, 16);
                    void reverseGeocodeAt(lat, lng);
                });

                marker.on('dragend', () => {
                    const position = marker.getLatLng();
                    void reverseGeocodeAt(position.lat, position.lng);
                });

                mapRef.current = map;
                markerRef.current = marker;

                if (!cancelled) {
                    setIsReady(true);
                    setIsLoading(false);
                }
            } catch (error: any) {
                console.error('Geoapify map initialisation failed:', error);

                if (!cancelled) {
                    setLoadError(error?.message || 'Unable to load the map.');
                    setIsLoading(false);
                }
            }
        };

        void initialise();

        return () => {
            cancelled = true;

            if (searchTimerRef.current) {
                clearTimeout(searchTimerRef.current);
            }
            searchAbortRef.current?.abort();

            const map = mapRef.current;
            if (map) {
                map.off();
                map.remove();
            }

            mapRef.current = null;
            markerRef.current = null;
        };
    }, [moveMarker, reverseGeocodeAt]);

    // Close the suggestion list when clicking elsewhere on the page
    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (
                searchWrapRef.current &&
                !searchWrapRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);

    const runSearch = useCallback(async (query: string, pickFirst = false) => {
        const trimmed = query.trim();

        if (trimmed.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            if (pickFirst) {
                toast.info('Type at least 3 characters to search for an address.');
            }
            return;
        }

        searchAbortRef.current?.abort();
        const controller = new AbortController();
        searchAbortRef.current = controller;

        try {
            const features = await searchAddresses(trimmed, {
                limit: 5,
                signal: controller.signal,
            });

            setSuggestions(features);
            setShowSuggestions(features.length > 0);

            if (pickFirst) {
                if (features[0]) {
                    applyFeature(features[0]);
                } else {
                    toast.error('No matching address found for that search.');
                }
            }
        } catch (error: any) {
            if (error?.name === 'AbortError') return;
            console.error('Address search failed:', error);
            toast.error('Could not search that address. Please try again.');
        }
    }, [applyFeature]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);

        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current);
        }

        if (value.trim().length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        searchTimerRef.current = setTimeout(() => {
            void runSearch(value);
        }, 300);
    };

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;

        // The picker lives inside a form; never submit the address form from here
        event.preventDefault();

        if (showSuggestions && suggestions[0]) {
            applyFeature(suggestions[0]);
            return;
        }

        void runSearch(event.currentTarget.value, true);
    };

    const handleSuggestionClick = (feature: GeoapifyFeature) => {
        applyFeature(feature);
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Location access is not supported in this browser.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                moveMarker(latitude, longitude, 17);
                void reverseGeocodeAt(latitude, longitude).finally(() => setIsLocating(false));
            },
            (error) => {
                setIsLocating(false);
                if (error.code === error.PERMISSION_DENIED) {
                    toast.error('Location permission denied. Allow access or search for your address.');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    toast.error('Your current location is unavailable right now.');
                } else {
                    toast.error('Could not get your location. Please try again.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    return (
        <div className="address-map-picker">
            <div className="map-search-row">
                <div className="map-search-wrap" ref={searchWrapRef}>
                    <input
                        type="text"
                        className="form-input-addr map-search-input"
                        placeholder="Search your address..."
                        aria-label="Search your address"
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        onKeyDown={handleSearchKeyDown}
                        autoComplete="off"
                    />

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="map-search-suggestions" role="listbox">
                            {suggestions.map((feature, index) => (
                                <li
                                    key={`${feature.properties.formatted}-${index}`}
                                    role="option"
                                    aria-selected={false}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSuggestionClick(feature)}
                                >
                                    {feature.properties.formatted}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    type="button"
                    className="btn-map-location"
                    onClick={handleUseCurrentLocation}
                    disabled={!isReady || isLocating}
                >
                    {isLocating ? (
                        <span className="btn-spinner btn-spinner-dark" aria-hidden="true" />
                    ) : (
                        <MdMyLocation size={18} />
                    )}
                    Use My Current Location
                </button>
            </div>

            <div className="map-canvas-wrap">
                <div ref={mapContainerRef} className="map-canvas" />

                {(isLoading || loadError) && (
                    <div className="map-status">
                        {isLoading ? (
                            <>
                                <span className="btn-spinner btn-spinner-dark" aria-hidden="true" />
                                Loading map...
                            </>
                        ) : (
                            loadError
                        )}
                    </div>
                )}
            </div>

            {isReady && (
                <p className="map-hint">
                    Search, click on the map, or drag the marker to set your exact location.
                </p>
            )}
        </div>
    );
};

export default AddressMapPicker;
