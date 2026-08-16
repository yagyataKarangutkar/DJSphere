import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Users, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getClubs } from '../services/clubService';

// Import local assets for mapping
import cisiLogo from '../assets/CISI.png';
import codeaiLogo from '../assets/CodeAi.png';
import ieeeLogo from '../assets/IEEE.png';
import rasLogo from '../assets/RAS.png';
import saeLogo from '../assets/SAE.png';
import smeLogo from '../assets/SME.png';
import aiWorkshopImg from '../assets/ai_workshop.jpg';
import codesprintImg from '../assets/codesprint.jpg';
import nrityaImg from '../assets/nritya.jpg';
import careerTalkImg from '../assets/career_talk.jpg';
import roboticsImg from '../assets/robotics.jpg';

const logoMap = {
  '/src/assets/CISI.png': cisiLogo,
  '/src/assets/CodeAi.png': codeaiLogo,
  '/src/assets/IEEE.png': ieeeLogo,
  '/src/assets/RAS.png': rasLogo,
  '/src/assets/SAE.png': saeLogo,
  '/src/assets/SME.png': smeLogo,
  '/src/assets/ai_workshop.jpg': aiWorkshopImg,
  '/src/assets/codesprint.jpg': codesprintImg,
  '/src/assets/nritya.jpg': nrityaImg,
  '/src/assets/career_talk.jpg': careerTalkImg,
  '/src/assets/robotics.jpg': roboticsImg
};

export const getClubLogo = (path) => logoMap[path] || codeaiLogo;

export default function Clubs() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchClubsList = async () => {
      try {
        const response = await getClubs();
        if (response && response.success) {
          setClubs(response.data);
        } else {
          setError('Failed to fetch clubs.');
        }
      } catch (err) {
        setError('Error connecting to backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubsList();
  }, []);

  // Filter logic
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.subtitle && club.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (club.tag && club.tag.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'All') return true;
    if (activeTab === 'Student Chapters') return club.type === 'Student Chapters';
    if (activeTab === 'Teams / Clubs') return club.type === 'Teams' || club.type === 'Club';
    if (activeTab === 'Technical') return club.tag.toLowerCase().includes('tech') || club.tag.toLowerCase().includes('coding') || club.tag.toLowerCase().includes('aero') || club.tag.toLowerCase().includes('robot');
    if (activeTab === 'Cultural') return club.tag.toLowerCase().includes('cultural') || club.tag.toLowerCase().includes('literature');
    if (activeTab === 'Creative') return club.type.toLowerCase().includes('creative') || club.tag.toLowerCase().includes('creative');
    if (activeTab === 'Sports') return club.tag.toLowerCase().includes('sports') || club.tag.toLowerCase().includes('racing');

    return true;
  });

  const studentChapters = filteredClubs.filter((c) => c.type === 'Student Chapters');
  const teams = filteredClubs.filter((c) => c.type === 'Teams');
  const otherClubs = filteredClubs.filter((c) => c.type !== 'Student Chapters' && c.type !== 'Teams');

  const categories = [
    'All',
    'Student Chapters',
    'Teams / Clubs',
    'Technical',
    'Cultural',
    'Creative',
    'Sports'
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#FAF5F5] via-[#FCFAF8] to-[#E3EEF0] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
        {/* Header Block */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Clubs & Committees
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-2">
            Explore communities that match your passion.
          </p>
        </div>

        {/* Filters and Search controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          {/* Category Pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4.5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                  activeTab === cat
                    ? 'bg-[#4A9B68] text-white shadow-md shadow-[#4A9B68]/15'
                    : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-md w-full shrink-0">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-xs outline-none bg-white transition-all font-semibold shadow-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
              <span className="text-xs font-bold text-slate-400">Loading directory...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-3xl font-bold max-w-md mx-auto text-center">
            {error}
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
            <p className="text-sm text-slate-400 font-bold">No clubs match your filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Conditional Tab Rendering */}
            {activeTab === 'All' ? (
              <>
                {/* Student Chapters */}
                {studentChapters.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-900">Student Chapters</h2>
                      <button
                        onClick={() => setActiveTab('Student Chapters')}
                        className="text-xs font-bold text-[#4A9B68] hover:text-[#3C8256] flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {studentChapters.map((club) => (
                        <ClubCard key={club._id} club={club} navigate={navigate} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Teams */}
                {teams.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-900">Teams</h2>
                      <button
                        onClick={() => setActiveTab('Teams / Clubs')}
                        className="text-xs font-bold text-[#4A9B68] hover:text-[#3C8256] flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {teams.map((club) => (
                        <ClubCard key={club._id} club={club} navigate={navigate} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other/Uncategorized */}
                {otherClubs.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900">Other Committees & Clubs</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {otherClubs.map((club) => (
                        <ClubCard key={club._id} club={club} navigate={navigate} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Flat view for filtered tab */
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900">{activeTab}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredClubs.map((club) => (
                    <ClubCard key={club._id} club={club} navigate={navigate} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Club Card Component
function ClubCard({ club, navigate }) {
  return (
    <div
      onClick={() => navigate(`/clubs/${club._id}`)}
      className="bg-white rounded-3xl border border-slate-100 hover:border-[#4A9B68]/30 p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
    >
      <div className="space-y-4">
        {/* Logo container */}
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 p-1 group-hover:scale-105 transition-transform duration-200">
          <img
            src={getClubLogo(club.logo)}
            alt={club.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Club Details */}
        <div>
          <h3 className="text-sm font-black text-slate-900 group-hover:text-[#4A9B68] transition-colors duration-200">
            {club.name}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5 tracking-wide line-clamp-1">
            {club.subtitle || club.type}
          </p>
          <p className="text-xs text-slate-500 font-semibold mt-2.5 line-clamp-2 leading-relaxed">
            {club.description || 'Explore joining this committee and technical chapters of DJSCE.'}
          </p>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <Users className="w-3.5 h-3.5 text-[#4A9B68]" />
        <span>{club.members || 0} Members</span>
      </div>
    </div>
  );
}
