import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { Trees, Menu, X, LogOut, User, FileText, Compass, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Clubs', path: '/clubs' },
    { name: 'About Us', path: '#about' },
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-[#fcedeb]/90 backdrop-blur-md border-b border-[#E2EEF0]/40 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#1E293B] hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf4ef] text-[#4A9B68]">
            <Trees className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">DJSphere</span>
        </Link>

        {/* Desktop Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.path.startsWith('#') ? (
              <a
                key={link.name}
                href={link.path}
                className="text-sm font-semibold text-slate-600 hover:text-[#4A9B68] transition-colors duration-200"
              >
                {link.name}
              </a>
            ) : (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-[#4A9B68]' : 'text-slate-600 hover:text-[#4A9B68]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            )
          ))}
        </div>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-[#E2E8F0] rounded-full hover:bg-slate-50 transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#c54b40] bg-[#f8dedb] rounded-full hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 bg-[#f8dedb] hover:bg-[#f6d2ce] text-[#c54b40] text-sm font-bold rounded-full transition-all shadow-sm active:scale-[0.98]"
            >
              Login / Sign up
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 border-t border-[#E2EEF0]/40 mt-4 rounded-2xl shadow-xl max-w-6xl mx-auto"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                link.path.startsWith('#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#4A9B68] transition-all"
                  >
                    {link.name}
                  </a>
                ) : (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#eaf4ef] text-[#4A9B68]' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-[#4A9B68]'
                      }`
                    }
                  >
                    <span>{link.name}</span>
                  </NavLink>
                )
              ))}
              
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-[#c54b40] bg-[#f8dedb] rounded-xl hover:opacity-90 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center py-3 text-sm font-bold text-[#c54b40] bg-[#f8dedb] hover:bg-[#f6d2ce] rounded-xl transition-all"
                  >
                    Login / Sign up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
