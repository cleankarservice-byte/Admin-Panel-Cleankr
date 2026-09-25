import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Download, 
  IndianRupee, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const ReportsView: React.FC = () => {
  const { bookings, customers, partners } = useData();

  const totalGMV = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.totalAmount : 0), 0);
  const totalPartnerPayouts = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.partnerPayoutAmount : 0), 0);
  const totalMargin = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.companyCommissionAmount : 0), 0);

  // Group by City
  const cityMetrics: Record<string, { count: number; volume: number }> = {};
  bookings.forEach(b => {
    const city = b.address.city.split(',')[0].trim();
    if (!cityMetrics[city]) {
      cityMetrics[city] = { count: 0, volume: 0 };
    }
    cityMetrics[city].count += 1;
    cityMetrics[city].volume += b.totalAmount;
  });

  // Group by Service
  const serviceMetrics: Record<string, { count: number; volume: number }> = {};
  bookings.forEach(b => {
    if (!serviceMetrics[b.serviceTitle]) {
      serviceMetrics[b.serviceTitle] = { count: 0, volume: 0 };
    }
    serviceMetrics[b.serviceTitle].count += 1;
    serviceMetrics[b.serviceTitle].volume += b.totalAmount;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Executive Reports & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated metrics for marketplace health, geographical demand, and cohort retention
          </p>
        </div>
      </div>

      {/* High level metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Total Market Volume (GMV)</span>
          <span className="text-2xl font-bold text-white">₹{totalGMV.toLocaleString('en-IN')}</span>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> High completion rate
          </div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Total Partner Share Disbursed</span>
          <span className="text-2xl font-bold text-emerald-400">₹{totalPartnerPayouts.toLocaleString('en-IN')}</span>
          <div className="text-[11px] text-slate-400 mt-1">Average 72.4% partner take-home</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block mb-1">Cleankr Net Commission</span>
          <span className="text-2xl font-bold text-cyan-400">₹{totalMargin.toLocaleString('en-IN')}</span>
          <div className="text-[11px] text-slate-400 mt-1">Sustaining operations & guarantee</div>
        </div>
      </div>

      {/* Grid of Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Geographic Demand by City
          </h3>
          <div className="space-y-3">
            {Object.entries(cityMetrics).map(([city, data]) => {
              const pct = Math.round((data.volume / (totalGMV || 1)) * 100);
              return (
                <div key={city} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium text-white">{city} ({data.count} jobs)</span>
                    <span className="font-bold">₹{data.volume.toLocaleString('en-IN')} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category & Service Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Service Category Contribution
          </h3>
          <div className="space-y-3">
            {Object.entries(serviceMetrics).map(([srv, data]) => {
              const pct = Math.round((data.volume / (totalGMV || 1)) * 100);
              return (
                <div key={srv} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-medium text-white">{srv} ({data.count} bookings)</span>
                    <span className="font-bold">₹{data.volume.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
