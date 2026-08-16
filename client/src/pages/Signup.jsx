import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../store/authSlice';
import { Eye, EyeOff, Trees } from 'lucide-react';
import { motion } from 'framer-motion';
import authIllustration from '../assets/auth_illustration.png';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(
        user.role === 'club_admin' || 
        user.role === 'super_admin' || 
        user.role === 'clubAdmin' || 
        user.role === 'superAdmin'
          ? '/admin/dashboard'
          : '/'
      );
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (localError) setLocalError('');
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields.');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const result = await dispatch(
      signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );

    if (signupUser.fulfilled.match(result)) {
      const u = result.payload;

      navigate(
        u.role === 'club_admin' || 
        u.role === 'super_admin' || 
        u.role === 'clubAdmin' || 
        u.role === 'superAdmin'
          ? '/admin/dashboard'
          : '/'
      );
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen py-16 flex flex-col justify-center w-full bg-[#F0F4F2] items-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-[#4A9B68] selection:text-white">
      
      {/* Branding Logo (Visible at the top left of the screen with subtle fade-in) */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2.5 z-10"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E4F1E8] text-[#4A9B68]">
          <Trees className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-[#1E293B] tracking-tight">
          DJSphere
        </span>
      </motion.div>

      {/* Main Responsive Split Grid/Flex Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Proportional illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="hidden lg:flex flex-1 items-center justify-center max-w-md lg:max-w-xl w-full"
        >
          <img
            src={authIllustration}
            alt="Campus Illustration"
            className="w-full h-auto object-contain drop-shadow-md max-h-[380px] lg:max-h-[480px]"
          />
        </motion.div>

        {/* Right Column: Centered Signup Card */}
        <div className="w-full max-w-[420px] mx-auto lg:mx-0 flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full bg-[#FFFFFF] rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-100/50 p-8 sm:p-10 transition-all duration-300"
          >
            
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mb-6"
            >
              <h1 className="text-[28px] font-bold text-[#1E293B] tracking-tight">Create Account ✨</h1>
              <p className="text-[14px] text-[#94A3B8] mt-1.5">Sign up to get started</p>
            </motion.div>

            {/* Error Banner */}
            {activeError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold"
              >
                {activeError}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A9B68] focus:ring-4 focus:ring-[#4A9B68]/10 transition-all font-medium"
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
              >
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A9B68] focus:ring-4 focus:ring-[#4A9B68]/10 transition-all font-medium"
                />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-12 pl-4 pr-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A9B68] focus:ring-4 focus:ring-[#4A9B68]/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#4A9B68] transition focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full h-12 pl-4 pr-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A9B68] focus:ring-4 focus:ring-[#4A9B68]/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#4A9B68] transition focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#4A9B68] hover:bg-[#3F895A] text-white font-semibold rounded-xl shadow-[0_8px_20px_rgba(74,155,104,0.22)] hover:shadow-[0_10px_24px_rgba(74,155,104,0.28)] active:scale-[0.99] transition-all text-sm disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Sign Up'
                )}
              </motion.button>

            </form>

            {/* Footer Toggle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="text-center mt-6 text-sm text-[#94A3B8]"
            >
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#4A9B68] hover:text-[#3F895A] hover:underline">
                Login
              </Link>
            </motion.p>

          </motion.div>
        </div>

      </div>
    </div>
  );
}
