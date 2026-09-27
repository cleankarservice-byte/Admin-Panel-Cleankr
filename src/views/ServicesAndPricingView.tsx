import React, { useState } from 'react';
import { 
  Layers, 
  Tag, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  IndianRupee, 
  ShieldAlert, 
  Sparkles, 
  History, 
  ArrowUpDown, 
  Trash2, 
  Save, 
  AlertCircle,
  FileText,
  Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ServiceItem, ServicePackage, ServiceAddOn } from '../types/cleankr';

export const ServicesAndPricingView: React.FC<{ initialMode?: 'catalog' | 'pricing' | 'history' }> = ({ initialMode = 'catalog' }) => {
  const { 
    services, 
    priceAuditLogs, 
    saveService, 
    toggleServiceActive, 
    updateServicePrice 
  } = useData();
  const { hasRole, currentAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'pricing' | 'history'>(initialMode);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing / Creating Service Modal State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Quick Price Change Modal State
  const [priceModalData, setPriceModalData] = useState<{
    serviceId: string;
    serviceTitle: string;
    variantId: string;
    variantName: string;
    currentPrice: number;
    newPrice: number;
    reason: string;
  } | null>(null);

  // Selected Service for History View
  const [historyService, setHistoryService] = useState<ServiceItem | null>(null);

  // Categories
  const categories = ['ALL', 'BATHROOM', 'KITCHEN', 'FLAT', 'OTHER'];

  // Filtered Services sorted by displayOrder
  const filteredServices = services
    .filter(s => {
      const matchesCategory = categoryFilter === 'ALL' || s.category.toUpperCase() === categoryFilter;
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const handleCreateNewService = () => {
    const newService: ServiceItem = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      title: 'New Service',
      category: 'BATHROOM',
      description: 'Comprehensive cleaning standard.',
      isActive: true,
      displayOrder: services.length + 1,
      availableCities: ['Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'],
      packages: [
        {
          id: `pkg-${Date.now()}-1`,
          name: '1 Unit',
          description: 'Standard single unit package.',
          durationHours: 1.5,
          price: 500,
          partnerSharePercent: 70,
          isActive: true
        }
      ],
      addOns: [],
      priceHistory: [],
      createdAt: new Date().toISOString()
    };
    setEditingService(newService);
  };

  const handleSavePriceChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceModalData) return;
    updateServicePrice(
      priceModalData.serviceId, 
      priceModalData.variantId, 
      Number(priceModalData.newPrice), 
      priceModalData.reason
    );
    setPriceModalData(null);
  };

  const handleSaveServiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    saveService(editingService);
    setEditingService(null);
  };

  // Helper to add variant in editing form
  const handleAddVariant = () => {
    if (!editingService) return;
    const newVariant: ServicePackage = {
      id: `pkg-${Date.now().toString().slice(-4)}`,
      name: 'New Variant',
      description: 'Variant description',
      durationHours: 2,
      price: 900,
      partnerSharePercent: 70,
      isActive: true
    };
    setEditingService({
      ...editingService,
      packages: [...editingService.packages, newVariant]
    });
  };

  const handleRemoveVariant = (variantId: string) => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      packages: editingService.packages.filter(p => p.id !== variantId)
    });
  };

  const handleAddAddOn = () => {
    if (!editingService) return;
    const newAddOn: ServiceAddOn = {
      id: `add-${Date.now().toString().slice(-4)}`,
      name: 'New Add-on',
      price: 200,
      isActive: true
    };
    setEditingService({
      ...editingService,
      addOns: [...(editingService.addOns || []), newAddOn]
    });
  };

  const handleRemoveAddOn = (addonId: string) => {
    if (!editingService) return;
    setEditingService({
      ...editingService,
      addOns: (editingService.addOns || []).filter(a => a.id !== addonId)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Services Catalog & Authoritative Fixed Pricing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centrally governed rate cards, variant structures & immutable audit logs. Mobile apps fetch active pricing dynamically.
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
              Fixed Price Matrix
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'history'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Price Audit Logs
            </button>
          </div>

          {hasRole(['OPERATIONS_ADMIN']) && (
            <button
              onClick={handleCreateNewService}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          )}
        </div>
      </div>

      {/* Over-The-Air (OTA) Real-time Sync Indicator */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-300">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>
            <strong>Over-The-Air (OTA) Live Connected:</strong> Every price change, variant, or service saved here instantly updates the <strong>Customer App</strong> in real time without a Google Play Store update.
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 bg-emerald-900/60 border border-emerald-700/60 rounded-md font-mono shrink-0 text-emerald-200">
          Direct Firestore sync: /services
        </span>
      </div>

      {/* Category Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search service name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 1. SERVICES CATALOG VIEW */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className={`p-5 rounded-2xl bg-slate-900 border transition shadow-lg flex flex-col justify-between ${
                service.isActive ? 'border-slate-800' : 'border-slate-800/50 opacity-65'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                        {service.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Order #{service.displayOrder || 1}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{service.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{service.description}</p>
                  </div>

                  <button
                    onClick={() => toggleServiceActive(service.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                      service.isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Variants List */}
                <div className="mt-4 space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Variants & Standard Rates ({service.packages.length})
                  </span>
                  <div className="space-y-1.5">
                    {service.packages.map(pkg => (
                      <div 
                        key={pkg.id} 
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{pkg.name}</div>
                          <div className="text-[11px] text-slate-400">{pkg.durationHours} hrs • Partner Share: {pkg.partnerSharePercent}%</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-emerald-400">₹{pkg.price}</span>
                          {hasRole(['OPERATIONS_ADMIN']) && (
                            <button
                              onClick={() => setPriceModalData({
                                serviceId: service.id,
                                serviceTitle: service.title,
                                variantId: pkg.id,
                                variantName: pkg.name,
                                currentPrice: pkg.price,
                                newPrice: pkg.price,
                                reason: ''
                              })}
                              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition"
                              title="Calibrate Price"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add-ons List */}
                {(service.addOns && service.addOns.length > 0) && (
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                      Add-on Options ({service.addOns.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.addOns.map(addon => (
                        <div key={addon.id} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center gap-2">
                          <span className="text-slate-300">{addon.name}</span>
                          <span className="font-bold text-emerald-400 font-mono">+₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setHistoryService(service)}
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
                >
                  <History className="w-3.5 h-3.5" />
                  Price History ({service.priceHistory?.length || 0})
                </button>

                {hasRole(['OPERATIONS_ADMIN']) && (
                  <button
                    onClick={() => setEditingService(service)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    Edit Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. FIXED PRICING MATRIX VIEW */}
      {activeTab === 'pricing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Cleankr Authoritative Price Matrix</h3>
              <p className="text-[11px] text-slate-400">All prices in Indian Rupees (₹). Server locks price snapshot on booking create.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Variant</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Partner Payout (Est)</th>
                  <th className="py-3 px-4 text-right">Calibrate Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredServices.flatMap(service => 
                  service.packages.map(pkg => (
                    <tr key={`${service.id}-${pkg.id}`} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono text-slate-500">#{service.displayOrder}</td>
                      <td className="py-3 px-4 font-bold text-cyan-400">{service.category}</td>
                      <td className="py-3 px-4 font-medium text-white">{service.title}</td>
                      <td className="py-3 px-4 text-slate-200">{pkg.name}</td>
                      <td className="py-3 px-4 text-slate-400">{pkg.durationHours} hrs</td>
                      <td className="py-3 px-4 font-bold text-emerald-400 text-sm">₹{pkg.price}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">₹{Math.round(pkg.price * (pkg.partnerSharePercent / 100))} ({pkg.partnerSharePercent}%)</td>
                      <td className="py-3 px-4 text-right">
                        {hasRole(['OPERATIONS_ADMIN']) && (
                          <button
                            onClick={() => setPriceModalData({
                              serviceId: service.id,
                              serviceTitle: service.title,
                              variantId: pkg.id,
                              variantName: pkg.name,
                              currentPrice: pkg.price,
                              newPrice: pkg.price,
                              reason: ''
                            })}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-medium transition"
                          >
                            Change Price
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PRICE AUDIT LOGS VIEW */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Immutable Price Change Audit Logs
              </h3>
              <p className="text-[11px] text-slate-400">Every rate card modification recorded with admin identification and timestamp</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                <tr>
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Variant</th>
                  <th className="py-3 px-4">Old Price</th>
                  <th className="py-3 px-4">New Price</th>
                  <th className="py-3 px-4">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {priceAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No price change audit records found.
                    </td>
                  </tr>
                ) : (
                  priceAuditLogs.map(log => {
                    const diff = log.newPrice - log.oldPrice;
                    return (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-medium text-cyan-400">{log.id}</td>
                        <td className="py-3 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4 text-white font-medium">{log.adminEmail || log.adminId}</td>
                        <td className="py-3 px-4">{log.serviceName}</td>
                        <td className="py-3 px-4 text-slate-200">{log.variantName || '-'}</td>
                        <td className="py-3 px-4 font-bold text-slate-400">₹{log.oldPrice}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">₹{log.newPrice}</td>
                        <td className="py-3 px-4 font-mono">
                          <span className={diff > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {diff > 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK PRICE CHANGE MODAL WITH AUDIT LOGGING */}
      {priceModalData && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                Change Service Price
              </h3>
              <button onClick={() => setPriceModalData(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSavePriceChange} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="font-semibold text-white">{priceModalData.serviceTitle}</div>
                <div className="text-slate-400">Variant: <span className="text-cyan-300 font-medium">{priceModalData.variantName}</span></div>
                <div className="text-slate-400">Current Fixed Price: <strong className="text-emerald-400 font-mono">₹{priceModalData.currentPrice}</strong></div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">New Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={priceModalData.newPrice}
                  onChange={(e) => setPriceModalData({ ...priceModalData, newPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Reason for Price Change *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Festival calibration, chemical cost revision, inflation adjustment"
                  value={priceModalData.reason}
                  onChange={(e) => setPriceModalData({ ...priceModalData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/40 rounded-lg text-cyan-300 text-[11px] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <span>
                  <strong>Price Security Rule:</strong> Existing bookings preserve their captured price snapshot. This change applies immediately to all future customer app queries.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPriceModalData(null)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
                >
                  Commit Price Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / CREATE SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                {editingService.id.startsWith('srv-') ? `Edit Service: ${editingService.title}` : 'Add New Service'}
              </h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveServiceForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Category *</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="BATHROOM">BATHROOM</option>
                    <option value="KITCHEN">KITCHEN</option>
                    <option value="FLAT">FLAT</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingService.displayOrder || 1}
                    onChange={(e) => setEditingService({ ...editingService, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Status</label>
                  <select
                    value={editingService.isActive ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) => setEditingService({ ...editingService, isActive: e.target.value === 'ACTIVE' })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Variants Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white uppercase text-[11px] tracking-wider">
                    Service Variants ({editingService.packages.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-2.5 py-1 bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Variant
                  </button>
                </div>

                <div className="space-y-2">
                  {editingService.packages.map((pkg, idx) => (
                    <div key={pkg.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-4 gap-2 items-center">
                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-400 block">Variant Name</label>
                        <input
                          type="text"
                          required
                          value={pkg.name}
                          onChange={(e) => {
                            const updated = [...editingService.packages];
                            updated[idx].name = e.target.value;
                            setEditingService({ ...editingService, packages: updated });
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block">Price (₹)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={pkg.price}
                          onChange={(e) => {
                            const updated = [...editingService.packages];
                            updated[idx].price = Number(e.target.value);
                            setEditingService({ ...editingService, packages: updated });
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(pkg.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white uppercase text-[11px] tracking-wider">
                    Add-ons ({(editingService.addOns || []).length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddAddOn}
                    className="px-2.5 py-1 bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 rounded-lg text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Add-on
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingService.addOns || []).map((addon, idx) => (
                    <div key={addon.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-4 gap-2 items-center">
                      <div className="col-span-2">
                        <input
                          type="text"
                          required
                          value={addon.name}
                          onChange={(e) => {
                            const updated = [...(editingService.addOns || [])];
                            updated[idx].name = e.target.value;
                            setEditingService({ ...editingService, addOns: updated });
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          required
                          min="0"
                          value={addon.price}
                          onChange={(e) => {
                            const updated = [...(editingService.addOns || [])];
                            updated[idx].price = Number(e.target.value);
                            setEditingService({ ...editingService, addOns: updated });
                          }}
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveAddOn(addon.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE PRICE HISTORY MODAL */}
      {historyService && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  Price History: {historyService.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Audit log of all price updates</p>
              </div>
              <button onClick={() => setHistoryService(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs">
              {(!historyService.priceHistory || historyService.priceHistory.length === 0) ? (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 text-center">
                  No previous price revisions recorded. Current pricing is the original baseline.
                </div>
              ) : (
                historyService.priceHistory.map(item => (
                  <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between font-semibold text-white">
                      <span>{item.variantName}</span>
                      <span>
                        <span className="text-slate-500 line-through mr-1.5">₹{item.oldPrice}</span>
                        <span className="text-emerald-400">₹{item.newPrice}</span>
                      </span>
                    </div>
                    {item.reason && <p className="text-[11px] text-slate-400 italic">"{item.reason}"</p>}
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      Changed by {item.changedBy} on {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setHistoryService(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
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
