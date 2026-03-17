import React, { useState, useEffect } from 'react';
import { Address } from '../../types/address';
import { MdMyLocation, MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onSave: (address: Address) => void;
    onSave: (address: Omit<Address, 'id' | 'userId'>) => void;
    initialData?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, initialData }) => {

    const { user } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState<Omit<Address, 'id' | 'userId'>>({
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
            const { id, userId, ...rest } = initialData;
            setFormData(rest);
        } else {
            setFormData({
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
                    <button type='button' onClick={onClose} className="modal-close">
                        <MdClose size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <button type="button" className="btn-location">
                        <MdMyLocation size={20} />
                        Use my current location
                    </button>

                    <form onSubmit={handleSubmit}>
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

                        {/* <div className="form-group-addr">
                            <input
                                type="text"
                                name="landmark"
                                value=""
                                onChange={handleChange}
                                placeholder="Landmark (optional)"
                                className="form-input-addr"
                            />
                        </div> */}

                        {/* <div className="form-group-addr">
                            <input
                                type="text"
                                name="altPhone"
                                value={formData.altPhone}
                                onChange={handleChange}
                                placeholder="Alternate number (optional)"
                                className="form-input-addr"
                            />
                        </div> */}

                        {/* <div className="save-as-section">
                            <span className="save-as-label">Save As</span>
                            <div className="radio-group">
                                {['Home', 'Office', 'Other'].map((type) => (
                                    <label key={type} className="radio-label">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={formData.type === type}
                                            onChange={handleChange}
                                        />
                                        <div className="radio-box">
                                            {type}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div> */}

                        <button type="submit" className="btn-submit">
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
