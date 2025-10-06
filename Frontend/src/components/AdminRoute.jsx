import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Assuming you have a useAuth hook

const AdminRoute = () => {
    const { user, token } = useAuth();

    if (!token) {
        // Not logged in at all
        return <Navigate to="/login" />;
    }

    if (user && user.role === 'admin') {
        // Logged in and is an admin, allow access
        return <Outlet />;
    } else {
        // Logged in but not an admin, redirect to regular dashboard
        return <Navigate to="/" />;
    }
};

export default AdminRoute;