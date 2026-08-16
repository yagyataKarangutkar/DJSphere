import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAdminEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import { Loader2, Trash2, Edit3, Plus, X, Calendar, MapPin, Tag, Users, Clock, AlertCircle } from 'lucide-react';

export default function AdminEvents() {
  const { user } = useSelector((state) => state.auth);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'Technical',
    maxParticipants: '',
    clubName: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isSuperAdmin = user.role === 'superAdmin' || user.role === 'super_admin';

  // Available clubs list for super admin dropdown selection
  const availableClubs = ['DJS CodeAI', 'DJS CSI', 'DJS Synapse', 'DJS Unicode', 'DJS ACM SIGCHI'];

  const fetchEvents = async () => {
    try {
      const response = await getAdminEvents();
      if (response && response.success) {
        setEvents(response.data);
      } else {
        setError('Failed to fetch events data.');
      }
    } catch (err) {
      setError('An error occurred while loading events.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormError('');
    setSuccessMessage('');
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      category: 'Technical',
      maxParticipants: '',
      clubName: isSuperAdmin ? availableClubs[0] : user.clubName,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormError('');
    setSuccessMessage('');
    
    // Format date string to YYYY-MM-DD for date input field
    const formattedDate = event.date ? new Date(event.date).toISOString().substring(0, 10) : '';

    setFormData({
      title: event.title,
      description: event.description || '',
      date: formattedDate,
      time: event.time || '',
      venue: event.venue || '',
      category: event.category || 'Technical',
      maxParticipants: event.maxParticipants || '',
      clubName: event.clubName,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const { title, description, date, time, venue, category, maxParticipants, clubName } = formData;

    // Simple frontend validation
    if (!title.trim() || !description.trim() || !date || !time.trim() || !venue.trim() || !category || !maxParticipants) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (Number(maxParticipants) <= 0) {
      setFormError('Maximum participants must be a positive number.');
      return;
    }

    setSubmitting(true);

    try {
      if (editingEvent) {
        // Edit Action
        const response = await updateEvent(editingEvent._id, formData);
        if (response && response.success) {
          setSuccessMessage('Event updated successfully.');
          setIsModalOpen(false);
          fetchEvents();
        } else {
          setFormError('Failed to update event.');
        }
      } else {
        // Create Action
        const response = await createEvent(formData);
        if (response && response.success) {
          setSuccessMessage('Event created successfully.');
          setIsModalOpen(false);
          fetchEvents();
        } else {
          setFormError('Failed to create event.');
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'An error occurred while saving the event.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this event: "${title}"?`);
    if (!confirmDelete) return;

    try {
      const response = await deleteEvent(id);
      if (response && response.success) {
        alert('Event deleted successfully.');
        fetchEvents();
      } else {
        alert('Failed to delete event.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred while deleting the event.');
      console.error(err);
    }
  };

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold max-w-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Events</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {user.role === 'clubAdmin' || user.role === 'club_admin'
              ? `Manage events belonging to ${user.clubName}`
              : 'Manage events for all platform clubs'}
          </p>
        </div>

        {/* Create Event Button */}
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A9B68] hover:bg-[#3C8256] text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </button>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#4A9B68] text-sm rounded-2xl font-bold flex items-center gap-2">
          <span>{successMessage}</span>
        </div>
      )}

      {/* Events Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-xs">
        <div className="overflow-x-auto -mx-6 sm:-mx-8">
          <div className="inline-block min-w-full align-middle px-6 sm:px-8">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Event</th>
                  <th className="pb-3 px-4">Club</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Venue</th>
                  <th className="pb-3 px-4">Registrations</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 text-sm font-semibold text-slate-700">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-xs font-bold">
                      No events found.
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4 text-slate-900 font-extrabold max-w-[180px] truncate">
                        {event.title}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium truncate max-w-[140px]">
                        {event.clubName}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {formatDate(event.date)}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium truncate max-w-[120px]">
                        {event.venue}
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-bold">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-black">
                          {event.registrationsCount} / {event.maxParticipants}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-1.5 text-slate-400 hover:text-[#4A9B68] hover:bg-emerald-50 rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id, event.title)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dynamic Creation/Edit Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-6">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-semibold text-slate-700">
              {formError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Event Name *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. AI Workshop"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Description *</label>
                <textarea
                  name="description"
                  placeholder="Provide an overview of the event..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full h-24 px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all resize-none"
                  required
                />
              </div>

              {/* Grid 2 Column for Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Date *</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Time *</label>
                  <input
                    type="text"
                    name="time"
                    placeholder="e.g. 3:00 PM"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Grid 2 Column for Venue & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    placeholder="e.g. Seminar Hall"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              {/* Max Participants & Club Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Maximum Participants *</label>
                  <input
                    type="number"
                    name="maxParticipants"
                    placeholder="e.g. 100"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Club *</label>
                  {isSuperAdmin ? (
                    <select
                      name="clubName"
                      value={formData.clubName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                    >
                      {availableClubs.map((club) => (
                        <option key={club} value={club}>{club}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-500 select-none">
                      {user.clubName}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-500 text-sm rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#4A9B68] hover:bg-[#3C8256] text-white text-sm rounded-2xl font-bold transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
