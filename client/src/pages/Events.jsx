import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { Calendar, MapPin, Tag, Users, ArrowRight, Loader2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventsList = async () => {
      try {
        const response = await getEvents();
        if (response && response.success) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        } else {
          setError('Failed to load events.');
        }
      } catch (err) {
        setError('Error connecting to the server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsList();
  }, []);

  // Filter events when search term or category changes
  useEffect(() => {
    let result = events;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.clubName.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((e) => e.category === selectedCategory);
    }

    setFilteredEvents(result);
  }, [searchTerm, selectedCategory, events]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const categories = ['All', 'Technical', 'Cultural', 'Seminar', 'Sports'];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fbf8f7] via-[#fafbfc] to-[#f4f7f6] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Campus Events</h1>
          <p className="text-sm text-slate-500 font-medium mt-2">
            Discover hackathons, college fests, cultural nights, and seminars happening at DJSCE.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 order-2 md:order-1 font-semibold text-xs">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4.5 py-2.5 rounded-full transition-all cursor-pointer border ${
                  selectedCategory === category
                    ? 'bg-[#4A9B68] border-[#4A9B68] text-white shadow-md shadow-[#4A9B68]/15 font-bold'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full order-1 md:order-2 font-semibold">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by title, club or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
              <span className="text-sm font-medium text-slate-500">Fetching events list...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold max-w-lg mx-auto text-center">
            {error}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl p-8 max-w-md mx-auto">
            <span className="text-3xl block">📅</span>
            <h3 className="text-sm font-extrabold text-slate-800 mt-4">No Events Found</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-semibold text-slate-700">
            {filteredEvents.map((event) => {
              const spotsLeft = Math.max(0, event.maxParticipants - event.registrationsCount);
              const isFull = spotsLeft === 0;

              return (
                <div 
                  key={event._id}
                  className="bg-white rounded-3xl border border-slate-200/50 hover:border-[#4A9B68]/20 p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Header Category and spots */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-[#4A9B68] tracking-wider">
                        {event.category}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isFull ? 'text-red-500' : 'text-slate-400'}`}>
                        {isFull ? 'Fully Booked' : `${spotsLeft} spots left`}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h2 className="text-lg font-black text-slate-900 line-clamp-1 group-hover:text-[#4A9B68] transition-colors">
                        {event.title}
                      </h2>
                      <span className="text-xs font-bold text-[#4A9B68] block mt-0.5">{event.clubName}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Meta info */}
                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{formatDate(event.date)} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-[#4A9B68]/30 text-slate-700 hover:text-[#4A9B68] text-xs font-bold rounded-2xl transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
