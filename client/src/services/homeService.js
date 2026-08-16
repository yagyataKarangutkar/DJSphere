import api from './api';

// Fetch public landing page stats
export const getHomeStats = async () => {
  const response = await api.get('/home');
  return response.data;
};
