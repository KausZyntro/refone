'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { MdMyLocation } from 'react-icons/md';

export interface MapAddressDetails {
    address_line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

interface AddressMapPickerProps {
    onAddressSelect: (details: MapAddressDetails) => void;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const SCRIPT_ID = 'google-maps-script';
// Fallback view (centre of India) until the user searches or picks a location
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

let mapsLoader: Promise<any> | null = null;

// The Maps JS API is loaded once per page and shared by every picker instance
const loadGoogleMaps = (): Promise<any> => {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Google Maps can only load in the browser.'));
    }

    const existingMaps = (window as any).google?.maps;
    if (existingMaps?.Map) {
        return Promise.resolve(existingMaps);
    }

    if (!GOOGLE_MAPS_API_KEY) {
        return Promise.reject(
            new Error('Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.')
        );
    }

    if (!mapsLoader) {
        mapsLoader = new Promise((resolve, reject) => {
            const handleLoad = () => {
                const maps = (window as any).google?.maps;
                if (maps?.Map) {
                    resolve(maps);
                } else {
                    mapsLoader = null;
                    reject(new Error('Google Maps failed to initialise.'));
                }
            };

            const handleError = () => {
                mapsLoader = null;
                reject(new Error('Unable to load Google Maps. Check the API key and enabled APIs.'));
            };

            const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
            if (existingScript) {
                existingScript.addEventListener('load', handleLoad);
                existingScript.addEventListener('error', handleError);
                return;
            }

            const script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.async = true;
            script.defer = true;
            script.src =
                `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}` +
                `&libraries=places&loading=async&v=weekly`;
            script.addEventListener('load', handleLoad);
            script.addEventListener('error', handleError);
            document.head.appendChild(script);
        });
    }

    return mapsLoader;
};

const readComponent = (components: any[], type: string, shortName = false) => {
    const match = components.find(
        (component) => Array.isArray(component.types) && component.types.includes(type)
    );
    if (!match) return '';
    return (shortName ? match.shortText ?? match.short_name : match.longText ?? match.long_name) ?? '';
};

// Maps a Geocoder address_components list onto the fields the form needs
const buildAddressDetails = (components: any[], formattedAddress?: string): MapAddressDetails => {
    const streetNumber = readComponent(components, 'street_number');
    const route = readComponent(components, 'route');
    const premise = readComponent(components, 'premise') || readComponent(components, 'subpremise');

    const addressLine =
        [premise, streetNumber, route].filter(Boolean).join(' ').trim() ||
        readComponent(components, 'sublocality_level_1') ||
        readComponent(components, 'neighborhood') ||
        (formattedAddress ? formattedAddress.split(',')[0].trim() : '');

    const city =
        readComponent(components, 'locality') ||
        readComponent(components, 'postal_town') ||
        readComponent(components, 'administrative_area_level_2');

    return {
        address_line1: addressLine,
        city,
        state: readComponent(components, 'administrative_area_level_1'),
        pincode: readComponent(components, 'postal_code').replace(/\D/g, '').slice(0, 6),
    };
};

const AddressMapPicker: React.FC<AddressMapPickerProps> = ({ onAddressSelect }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const geocoderRef = useRef<any>(null);
    const autocompleteRef = useRef<any>(null);

    // Kept in a ref so a re-rendered parent callback never re-creates the map
    const onAddressSelectRef = useRef(onAddressSelect);
    useEffect(() => {
        onAddressSelectRef.current = onAddressSelect;
    }, [onAddressSelect]);

    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocating, setIsLocating] = useState(false);
    const [loadError, setLoadError] = useState('');

    const reverseGeocode = useCallback(async (latLng: any) => {
        const geocoder = geocoderRef.current;
        if (!geocoder) return;

        try {
            const response = await geocoder.geocode({ location: latLng });
            const result = response?.results?.[0];

            if (!result) {
                toast.error('Could not find an address for this location.');
                return;
            }

            onAddressSelectRef.current(
                buildAddressDetails(result.address_components || [], result.formatted_address)
            );
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            toast.error('Could not find an address for this location.');
        }
    }, []);

    const applyPosition = useCallback(
        (latLng: any, options?: { zoom?: number }) => {
            const map = mapRef.current;
            const marker = markerRef.current;

            if (!map || !marker) {
                return Promise.resolve();
            }

            marker.setPosition(latLng);
            map.panTo(latLng);

            if (options?.zoom) {
                map.setZoom(options.zoom);
            }

            return reverseGeocode(latLng);
        },
        [reverseGeocode]
    );

    useEffect(() => {
        let cancelled = false;
        let clickListener: any;
        let dragListener: any;
        let placeListener: any;

        const initialise = async () => {
            try {
                const maps = await loadGoogleMaps();

                if (cancelled || !mapContainerRef.current) return;

                const map = new maps.Map(mapContainerRef.current, {
                    center: DEFAULT_CENTER,
                    zoom: 5,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    clickableIcons: false,
                });

                const marker = new maps.Marker({
                    map,
                    position: DEFAULT_CENTER,
                    draggable: true,
                    title: 'Drag the marker to adjust your location',
                });

                mapRef.current = map;
                markerRef.current = marker;
                geocoderRef.current = new maps.Geocoder();

                clickListener = map.addListener('click', (event: any) => {
                    void applyPosition(event.latLng, { zoom: 16 });
                });

                dragListener = marker.addListener('dragend', () => {
                    const position = marker.getPosition();
                    if (position) {
                        void applyPosition(position);
                    }
                });

                const input = searchInputRef.current;
                if (input && maps.places?.Autocomplete) {
                    const autocomplete = new maps.places.Autocomplete(input, {
                        fields: ['geometry', 'formatted_address', 'address_components', 'name'],
                        componentRestrictions: { country: 'in' },
                    });
                    autocompleteRef.current = autocomplete;

                    placeListener = autocomplete.addListener('place_changed', () => {
                        const place = autocomplete.getPlace();
                        const location = place?.geometry?.location;

                        if (!location) {
                            toast.info('Please choose an address from the suggestions.');
                            return;
                        }

                        void applyPosition(location, { zoom: 17 });
                    });
                }

                if (!cancelled) {
                    setIsReady(true);
                    setIsLoading(false);
                }
            } catch (error: any) {
                const message: string = error?.message || 'Unable to load Google Maps.';

                // A missing key is a configuration issue; surface it inline only.
                if (!message.startsWith('Google Maps API key is missing')) {
                    console.error('Google Maps initialisation failed:', error);
                }

                if (cancelled) return;
                setLoadError(message);
                setIsLoading(false);
            }
        };

        void initialise();

        return () => {
            cancelled = true;
            clickListener?.remove();
            dragListener?.remove();
            placeListener?.remove();

            const autocomplete = autocompleteRef.current;
            const maps = (window as any).google?.maps;
            if (autocomplete && maps?.event) {
                maps.event.clearInstanceListeners(autocomplete);
            }

            autocompleteRef.current = null;
            mapRef.current = null;
            markerRef.current = null;
            geocoderRef.current = null;

            if (mapContainerRef.current) {
                mapContainerRef.current.innerHTML = '';
            }
        };
    }, [applyPosition]);

    // Without the Places Autocomplete widget, Enter still searches via Geocoding
    const handleSearchKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;

        // The picker lives inside a form; never submit the address form from here
        event.preventDefault();

        if (autocompleteRef.current) return;

        const query = event.currentTarget.value.trim();
        const maps = (window as any).google?.maps;
        const geocoder = geocoderRef.current;
        if (!query || !geocoder) return;

        setIsLocating(true);
        try {
            const response = await geocoder.geocode({ address: query });
            const result = response?.results?.[0]?.geometry?.location;

            if (!result) {
                toast.error('No matching address found for that search.');
                return;
            }

            void applyPosition(result, { zoom: 17 });
        } catch (error) {
            console.error('Address search failed:', error);
            toast.error('Could not search that address. Please try again.');
        } finally {
            setIsLocating(false);
        }
    };

    const handleUseCurrentLocation = () => {
        const maps = (window as any).google?.maps;

        if (!maps || !navigator.geolocation) {
            toast.error('Location access is not supported in this browser.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latLng = new maps.LatLng(position.coords.latitude, position.coords.longitude);
                void applyPosition(latLng, { zoom: 17 }).finally(() => setIsLocating(false));
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
                <input
                    ref={searchInputRef}
                    type="text"
                    className="form-input-addr map-search-input"
                    placeholder="Search your address..."
                    aria-label="Search your address"
                    onKeyDown={handleSearchKeyDown}
                    disabled={!isReady}
                />
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
