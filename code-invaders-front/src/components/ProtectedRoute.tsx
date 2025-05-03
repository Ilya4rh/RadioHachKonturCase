import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = (): boolean => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
};

export const ProtectedRoute = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}; 