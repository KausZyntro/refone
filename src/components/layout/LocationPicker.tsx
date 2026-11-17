'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiMapPin, FiX } from 'react-icons/fi';
import { MdMyLocation } from 'react-icons/md';
import { toast } from 'react-toastify';
import {
    GEOAPIFY_API_KEY,
    GeoapifyFeature,
    getCityName,
    reverseGeocode,
    searchAddresses,
} from '@/lib/geoapify';

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (city: string) => void;
}

const LocationPicker = ({ isOpen, onClose, onSelect }: LocationPickerProps) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<GeoapifyFeature[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [error, setError] = useState('');

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        setQuery('');
        setSuggestions([]);
        setError('');
        setIsSearching(false);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onCloseRef.current();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            abortRef.current?.abort();
        };
    }, []);

    const runSearch = useCallback(async (text: string) => {
        const trimmed = text.trim();

        if (trimmed.length < 2) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setIsSearching(true);

        try {
            const features = await searchAddresses(trimmed, {
                limit: 6,
                type: 'city',
                signal: controller.signal,
            });
            setSuggestions(features);
        } catch (searchError: any) {
            if (searchError?.name === 'AbortError') return;
            console.error('City search failed:', searchError);
            setError(searchError?.message || 'Could not search locations. Please try again.');
        } finally {
            if (!controller.signal.aborted) {
                setIsSearching(false);
            }
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        setError('');

        if (timerRef.current) clearTimeout(timerRef.current);

        if (value.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        timerRef.current = setTimeout(() => {
            void runSearch(value);
        }, 300);
    };

    const selectCity = (city: string) => {
        if (!city) {
            toast.error('Could not determine the city for this location.');
            return;
        }

        onSelect(city);
        onClose();
    };

    const handleSuggestionClick = (feature: GeoapifyFeature) => {
        selectCity(getCityName(feature.properties) || feature.properties.formatted || '');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();

        if (suggestions[0]) {
            handleSuggestionClick(suggestions[0]);
        } else if (query.trim()) {
            selectCity(query.trim());
        }
    };

    const handleUseCurrentLocation = () => {
        if (!GEOAPIFY_API_KEY) {
            setError(
                'Geoapify API key is missing. Set NEXT_PUBLIC_GEOAPIFY_API_KEY in your environment.'
            );
            return;
        }

        if (!navigator.geolocation) {
            toast.error('Location access is not supported in this browser.');
            return;
        }

        setIsLocating(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const feature = await reverseGeocode(
                        position.coords.latitude,
                        position.coords.longitude
                    );

                    if (!feature) {
                        toast.error('Could not find your city for this location.');
                        return;
                    }

                    selectCity(
                        getCityName(feature.properties) || feature.properties.formatted || ''
                    );
                } catch (locationError) {
                    console.error('Reverse geocoding failed:', locationError);
                    toast.error('Could not find your city. Please search instead.');
                } finally {
                    setIsLocating(false);
                }
            },
            (geoError) => {
                setIsLocating(false);
                if (geoError.code === geoError.PERMISSION_DENIED) {
                    toast.error('Location permission denied. Allow access or search for a city.');
                } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
                    toast.error('Your current location is unavailable right now.');
                } else {
                    toast.error('Could not get your location. Please try again.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div
                className="location-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="location-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="location-modal-header">
                    <h2 id="location-modal-title">
                        <FiMapPin size={18} /> Select Location
                    </h2>
                    <button
                        type="button"
                        className="location-modal-close"
                        onClick={onClose}
                        aria-label="Close location picker"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="location-search-wrap">
                    <input
                        type="text"
                        className="location-search-input"
                        placeholder="Search for your city..."
                        aria-label="Search for your city"
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        autoFocus
                    />

                    <button
                        type="button"
                        className="location-current-btn"
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                    >
                        {isLocating ? (
                            <span className="btn-spinner btn-spinner-dark" aria-hidden="true" />
                        ) : (
                            <MdMyLocation size={18} />
                        )}
                        Use My Current Location
                    </button>

                    {error && <p className="location-error">{error}</p>}

                    {isSearching && <p className="location-hint">Searching...</p>}

                    {!isSearching && suggestions.length > 0 && (
                        <ul className="location-suggestions" role="listbox">
                            {suggestions.map((feature, index) => (
                                <li
                                    key={`${feature.properties.formatted}-${index}`}
                                    role="option"
                                    aria-selected={false}
                                    onClick={() => handleSuggestionClick(feature)}
                                >
                                    <FiMapPin size={15} />
                                    <span>{feature.properties.formatted}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!isSearching &&
                        !error &&
                        query.trim().length >= 2 &&
                        suggestions.length === 0 && (
                            <p className="location-hint">No matching cities found.</p>
                        )}
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
