import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  KeyRound,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminRole } from '../types/cleankr';
import { INITIAL_ADMINS } from '../data/mockData';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('admin@cleankr.co.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AdminRole>('SUPER_ADMIN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide an administrator email address');
      return;
    }

    if (!password) {
      setError('Please enter the administrator security password');
      return;
    }

    // Check for customer/partner intrusion attempts
    const normalized = email.toLowerCase().trim();
    if (
      normalized.includes('@example.com') ||
      normalized.includes('@partner.in') ||
      normalized.includes('customer') ||
      normalized.includes('partner')
    ) {
      setError('Access Denied: Customer and Partner accounts cannot access the administrative portal. Only authorized administrators in /admins directory are permitted.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password, role);
      if (!res.success) {
        setFailedAttempts(prev => prev + 1);
        setError(res.error || 'Authentication failure. Access Denied.');
        setLoading(false);
        return;
      }
      // On success, AuthProvider sets currentAdmin and the app transitions immediately
    } catch (err: any) {
      setError(err?.message || 'Unexpected login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmail = (selectedEmail: string, selectedRole: AdminRole) => {
    setEmail(selectedEmail);
    setRole(selectedRole);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Background aesthetics */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-cyan-500/25">
            C
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Cleankr Admin Control</h1>
          <p className="text-xs text-slate-400">
            Enterprise Security Gateway • <span className="font-mono text-cyan-400">admin.cleankr.co.in</span>
          </p>
        </div>

        {/* Backend notice */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authoritative Backend: <strong>cleankr-724ce</strong></span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
            SSL 256-BIT
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block text-rose-200">Security Notice</span>
              <span>{error}</span>
              {failedAttempts >= 2 && (
                <span className="block text-[11px] text-rose-400 mt-1">
                  Failed attempts: {failedAttempts}. Please verify your administrator password.
                </span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          {/* Email input */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-medium flex items-center justify-between">
              <span>Administrator Email</span>
              <span className="text-[10px] text-slate-500 font-mono">Protected</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cleankr.co.in"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition font-sans"
              />
            </div>
          </div>

          {/* Password input with show/hide toggle */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-medium flex items-center justify-between">
              <span>Administrator Password</span>
              <span className="text-[10px] text-cyan-400 font-mono">Required</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security password"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition font-mono tracking-wider"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="text-slate-300 block mb-1.5 font-medium">Administrative Role Authorization</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full Platform Governance)</option>
              <option value="OPERATIONS_ADMIN">OPERATIONS_ADMIN (Partners & Bookings)</option>
              <option value="FINANCE_ADMIN">FINANCE_ADMIN (Payouts & Refunds)</option>
              <option value="SUPPORT_ADMIN">SUPPORT_ADMIN (Disputes & Customers)</option>
              <option value="READ_ONLY_ADMIN">READ_ONLY_ADMIN (Auditing)</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating Identity...</span>
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Unlock & Access Admin Control</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Info & Authorized Identities */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">
              Authorized Administrative Identities:
            </span>
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <Shield className="w-3 h-3" />
              2FA Protected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {INITIAL_ADMINS.map(acc => (
              <button
                key={acc.uid}
                type="button"
                onClick={() => handleSelectEmail(acc.email, acc.role)}
                className={`p-2 text-left rounded-xl border text-[11px] transition ${
                  email === acc.email
                    ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/60 text-slate-400'
                }`}
              >
                <div className="font-medium text-slate-200 truncate flex items-center gap-1">
                  <span>{acc.displayName.split(' ')[0]}</span>
                  {email === acc.email && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                </div>
                <div className="text-slate-500 font-mono text-[9px] truncate">{acc.email}</div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 text-center pt-2">
            Protected by Cleankr Enterprise Access Control • Unlawful access attempts are logged to Firestore audit ledger.
          </p>
        </div>
      </div>
    </div>
  );
};
