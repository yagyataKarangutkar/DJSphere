import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Loader2, ArrowLeft, BookmarkCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMyRegistrations, getEvents } from '../services/eventService';

// Import local assets for mapping
import aiWorkshopImg from '../assets/ai_workshop.jpg';
import codesprintImg from '../assets/codesprint.jpg';
import nrityaImg from '../assets/nritya.jpg';
import careerTalkImg from '../assets/career_talk.jpg';
import roboticsImg from '../assets/robotics.jpg';

const getIllustration = (category) => {
  const cat = String(category).toLowerCase();
  if (cat.includes('ai') || cat.includes('machine') || cat.includes('workshop')) return aiWorkshopImg;
  if (cat.includes('code') || cat.includes('hackathon') || cat.includes('contest')) return codesprintImg;
  if (cat.includes('dance') || cat.includes('cultural') || cat.includes('music')) return nrityaImg;
  if (cat.includes('career') || cat.includes('talk') || cat.includes('seminar')) return careerTalkImg;
  return roboticsImg;
};

export default function MyRegistrations() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Upcoming');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, eventsRes] = await Promise.all([
          getMyRegistrations(),
          getEvents()
        ]);

        if (regRes && regRes.success) {
          setRegistrations(regRes.data);
        } else {
          setError('Failed to fetch registrations.');
        }

        if (eventsRes && eventsRes.success) {
          setEvents(eventsRes.data);
        }
      } catch (err) {
        setError('Error connecting to backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map each registration to its corresponding event details
  const enrichedRegistrations = registrations.map((reg) => {
    const matchedEvent = events.find(
      (e) => e.title.toLowerCase() === reg.eventName.toLowerCase()
    );
    return {
      ...reg,
      eventDetails: matchedEvent || {
        date: reg.registeredOn,
        time: 'TBA',
        venue: 'DJSCE',
        category: 'Other',
        description: 'Details for this event are currently unavailable.'
      }
    };
  });

  // Filter based on dates relative to now
  const now = new Date();
  const upcomingList = enrichedRegistrations.filter(
    (item) => new Date(item.eventDetails.date) >= now
  );
  const completedList = enrichedRegistrations.filter(
    (item) => new Date(item.eventDetails.date) < now
  );

  const displayedList = activeTab === 'Upcoming' ? upcomingList : completedList;

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#FAF5F5] via-[#FCFAF8] to-[#E3EEF0] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-16">
        
        {/* Header Block */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            My Registrations
          </h1>
          <p className="text-xs text-slate-500 font-bold mt-2">
            Events you've registered for.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200/80 mb-8 gap-8 overflow-x-auto scrollbar-none">
          {['Upcoming', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#4A9B68] text-[#4A9B68]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading registrations...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-4.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-3xl font-bold text-center max-w-md mx-auto">
            {error}
          </div>
        ) : displayedList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs max-w-2xl mx-auto flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 font-bold">No {activeTab.toLowerCase()} registrations found.</p>
            <button
              onClick={() => navigate('/events')}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-[#4A9B68] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              Explore Events
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl">
            {displayedList.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/events/${item.eventDetails._id || ''}`)}
                className="bg-white rounded-3xl border border-slate-100 hover:border-[#4A9B68]/30 p-5 md:p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 group"
              >
                {/* Event Card Info */}
                <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                  {/* Category Image block */}
                  <div className="w-32 h-20 shrink-0 bg-[#FAF5F5] rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center p-2 shadow-inner shadow-slate-50 group-hover:scale-[1.02] transition-transform duration-200">
                    <img
                      src={getIllustration(item.eventDetails.category)}
                      alt={item.eventName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Text specs */}
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {item.eventDetails.category || 'Event'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#4A9B68] transition-colors mt-1.5 leading-snug">
                      {item.eventName}
                    </h3>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#4A9B68]" />
                        <span>
                          {new Date(item.eventDetails.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {' @ '}{item.eventDetails.time || '10:00 AM'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#4A9B68]" />
                        <span>{item.eventDetails.venue || 'College Campus'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge Status */}
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-[#E4F2EE] text-[#4A9B68] rounded-full text-[10px] font-black uppercase tracking-wider border border-[#4A9B68]/15 shadow-xs shadow-[#4A9B68]/5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Registered</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
