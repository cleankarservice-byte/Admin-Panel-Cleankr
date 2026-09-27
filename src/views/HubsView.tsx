import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  Users, 
  CalendarClock, 
  IndianRupee, 
  Edit3, 
  Trash2, 
  UserPlus, 
  UserMinus, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Hub } from '../types/cleankr';

export const HubsView: React.FC = () => {
  const { 
    hubs, 
    partners, 
    bookings, 
    createHub, 
    updateHub, 
    toggleHubActive, 
    assignPartnerToHub, 
    removePartnerFromHub,
    findActiveHubForPincode
  } = useData();
  const { hasRole } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedHub, setSelectedHub] = useState<Hub | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHub, setEditingHub] = useState<Hub | null>(null);
  const [partnerAssignHub, setPartnerAssignHub] = useState<Hub | null>(null);
  
  // Pincode Tester State
  const [testPincode, setTestPincode] = useState('');
  const [testResult, setTestResult] = useState<{ checked: boolean; hub: Hub | null }>({ checked: false, hub: null });

  // Form State for Create / Edit Hub
  const [formHubName, setFormHubName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('Maharashtra');
  const [formServiceAreas, setFormServiceAreas] = useState('');
  const [formPincodes, setFormPincodes] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Hub Statistics
  const activeHubsCount = hubs.filter(h => h.status === 'ACTIVE').length;
  const inactiveHubsCount = hubs.filter(h => h.status === 'INACTIVE').length;
  const totalAssignedPartners = hubs.reduce((acc, h) => acc + (h.assignedPartnerIds?.length || 0), 0);
  const avgPartnersPerHub = hubs.length > 0 ? (totalAssignedPartners / hubs.length).toFixed(1) : '0';

  const todayStr = '2026-09-25'; // Current system context date
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const pendingJobs = bookings.filter(b => b.bookingStatus === 'CREATED' || b.bookingStatus === 'ASSIGNED');
  const activeJobs = bookings.filter(b => ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.bookingStatus));
  const completedJobs = bookings.filter(b => b.bookingStatus === 'COMPLETED');
  const cancelledJobs = bookings.filter(b => b.bookingStatus === 'CANCELLED');
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.totalAmount : 0), 0);

  // Unique Cities
  const cities = Array.from(new Set(hubs.map(h => h.city)));

  // Filtered Hubs
  const filteredHubs = hubs.filter(h => {
    const matchesSearch = 
      h.hubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.serviceAreas.some(area => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      h.pincodes.some(pin => pin.includes(searchQuery));
    const matchesCity = cityFilter === 'ALL' || h.city === cityFilter;
    const matchesStatus = statusFilter === 'ALL' || h.status === statusFilter;
    return matchesSearch && matchesCity && matchesStatus;
  });

  const openCreateModal = () => {
    setFormHubName('');
    setFormCity('');
    setFormState('Maharashtra');
    setFormServiceAreas('');
    setFormPincodes('');
    setFormStatus('ACTIVE');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (hub: Hub) => {
    setEditingHub(hub);
    setFormHubName(hub.hubName);
    setFormCity(hub.city);
    setFormState(hub.state);
    setFormServiceAreas(hub.serviceAreas.join(', '));
    setFormPincodes(hub.pincodes.join(', '));
    setFormStatus(hub.status);
  };

  const handleSaveHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHubName || !formCity) return;

    const parsedAreas = formServiceAreas
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const parsedPins = formPincodes
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingHub) {
      updateHub(editingHub.hubId, {
        hubName: formHubName,
        city: formCity,
        state: formState,
        serviceAreas: parsedAreas,
        pincodes: parsedPins,
        status: formStatus
      });
      setEditingHub(null);
    } else {
      createHub({
        hubName: formHubName,
        city: formCity,
        state: formState,
        serviceAreas: parsedAreas,
        pincodes: parsedPins,
        status: formStatus,
        assignedPartnerIds: []
      });
      setIsCreateModalOpen(false);
    }
  };

  const handleTestPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPincode) return;
    const matched = findActiveHubForPincode(testPincode);
    setTestResult({ checked: true, hub: matched });
  };

  const getHubBookings = (hubId: string) => {
    return bookings.filter(b => b.hubId === hubId);
  };

  const getHubPartners = (hubId: string) => {
    const hub = hubs.find(h => h.hubId === hubId);
    if (!hub) return [];
    return partners.filter(p => (hub.assignedPartnerIds || []).includes(p.id) || p.assignedHubIds?.includes(hubId));
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Hub Management & Operational Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative territory zones, serviceable pincodes, partner hub allocations & job routing rules
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasRole(['OPERATIONS_ADMIN']) && (
            <button
              onClick={openCreateModal}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Create Hub
            </button>
          )}
        </div>
      </div>

      {/* Over-The-Air (OTA) Real-time Sync Indicator */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-300">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>
            <strong>Over-The-Air (OTA) Hub Dispatching:</strong> Creating new Pune Hubs or adding serviceable pincodes updates customer booking eligibility in real time without a Google Play Store update.
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 bg-emerald-900/60 border border-emerald-700/60 rounded-md font-mono shrink-0 text-emerald-200">
          Direct Firestore sync: /hubs
        </span>
      </div>

      {/* 9. HUB DASHBOARD & KPI STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>Active Hubs</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xl font-bold text-white">{activeHubsCount} <span className="text-xs font-normal text-slate-400">/ {hubs.length}</span></div>
          <div className="text-[10px] text-slate-400 mt-0.5">{inactiveHubsCount} Inactive</div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1">Partners / Hub</div>
          <div className="text-xl font-bold text-cyan-400">{avgPartnersPerHub}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{totalAssignedPartners} total allocations</div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1">Today's Bookings</div>
          <div className="text-xl font-bold text-indigo-400">{todayBookings.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Live marketplace load</div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1">Pending Jobs</div>
          <div className="text-xl font-bold text-amber-400">{pendingJobs.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Awaiting partner accept</div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1">Active / Complete</div>
          <div className="text-xl font-bold text-emerald-400">{activeJobs.length} <span className="text-xs font-normal text-slate-400">/ {completedJobs.length}</span></div>
          <div className="text-[10px] text-slate-400 mt-0.5">{cancelledJobs.length} Cancelled</div>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-400 mb-1">Total Hub GMV</div>
          <div className="text-xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Verified Collections</div>
        </div>
      </div>

      {/* Pincode Availability Server-Side Validation Sandbox */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Pincode Serviceability Validation</div>
            <div className="text-[11px] text-slate-400">Test how customer booking server validates customer address against ACTIVE hubs</div>
          </div>
        </div>

        <form onSubmit={handleTestPincode} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Enter 6-digit Pincode (e.g. 411006)"
            value={testPincode}
            onChange={(e) => {
              setTestPincode(e.target.value);
              setTestResult({ checked: false, hub: null });
            }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56 font-mono"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
          >
            Check Route
          </button>
        </form>

        {testResult.checked && (
          <div className="w-full md:w-auto">
            {testResult.hub ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Routed to <strong>{testResult.hub.hubName}</strong> ({testResult.hub.city})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>"Cleankr service is currently unavailable in your area."</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hub name, area, pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            aria-label="Filter Hubs by City"
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            aria-label="Filter Hubs by Status"
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Hubs Only</option>
            <option value="INACTIVE">Inactive Hubs Only</option>
          </select>
        </div>
      </div>

      {/* Hubs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHubs.map(hub => {
          const hubBookings = getHubBookings(hub.hubId);
          const hubPartners = getHubPartners(hub.hubId);
          const hubRevenue = hubBookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.totalAmount : 0), 0);

          return (
            <div 
              key={hub.hubId}
              className={`p-5 rounded-2xl bg-slate-900 border transition shadow-lg flex flex-col justify-between ${
                hub.status === 'ACTIVE' ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/60 opacity-70'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                        {hub.hubId}
                      </span>
                      <span className="text-xs text-slate-400">{hub.city}, {hub.state}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{hub.hubName}</h3>
                  </div>

                  <button
                    onClick={() => toggleHubActive(hub.hubId)}
                    title={hub.status === 'ACTIVE' ? 'Deactivate Hub' : 'Activate Hub'}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1 ${
                      hub.status === 'ACTIVE'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {hub.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {hub.status}
                  </button>
                </div>

                {/* Service Areas */}
                <div className="mb-3">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> Service Areas ({hub.serviceAreas.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hub.serviceAreas.map((area, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Serviceable Pincodes */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1">
                    Serviceable Pincodes ({hub.pincodes.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hub.pincodes.map((pin, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                        {pin}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Partners</span>
                    <span className="font-bold text-white">{hubPartners.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bookings</span>
                    <span className="font-bold text-indigo-400">{hubBookings.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Revenue</span>
                    <span className="font-bold text-emerald-400">₹{hubRevenue}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                <button
                  onClick={() => setSelectedHub(hub)}
                  className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition text-center"
                >
                  View Details & Jobs
                </button>

                {hasRole(['OPERATIONS_ADMIN']) && (
                  <>
                    <button
                      onClick={() => setPartnerAssignHub(hub)}
                      title="Manage Assigned Partners"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg transition"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(hub)}
                      title="Edit Hub Settings"
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT HUB MODAL */}
      {(isCreateModalOpen || editingHub) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                {editingHub ? `Edit Hub: ${editingHub.hubName}` : 'Create Operational Hub'}
              </h3>
              <button 
                onClick={() => { setIsCreateModalOpen(false); setEditingHub(null); }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHub} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Hub Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Central Hub"
                  value={formHubName}
                  onChange={(e) => setFormHubName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">State *</label>
                  <input
                    type="text"
                    required
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Service Areas (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kalyani Nagar, Koregaon Park, Viman Nagar"
                  value={formServiceAreas}
                  onChange={(e) => setFormServiceAreas(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Serviceable Pincodes (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 411006, 411001, 411014"
                  value={formPincodes}
                  onChange={(e) => setFormPincodes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Only bookings with matching pincode will route to this Hub.
                </span>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Hub Initial Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ACTIVE">ACTIVE (Accepting new customer bookings)</option>
                  <option value="INACTIVE">INACTIVE (Service unavailable in this zone)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setEditingHub(null); }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold"
                >
                  {editingHub ? 'Save Changes' : 'Create Hub'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTNER ASSIGNMENT TO HUB MODAL */}
      {partnerAssignHub && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  Assign Partners: {partnerAssignHub.hubName}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only approved & active partners can receive dispatch jobs for this Hub.
                </p>
              </div>
              <button 
                onClick={() => setPartnerAssignHub(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {partners.map(partner => {
                const isAssigned = (partnerAssignHub.assignedPartnerIds || []).includes(partner.id) || partner.assignedHubIds?.includes(partnerAssignHub.hubId);
                const isPrimary = partner.primaryHubId === partnerAssignHub.hubId;
                const isApproved = partner.status === 'ACTIVE';

                return (
                  <div 
                    key={partner.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{partner.fullName}</span>
                        <span className="font-mono text-[10px] text-slate-400">({partner.id})</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          partner.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {partner.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        City: {partner.city} • Skills: {partner.skills.join(', ')}
                      </div>
                      {isPrimary && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold inline-block mt-1">
                          Primary Hub
                        </span>
                      )}
                    </div>

                    <div>
                      {isAssigned ? (
                        <button
                          onClick={() => removePartnerFromHub(partner.id, partnerAssignHub.hubId)}
                          className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-medium transition"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => assignPartnerToHub(partner.id, partnerAssignHub.hubId, false)}
                          disabled={!isApproved}
                          title={!isApproved ? 'Only active partners can receive jobs' : 'Assign to Hub'}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                            isApproved 
                              ? 'bg-cyan-600 hover:bg-cyan-500 text-white' 
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setPartnerAssignHub(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HUB DETAILS DOSSIER MODAL */}
      {selectedHub && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedHub.hubName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedHub.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {selectedHub.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hub ID: <span className="font-mono text-cyan-400">{selectedHub.hubId}</span> • {selectedHub.city}, {selectedHub.state}
                </p>
              </div>
              <button 
                onClick={() => setSelectedHub(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Service Areas</span>
                <span className="text-base font-bold text-white">{selectedHub.serviceAreas.length}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Pincodes</span>
                <span className="text-base font-bold text-cyan-400">{selectedHub.pincodes.length}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Assigned Pros</span>
                <span className="text-base font-bold text-indigo-400">{getHubPartners(selectedHub.hubId).length}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Hub Bookings</span>
                <span className="text-base font-bold text-emerald-400">{getHubBookings(selectedHub.hubId).length}</span>
              </div>
            </div>

            {/* Assigned Active Partners */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Eligible Assigned Service Partners ({getHubPartners(selectedHub.hubId).length})
              </h4>
              <div className="space-y-2">
                {getHubPartners(selectedHub.hubId).length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500">
                    No service partners currently assigned to this Hub. Click "Assign Partners" to link active personnel.
                  </div>
                ) : (
                  getHubPartners(selectedHub.hubId).map(p => (
                    <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{p.fullName}</span>
                          <span className="text-[10px] text-amber-400 font-normal">★ {p.rating}</span>
                          {p.primaryHubId === selectedHub.hubId && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {p.phoneNumber} • {p.completedJobsCount} jobs completed
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Hub Bookings List */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5 text-indigo-400" />
                Recent Routed Bookings & Jobs ({getHubBookings(selectedHub.hubId).length})
              </h4>
              <div className="space-y-2">
                {getHubBookings(selectedHub.hubId).length === 0 ? (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500">
                    No orders have been routed through this Hub yet.
                  </div>
                ) : (
                  getHubBookings(selectedHub.hubId).map(b => (
                    <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{b.serviceTitle} ({b.packageName})</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {b.id} • {b.date} • Customer: {b.customerName} ({b.address.pincode})
                        </div>
                        <div className="text-[11px] text-cyan-400 mt-0.5">
                          Partner: {b.partnerName || 'Unassigned'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">₹{b.totalAmount}</div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          b.bookingStatus === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-300' :
                          b.bookingStatus === 'CANCELLED' ? 'bg-rose-500/15 text-rose-300' :
                          'bg-amber-500/15 text-amber-300'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedHub(null)}
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
