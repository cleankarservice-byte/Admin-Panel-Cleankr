import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Download, 
  IndianRupee, 
  Layers,
  ArrowUpRight,
  Building2,
  Users,
  UserCheck,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const ReportsView: React.FC = () => {
  const { bookings, customers, partners, hubs, refunds, services } = useData();

  // Filters
  const [customerFilter, setCustomerFilter] = useState('ALL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [hubFilter, setHubFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Active Report Tab
  const [reportTab, setReportTab] = useState<'overview' | 'hub_performance' | 'service_performance' | 'partner_performance'>('overview');

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesCustomer = customerFilter === 'ALL' || b.customerId === customerFilter;
    const matchesPartner = partnerFilter === 'ALL' || b.partnerId === partnerFilter;
    const matchesHub = hubFilter === 'ALL' || b.hubId === hubFilter;
    const matchesService = serviceFilter === 'ALL' || b.serviceId === serviceFilter;
    const matchesStart = !startDate || b.date >= startDate;
    const matchesEnd = !endDate || b.date <= endDate;
    return matchesCustomer && matchesPartner && matchesHub && matchesService && matchesStart && matchesEnd;
  });

  // Aggregated KPIs
  const totalBookingsCount = filteredBookings.length;
  const completedJobsCount = filteredBookings.filter(b => b.bookingStatus === 'COMPLETED').length;
  const cancelledJobsCount = filteredBookings.filter(b => b.bookingStatus === 'CANCELLED').length;
  const inProgressJobsCount = filteredBookings.filter(b => ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.bookingStatus)).length;

  const totalGMV = filteredBookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.totalAmount : 0), 0);
  const totalPartnerPayouts = filteredBookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.partnerPayoutAmount : 0), 0);
  const totalMargin = filteredBookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.companyCommissionAmount : 0), 0);
  
  const totalRefundsAmount = refunds
    .filter(r => r.status === 'PROCESSED')
    .reduce((sum, r) => sum + r.amount, 0);

  // Hub-wise Performance Aggregation
  const hubPerformance = hubs.map(hub => {
    const hubBookings = filteredBookings.filter(b => b.hubId === hub.hubId);
    const completed = hubBookings.filter(b => b.bookingStatus === 'COMPLETED').length;
    const cancelled = hubBookings.filter(b => b.bookingStatus === 'CANCELLED').length;
    const revenue = hubBookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.totalAmount : 0), 0);
    const assignedPros = (hub.assignedPartnerIds || []).length;

    return {
      hubId: hub.hubId,
      hubName: hub.hubName,
      city: hub.city,
      status: hub.status,
      totalJobs: hubBookings.length,
      completed,
      cancelled,
      revenue,
      assignedPros
    };
  });

  // Service-wise Performance Aggregation
  const servicePerformance = services.map(service => {
    const srvBookings = filteredBookings.filter(b => b.serviceId === service.id);
    const completed = srvBookings.filter(b => b.bookingStatus === 'COMPLETED').length;
    const cancelled = srvBookings.filter(b => b.bookingStatus === 'CANCELLED').length;
    const revenue = srvBookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.totalAmount : 0), 0);

    return {
      serviceId: service.id,
      title: service.title,
      category: service.category,
      totalOrders: srvBookings.length,
      completed,
      cancelled,
      revenue
    };
  });

  // Partner-wise Performance Aggregation
  const partnerPerformance = partners.map(partner => {
    const partBookings = filteredBookings.filter(b => b.partnerId === partner.id);
    const completed = partBookings.filter(b => b.bookingStatus === 'COMPLETED').length;
    const earnings = partBookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.partnerPayoutAmount : 0), 0);
    const primaryHub = hubs.find(h => h.hubId === partner.primaryHubId);

    return {
      partnerId: partner.id,
      fullName: partner.fullName,
      status: partner.status,
      rating: partner.rating,
      primaryHubName: primaryHub?.hubName || 'Unassigned',
      totalJobs: partBookings.length,
      completed,
      earnings
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Executive Reports & Territorial Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multidimensional analytics across Customers, Partners, Hub territories & Service lines
          </p>
        </div>
      </div>

      {/* 12. FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Customer */}
          <div>
            <label className="text-slate-400 block mb-1 text-[11px]">Customer</label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Customers</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.fullName}</option>
              ))}
            </select>
          </div>

          {/* Partner */}
          <div>
            <label className="text-slate-400 block mb-1 text-[11px]">Partner</label>
            <select
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Partners</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
          </div>

          {/* Hub */}
          <div>
            <label className="text-slate-400 block mb-1 text-[11px]">Territory Hub</label>
            <select
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Hubs</option>
              {hubs.map(h => (
                <option key={h.hubId} value={h.hubId}>{h.hubName}</option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="text-slate-400 block mb-1 text-[11px]">Service</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Date Start */}
          <div>
            <label className="text-slate-400 block mb-1 text-[11px]">Date From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Date End */}
          <div>
            <label className="text-slate-400 block mb-1 text-[11px]">Date To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {(customerFilter !== 'ALL' || partnerFilter !== 'ALL' || hubFilter !== 'ALL' || serviceFilter !== 'ALL' || startDate || endDate) && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                setCustomerFilter('ALL');
                setPartnerFilter('ALL');
                setHubFilter('ALL');
                setServiceFilter('ALL');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-cyan-400 hover:underline"
            >
              Clear Filter Selections
            </button>
          </div>
        )}
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Total Bookings</span>
          <span className="text-2xl font-bold text-white">{totalBookingsCount}</span>
          <div className="text-[10px] text-slate-400 mt-1">Filtered timeframe</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Completed Jobs</span>
          <span className="text-2xl font-bold text-emerald-400">{completedJobsCount}</span>
          <div className="text-[10px] text-slate-400 mt-1">{cancelledJobsCount} cancelled</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Gross Revenue (GMV)</span>
          <span className="text-2xl font-bold text-white">₹{totalGMV.toLocaleString('en-IN')}</span>
          <div className="text-[10px] text-emerald-400 mt-1">Verified receipts</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Partner Payouts</span>
          <span className="text-2xl font-bold text-cyan-400">₹{totalPartnerPayouts.toLocaleString('en-IN')}</span>
          <div className="text-[10px] text-slate-400 mt-1">Disbursed take-home</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Total Refunds</span>
          <span className="text-2xl font-bold text-rose-400">₹{totalRefundsAmount.toLocaleString('en-IN')}</span>
          <div className="text-[10px] text-slate-400 mt-1">Settled disputes</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2">
        <button
          onClick={() => setReportTab('overview')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            reportTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          High-Level Summary
        </button>
        <button
          onClick={() => setReportTab('hub_performance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            reportTab === 'hub_performance' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          Hub-Wise Performance
        </button>
        <button
          onClick={() => setReportTab('service_performance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            reportTab === 'service_performance' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          Service-Wise Performance
        </button>
        <button
          onClick={() => setReportTab('partner_performance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            reportTab === 'partner_performance' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
          }`}
        >
          Partner-Wise Performance
        </button>
      </div>

      {/* REPORT CONTENT PANELS */}

      {/* 1. OVERVIEW */}
      {reportTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Volume by Territory Hub
            </h3>
            <div className="space-y-3">
              {hubPerformance.map(item => {
                const pct = Math.round((item.revenue / (totalGMV || 1)) * 100);
                return (
                  <div key={item.hubId} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-medium text-white">{item.hubName} ({item.totalJobs} jobs)</span>
                      <span className="font-bold">₹{item.revenue.toLocaleString('en-IN')} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Service Demand Breakdown
            </h3>
            <div className="space-y-3">
              {servicePerformance.filter(s => s.totalOrders > 0).map(item => {
                const pct = Math.round((item.revenue / (totalGMV || 1)) * 100);
                return (
                  <div key={item.serviceId} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="font-medium text-white">{item.title}</span>
                      <span className="font-bold">₹{item.revenue.toLocaleString('en-IN')} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. HUB-WISE PERFORMANCE TABLE */}
      {reportTab === 'hub_performance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4">Hub Territory</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Pros</th>
                  <th className="py-3 px-4">Total Jobs</th>
                  <th className="py-3 px-4">Completed</th>
                  <th className="py-3 px-4">Cancelled</th>
                  <th className="py-3 px-4 text-right">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {hubPerformance.map(h => (
                  <tr key={h.hubId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{h.hubName}</td>
                    <td className="py-3 px-4 text-slate-400">{h.city}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300">{h.assignedPros}</td>
                    <td className="py-3 px-4 font-bold text-white">{h.totalJobs}</td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">{h.completed}</td>
                    <td className="py-3 px-4 text-rose-400 font-medium">{h.cancelled}</td>
                    <td className="py-3 px-4 text-right font-bold text-white text-sm">₹{h.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SERVICE-WISE PERFORMANCE TABLE */}
      {reportTab === 'service_performance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4">Service Line</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Completed</th>
                  <th className="py-3 px-4">Cancelled</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {servicePerformance.map(s => (
                  <tr key={s.serviceId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{s.title}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{s.category}</td>
                    <td className="py-3 px-4 font-bold text-white">{s.totalOrders}</td>
                    <td className="py-3 px-4 text-emerald-400">{s.completed}</td>
                    <td className="py-3 px-4 text-rose-400">{s.cancelled}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 text-sm">₹{s.revenue.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PARTNER-WISE PERFORMANCE TABLE */}
      {reportTab === 'partner_performance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4">Partner Name</th>
                  <th className="py-3 px-4">Primary Hub</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Jobs</th>
                  <th className="py-3 px-4">Completed</th>
                  <th className="py-3 px-4 text-right">Earnings Disbursed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {partnerPerformance.map(p => (
                  <tr key={p.partnerId} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{p.fullName}</td>
                    <td className="py-3 px-4 text-slate-300">{p.primaryHubName}</td>
                    <td className="py-3 px-4 text-amber-400 font-bold">★ {p.rating}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{p.totalJobs}</td>
                    <td className="py-3 px-4 text-emerald-400">{p.completed}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 text-sm">₹{p.earnings.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
