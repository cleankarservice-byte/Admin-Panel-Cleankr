import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Key, 
  AlertTriangle, 
  Terminal, 
  CheckCircle, 
  XCircle,
  FileCode,
  Server
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const SecurityView: React.FC = () => {
  const { securityAlerts, resolveSecurityAlert } = useData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Security Center & Rule Enforcement
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Zero-trust backend surveillance, brute-force alarms, privilege monitoring and perimeter status
        </p>
      </div>

      {/* Security Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Firestore Perimeter</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-white">DEFAULT DENY</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Client write bypass locked</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Authorization Layer</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-white">Custom Claims / RBAC</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Browser claims untrusted</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">MFA Enforcement</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-white">Active (TOTP/SMS)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Privileged operations guard</p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Environment Secret Hygiene</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-white">Zero Hardcoded Keys</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Server-side proxy routes</p>
        </div>
      </div>

      {/* Security Alerts Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-white">Active Incident & Threat Detection Log</h3>
          </div>
          <span className="text-xs text-slate-400">{securityAlerts.filter(a => a.status === 'OPEN').length} Open Threats</span>
        </div>

        <div className="divide-y divide-slate-800">
          {securityAlerts.map(alert => (
            <div key={alert.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    alert.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    alert.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="font-mono text-xs font-semibold text-white">{alert.type}</span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(alert.timestamp).toLocaleTimeString()} ({new Date(alert.timestamp).toLocaleDateString()})
                  </span>
                </div>
                <p className="text-xs text-slate-300">{alert.description}</p>
                <div className="text-[11px] text-slate-400 font-mono">
                  Source: {alert.source}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {alert.status === 'RESOLVED' ? (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resolved ({alert.resolvedBy})
                  </span>
                ) : (
                  <button
                    onClick={() => resolveSecurityAlert(alert.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
                  >
                    Acknowledge & Clear
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Hardening Specifications Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          Production Hardening Matrix (Admin Panel vs Customer vs Partner)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">1. Client-Side Authorization Immunity</span>
            <p className="text-slate-400">
              Browser-supplied role flags are discarded. Access relies on server-minted token claims and <strong>/admins/{'{uid}'}</strong> Firestore documents with read restrictions.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">2. Authoritative Price Integrity</span>
            <p className="text-slate-400">
              Final booking charges are locked in <strong>/services</strong> documents. Customer and Partner apps cannot write custom amounts to /bookings collections.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">3. Immutable Audit Trails</span>
            <p className="text-slate-400">
              The <strong>/audit_logs</strong> collection contains <strong>allow update, delete: if false;</strong>. No administrator can overwrite historical dispatch or payout actions.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">4. KYC Document Storage Isolation</span>
            <p className="text-slate-400">
              Partner Aadhaar, Voter IDs and police records in <strong>/partner_documents</strong> are blocked from public read access. Only authenticated reviewers or the owner can retrieve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
