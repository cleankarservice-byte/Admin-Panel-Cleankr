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
  Edit3,
  Building2,
  Tag,
  CreditCard,
  RotateCcw,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Booking, BookingStatus, PaymentStatus } from '../types/cleankr';

export const BookingsView: React.FC = () => {
  const { 
    bookings, 
    partners, 
    hubs, 
    services, 
    updateBookingStatus, 
    assignBookingPartner,
    isPartnerEligibleForBooking 
  } = useData();
  const { hasRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [hubFilter, setHubFilter] = useState<string>('ALL');
  const [partnerFilter, setPartnerFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | PaymentStatus>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Selected Booking Details Modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Partner Assignment Modal
  const [assignmentModalBooking, setAssignmentModalBooking] = useState<Booking | null>(null);
  const [targetPartnerId, setTargetPartnerId] = useState('');
  const [assignmentError, setAssignmentError] = useState('');

  // Status Lifecycle Progression Modal
  const [statusOverrideModalBooking, setStatusOverrideModalBooking] = useState<Booking | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<BookingStatus>('COMPLETED');
  const [overrideReason, setOverrideReason] = useState('');

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.partnerName && b.partnerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.pincode.includes(searchQuery);

    const matchesHub = hubFilter === 'ALL' || b.hubId === hubFilter;
    const matchesPartner = partnerFilter === 'ALL' || b.partnerId === partnerFilter;
    const matchesService = serviceFilter === 'ALL' || b.serviceId === serviceFilter;
    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' || b.paymentStatus === paymentFilter;
    const matchesDate = !dateFilter || b.date === dateFilter;

    return matchesSearch && matchesHub && matchesPartner && matchesService && matchesStatus && matchesPayment && matchesDate;
  });

  const handleConfirmAssignment = () => {
    if (!assignmentModalBooking || !targetPartnerId) return;
    setAssignmentError('');

    const success = assignBookingPartner(assignmentModalBooking.id, targetPartnerId);
    if (!success) {
      setAssignmentError('This partner is not assigned to the booking territory Hub. Assigning outside territory is restricted by Hub Routing Policy.');
      return;
    }

    setAssignmentModalBooking(null);
    setTargetPartnerId('');
  };

  const handleConfirmStatusOverride = () => {
    if (!statusOverrideModalBooking) return;
    updateBookingStatus(statusOverrideModalBooking.id, overrideStatus, overrideReason);
    setStatusOverrideModalBooking(null);
    setOverrideReason('');
  };

  const activeBookingRecord = selectedBooking 
    ? (bookings.find(b => b.id === selectedBooking.id) || selectedBooking)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-cyan-400" />
            Booking Operations & Field Lifecycle
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative lifecycle progression, hub territory validation, price snapshot security & partner routing
          </p>
        </div>
      </div>

      {/* Comprehensive Filter Bar (Hub, Partner, Service, Status, Payment, Date) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search booking ID, customer, partner, pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Hub Filter */}
          <select
            value={hubFilter}
            onChange={(e) => setHubFilter(e.target.value)}
            aria-label="Filter Bookings by Hub"
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Territory Hubs</option>
            {hubs.map(h => (
              <option key={h.hubId} value={h.hubId}>{h.hubName}</option>
            ))}
          </select>

          {/* Partner Filter */}
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            aria-label="Filter Bookings by Partner"
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Partners</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Filter Bookings by Service"
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Services</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>

          {/* Booking Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter Bookings by Status"
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Lifecycle Statuses</option>
            <option value="CREATED">Created (Unassigned)</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="ON_THE_WAY">On the Way</option>
            <option value="ARRIVED">Arrived</option>
            <option value="STARTED">Started (In Progress)</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            aria-label="Filter Bookings by Payment Status"
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          />

          {(hubFilter !== 'ALL' || partnerFilter !== 'ALL' || serviceFilter !== 'ALL' || statusFilter !== 'ALL' || paymentFilter !== 'ALL' || dateFilter) && (
            <button
              onClick={() => {
                setHubFilter('ALL');
                setPartnerFilter('ALL');
                setServiceFilter('ALL');
                setStatusFilter('ALL');
                setPaymentFilter('ALL');
                setDateFilter('');
              }}
              className="text-xs text-cyan-400 hover:underline px-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Service & Variant</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Territory Hub</th>
                <th className="py-3 px-4">Assigned Partner</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Price / Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No bookings found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-medium text-cyan-400">{b.id}</div>
                      {b.serviceChangePending && (
                        <span className="text-[9px] text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20 font-bold block mt-1">
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
                      <div className="text-[11px] text-slate-400 font-mono">Pin: {b.address.pincode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-200 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{b.hubName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {b.partnerName ? (
                        <div>
                          <div className="font-medium text-white">{b.partnerName}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">Assigned</div>
                        </div>
                      ) : (
                        <span className="text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded text-[10px] font-semibold border border-amber-500/20">
                          Needs Partner
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{b.date}</div>
                      <div className="text-[11px] text-slate-400">{b.timeSlot}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">₹{b.totalAmount}</div>
                      <div className="text-[10px] text-slate-400">{b.paymentStatus} • {b.paymentMethod}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.bookingStatus === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                        b.bookingStatus === 'STARTED' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 animate-pulse' :
                        b.bookingStatus === 'CANCELLED' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                        'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
                        >
                          Details
                        </button>

                        {hasRole(['OPERATIONS_ADMIN']) && (
                          <>
                            <button
                              onClick={() => { setAssignmentModalBooking(b); setTargetPartnerId(''); setAssignmentError(''); }}
                              title="Assign Partner"
                              className="px-2 py-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/40 rounded-lg text-xs transition"
                            >
                              Dispatch
                            </button>

                            <button
                              onClick={() => {
                                setStatusOverrideModalBooking(b);
                                setOverrideStatus(b.bookingStatus);
                                setOverrideReason('');
                              }}
                              title="Lifecycle Progress"
                              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
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

      {/* 8. ADMIN BOOKING DETAILS MODAL */}
      {activeBookingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Booking #{activeBookingRecord.id}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeBookingRecord.bookingStatus === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-300' :
                    activeBookingRecord.bookingStatus === 'CANCELLED' ? 'bg-rose-500/15 text-rose-300' :
                    'bg-amber-500/15 text-amber-300'
                  }`}>
                    {activeBookingRecord.bookingStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed on {new Date(activeBookingRecord.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer and Territory Hub */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Customer Information
                  </h4>
                  <div className="font-semibold text-white text-sm">{activeBookingRecord.customerName}</div>
                  <div className="text-slate-300">{activeBookingRecord.customerPhone}</div>
                  <div className="text-slate-400 mt-1">ID: <span className="font-mono text-cyan-400">{activeBookingRecord.customerId}</span></div>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Serving Territory Hub
                  </h4>
                  <div className="font-semibold text-white text-sm">{activeBookingRecord.hubName || 'Direct Unassigned'}</div>
                  <div className="text-slate-400">Hub ID: <span className="font-mono text-cyan-400">{activeBookingRecord.hubId || 'N/A'}</span></div>
                  <div className="text-slate-300 mt-1 font-mono">Service Pincode: {activeBookingRecord.address.pincode}</div>
                </div>
              </div>

              {/* Service & Schedule */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" /> Service & Variant
                  </h4>
                  <div className="font-semibold text-white">{activeBookingRecord.serviceTitle}</div>
                  <div className="text-cyan-300">{activeBookingRecord.packageName}</div>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Service Slot
                  </h4>
                  <div className="font-semibold text-white">{activeBookingRecord.date}</div>
                  <div className="text-slate-400">{activeBookingRecord.timeSlot}</div>
                </div>
              </div>

              {/* Address */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Service Location
                </h4>
                <div className="text-slate-200">
                  {activeBookingRecord.address.street}, {activeBookingRecord.address.city} - <span className="font-mono font-bold text-white">{activeBookingRecord.address.pincode}</span>
                </div>
              </div>

              {/* 3. PRICE SECURITY SNAPSHOT BREAKDOWN */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-400" />
                    Price Snapshot (Immutable)
                  </h4>
                  {activeBookingRecord.priceSnapshot && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      Version: {activeBookingRecord.priceSnapshot.priceVersion}
                    </span>
                  )}
                </div>

                {activeBookingRecord.priceSnapshot ? (
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Base Variant Price ({activeBookingRecord.priceSnapshot.variant})</span>
                      <span className="font-bold text-white">₹{activeBookingRecord.priceSnapshot.basePrice}</span>
                    </div>

                    {(activeBookingRecord.priceSnapshot.addOns && activeBookingRecord.priceSnapshot.addOns.length > 0) && (
                      <div className="pl-2 border-l border-slate-800 space-y-1">
                        {activeBookingRecord.priceSnapshot.addOns.map((add, idx) => (
                          <div key={idx} className="flex justify-between text-slate-400 text-[11px]">
                            <span>+ {add.name}</span>
                            <span>₹{add.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between text-slate-300">
                      <span>Add-ons Subtotal</span>
                      <span>₹{activeBookingRecord.priceSnapshot.addOnPrice}</span>
                    </div>

                    {activeBookingRecord.priceSnapshot.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount Voucher</span>
                        <span>-₹{activeBookingRecord.priceSnapshot.discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-slate-800">
                      <span>Final Charged Amount</span>
                      <span className="text-emerald-400">₹{activeBookingRecord.priceSnapshot.totalAmount}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1">
                      Snapshot captured on: {new Date(activeBookingRecord.priceSnapshot.timestamp).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between font-bold text-white text-sm">
                    <span>Total Amount Charged:</span>
                    <span className="text-emerald-400">₹{activeBookingRecord.totalAmount}</span>
                  </div>
                )}
              </div>

              {/* Payment & Refund Status */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Payment Status
                  </h4>
                  <div className="font-semibold text-white">{activeBookingRecord.paymentStatus} via {activeBookingRecord.paymentMethod}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">TXN: {activeBookingRecord.transactionId || 'None'}</div>
                </div>

                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" /> Refund Status
                  </h4>
                  <div className="font-semibold text-white">{activeBookingRecord.refundStatus || 'NONE'}</div>
                  {activeBookingRecord.refundAmount && (
                    <div className="text-[11px] text-rose-400 mt-0.5">₹{activeBookingRecord.refundAmount} refunded</div>
                  )}
                </div>
              </div>

              {/* Assigned Partner */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5 text-cyan-400" /> Assigned Partner
                </h4>
                {activeBookingRecord.partnerName ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{activeBookingRecord.partnerName}</div>
                      <div className="text-slate-400">{activeBookingRecord.partnerPhone} • Partner ID: {activeBookingRecord.partnerId}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-400 font-semibold block">Partner Payout</span>
                      <span className="font-bold text-white text-sm">₹{activeBookingRecord.partnerPayoutAmount}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-amber-400">
                    No partner currently assigned. Click "Dispatch" in the table to assign an eligible partner from Hub {activeBookingRecord.hubName}.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. HUB-BASED JOB ROUTING: PARTNER ASSIGNMENT MODAL */}
      {assignmentModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  Dispatch Partner: #{assignmentModalBooking.id}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Territory Hub: <strong className="text-cyan-300">{assignmentModalBooking.hubName}</strong> (Pincode: {assignmentModalBooking.address.pincode})
                </p>
              </div>
              <button onClick={() => setAssignmentModalBooking(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {assignmentError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{assignmentError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                <strong>Hub-Based Routing Rule:</strong> Only active partners assigned to <strong>{assignmentModalBooking.hubName}</strong> can receive this job.
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 block font-medium">Select Eligible Partner</label>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {partners.map(partner => {
                    const isEligible = isPartnerEligibleForBooking(partner.id, assignmentModalBooking.hubId);
                    const isSelected = targetPartnerId === partner.id;

                    return (
                      <div
                        key={partner.id}
                        onClick={() => {
                          if (isEligible) {
                            setTargetPartnerId(partner.id);
                            setAssignmentError('');
                          }
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          !isEligible ? 'bg-slate-950/50 border-slate-900 opacity-40 cursor-not-allowed' :
                          isSelected ? 'bg-cyan-500/15 border-cyan-500 text-white' :
                          'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <span>{partner.fullName}</span>
                            <span className="text-[10px] text-amber-400">★ {partner.rating}</span>
                            {!isEligible && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800">
                                Ineligible Hub
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            City: {partner.city} • {partner.phoneNumber}
                          </div>
                        </div>

                        <div className="text-right">
                          {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                          {!isSelected && isEligible && (
                            <span className="text-[10px] text-cyan-400">Select</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAssignmentModalBooking(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!targetPartnerId}
                onClick={handleConfirmAssignment}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIFECYCLE PROGRESSION MODAL */}
      {statusOverrideModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-cyan-400" />
              Advance Booking Lifecycle: #{statusOverrideModalBooking.id}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Lifecycle Stage</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="ON_THE_WAY">ON THE WAY</option>
                  <option value="ARRIVED">ARRIVED</option>
                  <option value="STARTED">STARTED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Operations Notes</label>
                <textarea
                  rows={2}
                  placeholder="Reason for override or update..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setStatusOverrideModalBooking(null)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusOverride}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
