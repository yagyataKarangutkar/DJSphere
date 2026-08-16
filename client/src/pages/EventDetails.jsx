import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getEventById, registerForEvent } from '../services/eventService';
import { Calendar, MapPin, Tag, Users, Clock, ArrowLeft, Loader2, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Register state
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchEventDetails = async () => {
    try {
      const response = await getEventById(id);
      if (response && response.success) {
        setEvent(response.data);
      } else {
        setError('Failed to load event details.');
      }
    } catch (err) {
      setError('Event not found or server connection failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    setRegisterError('');
    setRegisterSuccess('');

    try {
      const response = await registerForEvent(id);
      if (response && response.success) {
        setRegisterSuccess('Congratulations! You have successfully registered for this event.');
        setIsRegistered(true);
        // Refresh details (specifically the registration count)
        fetchEventDetails();
      } else {
        setRegisterError('Failed to register for the event.');
      }
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Error occurred while processing registration.');
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F5] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
            <span className="text-sm font-medium text-slate-500">Loading details...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen w-full bg-[#FAF9F5] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-lg font-black text-slate-800 mt-4">Error Loading Event</h3>
          <p className="text-sm text-slate-500 mt-1 font-semibold">{error || 'Event could not be found.'}</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#4A9B68] text-white text-xs font-bold rounded-2xl cursor-pointer hover:bg-[#3C8256]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const spotsLeft = Math.max(0, event.maxParticipants - event.registrationsCount);
  const isFull = spotsLeft === 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fbf8f7] via-[#fafbfc] to-[#f4f7f6] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-[#4A9B68]/30 text-slate-600 hover:text-[#4A9B68] text-xs font-bold rounded-2xl transition-all cursor-pointer bg-white mb-8 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        {/* Message banners */}
        {registerSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-[#4A9B68] text-sm rounded-3xl font-black flex items-start gap-2.5 shadow-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{registerSuccess}</span>
          </div>
        )}

        {registerError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-3xl font-black flex items-start gap-2.5 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{registerError}</span>
          </div>
        )}

        {/* Event Content Split Card */}
        <div className="bg-white border border-slate-200/50 rounded-3xl p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 font-semibold text-slate-700">
          
          {/* Main Info Columns (Left) */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-[#4A9B68] tracking-wider">
                {event.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
                {event.title}
              </h1>
              <span className="text-sm font-bold text-[#4A9B68] block mt-1">Hosted by {event.clubName}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">About the Event</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* Details Sidebar panel (Right) */}
          <div className="bg-[#FAF9F5] border border-slate-100 rounded-3xl p-6 flex flex-col justify-between h-fit gap-6">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Event Details</h3>

              {/* Date */}
              <div className="flex gap-3 text-xs">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Date</span>
                  <span className="text-slate-500 font-medium">{formatDate(event.date)}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex gap-3 text-xs">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Time</span>
                  <span className="text-slate-500 font-medium">{event.time}</span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex gap-3 text-xs">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Venue</span>
                  <span className="text-slate-500 font-medium block truncate max-w-[150px]">{event.venue}</span>
                </div>
              </div>

              {/* Capacity */}
              <div className="flex gap-3 text-xs">
                <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Registrations</span>
                  <span className="text-slate-500 font-medium block">
                    {event.registrationsCount} / {event.maxParticipants} booked
                  </span>
                </div>
              </div>
            </div>

            {/* Registration CTA Action Button */}
            <div className="pt-4 border-t border-slate-200/50">
              {isRegistered ? (
                <div className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 text-[#4A9B68] rounded-2xl text-sm font-black border border-emerald-100 select-none">
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Registered</span>
                </div>
              ) : isFull ? (
                <div className="w-full flex items-center justify-center py-3 bg-slate-100 text-slate-400 rounded-2xl text-sm font-black select-none text-center">
                  Fully Booked
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#4A9B68] hover:bg-[#3C8256] text-white rounded-2xl text-sm font-bold shadow-md shadow-[#4A9B68]/15 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {registering && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isAuthenticated ? 'Register Now' : 'Log in to Register'}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
