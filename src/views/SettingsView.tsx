import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Shield, 
  Database, 
  Server, 
  CheckCircle, 
  Save,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Zap,
  Radio,
  Plus,
  Trash2,
  Tag,
  Phone,
  MessageCircle,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { checkDomainReadiness, type DomainVerificationCheck } from '../lib/domainVerification';
import { DynamicBanner } from '../types/cleankr';

export const SettingsView: React.FC = () => {
  const { 
    addAuditLog, 
    appConfig, 
    updateAppConfig, 
    addBanner, 
    deleteBanner, 
    toggleBannerActive, 
    pushAllToLiveApps, 
    isSyncing,
    services,
    hubs
  } = useData();

  const [companyName, setCompanyName] = useState(appConfig.companyName);
  const [supportEmail, setSupportEmail] = useState(appConfig.supportEmail);
  const [supportPhone, setSupportPhone] = useState(appConfig.supportPhone);
  const [supportWhatsapp, setSupportWhatsapp] = useState(appConfig.supportWhatsapp || '+91 91580 04567');
  const [commissionRate, setCommissionRate] = useState(appConfig.commissionRate);
  const [cancellationGraceMinutes, setCancellationGraceMinutes] = useState(appConfig.cancellationGraceMinutes);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(appConfig.isMaintenanceMode);
  const [maintenanceMessage, setMaintenanceMessage] = useState(appConfig.maintenanceMessage || 'Cleankr is temporarily undergoing maintenance.');
  const [activeAnnouncement, setActiveAnnouncement] = useState(appConfig.activeAnnouncement || '');
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(appConfig.isAnnouncementActive);
  const [minCustomerVersion, setMinCustomerVersion] = useState(appConfig.minCustomerAppVersion || '1.0.0');
  const [minPartnerVersion, setMinPartnerVersion] = useState(appConfig.minPartnerAppVersion || '1.0.0');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [bulkSyncResult, setBulkSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  // New banner form state
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerBadge, setNewBannerBadge] = useState('OFFER');
  const [newBannerAction, setNewBannerAction] = useState<'SERVICE' | 'CATEGORY' | 'EXTERNAL_LINK' | 'NONE'>('CATEGORY');
  const [newBannerTarget, setNewBannerTarget] = useState('BATHROOM');

  // Domain verification state
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainCheckResult, setDomainCheckResult] = useState<DomainVerificationCheck | null>(null);

  useEffect(() => {
    runDomainCheck();
  }, []);

  const runDomainCheck = async () => {
    setIsCheckingDomain(true);
    const result = await checkDomainReadiness('admin.cleankr.co.in');
    setDomainCheckResult(result);
    setIsCheckingDomain(false);
  };

  const handleSaveGlobalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAppConfig({
      companyName,
      supportEmail,
      supportPhone,
      supportWhatsapp,
      commissionRate,
      cancellationGraceMinutes,
      isMaintenanceMode,
      maintenanceMessage,
      activeAnnouncement,
      isAnnouncementActive,
      minCustomerAppVersion: minCustomerVersion,
      minPartnerAppVersion: minPartnerVersion
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleTriggerBulkSync = async () => {
    setBulkSyncResult(null);
    const res = await pushAllToLiveApps();
    if (res.success) {
      setBulkSyncResult({
        success: true,
        message: `Successfully synchronized ${res.syncedServices} services & ${res.syncedHubs} Pune Hubs to Firebase Firestore (cleankr-724ce). Customer App & Partner App will reflect this live immediately without Play Store updates!`
      });
    } else {
      setBulkSyncResult({
        success: false,
        message: `Sync failed: ${res.error || 'Network error'}`
      });
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) return;
    await addBanner({
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim(),
      badgeText: newBannerBadge.trim(),
      actionType: newBannerAction,
      actionTarget: newBannerTarget,
      displayOrder: (appConfig.banners?.length || 0) + 1,
      isActive: true
    });
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setShowAddBannerModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Marketplace Parameters & Over-The-Air (OTA) App Sync
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control dynamic app pricing, Pune hubs, flash banners, emergency maintenance, and live Android app configs without Google Play Store release.
          </p>
        </div>

        <button
          onClick={handleTriggerBulkSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition shrink-0"
        >
          <Zap className={`w-4 h-4 ${isSyncing ? 'animate-bounce text-amber-300' : 'text-amber-300'}`} />
          <span>{isSyncing ? 'Pushing to Firebase...' : 'Push All Updates Live to Android Apps'}</span>
        </button>
      </div>

      {/* OTA Status Notification */}
      {bulkSyncResult && (
        <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 shadow-lg ${
          bulkSyncResult.success 
            ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-200' 
            : 'bg-rose-950/70 border-rose-800 text-rose-200'
        }`}>
          {bulkSyncResult.success ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <div className="font-semibold text-sm">
              {bulkSyncResult.success ? 'Live Over-The-Air (OTA) Sync Successful' : 'Sync Notice'}
            </div>
            <p className="text-xs opacity-90">{bulkSyncResult.message}</p>
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>System configurations safely committed to production database (cleankr-724ce) and live for Android apps.</span>
        </div>
      )}

      {/* Explainer: Play Store Bypass / Real-time Dynamic Architecture */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 shrink-0 mt-0.5">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-emerald-950 border border-emerald-700/60 text-emerald-400 rounded-full font-medium">
                  Dynamic Server-Driven UI (OTA)
                </span>
                <span className="text-[11px] text-slate-400">Zero Play Store Approval Waiting</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                बिना Play Store पर ऐप अपडेट किए Customer & Partner App में तुरंत बदलाव
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Cleankr Customer App और Partner App सीधे Firebase Firestore (<code className="text-cyan-300 font-mono text-[11px]">cleankr-724ce</code>) 
                से रीयल-टाइम कनेक्टेड हैं। जब भी आप Admin Panel से कोई सर्विस जोड़ते हैं, रेट बदलते हैं (जैसे Bathroom ₹450), नया Pune Hub या Pincode 
                शुरू करते हैं, या कोई ऑफर बैनर डालते हैं — वह <strong>1 सेकंड के अंदर</strong> कस्टमर और पार्टनर के फोन पर लाइव हो जाता है। 
                Play Store पर नया APK पब्लिश करने की बिल्कुल ज़रूरत नहीं है!
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-2 shrink-0 min-w-[220px]">
            <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Live Cloud Sync State</div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Catalog Services:</span>
              <span className="font-semibold text-cyan-400 font-mono">{services.length} items</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Active Pune Hubs:</span>
              <span className="font-semibold text-emerald-400 font-mono">{hubs.filter(h => h.status === 'ACTIVE').length} / {hubs.length}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Active App Banners:</span>
              <span className="font-semibold text-purple-400 font-mono">{(appConfig.banners || []).filter(b => b.isActive).length}</span>
            </div>
            <div className="pt-1 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Real-time Listeners Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Marketplace Operating Rules & Live Contact Info */}
        <form onSubmit={handleSaveGlobalConfig} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Live Customer & Partner App Dynamic Parameters
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                These settings update dynamically inside mobile apps without app store updates
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold flex items-center gap-1.5 transition shadow-lg shadow-cyan-600/20"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>
          </div>

          {/* Flash Announcement Bar */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Customer App Home Top Announcement Bar
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                <input
                  type="checkbox"
                  checked={isAnnouncementActive}
                  onChange={(e) => setIsAnnouncementActive(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>Show in App</span>
              </label>
            </div>
            <input
              type="text"
              value={activeAnnouncement}
              onChange={(e) => setActiveAnnouncement(e.target.value)}
              placeholder="e.g. 🎉 Flat ₹100 OFF on your first Pune Deep Cleaning! Use code PUNE100"
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[10px] text-slate-500">
              Appears at the very top of Customer Android App home screen. Update anytime for promos or weather notices.
            </p>
          </div>

          {/* Customer Care Hotline & WhatsApp Helpline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                Customer Care Helpline (Toll-Free / Direct)
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+91 1800 200 4567"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Renders in Customer & Partner app 'Help & Support'</span>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                Official WhatsApp Support Number
              </label>
              <input
                type="text"
                value={supportWhatsapp}
                onChange={(e) => setSupportWhatsapp(e.target.value)}
                placeholder="+91 91580 04567"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">One-tap WhatsApp chat button in Android apps</span>
            </div>
          </div>

          {/* Marketplace Commission & Cancellation Window */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Platform Baseline Commission (%)</label>
              <input
                type="number"
                min={0}
                max={50}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Free Cancellation Grace (Minutes)</label>
              <input
                type="number"
                min={0}
                max={120}
                value={cancellationGraceMinutes}
                onChange={(e) => setCancellationGraceMinutes(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Support Email Address</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Emergency Maintenance Mode */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${isMaintenanceMode ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-xs font-semibold text-white">Emergency Maintenance Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMaintenanceMode}
                  onChange={(e) => setIsMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
            {isMaintenanceMode && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-slate-400 block text-[11px]">Message shown to users on app launch:</label>
                <input
                  type="text"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-amber-800/60 rounded-lg text-amber-200 text-xs focus:outline-none"
                />
                <p className="text-[10px] text-amber-400">
                  ⚠️ When active, Customer App temporarily halts new bookings and displays this message gracefully.
                </p>
              </div>
            )}
          </div>

          {/* Minimum App Version Enforcer (Optional forced update trigger) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <label className="text-slate-300 block mb-1 text-[11px] font-medium">Min Customer App Version</label>
              <input
                type="text"
                value={minCustomerVersion}
                onChange={(e) => setMinCustomerVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Below this version, app prompts for Play Store update</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <label className="text-slate-300 block mb-1 text-[11px] font-medium">Min Partner App Version</label>
              <input
                type="text"
                value={minPartnerVersion}
                onChange={(e) => setMinPartnerVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Forces partner compliance if major feature is released</span>
            </div>
          </div>
        </form>

        {/* Right Column: Dynamic Home Screen Banners & Connected Collections */}
        <div className="space-y-6">
          {/* Dynamic Banners Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-semibold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Dynamic Home Banners
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Active carousel slides in Customer App</p>
              </div>
              <button
                onClick={() => setShowAddBannerModal(true)}
                className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 rounded-lg font-medium flex items-center gap-1 transition text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Banner
              </button>
            </div>

            <div className="space-y-2.5">
              {(appConfig.banners || []).map((b) => (
                <div 
                  key={b.id} 
                  className={`p-3 rounded-xl border transition ${
                    b.isActive ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white text-xs">{b.title}</span>
                        {b.badgeText && (
                          <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950 border border-cyan-700/60 text-cyan-300 rounded font-semibold uppercase">
                            {b.badgeText}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{b.subtitle}</p>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>Action: {b.actionType} ({b.actionTarget})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleBannerActive(b.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium border transition ${
                          b.isActive 
                            ? 'bg-emerald-950 border-emerald-800 text-emerald-300' 
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {b.isActive ? 'Active' : 'Paused'}
                      </button>
                      <button
                        onClick={() => deleteBanner(b.id)}
                        className="p-1 hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 rounded transition"
                        title="Delete banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure & Collections summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-400" />
              Connected Real-time Collections
            </h3>
            <div className="text-slate-400 space-y-1.5 text-[11px]">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span><code>services</code> (Rates, Variants, Addons)</span>
                <span className="text-emerald-400 font-mono text-[10px]">Live OTA</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span><code>hubs</code> (Pune Hubs & Pincodes)</span>
                <span className="text-emerald-400 font-mono text-[10px]">Live OTA</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span><code>app_config/global</code> (Banners, Hotlines)</span>
                <span className="text-emerald-400 font-mono text-[10px]">Live OTA</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <span><code>partners</code> (Assigned Hubs & KYC)</span>
                <span className="text-emerald-400 font-mono text-[10px]">Live OTA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Banner Modal */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Add Dynamic Home Banner (No Play Store Update)
              </h3>
              <button 
                onClick={() => setShowAddBannerModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  placeholder="e.g. Festival Deep Clean Offer"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Subtitle / Offer Description</label>
                <input
                  type="text"
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  placeholder="e.g. Flat 1 BHK to 4 BHK deep sanitized at flat rates"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Badge Tag</label>
                  <input
                    type="text"
                    value={newBannerBadge}
                    onChange={(e) => setNewBannerBadge(e.target.value)}
                    placeholder="e.g. 20% OFF"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Action Type</label>
                  <select
                    value={newBannerAction}
                    onChange={(e) => setNewBannerAction(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CATEGORY">Open Category</option>
                    <option value="SERVICE">Open Service</option>
                    <option value="NONE">No Action (Display Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Target Category / Service ID</label>
                <input
                  type="text"
                  value={newBannerTarget}
                  onChange={(e) => setNewBannerTarget(e.target.value)}
                  placeholder="e.g. BATHROOM, KITCHEN, FLAT, or srv-001"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBannerModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-cyan-600/30"
                >
                  Publish Banner Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
