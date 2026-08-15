import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from './store/authSlice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Placeholder views for protected route verification
const StudentDashboard = () => (
  <div className="min-h-screen bg-[#EEF2F5] p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
      <p className="text-gray-500 mt-2">Welcome to DJSphere Campus Portal.</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="min-h-screen bg-[#EEF2F5] p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
      <p className="text-gray-500 mt-2">Manage campus clubs, events, and registrations.</p>
    </div>
  </div>
);

export default function App() {
  const dispatch = useDispatch();

  // Verify backend session on initial application load via HTTP-only cookie
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<StudentDashboard />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}