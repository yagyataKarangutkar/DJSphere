import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FCFAF8] border-t border-[#E2EEF0]/40 px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">
        
        {/* Branding & Info */}
        <div className="flex flex-col items-center md:items-start max-w-sm text-center md:text-left">
          <div className="flex items-center gap-2 text-slate-900 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E4F2EE] text-[#4A9B68]">
              <Trees className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight">DJSphere</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Discover college clubs, connect with passionate student communities, and participate in campus events.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-slate-600">
          <Link to="/" className="hover:text-[#4A9B68] transition-colors">Home</Link>
          <Link to="/clubs" className="hover:text-[#4A9B68] transition-colors">Clubs</Link>
          <Link to="/events" className="hover:text-[#4A9B68] transition-colors">Events</Link>
          <a href="#about" className="hover:text-[#4A9B68] transition-colors">About Us</a>
        </div>

        {/* Contact / Socials */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#github" className="hover:text-[#4A9B68] transition-colors" aria-label="Github"><Globe className="w-4.5 h-4.5" /></a>
            <a href="#mail" className="hover:text-[#4A9B68] transition-colors" aria-label="Mail"><Mail className="w-4.5 h-4.5" /></a>
            <a href="#website" className="hover:text-[#4A9B68] transition-colors" aria-label="Website"><Globe className="w-4.5 h-4.5" /></a>
          </div>
          <p className="text-[11px] text-slate-400">
            © {currentYear} DJSphere. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
