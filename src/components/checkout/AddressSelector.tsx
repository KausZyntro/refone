"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAddresses, setSelectedAddress, addAddress, updateAddress, deleteAddress } from "@/redux/features/addressSlice";
import { FiPlus, FiCheckCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import AddressModal from "../address/AddressModal";
import "@/styles/AddressManagement.css";

const AddressSelector: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, selectedAddressId, isLoading } = useSelector((state: RootState) => state.address);
    const { user } = useSelector((state: RootState) => state.auth);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingAddress, setEditingAddress] = React.useState<any>(null);

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

    const handleAddClick = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (e: React.MouseEvent, addr: any) => {
        e.stopPropagation();
        setEditingAddress(addr);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this address?")) {
            dispatch(deleteAddress(id));
        }
    };

    const handleSaveAddress = async (formData: any) => {
        if (!user?.id) return;

        const addressData = {
            ...formData,
            user_id: user.id
        };

        if (editingAddress) {
            await dispatch(updateAddress({ id: editingAddress.id, data: addressData }));
        } else {
            const result = await dispatch(addAddress(addressData));
            // Auto select newly added address
            if (addAddress.fulfilled.match(result)) {
                const newAddr = result.payload?.data || result.payload;
                if (newAddr?.id) {
                    dispatch(setSelectedAddress(newAddr.id));
                }
            }
        }
        setIsModalOpen(false);
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
                <button onClick={handleAddClick} className="btn-add-address-outline">
                    <FiPlus /> Add New
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="address-empty">
                    <p>You have no saved addresses.</p>
                    <button onClick={handleAddClick} className="btn-add-address-primary">
                        Add New Address
                    </button>
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
                                    <p className="address-name">{addr.name || user?.name || "User"}</p>
                                    <p className="address-line">{addr.address_line1}</p>
                                    <p className="address-line">
                                        {addr.city}, {addr.state} {addr.pincode}
                                    </p>
                                    <p className="address-line">{addr.country}</p>
                                    <p className="address-phone">Phone: {addr.phone}</p>
                                </div>
                                <div className="address-actions-mini">
                                    <button
                                        onClick={(e) => handleEditClick(e, addr)}
                                        className="btn-action edit"
                                        title="Edit"
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, addr.id)}
                                        className="btn-action delete"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAddress}
                initialData={editingAddress}
            />
        </div>
    );
};

export default AddressSelector;
