import React, { useEffect, useState } from 'react';
import "@/styles/UserDashboard.css";
import { toast } from 'react-toastify';
import {
    FiUser,
    FiShoppingBag,
    FiMapPin,
    FiCreditCard,
    FiLock,
    FiLogOut,
    FiEdit2
} from "react-icons/fi";
import { userAPI } from '@/services/api';
import { useDispatch } from 'react-redux';
import { logout, updateProfileThunk } from '@/redux/features/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import AddressList from '../address/AddressList';
import Link from 'next/link';

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

interface UserProfile {
    id: number;
    name: string;
    email: string;
    mobile: string | null;
    status: string;
    created: string;
    gender?: string; // Additional field to add
}

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('personal-info');
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: ''
    });
    const [initialData, setInitialData] = useState({
        email: '',
        phone: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    }>({});

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userAPI.getUserProfile();
                if (response?.status === "SUCCESS" && response?.data) {
                    const data = response.data;
                    setProfile(data);

                    // Split name if possible
                    const nameParts = data.name ? data.name.split(' ') : ['', ''];
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';

                    setFormData({
                        firstName: stripLeadingSpaces(firstName),
                        lastName: stripLeadingSpaces(lastName),
                        email: stripLeadingSpaces(data.email || ''),
                        phone: (data.mobile || '').replace(/\D/g, ''),
                        gender: data.gender || ''
                    });
                    setInitialData({
                        email: data.email || '',
                        phone: data.mobile || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const validate = () => {
        const newErrors: { firstName?: string; lastName?: string; email?: string; phone?: string } = {};
        const namePattern = /^[A-Za-z][A-Za-z\s.'-]*$/;

        const firstName = formData.firstName.trim();
        const lastName = formData.lastName.trim();
        const email = formData.email.trim();
        const phone = formData.phone.replace(/\D/g, '');

        if (!firstName) {
            newErrors.firstName = 'First name is required.';
        } else if (firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters.';
        } else if (!namePattern.test(firstName)) {
            newErrors.firstName = 'First name can only contain letters.';
        }

        if (!lastName) {
            newErrors.lastName = 'Last name is required.';
        }

        // Email and phone are only editable when not already set on the account
        if (!initialData.email) {
            if (!email) {
                newErrors.email = 'Email is required.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                newErrors.email = 'Please enter a valid email address.';
            }
        }

        if (!initialData.phone) {
            if (!phone) {
                newErrors.phone = 'Phone number is required.';
            } else if (!/^\d{10}$/.test(phone)) {
                newErrors.phone = 'Phone number must be exactly 10 digits.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name } = e.target;
        // Value is kept exactly as typed; spaces must not be stripped while typing
        let value = e.target.value;

        // Spaces are allowed while typing; letters and symbols are not
        if (name === 'phone') {
            value = sanitizePhoneInput(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Typing or clearing a field always removes that field's message.
        // Validation only runs again when the form is submitted.
        setErrors((prev) => {
            const field = name as keyof typeof prev;
            if (!prev[field]) return prev;

            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        const value = name === 'phone'
            ? e.target.value.replace(/\D/g, '').slice(0, 10)
            : stripLeadingSpaces(e.target.value);

        // Phone is normalised to digits once the user leaves the field

        if (value !== e.target.value) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }
        
        setIsUpdating(true);
        try {
            const firstName = formData.firstName.trim();
            const lastName = formData.lastName.trim();
            const fullName = `${firstName} ${lastName}`.trim();
            const resultAction = await dispatch(updateProfileThunk({
                name: fullName,
                email: formData.email.trim(),
                phone: formData.phone.replace(/\D/g, '')
            }));

            if (updateProfileThunk.fulfilled.match(resultAction)) {
                toast.success("Profile updated successfully!");
                setProfile(resultAction.payload);
            } else {
                toast.error(resultAction.payload as string || "Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred while updating profile");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">My Account</h1>
                <div className="dashboard-breadcrumb">
                    <span>Home</span> / <span>My Account</span>
                </div>
            </div>

            {/* Main Layout */}
            <div className="dashboard-main">

                {/* Left Sidebar */}
                <div className="dashboard-sidebar">
                    <ul className="sidebar-menu">
                        <li
                            className={`sidebar-item ${activeTab === 'personal-info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('personal-info')}
                        >
                            <FiUser className="sidebar-icon" />
                            Personal Information
                        </li>
                        {/* <li
                            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <Link href={"/my-orders"}
                                className="sidebar-link"
                                onClick={() => setActiveTab('orders')}
                            >
                                <FiShoppingBag className="sidebar-icon" />
                                    My Orders
                            </Link>
                        </li> */}
                        <li
                            className={`sidebar-item ${activeTab === 'address' ? 'active' : ''}`}
                            onClick={() => setActiveTab('address')}
                        >
                            <FiMapPin className="sidebar-icon" />
                            Manage Address
                        </li>
                        {/* <li
                            className={`sidebar-item ${activeTab === 'payment' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payment')}
                        >
                            <FiCreditCard className="sidebar-icon" />
                            Payment Method
                        </li> */}

                        <li
                            className="sidebar-item"
                            onClick={handleLogout}
                            style={{ color: '#e74c3c' }}
                        >
                            <FiLogOut className="sidebar-icon" />
                            Logout
                        </li>
                    </ul>
                </div>

                {/* Right Content Area */}
                <div className="dashboard-content">
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>Loading profile...</div>
                    ) : (
                        activeTab === 'personal-info' && (
                            <div>
                                {/* Profile Avatar Form */}
                                <div className="profile-avatar-section">
                                    <div className="avatar-wrapper">
                                        {/* Avatar Placeholder: using first letter of name */}
                                        <div style={{ fontSize: '40px', color: '#666', fontWeight: 'bold' }}>
                                            {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        {/* <div className="avatar-edit-icon">
                                            <FiEdit2 size={14} />
                                        </div> */}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <form onSubmit={handleUpdate}>
                                    <div className="profile-form">
                                        <div className="form-group">
                                            <label className="form-label">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                className={`form-input${errors.firstName ? ' input-error' : ''}`}
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                onKeyDown={blockLeadingSpace}
                                                placeholder="Enter first name"
                                            />
                                            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className={`form-input${errors.lastName ? ' input-error' : ''}`}
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                onKeyDown={blockLeadingSpace}
                                                placeholder="Enter last name"
                                            />
                                            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-input${errors.email ? ' input-error' : ''}`}
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                onKeyDown={blockLeadingSpace}
                                                placeholder="Enter email address"
                                                disabled={!!initialData.email}
                                                style={{ cursor: initialData.email ? 'not-allowed' : 'text' }}
                                            />
                                            {errors.email && <span className="field-error">{errors.email}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className={`form-input${errors.phone ? ' input-error' : ''}`}
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter phone number"
                                                inputMode="numeric"
                                                onBlur={handleBlur}
                                                onKeyDown={blockLeadingSpace}
                                                disabled={!!initialData.phone}
                                                style={{ cursor: initialData.phone ? 'not-allowed' : 'text' }}
                                            />
                                            {errors.phone && <span className="field-error">{errors.phone}</span>}
                                        </div>
                                        {/* <div className="form-group">
                                            <label className="form-label">Gender</label>
                                            <select
                                                name="gender"
                                                className="form-select"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div> */}

                                        <div className="update-btn-wrapper full-width">
                                            <button 
                                                type="submit" 
                                                className="update-btn" 
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? "Updating..." : "Update Changes"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )
                    )}

                    {activeTab === 'address' && !isLoading && (
                        <div className="address-tab-content" style={{ marginTop: '20px' }}>
                            <AddressList />
                        </div>
                    )}

                    {activeTab !== 'personal-info' && activeTab !== 'address' && !isLoading && (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                            <h2>Coming Soon</h2>
                            <p>This section is currently under development.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UserDashboard;
