'use client';

import React, { useEffect, useState } from 'react';
import { Address } from '../../types/address';
import AddressCard from './AddressCard';
import AddressModal from './AddressModal';
import { MdAdd } from 'react-icons/md';
import '../../styles/AddressManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { addAddress, deleteAddress, fetchAddresses, updateAddress } from '@/redux/features/addressSlice';
import { toast } from 'react-toastify';
// import { RootState } from '@reduxjs/toolkit/query';


const AddressList = () => {
    // const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const savingRef = React.useRef(false);
    const dispatch = useDispatch<AppDispatch>();
    const { addresses, isLoading } = useSelector((state: RootState) => state.address);
    const { user } = useSelector((state: RootState) => state.auth);
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            dispatch(fetchAddresses(userId));
        }
    }, [dispatch, userId]);

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    // const handleEdit = (id: number) => {
    //     const addressToEdit = addresses.find(addr => addr.id === id);
    //     if (addressToEdit) {
    //         setEditingAddress(addressToEdit);
    //         setIsModalOpen(true);
    //     }
    // };
    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this address?");
        if (confirmDelete) {
            try {
                await dispatch(deleteAddress(id)).unwrap();
                toast.success("Address deleted successfully");
            } catch (err: any) {
                console.error("Delete Address Error:", err);
                toast.error(err || "Failed to delete address.");
            }
        }
    };

    // Addresses are compared on the fields the API uses to reject duplicates
    const normalizeAddressPart = (value?: string) =>
        (value || '').trim().toLowerCase().replace(/\s+/g, ' ');

    const isDuplicateAddress = (addressData: Omit<Address, 'id' | 'userId'>) =>
        addresses.some((saved) =>
            saved.id !== editingAddress?.id &&
            normalizeAddressPart(saved.address_line1) === normalizeAddressPart(addressData.address_line1) &&
            normalizeAddressPart(saved.pincode) === normalizeAddressPart(addressData.pincode) &&
            normalizeAddressPart(saved.city) === normalizeAddressPart(addressData.city)
        );

    const handleSave = async (addressData: Omit<Address, 'id' | 'userId'>) => {
        if (!userId || !user) {
            toast.error("User session not found. Please login again.");
            return;
        }

        // Ignore repeated submits while a save request is already running
        if (savingRef.current) {
            return;
        }

        if (!editingAddress && isDuplicateAddress(addressData)) {
            toast.info("This address is already saved.");
            setIsModalOpen(false);
            setEditingAddress(null);
            return;
        }

        const finalPayload = {
            ...addressData,
            userId,
            user_id: userId,
            name: user?.name || "User",
            phone: user?.phone || addressData.phone || "",
            is_default: addressData.isDefault ? 1 : 0
        };

        savingRef.current = true;
        setIsSaving(true);

        try {
            if (editingAddress) {
                await dispatch(updateAddress({
                    id: editingAddress.id,
                    data: finalPayload
                })).unwrap();
            } else {
                await dispatch(addAddress(finalPayload)).unwrap();
            }
            toast.success(
                editingAddress ? "Address updated successfully." : "Address added successfully."
            );
            setIsModalOpen(false);
            setEditingAddress(null);
            dispatch(fetchAddresses(userId));
        } catch (err: any) {
            const message =
                typeof err === 'string'
                    ? err.trim()
                    : typeof err?.message === 'string'
                        ? err.message.trim()
                        : '';

            // The API rejects an address the customer already has; treat it as
            // information rather than a failed save.
            if (/already exists/i.test(message)) {
                toast.info("This address is already saved.");
                setIsModalOpen(false);
                setEditingAddress(null);
                dispatch(fetchAddresses(userId));
            } else {
                console.error("Save Address Error:", err);
                toast.error(message || "Failed to save address.");
            }
        } finally {
            savingRef.current = false;
            setIsSaving(false);
        }
    };

    return (
        <>
            {/* <div className="address-container"> */}
            <div className="address-header">
                <h2 className="address-title">Saved Addresses</h2>
                <button className="btn-add-new" onClick={handleAddNew}>
                    <MdAdd size={20} /> Add New
                </button>
            </div>

            <div className="address-grid">
                {addresses.map(address => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={() => handleEdit(address)}
                        onDelete={() => handleDelete(address.id)}
                    />
                ))}

                {addresses.length === 0 && (
                    <div className="address-empty">
                        <div className="empty-icon">
                            <MdAdd size={32} />
                        </div>
                        <h3>No saved addresses found.</h3>
                        <p>Click "Add New" to add your first address.</p>
                    </div>
                )}
            </div>

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingAddress}
                isSaving={isSaving}
            />
            {/* </div> */}
        </>
    );
};

export default AddressList;
