"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAddresses, setSelectedAddress } from "@/redux/features/addressSlice";
import { FiPlus, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

const AddressSelector: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, selectedAddressId, isLoading } = useSelector((state: RootState) => state.address);
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (user?.id && addresses.length === 0) {
            dispatch(fetchAddresses(user.id));
        }
    }, [dispatch, user?.id, addresses.length]);

    // Automatically select the first address if none is selected and addresses exist
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            // Find default address first, else pick first
            const defaultAddr = addresses.find(a => a.isDefault);
            if (defaultAddr) {
                dispatch(setSelectedAddress(defaultAddr.id));
            } else {
                dispatch(setSelectedAddress(addresses[0].id));
            }
        }
    }, [addresses, selectedAddressId, dispatch]);

    const handleSelectAddress = (id: number) => {
        dispatch(setSelectedAddress(id));
    };

    if (isLoading && addresses.length === 0) {
        return (
            <div className="address-section">
                <h2 className="checkout-heading mb-md">Select Delivery Address</h2>
                <div className="skeleton-card" style={{ height: "120px" }} />
                <div className="skeleton-card" style={{ height: "120px", marginTop: "1rem" }} />
            </div>
        );
    }

    return (
        <div className="address-section">
            <div className="address-header">
                <h2 className="checkout-heading">Select Delivery Address</h2>
                <Link href="/my-account" className="btn-add-address-outline">
                    <FiPlus /> Add New
                </Link>
            </div>

            {addresses.length === 0 ? (
                <div className="address-empty">
                    <p>You have no saved addresses.</p>
                    <Link href="/my-account" className="btn-add-address-primary">
                        Add New Address
                    </Link>
                </div>
            ) : (
                <div className="address-grid">
                    {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                            <div
                                key={addr.id}
                                className={`address-card ${isSelected ? "selected" : ""}`}
                                onClick={() => handleSelectAddress(addr.id)}
                            >
                                {isSelected && (
                                    <div className="address-check">
                                        <FiCheckCircle size={20} />
                                    </div>
                                )}
                                <div className="address-content">
                                    <p className="address-name">{user?.name || "User"}</p>
                                    <p className="address-line">{addr.address_line1}</p>
                                    <p className="address-line">
                                        {addr.city}, {addr.state} {addr.pincode}
                                    </p>
                                    <p className="address-line">{addr.country}</p>
                                    <p className="address-phone">Phone: {addr.phone}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AddressSelector;
