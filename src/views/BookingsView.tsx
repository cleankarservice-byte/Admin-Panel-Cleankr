import React, { useState } from 'react';
import { 
  CalendarClock, 
  Search, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  UserPlus,
  ArrowRight,
  ShieldAlert,
  Edit3
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Booking, BookingStatus } from '../types/cleankr';

export const BookingsView: React.FC = () => {
  const { bookings, partners, updateBookingStatus, assignBookingPartner } = useData();
  const { hasRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [assignmentModalBooking, setAssignmentModalBooking] = useState<Booking | null>(null);
  const [statusOverrideModalBooking, setStatusOverrideModalBooking] = useState<Booking | null>(null);
  const [targetPartnerId, setTargetPartnerId] = useState('');
  const [overrideStatus, setOverrideStatus] = useState<BookingStatus>('COMPLETED');
  const [overrideReason, setOverrideReason] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.partnerName && b.partnerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const availablePartners = partners.filter(p => p.status === 'ACTIVE');

  const handleConfirmAssignment = () => {
    if (!assignmentModalBooking || !targetPartnerId) return;
    assignBookingPartner(assignmentModalBooking.id, targetPartnerId);
    setAssignmentModalBooking(null);
    setTargetPartnerId('');
  };

  const handleConfirmStatusOverride = () => {
    if (!statusOverrideModalBooking) return;
    updateBookingStatus(statusOverrideModalBooking.id, overrideStatus, overrideReason);
    setStatusOverrideModalBooking(null);
    setOverrideReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-cyan-400" />
            Booking Operations & Field Lifecycle
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative state machine synchronizing customer app orders and partner field progression
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search booking ID, customer, partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter Bookings by Status"
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CREATED">Created (Unassigned)</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="ON_THE_WAY">On the Way</option>
            <option value="ARRIVED">Arrived</option>
            <option value="STARTED">Started (In Progress)</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Service & Package</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Assigned Partner</th>
                <th className="py-3 px-4">Date & Slot</th>
                <th className="py-3 px-4">Price / Split</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-medium text-cyan-400">{b.id}</div>
                      {b.serviceChangePending && (
                        <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-bold block mt-1">
                          Change Req
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{b.serviceTitle}</div>
                      <div className="text-[11px] text-slate-400">{b.packageName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {b.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {b.partnerName ? (
                        <div>
                          <div className="font-medium text-slate-200">{b.partnerName}</div>
                          <div className="text-[11px] text-slate-400">{b.partnerPhone}</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssignmentModalBooking(b)}
                          className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          Assign Partner
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{b.date}</div>
                      <div className="text-[11px] text-slate-400">{b.timeSlot}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">₹{b.totalAmount}</div>
                      <div className="text-[10px] text-slate-400">
                        Partner: ₹{b.partnerPayoutAmount} | Cleankr: ₹{b.companyCommissionAmount}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.bookingStatus === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                        b.bookingStatus === 'STARTED' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse' :
                        b.bookingStatus === 'ACCEPTED' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' :
                        b.bookingStatus === 'ASSIGNED' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' :
                        b.bookingStatus === 'CANCELLED' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
                        >
                          Details
                        </button>
                        {hasRole(['OPERATIONS_ADMIN']) && (
                          <button
                            onClick={() => {
                              setStatusOverrideModalBooking(b);
                              setOverrideStatus(b.bookingStatus);
                            }}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs transition"
                            title="Supervisory Override"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Manual Dispatch / Assignment Modal */}
      {assignmentModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Manual Partner Dispatch</h3>
            <p className="text-xs text-slate-400">
              Assign an active partner to Booking <strong>{assignmentModalBooking.id}</strong> ({assignmentModalBooking.serviceTitle}).
            </p>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">
                Select Active & Available Partner
              </label>
              <select
                value={targetPartnerId}
                onChange={(e) => setTargetPartnerId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Choose Partner --</option>
                {availablePartners.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.city}) - Rating ★{p.rating}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAssignmentModalBooking(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                disabled={!targetPartnerId}
                onClick={handleConfirmAssignment}
                className="px-4 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl font-medium transition"
              >
                Dispatch Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Status Override Modal (audited) */}
      {statusOverrideModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Administrative Status Override</h3>
            </div>
            <p className="text-xs text-slate-400">
              Manually modifying the lifecycle state for Booking <strong>{statusOverrideModalBooking.id}</strong> creates a permanent entry in the security audit logs.
            </p>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">Target Status</label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value as BookingStatus)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="CREATED">CREATED</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="ON_THE_WAY">ON_THE_WAY</option>
                <option value="ARRIVED">ARRIVED</option>
                <option value="STARTED">STARTED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1.5">Administrative Reason</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Reason for manual operational intervention..."
                className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setStatusOverrideModalBooking(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusOverride}
                className="px-4 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition"
              >
                Save Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Booking #{selectedBooking.id}</h3>
                <p className="text-xs text-slate-400">{selectedBooking.serviceTitle} • {selectedBooking.packageName}</p>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Customer</span>
                <span className="font-semibold text-white block">{selectedBooking.customerName}</span>
                <span className="text-slate-400">{selectedBooking.customerPhone}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Assigned Partner</span>
                <span className="font-semibold text-white block">{selectedBooking.partnerName || 'Not Assigned'}</span>
                <span className="text-slate-400">{selectedBooking.partnerPhone || 'Pending Dispatch'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Service Location
              </span>
              <div className="text-slate-200">
                {selectedBooking.address.street}, {selectedBooking.address.city} - {selectedBooking.address.pincode}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1 font-semibold">Authoritative Financial Split</span>
              <div className="flex justify-between items-center text-slate-300 py-1 border-b border-slate-800/60">
                <span>Total Customer Charged:</span>
                <span className="font-bold text-white">₹{selectedBooking.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 py-1 border-b border-slate-800/60">
                <span>Partner Payout (Share):</span>
                <span className="font-medium text-emerald-400">₹{selectedBooking.partnerPayoutAmount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 py-1">
                <span>Company Margin:</span>
                <span className="font-medium text-cyan-400">₹{selectedBooking.companyCommissionAmount}</span>
              </div>
            </div>

            {selectedBooking.notes && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1 font-semibold">Operational Notes & History</span>
                <div className="text-slate-300">{selectedBooking.notes}</div>
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedBooking(null)}
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
