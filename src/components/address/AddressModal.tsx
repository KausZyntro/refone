import React, { useState, useEffect } from 'react';
import { Address } from '../../types/address';
import { MdMyLocation, MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Omit<Address, 'id' | 'userId'>) => void;
    initialData?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, initialData }) => {

    const [formData, setFormData] = useState<Omit<Address, 'id' | 'userId'>>({
        name: '',
        address_line1: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        country: 'India',
        isDefault: false,
    });

    useEffect(() => {
        if (initialData) {
            const { id, userId, name, ...rest } = initialData;
            setFormData({
                name: name || '',
                address_line1: rest.address_line1 || '',
                city: rest.city || '',
                state: rest.state || '',
                pincode: rest.pincode || '',
                phone: rest.phone || '',
                country: rest.country || 'India',
                isDefault: rest.isDefault || false,
            });
        } else {
            setFormData({
                name: '',
                address_line1: '',
                city: '',
                state: '',
                pincode: '',
                phone: '',
                country: 'India',
                isDefault: false,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title">
                        {initialData ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button type="button" onClick={onClose} className="modal-close">
                        <MdClose size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* <button type="button" className="btn-location">
                        <MdMyLocation size={20} />
                        Use my current location
                    </button> */}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name *"
                                required
                                className="form-input-addr"
                            />
                        </div>
                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Pincode *"
                                required
                                className="form-input-addr"
                            />
                        </div>

                        <div className="form-row">
                            <div>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City *"
                                    required
                                    className="form-input-addr"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State *"
                                    required
                                    className="form-input-addr"
                                />
                            </div>
                        </div>

                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                placeholder="Flat no./House no./Office Building *"
                                required
                                className="form-input-addr"
                            />
                        </div>

                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number *"
                                required
                                className="form-input-addr"
                            />
                        </div>

                        <div className="checkbox-group-addr" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="isDefault" style={{ fontSize: '14px', color: '#555', cursor: 'pointer', fontWeight: 500 }}>
                                Set as default address
                            </label>
                        </div>

                        <button type="submit" className="btn-submit">
                            {initialData ? 'Update Address' : 'Save Address'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
