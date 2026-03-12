"use client";
import React from 'react';
import UserDashboard from '@/components/account/UserDashboard';

const MyAccountPage = () => {
    return (
        <div style={{ padding: '20px 0', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <UserDashboard />
        </div>
    );
};

export default MyAccountPage;
