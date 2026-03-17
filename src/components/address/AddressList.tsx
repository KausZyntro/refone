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
// import { RootState } from '@reduxjs/toolkit/query';


const AddressList = () => {
    // const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
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
            } catch (err: any) {
                console.error("Delete Address Error:", err);
                alert(err || "Failed to delete address.");
            }
        }
    };

    const handleSave = async (addressData: Omit<Address, 'id' | 'userId'>) => {
        if (!userId || !user) {
            alert("User session not found. Please login again.");
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

        try {
            if (editingAddress) {
                await dispatch(updateAddress({
                    id: editingAddress.id,
                    data: finalPayload
                })).unwrap();
            } else {
                await dispatch(addAddress(finalPayload)).unwrap();
            }
            setIsModalOpen(false);
            setEditingAddress(null);
            dispatch(fetchAddresses(userId));
        } catch (err: any) {
            console.error("Save Address Error:", err);
            alert(err || "Failed to save address.");
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
            />
            {/* </div> */}
        </>
    );
};

export default AddressList;
