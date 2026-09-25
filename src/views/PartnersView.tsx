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
  ShieldCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Partner, PartnerStatus } from '../types/cleankr';

export const PartnersView: React.FC = () => {
  const { partners, bookings, updatePartnerStatus } = useData();
  const { hasRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PartnerStatus>('ALL');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [rejectionModalPartner, setRejectionModalPartner] = useState<Partner | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredPartners = partners.filter(p => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phoneNumber.includes(searchQuery) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesFilter;
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

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-400" />
            Partner Operations & Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative vetting, onboarding documents, background check approvals, and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner, city, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter Partners by Status"
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Partners</option>
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
                <th className="py-3 px-4">City / Coverage</th>
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
                    No partner records found.
                  </td>
                </tr>
              ) : (
                filteredPartners.map(partner => (
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
                      <div className="font-medium text-slate-200">{partner.city}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {partner.serviceAreas?.join(', ') || 'Metropolitan Area'}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal with Reason auditing */}
      {rejectionModalPartner && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reject Partner Application</h3>
            <p className="text-xs text-slate-400">
              Provide an authoritative rejection reason for {rejectionModalPartner.fullName}. This reason will be logged in the permanent audit trail.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Police verification document unreadable or mismatched criminal background record..."
              className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectionModalPartner(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Full Dossier Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedPartner.fullName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-amber-400">
                    {selectedPartner.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Operating in {selectedPartner.city} • Rating ★{selectedPartner.rating}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPartner(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Jobs Done</span>
                <span className="text-base font-bold text-white">{selectedPartner.completedJobsCount}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Total Earned</span>
                <span className="text-base font-bold text-emerald-400">₹{selectedPartner.totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Unpaid Balance</span>
                <span className="text-base font-bold text-amber-400">₹{selectedPartner.pendingPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Availability</span>
                <span className={`text-xs font-bold ${selectedPartner.isAvailable ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {selectedPartner.isAvailable ? 'Online / On Duty' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Bank details for payouts */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-semibold block flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" /> Authorized Settlement Account
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                <div>Bank: <strong className="text-white">{selectedPartner.bankDetails?.bankName}</strong></div>
                <div>IFSC: <strong className="text-white">{selectedPartner.bankDetails?.ifscCode}</strong></div>
                <div>Account No: <strong className="text-white">{selectedPartner.bankDetails?.accountNumber}</strong></div>
                <div>Holder: <strong className="text-white">{selectedPartner.bankDetails?.accountHolderName}</strong></div>
              </div>
            </div>

            {/* KYC files */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">Stored Verification Documents</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">ID Document: {selectedPartner.documents?.idProofType}</span>
                  <img 
                    src={selectedPartner.documents?.idProofUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600'} 
                    alt="ID" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 block mb-1">Police Clearance Dossier</span>
                  <img 
                    src={selectedPartner.documents?.policeVerificationUrl || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600'} 
                    alt="Police check" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Partner jobs */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">Assigned & Completed Jobs</span>
              <div className="space-y-2">
                {getPartnerJobs(selectedPartner.id).map(b => (
                  <div key={b.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{b.serviceTitle} ({b.id})</div>
                      <div className="text-[11px] text-slate-400">Customer: {b.customerName} • {b.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-400">Payout: ₹{b.partnerPayoutAmount}</div>
                      <span className="text-[10px] text-slate-400">{b.bookingStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
