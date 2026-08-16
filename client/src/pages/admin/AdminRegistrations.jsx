import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAdminRegistrations } from '../../services/adminService';
import { Loader2, Search } from 'lucide-react';

export default function AdminRegistrations() {
  const { user } = useSelector((state) => state.auth);
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegs, setFilteredRegs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await getAdminRegistrations();
        if (response && response.success) {
          setRegistrations(response.data);
          setFilteredRegs(response.data);
        } else {
          setError('Failed to fetch registrations data.');
        }
      } catch (err) {
        setError('An error occurred while loading registrations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  // Filter registrations when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRegs(registrations);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = registrations.filter(
        (reg) =>
          reg.studentName.toLowerCase().includes(term) ||
          reg.studentEmail.toLowerCase().includes(term) ||
          reg.eventName.toLowerCase().includes(term)
      );
      setFilteredRegs(filtered);
    }
  }, [searchTerm, registrations]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading registrations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold max-w-lg">
        {error}
      </div>
    );
  }

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registrations</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {user.role === 'clubAdmin' || user.role === 'club_admin'
              ? `Review student signups for ${user.clubName}`
              : 'Review global student signups'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search registrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all font-semibold"
          />
        </div>
      </div>

      {/* Registrations Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-xs">
        <div className="overflow-x-auto -mx-6 sm:-mx-8">
          <div className="inline-block min-w-full align-middle px-6 sm:px-8">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Student</th>
                  <th className="pb-3 px-4">Email</th>
                  <th className="pb-3 px-4">Event Name</th>
                  <th className="pb-3 pl-4 text-right">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 text-sm font-semibold text-slate-700">
                {filteredRegs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 text-xs font-bold">
                      No registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredRegs.map((reg) => (
                    <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4 text-slate-900 font-extrabold max-w-[160px] truncate">
                        {reg.studentName}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium truncate max-w-[180px]">
                        {reg.studentEmail}
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-bold truncate max-w-[200px]">
                        {reg.eventName}
                      </td>
                      <td className="py-4 pl-4 text-right text-slate-500 font-medium">
                        {formatDate(reg.registeredOn || reg.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
