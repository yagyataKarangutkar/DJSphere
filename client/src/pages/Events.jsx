import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { Calendar, MapPin, Search, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import local clay illustration assets
import aiWorkshopImg from '../assets/ai_workshop.jpg';
import codesprintImg from '../assets/codesprint.jpg';
import nrityaImg from '../assets/nritya.jpg';
import careerTalkImg from '../assets/career_talk.jpg';
import roboticsImg from '../assets/robotics.jpg';

export default function Events() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    const fetchEventsList = async () => {
      try {
        const response = await getEvents();
        if (response && response.success) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        } else {
          setError('Failed to fetch events.');
        }
      } catch (err) {
        setError('Error connecting to backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsList();
  }, []);

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
    setCurrentPage(1); // reset to page 1 on filter
  }, [searchTerm, selectedCategory, events]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Helper to map event titles to their respective clay illustration image
  const getEventImage = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning')) return aiWorkshopImg;
    if (lowerTitle.includes('sprint') || lowerTitle.includes('hackathon')) return codesprintImg;
    if (lowerTitle.includes('nritya') || lowerTitle.includes('dance')) return nrityaImg;
    if (lowerTitle.includes('career') || lowerTitle.includes('talk')) return careerTalkImg;
    if (lowerTitle.includes('robot')) return roboticsImg;
    return aiWorkshopImg; // fallback
  };

  const categories = ['All', 'Workshop', 'Competition', 'Cultural', 'Talk', 'Other'];

  // Pagination calculation
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="min-h-screen w-full bg-[#FCF5F3] flex flex-col font-sans selection:bg-[#E27D60] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        {/* Title Block */}
        <div className="mb-10 text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Events</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1.5">
            Find and register for exciting events.
          </p>
        </div>

        {/* Filters and Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          {/* Categories */}
          <div className="flex flex-wrap gap-2.5 order-2 md:order-1 font-semibold text-xs text-slate-500">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4.5 py-2.5 rounded-full border transition-all cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#4A9B68] border-[#4A9B68] text-white font-bold shadow-md shadow-[#4A9B68]/15'
                    : 'bg-white border-slate-200/60 text-slate-500 hover:border-slate-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full order-1 md:order-2 font-semibold">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-xs outline-none bg-white transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
              <span className="text-sm font-medium text-slate-500">Loading events...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold max-w-lg mx-auto text-center">
            {error}
          </div>
        ) : currentEvents.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8 max-w-md mx-auto shadow-xs">
            <span className="text-3xl">📅</span>
            <h3 className="text-sm font-extrabold text-slate-800 mt-4">No events scheduled</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Check back later or try adjusting filters.</p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-semibold text-slate-700">
              {currentEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="bg-white rounded-3xl border border-slate-200/40 p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-[#4A9B68]/20 transition-all duration-300 group cursor-pointer"
                >
                  <div>
                    {/* Event Illustration Image Container */}
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-4.5 border border-slate-100/50">
                      <img
                        src={getEventImage(event.title)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Metadata Card Content */}
                    <div className="space-y-2">
                      <h2 className="text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-[#4A9B68] transition-colors">
                        {event.title}
                      </h2>
                      
                      <div className="space-y-1.5 text-[10px] font-bold text-slate-400">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(event.date)} at {event.time.split(' - ')[0]}</span>
                        </div>
                        {/* Venue */}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12 font-bold text-xs">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#4A9B68] border-[#4A9B68] text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
