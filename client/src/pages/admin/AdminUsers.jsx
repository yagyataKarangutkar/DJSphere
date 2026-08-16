import React, { useEffect, useState } from 'react';
import { getAdminUsers } from '../../services/adminService';
import { Loader2, ShieldCheck, UserCheck, ShieldAlert, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAdminUsers();
        if (response && response.success) {
          setUsers(response.data);
        } else {
          setError('Failed to fetch users list.');
        }
      } catch (err) {
        setError('An error occurred while loading users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleActionClick = (actionName, userName) => {
    alert(`${actionName} action triggered for user: "${userName}"\n(This is a prototype demonstration)`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#4A9B68] animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading users...</span>
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Users</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage registered student, club admin, and super admin accounts
          </p>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/50 p-6 sm:p-8 shadow-xs">
        <div className="overflow-x-auto -mx-6 sm:-mx-8">
          <div className="inline-block min-w-full align-middle px-6 sm:px-8">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 px-4">Email</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Joined On</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60 text-sm font-semibold text-slate-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 text-xs font-bold">
                      No users registered.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => {
                    const isSuper = item.role === 'superAdmin' || item.role === 'super_admin';
                    const isClub = item.role === 'clubAdmin' || item.role === 'club_admin';
                    
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-4 text-slate-900 font-extrabold max-w-[160px] truncate">
                          {item.name}
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium truncate max-w-[180px]">
                          {item.email}
                        </td>
                        <td className="py-4 px-4 font-bold">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 ${
                            isSuper 
                              ? 'bg-purple-50 text-[#8A5CF5]' 
                              : isClub 
                              ? 'bg-amber-50 text-[#D97706]' 
                              : 'bg-emerald-50 text-[#4A9B68]'
                          }`}>
                            {isSuper ? (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Super Admin</span>
                              </>
                            ) : isClub ? (
                              <>
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Club Admin</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Student</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="py-4 pl-4 text-right space-x-2 shrink-0">
                          <button
                            onClick={() => handleActionClick('Delete User', item.name)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer inline-flex items-center"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
