import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Clubs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#FAF5F5] via-[#FCFAF8] to-[#E3EEF0] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#E4F2EE] text-[#4A9B68] flex items-center justify-center mb-6 shadow-sm">
          <Trees className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Clubs Directory
        </h1>
        <p className="text-sm text-slate-500 max-w-md mb-8">
          The ultimate dashboard to browse registered student chapters, join committees, and verify club structures is launching soon!
        </p>

        <div className="w-full max-w-sm p-6 bg-white rounded-3xl border border-slate-100 shadow-md mb-8 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3.5 h-3.5 rounded-full bg-[#4A9B68] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A9B68]">Sneak Peek</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 mb-1">Interactive Features Scheduled:</h2>
          <ul className="text-xs text-slate-500 space-y-2 mt-2">
            <li>• Search and filter by domain (Technical, Cultural, Sports).</li>
            <li>• Join requests with customizable profile submissions.</li>
            <li>• Admin portals for club heads to post updates.</li>
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
