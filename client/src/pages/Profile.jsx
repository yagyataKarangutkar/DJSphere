import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Ticket, Award, Edit, Lock, LogOut, Compass } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const profileData = {
    name: user?.name || 'Yagyata Karangutkar',
    email: user?.email || 'yagyata@gmail.com',
    branchYear: 'B.Tech AIML - 2nd Year',
    registeredEvents: 4,
    clubsExplored: 7,
    certificates: 2,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center space-y-6">
          
          {/* Avatar Graphic */}
          <div className="w-24 h-24 rounded-full bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            {profileData.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900">{profileData.name}</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{profileData.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
              {profileData.branchYear}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 max-w-lg mx-auto">
            <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
              <span className="text-xl font-black text-emerald-600 block">{profileData.registeredEvents}</span>
              <span className="text-[11px] font-bold text-slate-500">Registered Events</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
              <span className="text-xl font-black text-emerald-600 block">{profileData.clubsExplored}</span>
              <span className="text-[11px] font-bold text-slate-500">Clubs Explored</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100">
              <span className="text-xl font-black text-emerald-600 block">{profileData.certificates}</span>
              <span className="text-[11px] font-bold text-slate-500">Certificates</span>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="pt-6 border-t border-gray-100 max-w-md mx-auto space-y-2.5 text-left text-xs font-bold">
            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-3">
              <Edit className="w-4 h-4 text-emerald-600" />
              <span>Edit Profile</span>
            </button>

            <button className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-3">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Change Password</span>
            </button>

            <Link
              to="/my-registrations"
              className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-3 block"
            >
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>My Registrations</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
