import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Calendar, MapPin, Globe, Sparkles, Building, User2, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getClubById } from '../services/clubService';
import { getEvents } from '../services/eventService';
import { getClubLogo } from './Clubs';

// Import illustrations for Gallery
import aiWorkshopImg from '../assets/ai_workshop.jpg';
import codesprintImg from '../assets/codesprint.jpg';
import nrityaImg from '../assets/nritya.jpg';
import careerTalkImg from '../assets/career_talk.jpg';
import roboticsImg from '../assets/robotics.jpg';

export default function ClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('About');

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const clubResponse = await getClubById(id);
        if (clubResponse && clubResponse.success) {
          setClub(clubResponse.data);
          
          // Fetch events and filter by this club name
          const eventsResponse = await getEvents();
          if (eventsResponse && eventsResponse.success) {
            const clubEvents = eventsResponse.data.filter(
              (e) => e.clubName.toLowerCase() === clubResponse.data.name.toLowerCase()
            );
            setEvents(clubEvents);
          }
        } else {
          setError('Club details could not be found.');
        }
      } catch (err) {
        setError('Error connecting to backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
          <span className="text-xs font-bold text-slate-400">Loading club details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-3xl font-bold mb-6">
            {error || 'Club not found'}
          </div>
          <button
            onClick={() => navigate('/clubs')}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
          >
            Back to Clubs
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Gallery items matching our clay theme
  const galleryItems = [codesprintImg, aiWorkshopImg, roboticsImg, nrityaImg, careerTalkImg];

  // Team Mock Details
  const teamMembers = [
    { name: 'Yagyata Karangutkar', role: 'Chairperson', department: 'Computer Engineering' },
    { name: 'Riya Shah', role: 'Vice-Chairperson', department: 'Information Technology' },
    { name: 'Karan Patel', role: 'Technical Head', department: 'Electronics Engineering' },
    { name: 'Ananya Mehta', role: 'Creative Lead', department: 'Computer Engineering' }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#FAF5F5] via-[#FCFAF8] to-[#E3EEF0] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-16 space-y-12">
        {/* Back Link */}
        <button
          onClick={() => navigate('/clubs')}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Clubs</span>
        </button>

        {/* Top Details Card - Split Layout */}
        <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 md:p-12 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left panel - Large Clay Illustration Card */}
          <div className="md:col-span-5 aspect-square rounded-3xl bg-[#FAF5F5] overflow-hidden border border-slate-100 flex items-center justify-center p-8 max-w-sm mx-auto md:max-w-none w-full shadow-inner shadow-slate-100">
            <img
              src={getClubLogo(club.logo)}
              alt={club.name}
              className="w-full h-full object-cover rounded-2xl drop-shadow-xl animate-in fade-in zoom-in-95 duration-500"
            />
          </div>

          {/* Right panel - Info Block */}
          <div className="md:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E4F2EE] text-[#4A9B68] rounded-full text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{club.tag || 'Official Club'}</span>
            </span>

            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {club.name}
              </h1>
              {club.subtitle && (
                <p className="text-sm text-slate-400 font-bold mt-1 tracking-wide uppercase">
                  {club.subtitle}
                </p>
              )}
            </div>

            <p className="text-sm text-slate-500 font-semibold leading-relaxed">
              {club.description || 'Explore, build projects, and collaborate with leading student chapters at Dwarkadas J. Sanghvi College of Engineering.'}
            </p>

            {/* Structured Specifications Table */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-6 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-[#4A9B68] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Established</span>
                  <span className="text-slate-800 font-black normal-case text-sm block mt-0.5">{club.established || 2022}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#4A9B68] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Active Members</span>
                  <span className="text-slate-800 font-black normal-case text-sm block mt-0.5">{club.members || 100}+</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#4A9B68] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Category</span>
                  <span className="text-slate-800 font-black normal-case text-sm block mt-0.5">{club.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User2 className="w-4 h-4 text-[#4A9B68] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Open to</span>
                  <span className="text-slate-800 font-black normal-case text-sm block mt-0.5">{club.openTo || 'All Students'}</span>
                </div>
              </div>
            </div>

            {/* Social Links & CTA */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-3 text-slate-400">
                <a href={club.socialLinks?.facebook || 'https://facebook.com'} target="_blank" rel="noreferrer" className="hover:text-[#4A9B68] transition-colors p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={club.socialLinks?.github || 'https://github.com'} target="_blank" rel="noreferrer" className="hover:text-[#4A9B68] transition-colors p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={club.socialLinks?.twitter || 'https://twitter.com'} target="_blank" rel="noreferrer" className="hover:text-[#4A9B68] transition-colors p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <Globe className="w-4 h-4" />
                </a>
                <a href={club.socialLinks?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" className="hover:text-[#4A9B68] transition-colors p-1.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <Globe className="w-4 h-4" />
                </a>
              </div>

              <button
                onClick={() => navigate(`/events?search=${encodeURIComponent(club.name)}`)}
                className="px-6 py-3 bg-[#4A9B68] hover:bg-[#3C8256] text-white text-xs font-black rounded-2xl transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                View Events
              </button>
            </div>
          </div>
        </div>

        {/* Tab Controls & Tab Panel Grid */}
        <div className="space-y-6">
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-8">
            {['About', 'What We Do', 'Gallery', 'Team'].map((tab) => (
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

          {/* Tab Contents */}
          <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-xs min-h-[220px]">
            {activeTab === 'About' && (
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-between">
                <div className="flex-1 space-y-4">
                  <h3 className="text-lg font-black text-slate-900">About {club.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    {club.aboutText || `Welcome to ${club.name}! We organize technical workshops, hackathons, guest lectures, and project mentorship programs to help engineering students build expertise in modern industries.`}
                  </p>
                </div>
                <div className="w-40 h-40 shrink-0 bg-[#E4F2EE] rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center p-4">
                  <img
                    src={roboticsImg}
                    alt="Details illust"
                    className="w-full h-full object-contain drop-shadow-md rounded-xl"
                  />
                </div>
              </div>
            )}

            {activeTab === 'What We Do' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">What We Do</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed whitespace-pre-line">
                  {club.whatWeDo || 'We organize regular coding contests, aero-modeling design bootcamps, workshops on cutting-edge engineering modules, and alumni connect panels.'}
                </p>
              </div>
            )}

            {activeTab === 'Gallery' && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {galleryItems.map((imgSrc, i) => (
                    <div key={i} className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 shadow-xs group hover:scale-[1.02] transition-all">
                      <img
                        src={imgSrc}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Team' && (
              <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900">Active Committee Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, i) => (
                    <div key={i} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{member.name}</h4>
                        <p className="text-[10px] text-[#4A9B68] font-bold mt-0.5 uppercase tracking-wide">{member.role}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-4">{member.department}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events Hosted by selected club */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Upcoming Events</h2>
            <button
              onClick={() => navigate('/events')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              View All
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
              <p className="text-xs text-slate-400 font-bold">No upcoming events are currently scheduled for this club.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="bg-white rounded-3xl border border-slate-100 hover:border-[#4A9B68]/30 p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-[0.99] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Event image card */}
                    <div className="aspect-video w-full rounded-2xl bg-[#FAF5F5] overflow-hidden border border-slate-100 flex items-center justify-center p-4">
                      <img
                        src={getClubLogo(club.logo)}
                        alt={event.title}
                        className="h-full object-contain rounded-xl drop-shadow-md"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-black text-[#4A9B68] uppercase tracking-wider">
                        {event.category}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-[#4A9B68] transition-colors duration-200 mt-1 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-2 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-50 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-[#4A9B68] shrink-0" />
                      <span className="truncate">{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#4A9B68] shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
