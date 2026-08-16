import React, { useEffect, useState } from 'react';
import { getAdminClubs, createClub } from '../../services/adminService';
import { Loader2, Plus, X, Trash2, Edit3 } from 'lucide-react';

export default function AdminClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubType, setNewClubType] = useState('Club');
  const [newClubMembers, setNewClubMembers] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchClubs = async () => {
    try {
      const response = await getAdminClubs();
      if (response && response.success) {
        setClubs(response.data);
      } else {
        setError('Failed to fetch clubs list.');
      }
    } catch (err) {
      setError('An error occurred while loading clubs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleAddClub = async (e) => {
    e.preventDefault();
    if (!newClubName.trim()) {
      setFormError('Please enter a club name.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      const response = await createClub({
        name: newClubName.trim(),
        type: newClubType,
        members: Number(newClubMembers) || 0,
      });

      if (response && response.success) {
        // Success
        setNewClubName('');
        setNewClubType('Club');
        setNewClubMembers('');
        setIsModalOpen(false);
        // Refresh list
        fetchClubs();
      } else {
        setFormError('Failed to create club.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error occurred while creating club.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleActionClick = (actionName, clubName) => {
    alert(`${actionName} action triggered for club: "${clubName}"\n(This is a prototype demonstration)`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading clubs...</span>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clubs</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage global student chapters, clubs, and student teams
          </p>
        </div>

        {/* Add Club Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A9B68] hover:bg-[#3C8256] text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Club</span>
        </button>
      </div>

      {/* Clubs Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-xs">
        <div className="overflow-x-auto -mx-6 sm:-mx-8">
          <div className="inline-block min-w-full align-middle px-6 sm:px-8">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Club Name</th>
                  <th className="pb-3 px-4">Type</th>
                  <th className="pb-3 px-4">Members</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 text-sm font-semibold text-slate-700">
                {clubs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400 text-xs font-bold">
                      No clubs registered.
                    </td>
                  </tr>
                ) : (
                  clubs.map((club) => (
                    <tr key={club._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 pr-4 text-slate-900 font-extrabold max-w-[200px] truncate">
                        {club.name}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium truncate max-w-[140px]">
                        {club.type}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {club.members}+
                      </td>
                      <td className="py-4 pl-4 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleActionClick('Edit', club.name)}
                          className="p-1.5 text-slate-400 hover:text-[#4A9B68] hover:bg-emerald-50 rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Edit Club"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleActionClick('Delete', club.name)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer inline-flex items-center"
                          title="Delete Club"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Club Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-black text-slate-900 mb-6">Add New Club</h2>

            <form onSubmit={handleAddClub} className="space-y-4 font-semibold text-slate-700">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Club Name</label>
                <input
                  type="text"
                  placeholder="e.g. DJS ACM SIGCHI"
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Club Type</label>
                <select
                  value={newClubType}
                  onChange={(e) => setNewClubType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                >
                  <option value="Club">Club</option>
                  <option value="Student Chapter">Student Chapter</option>
                  <option value="Team">Team</option>
                </select>
              </div>

              {/* Members */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Initial Members</label>
                <input
                  type="number"
                  placeholder="e.g. 90"
                  value={newClubMembers}
                  onChange={(e) => setNewClubMembers(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-[#4A9B68] focus:ring-1 focus:ring-[#4A9B68]/30 rounded-2xl text-sm outline-none bg-white transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-500 text-sm rounded-2xl font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#4A9B68] hover:bg-[#3C8256] text-white text-sm rounded-2xl font-bold transition-all shadow-md shadow-[#4A9B68]/15 hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{submitting ? 'Adding...' : 'Add Club'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
