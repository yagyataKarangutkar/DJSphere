import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Building2, 
  Users, 
  LogOut, 
  Menu, 
  X,
  User
} from 'lucide-react';

export default function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  if (!user) return null;

  const isSuperAdmin = user.role === 'superAdmin' || user.role === 'super_admin';

  // Navigation Links based on role
  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, roles: ['student', 'clubAdmin', 'superAdmin', 'club_admin', 'super_admin'] },
    { name: 'Events', path: '/admin/events', icon: Calendar, roles: ['student', 'clubAdmin', 'superAdmin', 'club_admin', 'super_admin'] },
    { name: 'Registrations', path: '/admin/registrations', icon: ClipboardList, roles: ['student', 'clubAdmin', 'superAdmin', 'club_admin', 'super_admin'] },
    { name: 'Clubs', path: '/admin/clubs', icon: Building2, roles: ['superAdmin', 'super_admin'] },
    { name: 'Users', path: '/admin/users', icon: Users, roles: ['superAdmin', 'super_admin'] },
  ];

  // Filter links for user role
  const allowedLinks = navLinks.filter(link => link.roles.includes(user.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#11221D] text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-slate-800/40">
        <div className="w-8 h-8 rounded-xl bg-[#4A9B68] flex items-center justify-center text-white font-black text-sm">
          DS
        </div>
        <div>
          <span className="font-extrabold text-base text-white tracking-wide block">DJSphere</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block -mt-1">
            {isSuperAdmin ? 'Super Admin' : 'Club Panel'}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {allowedLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <button
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-semibold rounded-2xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#4A9B68] text-white shadow-lg shadow-[#4A9B68]/15' 
                  : 'hover:bg-[#1E332E]/50 hover:text-white text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout footer */}
      <div className="p-4 border-t border-slate-800/40 bg-[#0E1B17]/60">
        <div className="flex items-center gap-3 px-2 py-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-sm font-bold uppercase">
            {user.name ? user.name[0] : 'A'}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block truncate">{user.name}</span>
            <span className="text-[9px] font-bold text-slate-500 block truncate -mt-0.5">
              {user.clubName || (isSuperAdmin ? 'Platform Admin' : 'Student')}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-semibold rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-slate-800 flex font-sans overflow-x-hidden">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block w-64 h-screen shrink-0 sticky top-0 border-r border-slate-200/50">
        <SidebarContent />
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/60 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#4A9B68] flex items-center justify-center text-white font-black text-sm">
              DS
            </div>
            <span className="font-extrabold text-base text-slate-900">DJSphere</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Mobile Sidebar Overlay/Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Sidebar Body */}
            <div className="relative w-64 h-full flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-[-48px] p-2 bg-slate-900 text-white rounded-r-xl"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
