import React, { useState } from 'react';
import { 
  UserCog, 
  Shield, 
  Plus, 
  Key, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lock,
  Smartphone
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { AdminRole, AdminUser } from '../types/cleankr';

export const AdminUsersView: React.FC = () => {
  const { admins, createAdminUser, updateAdminStatus } = useData();
  const { hasRole, currentAdmin } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('OPERATIONS_ADMIN');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;
    createAdminUser({
      email: newEmail,
      displayName: newName,
      phoneNumber: newPhone,
      role: newRole
    });
    setShowAddModal(false);
    setNewEmail('');
    setNewName('');
    setNewPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCog className="w-5 h-5 text-cyan-400" />
            Administrative Accounts & Role-Based Permissions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super Admin directory for granting, revoking, and auditing administrative privileges
          </p>
        </div>

        {hasRole(['SUPER_ADMIN']) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            Provision Admin User
          </button>
        )}
      </div>

      {/* Admin Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">UID / Identifier</th>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">MFA State</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {admins.map(admin => (
                <tr key={admin.uid} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-medium text-cyan-400">{admin.uid}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{admin.displayName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{admin.email}</span>
                      {admin.phoneNumber && <span>• {admin.phoneNumber}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      admin.role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      admin.role === 'OPERATIONS_ADMIN' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      admin.role === 'FINANCE_ADMIN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      admin.role === 'SUPPORT_ADMIN' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <Smartphone className="w-3.5 h-3.5" />
                      Enforced (SMS/TOTP)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      admin.isActive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      {admin.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {hasRole(['SUPER_ADMIN']) && admin.uid !== currentAdmin?.uid ? (
                      <button
                        onClick={() => updateAdminStatus(admin.uid, !admin.isActive)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          admin.isActive 
                            ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {admin.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Current Session</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Provision New Administrator
            </h3>
            <p className="text-xs text-slate-400">
              New admin will receive an invitation to bind their MFA credential to Firebase Authentication.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Maya Patel"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Official Email (@cleankr.co.in)</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. maya@cleankr.co.in"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Phone Number (MFA)</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Granular Role Assignment</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminRole)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="OPERATIONS_ADMIN">OPERATIONS_ADMIN (Partners, Bookings, Services)</option>
                  <option value="FINANCE_ADMIN">FINANCE_ADMIN (Payments, Refunds, Payouts)</option>
                  <option value="SUPPORT_ADMIN">SUPPORT_ADMIN (Customer Service & Assistance)</option>
                  <option value="READ_ONLY_ADMIN">READ_ONLY_ADMIN (Auditing / View Only)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Governance)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
