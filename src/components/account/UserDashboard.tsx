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
import { logout } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import AddressList from '../address/AddressList';

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
                        firstName: firstName,
                        lastName: lastName,
                        email: data.email || '',
                        phone: data.mobile || 'Not Provided',
                        gender: data.gender || ''
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the update API request
        toast.info("Profile update would trigger here!");
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    return (
        <div className="container-hero">
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
                        <li
                            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <FiShoppingBag className="sidebar-icon" />
                            My Orders
                        </li>
                        <li
                            className={`sidebar-item ${activeTab === 'address' ? 'active' : ''}`}
                            onClick={() => setActiveTab('address')}
                        >
                            <FiMapPin className="sidebar-icon" />
                            Manage Address
                        </li>
                        <li
                            className={`sidebar-item ${activeTab === 'payment' ? 'active' : ''}`}
                            onClick={() => setActiveTab('payment')}
                        >
                            <FiCreditCard className="sidebar-icon" />
                            Payment Method
                        </li>

                        <li
                            className="sidebar-item"
                            onClick={handleLogout}
                            style={{ marginTop: '20px', color: '#e74c3c' }}
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
                                                className="form-input"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="form-input"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter email address"
                                                readOnly // Usually email shouldn't be mutable directly without verification
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className="form-input"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Enter phone number"
                                            />
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
                                            <button type="submit" className="update-btn">
                                                Update Changes
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
