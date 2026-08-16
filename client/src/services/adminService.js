import api from './api';

// Fetch admin dashboard stats and recent event lists
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// Fetch admin list of events (filtered by club context on backend)
export const getAdminEvents = async () => {
  const response = await api.get('/admin/events');
  return response.data;
};

// Fetch admin list of registrations (filtered by club context on backend)
export const getAdminRegistrations = async () => {
  const response = await api.get('/admin/registrations');
  return response.data;
};

// Fetch list of clubs (Super Admin only)
export const getAdminClubs = async () => {
  const response = await api.get('/admin/clubs');
  return response.data;
};

// Create a new club (Super Admin only)
export const createClub = async (clubData) => {
  const response = await api.post('/admin/clubs', clubData);
  return response.data;
};

// Fetch list of registered platform users (Super Admin only)
export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};
