import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, updateProfile, updatePassword } from '../store/authSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMyRegistrations } from '../services/eventService';
import { User, Ticket, Lock, LogOut, Edit, X, Loader2, Sparkles, Award, ShieldAlert, BadgeCheck } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSelector((state) => state.auth);

  // Component states
  const [registrationsCount, setRegistrationsCount] = useState(4);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editCourse, setEditCourse] = useState(user?.course || 'B. Tech AIML');
  const [editYear, setEditYear] = useState(user?.year || '2nd Year');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [updatingPass, setUpdatingPass] = useState(false);

  // Load user registrations for dynamic stats
  useEffect(() => {
    const fetchRegistrationsCount = async () => {
      try {
        const response = await getMyRegistrations();
        if (response && response.success) {
          setRegistrationsCount(response.count);
        }
      } catch (err) {
        console.error('Error fetching registrations count:', err);
      }
    };
    fetchRegistrationsCount();
  }, []);

  // Sync state with user details when updated
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditCourse(user.course || 'B. Tech AIML');
      setEditYear(user.year || '2nd Year');
    }
  }, [user]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    if (!editName.trim()) {
      setEditError('Name is required');
      return;
    }

    try {
      const result = await dispatch(updateProfile({
        name: editName,
        course: editCourse,
        year: editYear
      })).unwrap();

      if (result) {
        setEditSuccess('Profile updated successfully!');
        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccess('');
        }, 1200);
      }
    } catch (err) {
      setEditError(err || 'Failed to update profile.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Both current and new passwords are required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setUpdatingPass(true);
    try {
      const result = await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      if (result && result.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 1200);
      }
    } catch (err) {
      setPasswordError(err || 'Incorrect current password or update failed.');
    } finally {
      setUpdatingPass(false);
    }
  };

  // Clay adventurer girl matching user's cartoon mockup
  const clayAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || 'Yagyata'}&backgroundColor=fcedeb&radius=50`;

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#FAF5F5] via-[#FCFAF8] to-[#E3EEF0] flex flex-col font-sans selection:bg-[#4A9B68] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-16 flex flex-col items-center">
        
        {/* Profile Details Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] w-full max-w-xl text-center space-y-8">
          
          {/* Avatar & Biography block */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full border-4 border-[#E4F2EE] overflow-hidden p-1 shadow-md bg-white hover:scale-105 transition-transform duration-200">
              <img
                src={clayAvatarUrl}
                alt={user?.name || 'Yagyata'}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">
                {user?.name || 'Yagyata'}
              </h1>
              <p className="text-xs text-[#EB6B56] font-semibold mt-1">
                {user?.email || 'yagyata@email.com'}
              </p>
              <span className="inline-block mt-3.5 px-4.5 py-1.5 rounded-full bg-[#FCFAF8] border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                {user?.course || 'B. Tech AIML'} {' - '}{user?.year || '2nd Year'}
              </span>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-3 gap-2.5 pt-6 border-t border-slate-100 max-w-md mx-auto text-center font-bold">
            <div className="p-3 bg-[#FCFAF8] rounded-2xl border border-slate-100/50">
              <span className="text-xl font-black text-[#4A9B68] block">{registrationsCount}</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-400 mt-1 block">Registered Events</span>
            </div>
            <div className="p-3 bg-[#FCFAF8] rounded-2xl border border-slate-100/50">
              <span className="text-xl font-black text-[#4A9B68] block">7</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-400 mt-1 block">Clubs Explored</span>
            </div>
            <div className="p-3 bg-[#FCFAF8] rounded-2xl border border-slate-100/50">
              <span className="text-xl font-black text-[#4A9B68] block">2</span>
              <span className="text-[10px] uppercase tracking-wide text-slate-400 mt-1 block">Certificates</span>
            </div>
          </div>

          {/* Actions List */}
          <div className="pt-6 border-t border-slate-100 max-w-md mx-auto space-y-3.5 text-left text-xs font-bold">
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full p-4 rounded-2xl bg-[#FCFAF8] hover:bg-slate-50 border border-slate-100 hover:border-[#4A9B68]/20 text-slate-700 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Edit className="w-4 h-4 text-[#4A9B68]" />
                <span>Edit Profile</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#4A9B68] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-4 rounded-2xl bg-[#FCFAF8] hover:bg-slate-50 border border-slate-100 hover:border-[#4A9B68]/20 text-slate-700 transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#4A9B68]" />
                <span>Change Password</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#4A9B68] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <Link
              to="/my-registrations"
              className="w-full p-4 rounded-2xl bg-[#FCFAF8] hover:bg-slate-50 border border-slate-100 hover:border-[#4A9B68]/20 text-slate-700 transition flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4 text-[#4A9B68]" />
                <span>My Registrations</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-[#4A9B68] opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full p-4 rounded-2xl bg-[#FAF3F3] hover:bg-[#F6E8E8] border border-red-50 text-[#EB6B56] transition flex items-center gap-3 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Modal: Edit Profile Details */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-100 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <h3 className="text-base font-black text-slate-900">Edit Profile Details</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditError('');
                    setEditSuccess('');
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {editError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-green-100">
                  <BadgeCheck className="w-4 h-4" />
                  <span>{editSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 font-semibold"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Branch/Course</label>
                  <select
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 font-semibold cursor-pointer"
                  >
                    <option value="B. Tech AIML">B. Tech AIML</option>
                    <option value="B. Tech CSE">B. Tech CSE</option>
                    <option value="B. Tech IT">B. Tech IT</option>
                    <option value="B. Tech EXTC">B. Tech EXTC</option>
                    <option value="B. Tech Mech">B. Tech Mech</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Year of Study</label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none bg-white focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 font-semibold cursor-pointer"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditError('');
                      setEditSuccess('');
                    }}
                    className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition border border-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex-1 py-3 bg-[#4A9B68] hover:bg-[#3C8256] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {authLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-100 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                <h3 className="text-base font-black text-slate-900">Change Password</h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setCurrentPassword('');
                    setNewPassword('');
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-50 text-green-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-green-100">
                  <BadgeCheck className="w-4 h-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 font-semibold"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 font-semibold"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError('');
                      setPasswordSuccess('');
                      setCurrentPassword('');
                      setNewPassword('');
                    }}
                    className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-bold transition border border-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingPass}
                    className="flex-1 py-3 bg-[#4A9B68] hover:bg-[#3C8256] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {updatingPass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
