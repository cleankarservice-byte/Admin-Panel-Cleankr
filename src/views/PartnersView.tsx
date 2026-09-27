import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Star, 
  Wallet,
  AlertTriangle,
  Building,
  ShieldCheck,
  Building2,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Partner, PartnerStatus } from '../types/cleankr';

export const PartnersView: React.FC = () => {
  const { 
    partners, 
    bookings, 
    hubs, 
    updatePartnerStatus, 
    assignPartnerToHub, 
    removePartnerFromHub, 
    setPartnerPrimaryHub 
  } = useData();
  const { hasRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PartnerStatus>('ALL');
  const [hubFilter, setHubFilter] = useState<string>('ALL');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [rejectionModalPartner, setRejectionModalPartner] = useState<Partner | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Hub assignment modal within Partner View
  const [hubAssignModalPartner, setHubAssignModalPartner] = useState<Partner | null>(null);

  const filteredPartners = partners.filter(p => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phoneNumber.includes(searchQuery) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesHub = hubFilter === 'ALL' || (p.assignedHubIds?.includes(hubFilter) || p.primaryHubId === hubFilter);
    return matchesSearch && matchesStatus && matchesHub;
  });

  const getPartnerJobs = (partnerId: string) => {
    return bookings.filter(b => b.partnerId === partnerId);
  };

  const handleConfirmReject = () => {
    if (!rejectionModalPartner) return;
    updatePartnerStatus(rejectionModalPartner.id, 'REJECTED', rejectionReason || 'KYC verification failed or criteria unmet');
    setRejectionModalPartner(null);
    setRejectionReason('');
  };

  const activePartnerRecord = selectedPartner 
    ? (partners.find(p => p.id === selectedPartner.id) || selectedPartner)
    : null;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            Partner Operations & Hub Assignment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative vetting, onboarding documents, background check approvals & territorial hub allocations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner, city, phone, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-60"
            />
          </div>

          <select
            value={hubFilter}
            onChange={(e) => setHubFilter(e.target.value)}
            aria-label="Filter Partners by Hub"
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Hubs</option>
            {hubs.map(h => (
              <option key={h.hubId} value={h.hubId}>{h.hubName}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter Partners by Status"
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING_APPROVAL">Pending Verification</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Partners List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Partner ID</th>
                <th className="py-3 px-4">Name & Contact</th>
                <th className="py-3 px-4">Assigned Hubs & Territory</th>
                <th className="py-3 px-4">KYC Status</th>
                <th className="py-3 px-4">Completed Jobs</th>
                <th className="py-3 px-4">Lifetime Earnings</th>
                <th className="py-3 px-4">Pending Payout</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No partner records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPartners.map(partner => {
                  const assignedHubs = hubs.filter(h => partner.assignedHubIds?.includes(h.hubId) || partner.primaryHubId === h.hubId);
                  const primaryHub = hubs.find(h => h.hubId === partner.primaryHubId);

                  return (
                    <tr key={partner.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-medium text-cyan-400">{partner.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {partner.fullName}
                          <span className="text-[11px] text-amber-400 font-normal">★ {partner.rating}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{partner.phoneNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          {primaryHub ? (
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300">
                              <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate max-w-[130px]">{primaryHub.hubName}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">PRI</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">No Primary Hub</span>
                          )}

                          {assignedHubs.length > 1 && (
                            <span className="text-[10px] text-slate-400">
                              + {assignedHubs.length - 1} secondary hub(s)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          partner.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                          partner.status === 'PENDING_APPROVAL' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse' :
                          partner.status === 'SUSPENDED' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {partner.status === 'ACTIVE' && <CheckCircle className="w-3 h-3" />}
                          {partner.status === 'PENDING_APPROVAL' && <Clock className="w-3 h-3" />}
                          {partner.status === 'SUSPENDED' && <AlertTriangle className="w-3 h-3" />}
                          {partner.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">{partner.completedJobsCount} jobs</td>
                      <td className="py-3 px-4 font-bold text-white">₹{partner.totalEarnings.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-semibold text-amber-400">
                        ₹{partner.pendingPayout.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedPartner(partner)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
                          >
                            Dossier
                          </button>

                          {hasRole(['OPERATIONS_ADMIN']) && (
                            <>
                              <button
                                onClick={() => setHubAssignModalPartner(partner)}
                                title="Assign Hubs"
                                className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 rounded-lg text-xs font-medium transition flex items-center gap-1"
                              >
                                <Building2 className="w-3 h-3" />
                                Hubs
                              </button>

                              {partner.status === 'PENDING_APPROVAL' && (
                                <>
                                  <button
                                    onClick={() => updatePartnerStatus(partner.id, 'ACTIVE')}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => setRejectionModalPartner(partner)}
                                    className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-medium border border-rose-800/40 transition"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {partner.status === 'ACTIVE' && (
                                <button
                                  onClick={() => updatePartnerStatus(partner.id, 'SUSPENDED', 'Account suspended for policy audit')}
                                  className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-medium border border-rose-800/40 transition"
                                >
                                  Suspend
                                </button>
                              )}

                              {partner.status === 'SUSPENDED' && (
                                <button
                                  onClick={() => updatePartnerStatus(partner.id, 'ACTIVE')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                                >
                                  Reactivate
                                </button>
                              )}
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

      {/* 5. PARTNER -> HUB ASSIGNMENT MODAL */}
      {hubAssignModalPartner && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Hub Allocations: {hubAssignModalPartner.fullName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only assigned Hubs can dispatch customer jobs to this partner.
                </p>
              </div>
              <button onClick={() => setHubAssignModalPartner(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider">
                Available Territory Hubs ({hubs.length})
              </h4>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {hubs.map(hub => {
                  const isAssigned = hubAssignModalPartner.assignedHubIds?.includes(hub.hubId) || hubAssignModalPartner.primaryHubId === hub.hubId;
                  const isPrimary = hubAssignModalPartner.primaryHubId === hub.hubId;

                  return (
                    <div 
                      key={hub.hubId}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{hub.hubName}</span>
                          <span className="text-[10px] text-slate-400">({hub.city})</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            hub.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {hub.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {hub.serviceAreas.slice(0, 3).join(', ')}...
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAssigned ? (
                          <>
                            {isPrimary ? (
                              <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                                Primary Hub
                              </span>
                            ) : (
                              <button
                                onClick={() => setPartnerPrimaryHub(hubAssignModalPartner.id, hub.hubId)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition"
                              >
                                Make Primary
                              </button>
                            )}

                            <button
                              onClick={() => removePartnerFromHub(hubAssignModalPartner.id, hub.hubId)}
                              className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition"
                              title="Remove from Hub"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => assignPartnerToHub(hubAssignModalPartner.id, hub.hubId, false)}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition"
                          >
                            Assign Hub
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setHubAssignModalPartner(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER DOSSIER MODAL */}
      {activePartnerRecord && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{activePartnerRecord.fullName}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-cyan-400">
                    {activePartnerRecord.id}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Partner Member since {new Date(activePartnerRecord.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelectedPartner(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Completed Jobs</span>
                <span className="text-base font-bold text-white">{activePartnerRecord.completedJobsCount}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Lifetime Earnings</span>
                <span className="text-base font-bold text-emerald-400">₹{activePartnerRecord.totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Pending Payout</span>
                <span className="text-base font-bold text-amber-400">₹{activePartnerRecord.pendingPayout.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Assigned Hubs Info */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Assigned Territorial Hubs
              </h4>
              <div className="flex flex-wrap gap-2">
                {hubs.filter(h => activePartnerRecord.assignedHubIds?.includes(h.hubId) || activePartnerRecord.primaryHubId === h.hubId).map(h => (
                  <span key={h.hubId} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                    <span className="font-medium text-white">{h.hubName}</span>
                    {activePartnerRecord.primaryHubId === h.hubId && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold">
                        PRIMARY
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* KYC and Verification */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> KYC Verification & Bank Settlement
              </h4>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div><span className="text-slate-500">Document Type:</span> {activePartnerRecord.documents?.idProofType || 'Aadhaar Card'}</div>
                <div><span className="text-slate-500">Bank Name:</span> {activePartnerRecord.bankDetails?.bankName || 'HDFC Bank'}</div>
                <div><span className="text-slate-500">Account Number:</span> {activePartnerRecord.bankDetails?.accountNumber || 'XXXXXX9821'}</div>
                <div><span className="text-slate-500">IFSC Code:</span> {activePartnerRecord.bankDetails?.ifscCode || 'HDFC0000123'}</div>
              </div>
            </div>

            {/* Past Jobs */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Recent Dispatched Jobs ({getPartnerJobs(activePartnerRecord.id).length})
              </h4>
              <div className="space-y-2">
                {getPartnerJobs(activePartnerRecord.id).map(b => (
                  <div key={b.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{b.serviceTitle}</div>
                      <div className="text-[11px] text-slate-400">{b.date} • {b.packageName} • Customer: {b.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">₹{b.partnerPayoutAmount} (Payout)</div>
                      <span className="text-[10px] text-slate-400">{b.bookingStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {rejectionModalPartner && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Reject Partner Application: {rejectionModalPartner.fullName}
            </h3>
            <textarea
              rows={3}
              placeholder="State rejection reason (e.g. Unclear identity documents, address mismatch)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectionModalPartner(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
