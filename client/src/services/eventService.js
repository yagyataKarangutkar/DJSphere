import api from './api';

// Fetch all events (public/student listing)
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

// Fetch admin filtered events
export const getAdminEvents = async () => {
  const response = await api.get('/events?admin=true');
  return response.data;
};

// Fetch details for a specific event
export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

// Create a new event (Club Admin or Super Admin)
export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

// Update an existing event (Club Admin or Super Admin)
export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

// Delete an event (Club Admin or Super Admin)
export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

// Register the logged-in student for an event
export const registerForEvent = async (id) => {
  const response = await api.post(`/events/${id}/register`);
  return response.data;
};
