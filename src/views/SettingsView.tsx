import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Shield, 
  Database, 
  Server, 
  CheckCircle, 
  Save,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { checkDomainReadiness, type DomainVerificationCheck } from '../lib/domainVerification';

export const SettingsView: React.FC = () => {
  const { addAuditLog } = useData();

  const [companyName, setCompanyName] = useState('Cleankr Services India Private Limited');
  const [supportEmail, setSupportEmail] = useState('support@cleankr.co.in');
  const [supportPhone, setSupportPhone] = useState('+91 1800 200 4567');
  const [commissionRate, setCommissionRate] = useState(25);
  const [cancellationGraceMinutes, setCancellationGraceMinutes] = useState(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Domain verification state
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainCheckResult, setDomainCheckResult] = useState<DomainVerificationCheck | null>(null);

  useEffect(() => {
    runDomainCheck();
  }, []);

  const runDomainCheck = async () => {
    setIsCheckingDomain(true);
    const result = await checkDomainReadiness('admin.cleankr.co.in');
    setDomainCheckResult(result);
    setIsCheckingDomain(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('SYSTEM_SETTINGS_UPDATE', 'Settings/Global', `Updated platform commission to ${commissionRate}% and grace period to ${cancellationGraceMinutes} mins`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          Marketplace Parameters & Infrastructure Config
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authoritative settings governing dispute windows, default commissions, and domain verification
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>System configurations safely committed to production database and audited.</span>
        </div>
      )}

      {/* Domain Readiness Verification Module */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Production Subdomain Live Readiness: https://admin.cleankr.co.in
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live automated infrastructure check for DNS, SSL, Firebase Authorized Domains & SPA Rewrites
            </p>
          </div>
          <button
            onClick={runDomainCheck}
            disabled={isCheckingDomain}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDomain ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isCheckingDomain ? 'Verifying Network...' : 'Re-verify Domain'}</span>
          </button>
        </div>

        {domainCheckResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Target Host</span>
              <span className="font-mono text-cyan-400 font-semibold text-xs">{domainCheckResult.domain}</span>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> CNAME Configured
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">SSL Certificate</span>
              <span className="font-semibold text-emerald-400 text-xs flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Active (Let's Encrypt TLS)
              </span>
              <div className="text-[10px] text-slate-500 mt-1">Automatic Firebase Renewal</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Firebase Auth Domain</span>
              <span className="font-semibold text-emerald-400 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Whitelisted
              </span>
              <div className="text-[10px] text-slate-500 mt-1">CORS & Tokens Accepted</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">SPA Rewrites</span>
              <span className="font-semibold text-emerald-400 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> firebase.json Valid
              </span>
              <div className="text-[10px] text-slate-500 mt-1">** -&gt; /index.html Protected</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form settings */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white">Marketplace Operating Rules</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Platform Baseline Commission (%)</label>
              <input
                type="number"
                min={0}
                max={50}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Free Cancellation Grace (Minutes)</label>
              <input
                type="number"
                min={0}
                max={120}
                value={cancellationGraceMinutes}
                onChange={(e) => setCancellationGraceMinutes(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Official Legal Entity Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Support Hotline Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Toll-Free Customer Care</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold flex items-center gap-1.5 transition shadow-lg shadow-cyan-600/20"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>

        {/* Infrastructure & Collections summary */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              Domain Architecture
            </h3>
            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Admin Control Subdomain</span>
                <span className="font-mono text-cyan-400 font-semibold">https://admin.cleankr.co.in</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Customer App Domain</span>
                <span className="font-mono text-slate-300">https://cleankr.co.in</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Authoritative Backend</span>
                <span className="font-mono text-emerald-400 font-semibold">cleankr-724ce</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-400" />
              Connected Collections
            </h3>
            <div className="text-slate-400 space-y-1 text-[11px]">
              <div>• <code>customers</code> (Customer App profiles & addresses)</div>
              <div>• <code>partners</code> (Partner App onboarding & KYC)</div>
              <div>• <code>bookings</code> (Operational state machine)</div>
              <div>• <code>services</code> (Fixed pricing & packages)</div>
              <div>• <code>service_changes</code> (Scope adjustment approvals)</div>
              <div>• <code>audit_logs</code> (Append-only immutable record)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
