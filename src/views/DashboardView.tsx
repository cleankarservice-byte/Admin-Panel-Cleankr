import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  FileCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Database
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { NavTab } from '../components/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    customers, 
    partners, 
    bookings, 
    serviceChanges, 
    securityAlerts, 
    approveServiceChange, 
    rejectServiceChange, 
    updatePartnerStatus,
    firebaseDiagnostics
  } = useData();
  const { hasRole } = useAuth();

  // Metrics computation
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'ACTIVE').length;

  const totalPartners = partners.length;
  const activePartners = partners.filter(p => p.status === 'ACTIVE').length;
  const pendingPartners = partners.filter(p => p.status === 'PENDING_APPROVAL');

  const todayStr = '2026-09-25'; // matches system timestamp
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const activeOngoingJobs = bookings.filter(b => ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.bookingStatus));
  const completedJobs = bookings.filter(b => b.bookingStatus === 'COMPLETED').length;
  const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;

  const pendingServiceChanges = serviceChanges.filter(s => s.status === 'PENDING');

  const todayRevenue = todayBookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const monthlyRevenue = bookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const openSecurityAlerts = securityAlerts.filter(a => a.status === 'OPEN');

  const [selectedPartnerKyc, setSelectedPartnerKyc] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner / System Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h1 className="text-xl font-bold text-white tracking-tight">Operations Control Center</h1>
          </div>
          <p className="text-sm text-slate-400">
            Authoritative command for Customer App, Partner App and Cleankr Services Marketplace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Database:</span>
            <span className="font-mono text-cyan-400 font-semibold">cleankr-724ce</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              firebaseDiagnostics.state === 'CONNECTED_LIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
              firebaseDiagnostics.state === 'PERMISSION_DENIED' ? 'bg-rose-950 text-rose-300 border border-rose-800/60' :
              'bg-amber-950 text-amber-300 border border-amber-800/60'
            }`}>
              {firebaseDiagnostics.state === 'CONNECTED_LIVE' ? 'LIVE SYNC' :
               firebaseDiagnostics.state === 'PERMISSION_DENIED' ? 'DEFAULT DENY RULE' : 'LOCAL REPLICA'}
            </span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Security State:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Default-Deny Enforced
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div 
          onClick={() => onNavigate('customers')}
          className="cursor-pointer bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl transition duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Customers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{totalCustomers}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {activeCustomers} active
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Live synchronized accounts</div>
        </div>

        {/* Partners & Approvals */}
        <div 
          onClick={() => onNavigate('partners')}
          className="cursor-pointer bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl transition duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Partners</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{totalPartners}</span>
            {pendingPartners.length > 0 ? (
              <span className="text-xs text-amber-400 font-semibold bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                {pendingPartners.length} pending KYC
              </span>
            ) : (
              <span className="text-xs text-emerald-400 font-medium">{activePartners} active</span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Onboarding & background checks</div>
        </div>

        {/* Today's Jobs & Operations */}
        <div 
          onClick={() => onNavigate('bookings')}
          className="cursor-pointer bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl transition duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{activeOngoingJobs.length}</span>
            <span className="text-xs text-cyan-400 font-medium">
              {todayBookings.length} scheduled today
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">{completedJobs} completed | {cancelledBookings} cancelled</div>
        </div>

        {/* Today's Revenue */}
        <div 
          onClick={() => onNavigate('payments')}
          className="cursor-pointer bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl transition duration-200 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Revenue (Monthly)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">₹{monthlyRevenue.toLocaleString('en-IN')}</span>
            <span className="text-xs text-emerald-400 font-medium flex items-center">
              Today: ₹{todayRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Gross marketplace transaction volume</div>
        </div>
      </div>

      {/* Critical Action Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Partner Approvals */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Pending Partner Approvals</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingPartners.length}
              </span>
            </div>
            <button 
              onClick={() => onNavigate('partners')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              All Partners
            </button>
          </div>

          <div className="p-4 divide-y divide-slate-800/80">
            {pendingPartners.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No pending partner onboarding applications.
              </div>
            ) : (
              pendingPartners.map(p => (
                <div key={p.id} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{p.fullName}</span>
                      <span className="text-[10px] text-slate-400">({p.city})</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {p.phoneNumber}
                      </span>
                      <span>Skills: {p.skills.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedPartnerKyc(p)}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                      View KYC
                    </button>
                    {hasRole(['OPERATIONS_ADMIN']) && (
                      <>
                        <button
                          onClick={() => updatePartnerStatus(p.id, 'ACTIVE')}
                          className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updatePartnerStatus(p.id, 'REJECTED', 'Missing police verification')}
                          className="px-2 py-1 text-xs bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-medium rounded-lg border border-rose-800/40 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Service Change Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-white">Partner Service-Change Requests</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {pendingServiceChanges.length}
              </span>
            </div>
            <button 
              onClick={() => onNavigate('service-changes')}
              className="text-xs text-cyan-400 hover:underline"
            >
              View Full Queue
            </button>
          </div>

          <div className="p-4 divide-y divide-slate-800/80">
            {pendingServiceChanges.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No active service-change proposals awaiting company approval.
              </div>
            ) : (
              pendingServiceChanges.map(change => (
                <div key={change.id} className="py-3 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white">Booking #{change.bookingId}</span>
                      <span className="text-[11px] text-slate-400 ml-2">by {change.partnerName}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      ₹{change.currentPrice} → ₹{change.proposedPrice}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px]">
                    <div className="text-slate-300 font-medium">Proposed: {change.proposedService}</div>
                    <div className="text-slate-400 mt-1 italic">"{change.reason}"</div>
                  </div>
                  {hasRole(['OPERATIONS_ADMIN']) && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => rejectServiceChange(change.id, 'Scope does not warrant modification')}
                        className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveServiceChange(change.id, 'Verified with customer verbal consent')}
                        className="px-3 py-1 text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition"
                      >
                        Approve & Update Price
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Real-time Ongoing Bookings & Live Operations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Live Field Operations & Dispatches</h2>
            <p className="text-xs text-slate-400">Cross-app synchronization between Customer and Partner apps</p>
          </div>
          <button 
            onClick={() => onNavigate('bookings')}
            className="text-xs text-cyan-400 hover:underline"
          >
            Manage Bookings
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-2.5 px-4">Booking ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Assigned Partner</th>
                <th className="py-2.5 px-4">Service & Slot</th>
                <th className="py-2.5 px-4">Amount</th>
                <th className="py-2.5 px-4">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-medium text-cyan-400">{b.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{b.customerName}</div>
                    <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    {b.partnerName ? (
                      <div>
                        <div className="font-medium text-slate-200">{b.partnerName}</div>
                        <div className="text-[11px] text-slate-400">{b.partnerPhone}</div>
                      </div>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">{b.serviceTitle}</div>
                    <div className="text-[11px] text-slate-400">{b.date} • {b.timeSlot}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">₹{b.totalAmount}</div>
                    <div className="text-[10px] text-slate-400">{b.paymentStatus} ({b.paymentMethod})</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      b.bookingStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      b.bookingStatus === 'STARTED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse' :
                      b.bookingStatus === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      b.bookingStatus === 'CANCELLED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Inspection Modal */}
      {selectedPartnerKyc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Partner Verification Dossier</h3>
                <p className="text-xs text-slate-400">{selectedPartnerKyc.fullName} • {selectedPartnerKyc.phoneNumber}</p>
              </div>
              <button 
                onClick={() => setSelectedPartnerKyc(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">ID Document Type</span>
                <span className="font-semibold text-white">{selectedPartnerKyc.documents?.idProofType || 'National ID'}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Bank Account (for Payouts)</span>
                <span className="font-semibold text-white">{selectedPartnerKyc.bankDetails?.bankName} ({selectedPartnerKyc.bankDetails?.accountNumber})</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-300">Submitted Identity & Police Clearance Files:</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 p-2">
                  <span className="text-[10px] text-slate-400 mb-1 block">Government ID Card</span>
                  <img 
                    src={selectedPartnerKyc.documents?.idProofUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600'} 
                    alt="ID Proof" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 p-2">
                  <span className="text-[10px] text-slate-400 mb-1 block">Police Verification Record</span>
                  <img 
                    src={selectedPartnerKyc.documents?.policeVerificationUrl || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600'} 
                    alt="Police Verification" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPartnerKyc(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition"
              >
                Close
              </button>
              {hasRole(['OPERATIONS_ADMIN']) && (
                <button
                  onClick={() => {
                    updatePartnerStatus(selectedPartnerKyc.id, 'ACTIVE');
                    setSelectedPartnerKyc(null);
                  }}
                  className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition"
                >
                  Approve Partner Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
