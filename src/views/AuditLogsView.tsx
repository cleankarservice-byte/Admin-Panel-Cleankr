import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  Lock, 
  UserCheck, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetResource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportAuditCsv = () => {
    const headers = ['ID', 'Timestamp', 'Admin Email', 'Admin Role', 'Action', 'Target Resource', 'Previous Value', 'New Value', 'IP Address', 'Status'];
    const rows = auditLogs.map(l => [
      l.id,
      l.timestamp,
      l.adminEmail,
      l.adminRole,
      l.action,
      `"${l.targetResource}"`,
      `"${l.previousValue || ''}"`,
      `"${l.newValue || ''}"`,
      `"${l.ipAddress || ''}"`,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cleankr_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Immutable Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident chronological logs of every administrative, dispatch, pricing, and security intervention
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search actions, admin emails, targets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>

          <button
            onClick={exportAuditCsv}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            Export Log CSV
          </button>
        </div>
      </div>

      {/* Audit Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Firestore Rule Verification: <strong>allow update, delete: if false;</strong> strictly enforced on audit_logs.</span>
        </div>
        <span className="text-[11px] font-mono text-cyan-400">Total Entries: {auditLogs.length}</span>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Log ID & Time</th>
                <th className="py-3 px-4">Admin Principal</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Recorded Change Details</th>
                <th className="py-3 px-4">Source IP</th>
                <th className="py-3 px-4">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono text-cyan-400 font-medium">{log.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString()} ({new Date(log.timestamp).toLocaleDateString()})
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{log.adminEmail}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                      {log.adminRole}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-xs text-white">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                    {log.targetResource}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    {log.previousValue && (
                      <div className="text-[11px] text-rose-300 line-through">
                        Prev: {log.previousValue}
                      </div>
                    )}
                    <div className="text-white text-[11px] font-medium">
                      {log.newValue || 'Action performed successfully'}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {log.ipAddress || 'Authorized Terminal'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
