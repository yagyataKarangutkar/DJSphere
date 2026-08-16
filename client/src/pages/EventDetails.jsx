import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getEventById, registerForEvent } from '../services/eventService';
import { getClubs } from '../services/clubService';
import { Calendar, MapPin, Tag, Users, Clock, ArrowLeft, Loader2, BookmarkCheck, CheckCircle2, Share2, ClipboardList } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import local clay illustration assets
import aiWorkshopImg from '../assets/ai_workshop.jpg';
import codesprintImg from '../assets/codesprint.jpg';
import nrityaImg from '../assets/nritya.jpg';
import careerTalkImg from '../assets/career_talk.jpg';
import roboticsImg from '../assets/robotics.jpg';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [matchedClub, setMatchedClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Register states
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const fetchEventDetails = async () => {
    try {
      const response = await getEventById(id);
      if (response && response.success) {
        setEvent(response.data);

        // Fetch clubs to match by name
        if (response.data.clubName) {
          try {
            const clubsRes = await getClubs();
            if (clubsRes && clubsRes.success) {
              const found = clubsRes.data.find(
                (c) => c.name.toLowerCase() === response.data.clubName.toLowerCase()
              );
              setMatchedClub(found);
            }
          } catch (cErr) {
            console.error('Failed to resolve club ID:', cErr);
          }
        }
      } else {
        setError('Failed to load event details.');
      }
    } catch (err) {
      setError('Event not found.');
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
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

  // Generate checklist topics dynamically based on category
  const getLearningPoints = (category) => {
    switch (category) {
      case 'Workshop':
        return [
          'Introduction to AI & ML concepts',
          'Hands-on with Python libraries',
          'ML Model Building training',
          'Real world Case Studies & analysis'
        ];
      case 'Competition':
        return [
          'Collaborative design & brainstorming templates',
          'Optimizing SaaS database and deployment architectures',
          'Building features under strict time limits',
          'Final pitch planning and review guidelines'
        ];
      case 'Cultural':
        return [
          'Solo & Group choreographic synchronization',
          'Stage movement and visual coordination principles',
          'Confidence building and presence training',
          'Public performance interaction strategies'
        ];
      case 'Talk':
        return [
          'Alumni career blueprints and path designs',
          'Interview deconstructions for tech giants',
          'Effective networking structures on campus',
          'Direct mentorship routes and Q&A'
        ];
      default:
        return [
          'Core concepts, tools, and platforms overview',
          'Guided hands-on exercise templates',
          'Live feedback and review sessions',
          'Networking with peer developers'
        ];
    }
  };

  // Generate dynamic event timeline slots based on date/time info
  const getTimelineSlots = (timeString) => {
    // Parse time range or provide default structured ranges
    if (timeString.includes('4:00 PM - 7:00 PM')) {
      return [
        { time: '4:00 PM – 4:30 PM', label: 'Registration' },
        { time: '4:30 PM – 5:30 PM', label: 'Session 1' },
        { time: '5:30 PM – 5:45 PM', label: 'Break' },
        { time: '5:45 PM – 7:00 PM', label: 'Session 2 + Q&A' }
      ];
    }
    if (timeString.includes('10:00 AM')) {
      return [
        { time: '10:00 AM – 11:00 AM', label: 'Opening Ceremony & Briefing' },
        { time: '11:00 AM – 2:00 PM', label: 'Hacking Round 1' },
        { time: '2:00 PM – 3:00 PM', label: 'Mentor Review 1' },
        { time: '3:00 PM – End', label: 'Development & Submissions' }
      ];
    }
    if (timeString.includes('5:30 PM')) {
      return [
        { time: '5:30 PM – 6:00 PM', label: 'Opening Showcase & Sound Check' },
        { time: '6:00 PM – 7:15 PM', label: 'Solo Performances' },
        { time: '7:15 PM – 7:30 PM', label: 'Intermission' },
        { time: '7:30 PM – 8:30 PM', label: 'Group Finale & Awards' }
      ];
    }
    return [
      { time: 'Start – Start + 30 mins', label: 'Registration & Onboarding' },
      { time: 'Start + 30 mins – Midpoint', label: 'Speaker Presentation / Session 1' },
      { time: 'Midpoint – Midpoint + 15 mins', label: 'Q&A and Interactive Networking' },
      { time: 'Midpoint + 15 mins – End', label: 'Closing Statements & Wrap Up' }
    ];
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString('en-GB', { weekday: 'long' });
    return `${date.toLocaleDateString('en-GB', options)} (${dayOfWeek})`;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FCF5F3] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
            <span className="text-sm font-medium text-slate-500">Loading event details...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen w-full bg-[#FCF5F3] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-sm font-extrabold text-slate-800 mt-4">Error Loading Event</h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">{error || 'Event could not be found.'}</p>
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

  const spotsLeft = Math.max(0, event.maxParticipants - event.registrationsCount);
  const isFull = spotsLeft === 0;

  return (
    <div className="min-h-screen w-full bg-[#FCF5F3] flex flex-col font-sans selection:bg-[#E27D60] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Back Link */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-bold bg-transparent border-none outline-none cursor-pointer mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        {/* Status Messages */}
        {registerSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-[#4A9B68] text-xs rounded-2xl font-bold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{registerSuccess}</span>
          </div>
        )}

        {registerError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-bold flex items-start gap-2">
            <Tag className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{registerError}</span>
          </div>
        )}

        {/* Layout Grid conforming to reference image */}
        <div className="space-y-10">
          
          {/* Main Top Details Card */}
          <div className="bg-white border border-slate-200/50 rounded-[32px] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 gap-8 items-start font-semibold text-slate-700">
            
            {/* Left: Large Illustration Container */}
            <div className="w-full aspect-[4/3] sm:aspect-square md:aspect-auto md:h-[350px] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100/60">
              <img
                src={getEventImage(event.title)}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Info Panel */}
            <div className="flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase bg-[#E6F4EA] text-[#137333] tracking-wider">
                  {event.category}
                </span>

                {/* Title */}
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    {event.description.split('.')[0]}.
                  </p>
                </div>

                {/* Metadata List */}
                <div className="space-y-3.5 pt-4 text-xs font-bold text-slate-500">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  {/* Time */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  {/* Venue */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    {matchedClub ? (
                      <button
                        onClick={() => navigate(`/clubs/${matchedClub._id}`)}
                        className="text-left font-black text-[#4A9B68] hover:text-[#3C8256] hover:underline cursor-pointer bg-transparent border-none p-0 outline-none transition-colors"
                      >
                        Organized by {event.clubName}
                      </button>
                    ) : (
                      <span>Organized by {event.clubName}</span>
                    )}
                  </div>
                  {/* Spots */}
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <span>{isFull ? 'No Seats Available' : `${spotsLeft} Seats Available`}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap gap-3.5 pt-6 border-t border-slate-100">
                {isRegistered ? (
                  <div className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 bg-[#E6F4EA] text-[#137333] rounded-2xl text-xs font-black border border-emerald-100/50 select-none">
                    <BookmarkCheck className="w-4.5 h-4.5" />
                    <span>Registered</span>
                  </div>
                ) : isFull ? (
                  <div className="flex-1 min-w-[120px] flex items-center justify-center py-3 bg-slate-100 text-slate-400 rounded-2xl text-xs font-black select-none text-center">
                    Fully Booked
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 bg-[#4A9B68] hover:bg-[#3C8256] text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {registering && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isAuthenticated ? 'Register Now' : 'Log in to Register'}</span>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-2xl text-xs font-bold transition-all cursor-pointer bg-white"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Share</span>
                </button>
              </div>

            </div>

          </div>

          {/* Bottom Split Section: About, What you'll learn & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start font-semibold text-slate-700">
            
            {/* Left Wider Column: Details */}
            <div className="md:col-span-2 space-y-8 bg-white border border-slate-200/50 rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
              {/* About */}
              <div className="space-y-3">
                <h2 className="text-base font-extrabold text-slate-900">About the Event</h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* What you'll learn */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900">What you'll learn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                  {getLearningPoints(event.category).map((point, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <span className="text-[#4A9B68] font-bold mt-0.5">✔</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Narrower Column: Timeline */}
            <div className="bg-white border border-slate-200/50 rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Event Timeline</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Schedule breakdown of sessions</p>
              </div>

              {/* Vertical Timeline Tracker */}
              <div className="relative border-l border-slate-100 pl-4.5 space-y-6 text-xs text-slate-600 font-semibold">
                {getTimelineSlots(event.time).map((slot, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Node dot */}
                    <div className="absolute -left-[24px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#4A9B68]" />
                    <div>
                      <span className="text-[10px] font-black text-[#4A9B68] block">{slot.time}</span>
                      <span className="text-slate-800 font-bold block mt-0.5">{slot.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
