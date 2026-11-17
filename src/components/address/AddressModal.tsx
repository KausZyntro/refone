import React, { useState, useEffect } from 'react';
import { Address } from '../../types/address';
import { MdMyLocation, MdClose } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import "@/styles/AddressManagement.css";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: Omit<Address, 'id' | 'userId'>) => void;
    initialData?: Address | null;
    isSaving?: boolean;
}

// Leading spaces are not allowed in any field
const stripLeadingSpaces = (value: string) => value.replace(/^\s+/, '');

// Phone fields allow spaces while typing but only digits are kept
// (spaces are stripped for validation and saving)
const sanitizePhoneInput = (raw: string) => {
    let digits = 0;
    let result = '';

    for (const char of raw) {
        if (char >= '0' && char <= '9') {
            if (digits < 10) {
                result += char;
                digits += 1;
            }
        } else if (/\s/.test(char)) {
            result += char;
        }
    }

    return stripLeadingSpaces(result);
};

// Pressing space as the very first character of a field is ignored
const blockLeadingSpace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (e.key === ' ' && input.selectionStart === 0) {
        e.preventDefault();
    }
};

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSave, initialData, isSaving = false }) => {

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

    const [errors, setErrors] = useState<Record<string, string>>({});
    const formRef = React.useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (initialData) {
            const { id, userId, name, ...rest } = initialData;
            setFormData({
                name: stripLeadingSpaces(name || ''),
                address_line1: stripLeadingSpaces(rest.address_line1 || ''),
                city: stripLeadingSpaces(rest.city || ''),
                state: stripLeadingSpaces(rest.state || ''),
                pincode: stripLeadingSpaces(rest.pincode || ''),
                phone: (rest.phone || '').replace(/\D/g, ''),
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
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    // };

    const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    let { name, value } = e.target;

    if (name === "pincode") {
        value = value.replace(/\D/g, "").slice(0, 6);
    }

    if (name === "phone") {
        // Spaces are allowed while typing; letters and symbols are not
        value = sanitizePhoneInput(value);
    }

    // Value is kept exactly as typed; spaces must not be stripped while typing

    if (errors[name]) {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
        });
    }

     if (name === "pincode" && value.length < 6) {
        setFormData((prev) => ({
            ...prev,
            pincode: value,
            city: "",
            state: "",
        }));
        return;
    }

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));

    if (name === "pincode" && value.length === 6) {
        try {
            const res = await fetch(
                `https://api.postalpincode.in/pincode/${value}`
            );

            const data = await res.json();

            if (
                data[0]?.Status === "Success" &&
                data[0]?.PostOffice?.length > 0
            ) {
                const office = data[0].PostOffice[0];

                setFormData((prev) => ({
                    ...prev,
                    pincode: value,
                    city: office.District || "",
                    state: office.State || "",
                }));
            }
        } catch (error) {
            console.error("Pincode lookup failed:", error);
        }
    }
};

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required.";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Full name must be at least 3 characters.";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required.";
        } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
            newErrors.pincode = "Pincode must be exactly 6 digits.";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required.";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required.";
        }

        if (!formData.address_line1.trim()) {
            newErrors.address_line1 = "Address is required.";
        } else if (formData.address_line1.trim().length < 5) {
            newErrors.address_line1 = "Address must be at least 5 characters.";
        }

        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (!phoneDigits) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(phoneDigits)) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        let value = e.target.value;

        if (name === "pincode") {
            value = value.replace(/\D/g, "").slice(0, 6);
        } else if (name === "phone") {
            value = value.replace(/\D/g, "").slice(0, 10);
        } else {
            value = stripLeadingSpaces(value);
        }

        if (value !== e.target.value) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // A second submit while the first request is in flight creates a
        // duplicate address on the server.
        if (isSaving) {
            return;
        }

        if (!validate()) {
            // Bring the first invalid field into view so a failed save is
            // obvious even when the form is scrolled down.
            requestAnimationFrame(() => {
                const firstInvalid = formRef.current?.querySelector<HTMLInputElement>('.input-error');
                firstInvalid?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                firstInvalid?.focus({ preventScroll: true });
            });
            return;
        }

        // Normalise on submit so no field is saved with a leading space
        onSave({
            ...formData,
            name: stripLeadingSpaces(formData.name),
            city: stripLeadingSpaces(formData.city),
            state: stripLeadingSpaces(formData.state),
            address_line1: stripLeadingSpaces(formData.address_line1),
            pincode: formData.pincode.replace(/\D/g, "").slice(0, 6),
            phone: formData.phone.replace(/\D/g, "").slice(0, 10),
        });
    };

    return (
        <div className="modal-overlay" onClick={isSaving ? undefined : onClose}>
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="address-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title" id="address-modal-title">
                        {initialData ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="modal-close"
                        aria-label="Close address form"
                    >
                        <MdClose size={22} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* <button type="button" className="btn-location">
                        <MdMyLocation size={20} />
                        Use my current location
                    </button> */}

                    <form onSubmit={handleSubmit} noValidate ref={formRef} aria-busy={isSaving}>
                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onKeyDown={blockLeadingSpace}
                                placeholder="Full Name *"
                                required
                                className={`form-input-addr${errors.name ? ' input-error' : ''}`}
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>
                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Pincode *"
                                required
                                inputMode="numeric"
                                maxLength={6}
                                className={`form-input-addr${errors.pincode ? ' input-error' : ''}`}
                            />
                            {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                        </div>

                        <div className="form-row">
                            <div>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={blockLeadingSpace}
                                    placeholder="City *"
                                    required
                                    className={`form-input-addr${errors.city ? ' input-error' : ''}`}
                                />
                                {errors.city && <span className="field-error">{errors.city}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={blockLeadingSpace}
                                    placeholder="State *"
                                    required
                                    className={`form-input-addr${errors.state ? ' input-error' : ''}`}
                                />
                                {errors.state && <span className="field-error">{errors.state}</span>}
                            </div>
                        </div>

                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onKeyDown={blockLeadingSpace}
                                placeholder="Flat no./House no./Office Building *"
                                required
                                className={`form-input-addr${errors.address_line1 ? ' input-error' : ''}`}
                            />
                            {errors.address_line1 && <span className="field-error">{errors.address_line1}</span>}
                        </div>

                        <div className="form-group-addr">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number *"
                                required
                                inputMode="numeric"
                                onBlur={handleBlur}
                                onKeyDown={blockLeadingSpace}
                                className={`form-input-addr${errors.phone ? ' input-error' : ''}`}
                            />
                            {errors.phone && <span className="field-error">{errors.phone}</span>}
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

                        <button type="submit" className="btn-submit" disabled={isSaving} aria-busy={isSaving}>
                            {isSaving && <span className="btn-spinner" aria-hidden="true" />}
                            {isSaving
                                ? 'Saving...'
                                : initialData
                                    ? 'Update Address'
                                    : 'Save Address'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
