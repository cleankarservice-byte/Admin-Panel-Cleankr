import React, { useState } from 'react';
import { 
  Layers, 
  Tag, 
  Plus, 
  Edit, 
  Check, 
  X, 
  Clock, 
  Percent, 
  IndianRupee, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ServiceItem } from '../types/cleankr';

export const ServicesAndPricingView: React.FC<{ initialMode?: 'catalog' | 'pricing' }> = ({ initialMode = 'catalog' }) => {
  const { services, saveService, toggleServiceActive } = useData();
  const { hasRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'pricing'>(initialMode);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const handleEditPackagePrice = (serviceId: string, pkgId: string, newPrice: number) => {
    const s = services.find(item => item.id === serviceId);
    if (!s) return;
    const updatedPackages = s.packages.map(p => p.id === pkgId ? { ...p, price: newPrice } : p);
    saveService({ ...s, packages: updatedPackages });
  };

  const handleCreateNewService = () => {
    const blank: ServiceItem = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      title: 'New Cleankr Service',
      category: 'Home Cleaning',
      description: 'Comprehensive cleaning service standard.',
      isActive: true,
      availableCities: ['Mumbai', 'Pune', 'Bengaluru'],
      packages: [
        {
          id: `pkg-${Date.now()}-1`,
          name: 'Standard Care Package',
          description: 'Standard 2-room sterilization and scrubbing.',
          durationHours: 3,
          price: 1999,
          partnerSharePercent: 70,
          isActive: true
        }
      ],
      createdAt: new Date().toISOString()
    };
    setEditingService(blank);
  };

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Services & Authoritative Fixed Pricing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centrally governed service tiers and company pricing. Mobile apps cannot override these rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'catalog'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Services Catalog
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'pricing'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Price Matrix
            </button>
          </div>

          {hasRole(['OPERATIONS_ADMIN']) && (
            <button
              onClick={handleCreateNewService}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              New Service
            </button>
          )}
        </div>
      </div>

      {/* Main View Body */}
      {activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <div 
              key={service.id} 
              className={`p-5 rounded-2xl bg-slate-900 border transition ${
                service.isActive ? 'border-slate-800' : 'border-slate-800/50 opacity-65'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 mb-1 inline-block">
                    {service.category}
                  </span>
                  <h3 className="text-base font-bold text-white">{service.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{service.description}</p>
                </div>
                <button
                  onClick={() => toggleServiceActive(service.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                    service.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Package cards within service */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Authoritative Packages ({service.packages.length})
                </span>
                {service.packages.map(pkg => (
                  <div key={pkg.id} className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{pkg.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pkg.durationHours} hrs</span>
                        <span>•</span>
                        <span>Partner: {pkg.partnerSharePercent}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-sm">₹{pkg.price}</div>
                      <div className="text-[10px] text-emerald-400">
                        P: ₹{Math.round(pkg.price * (pkg.partnerSharePercent / 100))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Addons if any */}
              {service.addOns && service.addOns.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Add-ons Available:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.addOns.map(add => (
                      <span key={add.id} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded">
                        {add.name} (+₹{add.price})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Cities: {service.availableCities.join(', ')}</span>
                {hasRole(['OPERATIONS_ADMIN']) && (
                  <button
                    onClick={() => setEditingService(service)}
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Pricing Matrix Table */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <span>Direct Rate Editor: Edits immediately lock authoritative prices across all apps</span>
            </div>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Customer Fixed Price</th>
                <th className="py-3 px-4">Partner Payout (Share %)</th>
                <th className="py-3 px-4">Company Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {services.flatMap(s => s.packages.map(p => {
                const partnerCut = Math.round(p.price * (p.partnerSharePercent / 100));
                const companyCut = p.price - partnerCut;
                return (
                  <tr key={`${s.id}-${p.id}`} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{s.title}</td>
                    <td className="py-3 px-4 text-slate-200">{p.name}</td>
                    <td className="py-3 px-4 text-slate-400">{p.durationHours} Hours</td>
                    <td className="py-3 px-4">
                      {hasRole(['FINANCE_ADMIN', 'OPERATIONS_ADMIN']) ? (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">₹</span>
                          <input
                            type="number"
                            defaultValue={p.price}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val > 0 && val !== p.price) {
                                handleEditPackagePrice(s.id, p.id, val);
                              }
                            }}
                            className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 rounded font-bold text-white text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-white">₹{p.price}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">
                      ₹{partnerCut} ({p.partnerSharePercent}%)
                    </td>
                    <td className="py-3 px-4 text-cyan-400 font-medium">
                      ₹{companyCut} ({100 - p.partnerSharePercent}%)
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      )}

      {/* Service Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService.id ? `Edit ${editingService.title}` : 'Create New Service'}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Available Cities (comma separated)</label>
                  <input
                    type="text"
                    value={editingService.availableCities.join(', ')}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      availableCities: e.target.value.split(',').map(c => c.trim())
                    })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Description</label>
                <textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveService(editingService);
                  setEditingService(null);
                }}
                className="px-4 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition"
              >
                Save & Deploy Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
