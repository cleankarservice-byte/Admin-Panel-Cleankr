import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  AlertTriangle,
  Building2,
  CreditCard,
  RotateCcw,
  Bell,
  Star,
  UserX,
  UserCheck,
  Send,
  FileText
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Customer, Booking, CustomerReview, CustomerNotification } from '../types/cleankr';

type DetailTab = 
  | 'profile' 
  | 'addresses' 
  | 'hub' 
  | 'bookings' 
  | 'payments' 
  | 'refunds' 
  | 'notifications' 
  | 'reviews' 
  | 'account_status';

export const CustomersView: React.FC = () => {
  const { 
    customers, 
    bookings, 
    refunds, 
    hubs, 
    updateCustomerStatus, 
    updateCustomerDeletionStatus, 
    sendCustomerNotification,
    findActiveHubForPincode
  } = useData();
  const { hasRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('profile');

  // Customer Notification Sender State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [notifChannel, setNotifChannel] = useState<'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP'>('PUSH_FCM');
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Deletion Review Notes State
  const [deletionNotes, setDeletionNotes] = useState('');

  // Booking Filter inside Customer Dossier
  const [bookingFilter, setBookingFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getCustomerBookings = (customerId: string) => {
    return bookings.filter(b => b.customerId === customerId);
  };

  const getCustomerRefunds = (customerId: string) => {
    return refunds.filter(r => r.customerId === customerId);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !notifTitle || !notifBody) return;
    setIsSendingNotif(true);
    await sendCustomerNotification(selectedCustomer.id, notifTitle, notifBody, notifChannel);
    setIsSendingNotif(false);
    setNotifSuccess(true);
    setNotifTitle('');
    setNotifBody('');
    setTimeout(() => setNotifSuccess(false), 3000);
  };

  const activeCustomerRecord = selectedCustomer 
    ? (customers.find(c => c.id === selectedCustomer.id) || selectedCustomer)
    : null;

  // Primary Address and Serving Hub calculation
  const primaryAddress = activeCustomerRecord?.addresses?.[0];
  const detectedHub = primaryAddress 
    ? findActiveHubForPincode(primaryAddress.pincode) 
    : (hubs.find(h => h.hubId === activeCustomerRecord?.servingHubId) || null);

  const customerBookings = activeCustomerRecord ? getCustomerBookings(activeCustomerRecord.id) : [];
  const filteredCustomerBookings = customerBookings.filter(b => {
    if (bookingFilter === 'ALL') return true;
    if (bookingFilter === 'UPCOMING') return ['CREATED', 'ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.bookingStatus);
    if (bookingFilter === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
    if (bookingFilter === 'CANCELLED') return b.bookingStatus === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Customer Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative registry of end-customers, profiles, active territory hubs, lifetime bookings & compliance controls
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-72"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter Customers by Status"
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="SUSPENDED">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name & Contact</th>
                <th className="py-3 px-4">Serving Hub</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Total Bookings</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No customer records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const hub = customer.servingHubName || (customer.addresses?.[0] ? findActiveHubForPincode(customer.addresses[0].pincode)?.hubName : 'Unassigned Hub');
                  const hasDeletion = customer.deletionRequest && customer.deletionRequest.status === 'PENDING_REVIEW';

                  return (
                    <tr key={customer.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-medium text-cyan-400">
                        {customer.id}
                        {hasDeletion && (
                          <span className="block text-[9px] font-bold text-rose-400 mt-0.5">
                            Deletion Req
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{customer.fullName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phoneNumber}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{hub}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          customer.status === 'ACTIVE' 
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          {customer.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {customer.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">{customer.totalBookings} bookings</td>
                      <td className="py-3 px-4 font-bold text-white">₹{customer.totalSpent.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-bold">
                          ★ {customer.rating || 5.0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setSelectedCustomer(customer); setDetailTab('profile'); }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            Details
                          </button>
                          {hasRole(['OPERATIONS_ADMIN']) && (
                            <button
                              onClick={() => updateCustomerStatus(
                                customer.id, 
                                customer.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                              )}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                                customer.status === 'ACTIVE'
                                  ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              }`}
                            >
                              {customer.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                            </button>
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

      {/* 1. CUSTOMER DETAIL PAGE MODAL / DOSSIER */}
      {activeCustomerRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{activeCustomerRecord.fullName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-cyan-400">
                    {activeCustomerRecord.id}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeCustomerRecord.status === 'ACTIVE' 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}>
                    {activeCustomerRecord.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Registered {new Date(activeCustomerRecord.createdAt).toLocaleDateString()} • Cleankr Customer App
                </p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs (Profile → Addresses → Hub → Bookings → Payments → Refunds → Notifications → Reviews → Account Status) */}
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-800 pb-2">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'addresses', label: 'Addresses' },
                { id: 'hub', label: 'Hub' },
                { id: 'bookings', label: `Bookings (${customerBookings.length})` },
                { id: 'payments', label: 'Payments' },
                { id: 'refunds', label: `Refunds (${getCustomerRefunds(activeCustomerRecord.id).length})` },
                { id: 'notifications', label: `Notifications (${activeCustomerRecord.notifications?.length || 0})` },
                { id: 'reviews', label: `Reviews (${activeCustomerRecord.reviews?.length || 0})` },
                { id: 'account_status', label: 'Account Status' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id as DetailTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    detailTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}

            {/* 1. PROFILE TAB */}
            {detailTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[11px] text-slate-400 block mb-1">Lifetime Spend</span>
                    <span className="text-xl font-bold text-emerald-400">₹{activeCustomerRecord.totalSpent.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[11px] text-slate-400 block mb-1">Total Orders</span>
                    <span className="text-xl font-bold text-white">{activeCustomerRecord.totalBookings} orders</span>
                  </div>
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <span className="text-[11px] text-slate-400 block mb-1">Customer Rating</span>
                    <span className="text-xl font-bold text-amber-400">★ {activeCustomerRecord.rating || 5.0}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">Identity & Verification</h4>
                  <div className="grid grid-cols-2 gap-3 text-slate-300">
                    <div><span className="text-slate-500">Full Name:</span> {activeCustomerRecord.fullName}</div>
                    <div><span className="text-slate-500">Phone:</span> {activeCustomerRecord.phoneNumber}</div>
                    <div><span className="text-slate-500">Email:</span> {activeCustomerRecord.email}</div>
                    <div><span className="text-slate-500">Firebase Auth UID:</span> <span className="font-mono text-cyan-400">{activeCustomerRecord.uid || activeCustomerRecord.id}</span></div>
                    <div><span className="text-slate-500">Serving Hub:</span> {detectedHub?.hubName || 'Unassigned'}</div>
                    <div><span className="text-slate-500">Security Clearance:</span> Verified Standard Client</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ADDRESSES TAB */}
            {detailTab === 'addresses' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Saved Delivery Addresses
                </h4>
                {(!activeCustomerRecord.addresses || activeCustomerRecord.addresses.length === 0) ? (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-500">
                    No addresses recorded for this customer yet.
                  </div>
                ) : (
                  activeCustomerRecord.addresses.map(addr => {
                    const matchedHub = findActiveHubForPincode(addr.pincode);
                    return (
                      <div key={addr.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{addr.label}</span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300">
                              Pincode: {addr.pincode}
                            </span>
                          </div>
                          <div className="text-slate-400 mt-1">
                            {addr.flat}, {addr.street}, {addr.city} {addr.landmark ? `(Landmark: ${addr.landmark})` : ''}
                          </div>
                        </div>

                        <div className="text-right">
                          {matchedHub ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle className="w-3 h-3" />
                              Serviced by {matchedHub.hubName}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                              <XCircle className="w-3 h-3" />
                              Outside Active Hub Coverage
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 3. HUB TAB */}
            {detailTab === 'hub' && (
              <div className="space-y-4 text-xs">
                {detectedHub ? (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-cyan-400" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{detectedHub.hubName}</h4>
                          <span className="text-[11px] text-slate-400">{detectedHub.city}, {detectedHub.state}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        detectedHub.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                      }`}>
                        {detectedHub.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-900 text-slate-300">
                      <div><span className="text-slate-500">Hub ID:</span> <span className="font-mono text-cyan-400">{detectedHub.hubId}</span></div>
                      <div><span className="text-slate-500">Primary Pincode:</span> {primaryAddress?.pincode} (Matched)</div>
                      <div><span className="text-slate-500">Assigned Service Pros:</span> {detectedHub.assignedPartnerIds?.length || 0} active partners</div>
                      <div><span className="text-slate-500">Territory Status:</span> Open for Bookings</div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[11px] text-slate-400 block mb-1">Covered Service Areas in this Hub:</span>
                      <div className="flex flex-wrap gap-1">
                        {detectedHub.serviceAreas.map((area, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2">
                    <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                    <div className="font-semibold text-white">No Active Hub Configured for Customer Address</div>
                    <p className="text-slate-400 max-w-md mx-auto text-[11px]">
                      Customer's primary pincode is not served by any currently ACTIVE hub. New bookings will display "Cleankr service is currently unavailable in your area."
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 4. BOOKINGS TAB */}
            {detailTab === 'bookings' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setBookingFilter(f)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                          bookingFilter === f ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <span className="text-slate-400 text-[11px]">Showing {filteredCustomerBookings.length} orders</span>
                </div>

                <div className="space-y-2">
                  {filteredCustomerBookings.length === 0 ? (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 text-center">
                      No bookings found for the selected filter.
                    </div>
                  ) : (
                    filteredCustomerBookings.map(b => (
                      <div key={b.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-white text-sm">{b.serviceTitle}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              ID: <span className="font-mono text-cyan-400">{b.id}</span> • {b.date} ({b.timeSlot})
                            </div>
                            <div className="text-[11px] text-slate-300 mt-0.5">
                              Variant: <span className="text-white font-medium">{b.packageName}</span> • Hub: {b.hubName || 'Direct'}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Partner: <span className="text-cyan-300">{b.partnerName || 'Pending Assignment'}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-bold text-white">₹{b.totalAmount}</div>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.bookingStatus === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-300' :
                              b.bookingStatus === 'CANCELLED' ? 'bg-rose-500/15 text-rose-300' :
                              'bg-amber-500/15 text-amber-300'
                            }`}>
                              {b.bookingStatus}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-1">Payment: {b.paymentStatus}</div>
                          </div>
                        </div>

                        {/* Price Snapshot details if present */}
                        {b.priceSnapshot && (
                          <div className="pt-2 border-t border-slate-900/80 text-[10px] text-slate-400 flex flex-wrap items-center gap-3">
                            <span className="font-mono text-cyan-400">Price Snapshot ({b.priceSnapshot.priceVersion})</span>
                            <span>Base: ₹{b.priceSnapshot.basePrice}</span>
                            <span>Add-ons: ₹{b.priceSnapshot.addOnPrice}</span>
                            <span>Discount: ₹{b.priceSnapshot.discount}</span>
                            <span>Total: ₹{b.priceSnapshot.totalAmount}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 5. PAYMENTS TAB */}
            {detailTab === 'payments' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  Payment Transactions
                </h4>
                <div className="space-y-2">
                  {customerBookings.map(b => (
                    <div key={b.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{b.serviceTitle}</div>
                        <div className="text-[11px] text-slate-400">
                          Ref: <span className="font-mono text-cyan-400">{b.transactionId || 'TXN_LOCAL'}</span> • Method: {b.paymentMethod}
                        </div>
                        <div className="text-[10px] text-slate-500">{new Date(b.createdAt).toLocaleString()}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-white text-sm">₹{b.totalAmount}</div>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                          b.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {b.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. REFUNDS TAB */}
            {detailTab === 'refunds' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  Refund History & Claims
                </h4>
                {getCustomerRefunds(activeCustomerRecord.id).length === 0 ? (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-500">
                    No refunds or chargeback requests recorded for this customer.
                  </div>
                ) : (
                  getCustomerRefunds(activeCustomerRecord.id).map(ref => (
                    <div key={ref.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span className="font-mono text-cyan-400">{ref.id}</span>
                          <span className="text-slate-400">for Booking {ref.bookingId}</span>
                        </div>
                        <p className="text-slate-300 mt-1 text-[11px]">{ref.reason}</p>
                        {ref.transactionRef && (
                          <div className="text-[10px] font-mono text-emerald-400 mt-1">
                            Settlement Ref: {ref.transactionRef}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-rose-400">₹{ref.amount}</div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ref.status === 'PROCESSED' ? 'bg-emerald-500/15 text-emerald-300' :
                          ref.status === 'REJECTED' ? 'bg-rose-500/15 text-rose-300' :
                          'bg-amber-500/15 text-amber-300'
                        }`}>
                          {ref.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 7. NOTIFICATIONS TAB */}
            {detailTab === 'notifications' && (
              <div className="space-y-4 text-xs">
                {/* Send Direct Notification Form */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="font-semibold text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    Send Push / SMS Notification to {activeCustomerRecord.fullName}
                  </h4>

                  {notifSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                      Notification successfully dispatched to customer terminal!
                    </div>
                  )}

                  <form onSubmit={handleSendNotification} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cleankr Special Offer"
                          value={notifTitle}
                          onChange={(e) => setNotifTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Channel</label>
                        <select
                          value={notifChannel}
                          onChange={(e) => setNotifChannel(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="PUSH_FCM">Firebase Cloud Messaging (FCM Push)</option>
                          <option value="IN_APP">In-App Notification Feed</option>
                          <option value="SMS_PRIORITY">SMS Priority Dispatch</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Message Body</label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Type message content..."
                        value={notifBody}
                        onChange={(e) => setNotifBody(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSendingNotif}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition"
                      >
                        {isSendingNotif ? 'Dispatching...' : 'Send to Customer'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Notification Feed */}
                <div>
                  <h4 className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                    Sent Notification History ({activeCustomerRecord.notifications?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {(!activeCustomerRecord.notifications || activeCustomerRecord.notifications.length === 0) ? (
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500">
                        No notifications have been dispatched to this customer yet.
                      </div>
                    ) : (
                      activeCustomerRecord.notifications.map(notif => (
                        <div key={notif.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-white">{notif.title}</div>
                            <p className="text-slate-300 mt-0.5">{notif.body}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {new Date(notif.date).toLocaleString()} • {notif.channel}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">DELIVERED</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 8. REVIEWS TAB */}
            {detailTab === 'reviews' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-semibold text-slate-300 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  Customer Feedback & Ratings
                </h4>
                {(!activeCustomerRecord.reviews || activeCustomerRecord.reviews.length === 0) ? (
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-500">
                    No verified reviews left by this customer yet.
                  </div>
                ) : (
                  activeCustomerRecord.reviews.map(rev => (
                    <div key={rev.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{rev.serviceTitle || 'Service Review'}</span>
                        <span className="text-amber-400 font-bold">★ {rev.rating} / 5</span>
                      </div>
                      <p className="text-slate-300 italic">"{rev.comment}"</p>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-1">
                        <span>Partner: {rev.partnerName || 'Assigned Pro'}</span>
                        <span>•</span>
                        <span>{new Date(rev.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 9. ACCOUNT STATUS & COMPLIANCE CONTROLS TAB */}
            {detailTab === 'account_status' && (
              <div className="space-y-4 text-xs">
                {/* Account Suspension / Activation */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Account Status: {activeCustomerRecord.status}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Suspended accounts are blocked from creating new bookings in Customer App.
                      </p>
                    </div>

                    <button
                      onClick={() => updateCustomerStatus(
                        activeCustomerRecord.id,
                        activeCustomerRecord.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                      )}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                        activeCustomerRecord.status === 'ACTIVE'
                          ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {activeCustomerRecord.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                    </button>
                  </div>
                </div>

                {/* 10. CUSTOMER ACCOUNT DELETION WORKFLOW */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-white text-sm">Account Erasure / Deletion Request</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activeCustomerRecord.deletionRequest?.status === 'PENDING_REVIEW' ? 'bg-amber-500/15 text-amber-300 animate-pulse' :
                      activeCustomerRecord.deletionRequest?.status === 'PROCESSED' ? 'bg-rose-500/15 text-rose-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {activeCustomerRecord.deletionRequest?.status || 'NO_REQUEST'}
                    </span>
                  </div>

                  {activeCustomerRecord.deletionRequest?.status === 'PENDING_REVIEW' ? (
                    <div className="space-y-3 pt-2">
                      <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-200 text-[11px]">
                        <strong>Customer Reason:</strong> {activeCustomerRecord.deletionRequest.reason || 'Requested account closure.'}
                      </div>

                      <p className="text-[11px] text-slate-400">
                        <strong>Compliance Notice:</strong> Processing deletion anonymizes PII from the customer profile. In accordance with Cleankr Financial & Tax Audit retention requirements, completed booking invoices and financial transaction logs are permanently retained.
                      </p>

                      <div className="flex items-center gap-2 justify-end pt-2">
                        <button
                          onClick={() => updateCustomerDeletionStatus(activeCustomerRecord.id, 'REJECTED', 'Retained per customer service resolution')}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                        >
                          Reject Request
                        </button>
                        <button
                          onClick={() => updateCustomerDeletionStatus(activeCustomerRecord.id, 'PROCESSED', 'Anonymized; legal tax records retained')}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold"
                        >
                          Process & Suspend Account
                        </button>
                      </div>
                    </div>
                  ) : activeCustomerRecord.deletionRequest?.status === 'PROCESSED' ? (
                    <p className="text-slate-400 text-[11px]">
                      Account has been processed for anonymization. Operational & financial records remain secured for audit.
                    </p>
                  ) : (
                    <p className="text-slate-400 text-[11px]">
                      No active deletion or erasure request pending for this account.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
