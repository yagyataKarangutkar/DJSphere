import api from './api';

// Fetch all clubs (with optional search and type filtering)
export const getClubs = async (search = '', type = 'All') => {
  const queryParams = new URLSearchParams();
  if (search.trim()) queryParams.append('search', search);
  if (type !== 'All') queryParams.append('type', type);

  const response = await api.get(`/clubs?${queryParams.toString()}`);
  return response.data;
};

// Fetch specific club details by ID or Name
export const getClubById = async (id) => {
  const response = await api.get(`/clubs/${id}`);
  return response.data;
};
