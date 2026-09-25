import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminRole } from '../types/cleankr';
import { INITIAL_ADMINS } from '../data/mockData';

export const LoginView: React.FC = () => {
  const { login, verifyMfa } = useAuth();
  
  const [email, setEmail] = useState('admin@cleankr.co.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<AdminRole>('SUPER_ADMIN');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA'>('CREDENTIALS');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an administrative email address');
      return;
    }
    // Check upfront for unauthorized customer/partner account attempts
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

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('MFA');
    }, 400);
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaCode) {
      setError('Enter 6-digit MFA OTP code');
      return;
    }
    setLoading(true);
    const res = await login(email, password, role);
    if (!res.success) {
      setError(res.error || 'Authentication failure.');
      setLoading(false);
      return;
    }
    verifyMfa(mfaCode);
    setLoading(false);
  };

  const quickSelect = (acc: typeof INITIAL_ADMINS[0]) => {
    setEmail(acc.email);
    setRole(acc.role);
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
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Connected to Authoritative Backend <strong>cleankr-724ce</strong></span>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'CREDENTIALS' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1.5 font-medium">Administrator Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cleankr.co.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Proceed to Security MFA'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-cyan-300 space-y-1">
              <span className="font-semibold block">Two-Factor Authentication</span>
              <p className="text-[11px] text-cyan-400/80">
                A 6-digit one-time passcode was sent to the registered mobile terminal for <strong>{email}</strong>.
              </p>
            </div>

            <div>
              <label className="text-slate-300 block mb-1.5 font-medium">Enter 6-Digit MFA Token (e.g. 123456)</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono tracking-widest text-center text-base focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('CREDENTIALS')}
                className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition"
              >
                <Lock className="w-4 h-4" />
                <span>Verify & Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* Quick Demo Credentials Selector */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
            Quick Select Authorized Accounts:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {INITIAL_ADMINS.map(acc => (
              <button
                key={acc.uid}
                type="button"
                onClick={() => quickSelect(acc)}
                className="p-1.5 text-left rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800/60 text-[10px] text-slate-300 transition"
              >
                <div className="font-semibold text-white truncate">{acc.displayName.split(' ')[0]}</div>
                <div className="text-slate-500 font-mono truncate">{acc.role}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
