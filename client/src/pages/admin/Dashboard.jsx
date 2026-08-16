import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDashboardStats } from '../../services/adminService';
import { Calendar, Users, ClipboardCheck, LayoutGrid, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response && response.success) {
          setData(response.data);
        } else {
          setError('Failed to fetch dashboard statistics.');
        }
      } catch (err) {
        setError('An error occurred while fetching dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm font-semibold max-w-lg">
        {error || 'Dashboard statistics could not be loaded.'}
      </div>
    );
  }

  const { stats, recentEvents, registrationsOverview } = data;
  const isSuperAdmin = user.role === 'superAdmin' || user.role === 'super_admin';

  // Format dates for display
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Circular Registration Donut Component
  const DonutChart = ({ chartData }) => {
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;

    if (total === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs font-semibold">
          No registration data yet
        </div>
      );
    }

    const colors = ['#4A9B68', '#E05D52', '#8A5CF5', '#D97706', '#2563EB', '#EC4899'];

    return (
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center mt-4">
        {/* SVG Circle */}
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#F8F7F3" strokeWidth="3" />
            {chartData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDashoffset = 100 - currentAngle;
              currentAngle += percentage;
              return (
                <circle
                  key={index}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="3.2"
                  strokeDasharray={`${percentage} ${100 - percentage}`}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-in-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-800">{total}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 max-w-xs text-xs font-semibold text-slate-600 w-full sm:w-auto">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="truncate max-w-[120px]">{item.name}</span>
              <span className="text-slate-400 font-bold ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Welcome back, <span className="text-[#4A9B68] font-bold">{user.name}</span>
            {user.clubName && <span className="text-slate-400 ml-1.5">({user.clubName})</span>}
          </p>
        </div>
      </div>

      {/* Stats Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-slate-950 block">{stats.totalEvents}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">Total Events</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#4A9B68] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-slate-950 block">{stats.totalUsers}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
              {isSuperAdmin ? 'Total Users' : 'Club Students'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-slate-950 block">{stats.totalRegistrations}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">Registrations</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8A5CF5] flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-slate-950 block">
              {isSuperAdmin ? stats.activeClubs : user.clubName ? '1' : '0'}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-1">
              {isSuperAdmin ? 'Active Clubs' : 'Managed Club'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Events List & Overview Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events Card (Table) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900">Recent Events</h2>
          </div>
          <div className="overflow-x-auto -mx-6 sm:-mx-8">
            <div className="inline-block min-w-full align-middle px-6 sm:px-8">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Event</th>
                    <th className="pb-3 px-4">Club</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 pl-4 text-right">Registrations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 text-sm font-semibold text-slate-700">
                  {recentEvents.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-6 text-center text-slate-400 text-xs font-bold">
                        No events found.
                      </td>
                    </tr>
                  ) : (
                    recentEvents.map((event) => (
                      <tr key={event._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 pr-4 text-slate-900 font-extrabold max-w-[160px] truncate">
                          {event.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium truncate max-w-[120px]">
                          {event.clubName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          {formatDate(event.date)}
                        </td>
                        <td className="py-3.5 pl-4 text-right text-slate-900 font-extrabold">
                          {event.registrationsCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Circular Registrations Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Registrations Overview</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Registration share per event</p>
          </div>
          <div className="flex-1 flex items-center justify-center my-6">
            <DonutChart chartData={registrationsOverview} />
          </div>
        </div>
      </div>
    </div>
  );
}
