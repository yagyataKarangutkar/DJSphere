import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as frameMotion } from 'framer-motion';
import { Compass, Users, Sparkles, ArrowRight, Trees, CalendarDays, MapPin, Award, BookOpen, UserPlus, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingIslandCanvas from '../components/FloatingIslandCanvas';
import { getHomeStats } from '../services/homeService';

export default function Home() {
  const navigate = useNavigate();
  const [activeCommunityPill, setActiveCommunityPill] = useState('Student Chapters');
  const [stats, setStats] = useState({
    clubsCount: 25,
    eventsCount: 40,
    studentsCount: 1200
  });

  React.useEffect(() => {
    let active = true;
    const fetchStats = async () => {
      try {
        const resData = await getHomeStats();
        if (active && resData && resData.success && resData.data) {
          setStats(resData.data);
        }
      } catch (err) {
        // Fallback silently
      }
    };
    fetchStats();
    return () => {
      active = false;
    };
  }, []);


  const communityPills = [
    'Student Chapters',
    'Clubs',
    'Teams',
    'Technical',
    'Cultural',
    'Creative',
    'Sports',
    'Social'
  ];

  const events = [
    {
      title: 'AI/ML Workshop',
      category: 'Workshop',
      date: '24 Aug 2026 @ 4:00 PM',
      location: 'DJSCE, Seminar Hall',
      bgGrad: 'from-[#e3f4e8] to-[#c5e6ce]',
      color: '#4A9B68',
      icon: BookOpen
    },
    {
      title: 'CodeSprint 3.0',
      category: 'Competition',
      date: '27 Aug 2026 @ 10:00 AM',
      location: 'Online',
      bgGrad: 'from-[#fcedeb] to-[#f4d0cb]',
      color: '#E05D52',
      icon: Sparkles
    },
    {
      title: 'Nritya - The Dance Fest',
      category: 'Festival',
      date: '29 Aug 2026 @ 5:00 PM',
      location: 'DJSCE, Auditorium',
      bgGrad: 'from-[#f2edf8] to-[#dacfe8]',
      color: '#8A5CF5',
      icon: Users
    },
    {
      title: 'Career in Tech Talk',
      category: 'Talk',
      date: '01 Sep 2026 @ 11:00 AM',
      location: 'DJSCE, Room 304',
      bgGrad: 'from-[#fdf6e6] to-[#f7e0b5]',
      color: '#B4833E',
      icon: Compass
    }
  ];

  const communities = [
    {
      name: 'DJS CSI',
      tag: 'CSI Student Chapter',
      bgGrad: 'from-[#e3f4e8] to-[#c5e6ce]',
      icon: BookOpen
    },
    {
      name: 'DJS IEEE',
      tag: 'IEEE Technical Chapter',
      bgGrad: 'from-[#fcedeb] to-[#f4d0cb]',
      icon: Sparkles
    },
    {
      name: 'DJS Synapse',
      tag: 'Creative/Video Team',
      bgGrad: 'from-[#edf2fb] to-[#cfdff8]',
      icon: Compass
    },
    {
      name: 'DJS CodeAI',
      tag: 'AI/ML Coding Club',
      bgGrad: 'from-[#f7edf8] to-[#eccfe8]',
      icon: Users
    }
  ];

  // Animation settings
  const scrollFadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#fcedeb] via-[#fbf7f5] to-[#f4f7f6] flex flex-col font-sans overflow-x-hidden selection:bg-[#4A9B68] selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full max-w-6xl mx-auto min-h-[calc(100vh-5rem)] flex items-center px-6 py-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <frameMotion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          >
            <frameMotion.h1 
              variants={scrollFadeIn}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E293B] tracking-tight leading-[1.1] mb-6"
            >
              Discover.<br />
              <span className="text-[#E05D52]">Connect.</span><br />
              Create.
            </frameMotion.h1>

            <frameMotion.p 
              variants={scrollFadeIn}
              className="text-sm sm:text-base text-[#64748B] max-w-md leading-relaxed mb-8"
            >
              Explore amazing events and join communities that shape our campus.
            </frameMotion.p>

            <frameMotion.div 
              variants={scrollFadeIn}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => navigate('/events')}
                className="px-6 py-3.5 bg-[#4A9B68] hover:bg-[#3C8256] text-white text-sm font-semibold rounded-full transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                Explore Events
              </button>

              <button
                onClick={() => navigate('/clubs')}
                className="px-6 py-3.5 bg-white border border-[#E2E8F0] hover:border-[#4A9B68]/30 text-[#1E293B] hover:text-[#4A9B68] text-sm font-semibold rounded-full transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                Explore Clubs
              </button>
            </frameMotion.div>

            {/* Stats Row */}
            <frameMotion.div
              variants={scrollFadeIn}
              className="flex items-center justify-center lg:justify-start gap-8 mt-8 pt-8 border-t border-slate-200/60 w-full"
            >
              <div>
                <span className="text-2xl font-black text-[#4A9B68] block">{stats.clubsCount}+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Clubs</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-2xl font-black text-[#E05D52] block">{stats.eventsCount}+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Events</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-2xl font-black text-[#8A5CF5] block">{stats.studentsCount}+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Students</span>
              </div>
            </frameMotion.div>
          </frameMotion.div>

          {/* Right Column: Interactive 3D Island Centerpiece */}
          <frameMotion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-7 w-full h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-radial-gradient from-[#E4F2EE] to-transparent opacity-50 pointer-events-none -z-10 blur-2xl scale-75" />
            <FloatingIslandCanvas />
          </frameMotion.div>

        </div>
      </section>

      {/* --- UPCOMING EVENTS SECTION --- */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        
        {/* Section Header */}
        <frameMotion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={scrollFadeIn}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">Upcoming Events</h2>
          <button 
            onClick={() => navigate('/events')}
            className="text-sm font-bold text-[#4A9B68] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </frameMotion.div>

        {/* Card Grid */}
        <frameMotion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {events.map((event, idx) => (
            <frameMotion.div
              key={idx}
              variants={scrollFadeIn}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border border-slate-100/60 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-[#4A9B68]/20 transition-all duration-300 flex flex-col h-full"
            >
              {/* Event Card Thumbnail (3D art simulation) */}
              <div className={`w-full h-40 bg-gradient-to-tr ${event.bgGrad} flex items-center justify-center p-6 relative overflow-hidden`}>
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold tracking-wider uppercase shadow-sm" style={{ color: event.color }}>
                  {event.category}
                </div>
                <event.icon className="w-12 h-12 stroke-[1.5]" style={{ color: event.color }} />
              </div>

              {/* Event Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="text-base font-bold text-[#1E293B] mb-4 leading-snug line-clamp-1">
                  {event.title}
                </h3>
                
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium line-clamp-1">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </frameMotion.div>
          ))}
        </frameMotion.div>

      </section>

      {/* --- EXPLORE DJSCE COMMUNITIES SECTION --- */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        
        {/* Header */}
        <frameMotion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={scrollFadeIn}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Explore DJSCE Communities
          </h2>
        </frameMotion.div>

        {/* Filter Pills Row */}
        <frameMotion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={scrollFadeIn}
          className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none"
        >
          {communityPills.map((pill) => {
            const isActive = activeCommunityPill === pill;
            return (
              <button
                key={pill}
                onClick={() => setActiveCommunityPill(pill)}
                className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#fcedeb] text-[#E05D52]' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 shadow-sm'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </frameMotion.div>

        {/* Communities Grid */}
        <frameMotion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
        >
          {communities.map((club, idx) => (
            <frameMotion.div
              key={idx}
              variants={scrollFadeIn}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl border border-slate-100/60 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-[#4A9B68]/20 transition-all duration-300"
            >
              {/* Community 3D art simulation */}
              <div className={`w-full h-36 bg-gradient-to-tr ${club.bgGrad} flex items-center justify-center p-6`}>
                <club.icon className="w-10 h-10 text-[#4A9B68] stroke-[1.5]" />
              </div>

              {/* Info block */}
              <div className="p-5">
                <h3 className="text-base font-bold text-[#1E293B] mb-1">{club.name}</h3>
                <p className="text-xs text-[#64748B] font-medium">{club.tag}</p>
              </div>
            </frameMotion.div>
          ))}
        </frameMotion.div>

      </section>

      {/* --- WHY JOIN A CLUB BANNER --- */}
      <section className="w-full max-w-6xl mx-auto py-16 px-6">
        <frameMotion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={scrollFadeIn}
          className="bg-[#eaf4ef] rounded-3xl p-8 sm:p-10 border border-[#e2eee0]/50 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          {/* Miniature 3D park decoration left */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#cbe6d4]/50 flex items-center justify-center text-[#4A9B68] shrink-0">
            <Trees className="w-12 h-12" />
          </div>

          {/* Banner Content */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E293B] mb-6">
              Why Join a Club?
            </h3>
            
            {/* Features Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-8 h-8 rounded-lg bg-white/80 text-[#4A9B68] flex items-center justify-center mb-2 shadow-sm">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#1E293B]">Learn</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">new skills</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="w-8 h-8 rounded-lg bg-white/80 text-[#4A9B68] flex items-center justify-center mb-2 shadow-sm">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#1E293B]">Connect</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">with people</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="w-8 h-8 rounded-lg bg-white/80 text-[#4A9B68] flex items-center justify-center mb-2 shadow-sm">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#1E293B]">Explore</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">your interests</p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <div className="w-8 h-8 rounded-lg bg-white/80 text-[#4A9B68] flex items-center justify-center mb-2 shadow-sm">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-xs font-bold text-[#1E293B]">Grow</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">together</p>
              </div>

            </div>
          </div>
        </frameMotion.div>
      </section>

      {/* --- FINAL CALL TO ACTION --- */}
      <section className="w-full max-w-4xl mx-auto py-20 px-6 text-center">
        <frameMotion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollFadeIn}
          className="space-y-6"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E293B] tracking-tight">
            Find your space at DJSphere.
          </h2>
          
          <p className="text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
            Explore communities, discover events, and make your campus experience yours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/clubs')}
              className="px-6 py-3.5 bg-[#4A9B68] hover:bg-[#3C8256] text-white text-sm font-semibold rounded-full transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center gap-2"
            >
              <span>Explore Clubs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-3.5 bg-white border border-[#E2E8F0] text-slate-600 hover:text-[#4A9B68] hover:border-[#4A9B68]/40 text-sm font-semibold rounded-full transition-all active:scale-[0.98] cursor-pointer shadow-sm"
            >
              Explore Events
            </button>
          </div>
        </frameMotion.div>
      </section>

      <Footer />
    </div>
  );
}
