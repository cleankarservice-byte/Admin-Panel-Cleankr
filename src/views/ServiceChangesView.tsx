import React, { useState } from 'react';
import { 
  GitPullRequestDraft, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ServiceChangeRequest } from '../types/cleankr';

export const ServiceChangesView: React.FC = () => {
  const { serviceChanges, approveServiceChange, rejectServiceChange } = useData();
  const { hasRole } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [selectedReq, setSelectedReq] = useState<ServiceChangeRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const filtered = serviceChanges.filter(s => {
    if (activeFilter === 'ALL') return true;
    return s.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitPullRequestDraft className="w-5 h-5 text-rose-400" />
            Partner Service-Change Approvals
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative gatekeeper: On-site scope modifications requested by partners require admin consent before final price updates
          </p>
        </div>

        <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeFilter === tab
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'PENDING' ? 'Pending Review' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Changes Table / Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Booking</th>
                <th className="py-3 px-4">Partner Requesting</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Current vs Proposed</th>
                <th className="py-3 px-4">Price Difference</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No service change requests in this queue.
                  </td>
                </tr>
              ) : (
                filtered.map(req => {
                  const priceDiff = req.proposedPrice - req.currentPrice;
                  return (
                    <tr key={req.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-medium text-cyan-400">{req.id}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{req.bookingId}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{req.partnerName}</div>
                        <div className="text-[10px] text-slate-400">{req.partnerId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{req.customerName}</div>
                        <div className="text-[10px] text-slate-400">{req.customerId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-400 line-through text-[11px]">{req.currentPackage}</div>
                        <div className="text-white font-medium text-xs mt-0.5">{req.proposedPackage}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-bold">
                          <span className="text-slate-400 text-xs">₹{req.currentPrice}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="text-emerald-400 text-sm">₹{req.proposedPrice}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          (+₹{priceDiff})
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          req.status === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                          req.status === 'PENDING' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse' :
                          'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
                          >
                            Review
                          </button>
                          {req.status === 'PENDING' && hasRole(['OPERATIONS_ADMIN']) && (
                            <>
                              <button
                                onClick={() => approveServiceChange(req.id, 'Approved by Operations Admin')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectServiceChange(req.id, 'Rejected: scope not verified')}
                                className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-medium border border-rose-800/40 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Service Change Proposal Review</h3>
                <p className="text-xs text-slate-400">Request #{selectedReq.id} for Booking {selectedReq.bookingId}</p>
              </div>
              <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Partner's Stated Reason</span>
                <p className="text-slate-200 italic leading-relaxed">"{selectedReq.reason}"</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Initial Order</span>
                  <div className="font-semibold text-white mt-1">{selectedReq.currentService}</div>
                  <div className="text-slate-400">{selectedReq.currentPackage}</div>
                  <div className="text-sm font-bold text-slate-300 mt-2">₹{selectedReq.currentPrice}</div>
                </div>

                <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">
                    Proposed Modification
                  </span>
                  <div className="font-semibold text-white mt-1">{selectedReq.proposedService}</div>
                  <div className="text-emerald-300">{selectedReq.proposedPackage}</div>
                  <div className="text-sm font-bold text-emerald-400 mt-2">₹{selectedReq.proposedPrice}</div>
                </div>
              </div>

              {selectedReq.status === 'PENDING' && (
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Reviewer Operational Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter validation notes for audit trail..."
                    className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              )}

              {selectedReq.reviewerNotes && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                  <span className="text-slate-400 block text-[10px] uppercase">Recorded Review Notes</span>
                  <div>{selectedReq.reviewerNotes} (Reviewed by: {selectedReq.reviewedBy})</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Close
              </button>
              {selectedReq.status === 'PENDING' && hasRole(['OPERATIONS_ADMIN']) && (
                <>
                  <button
                    onClick={() => {
                      rejectServiceChange(selectedReq.id, adminNotes || 'Declined');
                      setSelectedReq(null);
                    }}
                    className="px-4 py-2 text-xs bg-rose-950 hover:bg-rose-900 text-rose-300 font-semibold rounded-xl border border-rose-800/40 transition"
                  >
                    Reject Proposal
                  </button>
                  <button
                    onClick={() => {
                      approveServiceChange(selectedReq.id, adminNotes || 'Approved by Operations');
                      setSelectedReq(null);
                    }}
                    className="px-4 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition"
                  >
                    Approve & Enforce New Price
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
