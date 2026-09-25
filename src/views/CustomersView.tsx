import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
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
  AlertTriangle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Customer } from '../types/cleankr';

export const CustomersView: React.FC = () => {
  const { customers, bookings, updateCustomerStatus } = useData();
  const { hasRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
            Authoritative registry of end-customers registered through the Cleankr Customer App
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
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
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Bookings</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No customer records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-medium text-cyan-400">{customer.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{customer.fullName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phoneNumber}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>
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
                    <td className="py-3 px-4 font-medium text-slate-200">{customer.totalBookings} orders</td>
                    <td className="py-3 px-4 font-bold text-white">₹{customer.totalSpent.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 font-bold">
                        ★ {customer.rating || 5.0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          View Dossier
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Dossier Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedCustomer.fullName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-cyan-400">
                    {selectedCustomer.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Member since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">Total Orders</span>
                <span className="text-base font-bold text-white">{selectedCustomer.totalBookings}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">Total Spent</span>
                <span className="text-base font-bold text-emerald-400">₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block">Account Status</span>
                <span className={`text-xs font-bold ${selectedCustomer.status === 'ACTIVE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            {/* Addresses */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Saved Service Addresses
              </h4>
              <div className="space-y-2">
                {selectedCustomer.addresses?.map(addr => (
                  <div key={addr.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="font-semibold text-white mb-0.5">{addr.label}</div>
                    <div className="text-slate-400">{addr.flat}, {addr.street}, {addr.city} - {addr.pincode}</div>
                  </div>
                )) || <div className="text-xs text-slate-500">No saved addresses recorded.</div>}
              </div>
            </div>

            {/* Past Bookings */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Booking History in Cleankr
              </h4>
              <div className="space-y-2">
                {getCustomerBookings(selectedCustomer.id).map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{b.serviceTitle}</div>
                      <div className="text-[11px] text-slate-400">{b.date} • {b.packageName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">₹{b.totalAmount}</div>
                      <span className="text-[10px] text-emerald-400 font-semibold">{b.bookingStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCustomer(null)}
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
