import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyRegistrations() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#FAF5F5] via-[#FCFAF8] to-[#E3EEF0] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EDF2FA] text-[#4F70B5] flex items-center justify-center mb-6 shadow-sm">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          My Registrations
        </h1>
        <p className="text-sm text-slate-500 max-w-md mb-8">
          The ultimate dashboard to view your registered events, active tickets, and club memberships is launching soon!
        </p>

        <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-slate-100 shadow-md mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-[#4F70B5] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#4F70B5]">Member Portal</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 mb-1">Coming features:</h2>
          <ul className="text-xs text-slate-500 space-y-2 mt-2">
            <li>• List of all active and past RSVPs.</li>
            <li>• Downloadable PDF entry passes with QR validation.</li>
            <li>• Committee membership role badges.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-[#E2E8F0] hover:border-[#4A9B68]/30 text-slate-600 hover:text-[#4A9B68] text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
