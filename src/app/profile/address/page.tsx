import React from 'react';
import AddressList from '../../../components/address/AddressList';

export const metadata = {
    title: 'Saved Addresses',
    description: 'Manage your saved addresses for delivery',
};

export default function AddressPage() {
    return (
        <main className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6">
            <AddressList />
        </main>
    );
}
