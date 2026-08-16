import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from './store/authSlice';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Clubs from './pages/Clubs';
import Events from './pages/Events';
import MyRegistrations from './pages/MyRegistrations';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const AdminDashboard = () => (
  <div className="min-h-screen bg-[#FCFAF8] p-8 font-sans">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
      <p className="text-slate-500 mt-2">Manage campus clubs, events, and registrations.</p>
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
        {/* Public Discovery Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/events" element={<Events />} />

        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/profile" element={<Profile />} />
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