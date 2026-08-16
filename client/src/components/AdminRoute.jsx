import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF2F5] flex items-center justify-center text-gray-700">
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-200">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verifying admin access...</span>
        </div>
      </div>
    );
  }

  const isAdmin = user && (
    user.role === 'club_admin' || 
    user.role === 'super_admin' || 
    user.role === 'clubAdmin' || 
    user.role === 'superAdmin'
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
