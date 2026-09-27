import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CalendarClock, 
  Layers, 
  Tag, 
  GitPullRequestDraft, 
  CreditCard, 
  RotateCcw, 
  Wallet, 
  Bell, 
  BarChart3, 
  FileText, 
  ShieldAlert, 
  UserCog, 
  Settings,
  LogOut,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { AdminRole } from '../types/cleankr';

export type NavTab = 
  | 'dashboard'
  | 'customers'
  | 'partners'
  | 'hubs'
  | 'bookings'
  | 'services'
  | 'pricing'
  | 'service-changes'
  | 'payments'
  | 'refunds'
  | 'payouts'
  | 'notifications'
  | 'reports'
  | 'audit-logs'
  | 'security'
  | 'admin-users'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentAdmin, logout, switchRole, hasRole } = useAuth();
  const { isSyncing, syncWithFirebase, serviceChanges, securityAlerts, partners, firebaseDiagnostics } = useData();

  const pendingApprovalsCount = partners.filter(p => p.status === 'PENDING_APPROVAL').length;
  const pendingChangesCount = serviceChanges.filter(s => s.status === 'PENDING').length;
  const openAlertsCount = securityAlerts.filter(a => a.status === 'OPEN').length;

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
    allowedRoles?: AdminRole[];
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, allowedRoles: ['OPERATIONS_ADMIN', 'SUPPORT_ADMIN'] },
    { id: 'partners', label: 'Partners', icon: UserCheck, badge: pendingApprovalsCount, badgeColor: 'bg-amber-500', allowedRoles: ['OPERATIONS_ADMIN'] },
    { id: 'hubs', label: 'Hubs & Territory', icon: Building2, allowedRoles: ['OPERATIONS_ADMIN'] },
    { id: 'bookings', label: 'Bookings', icon: CalendarClock, allowedRoles: ['OPERATIONS_ADMIN', 'SUPPORT_ADMIN'] },
    { id: 'services', label: 'Services', icon: Layers, allowedRoles: ['OPERATIONS_ADMIN'] },
    { id: 'pricing', label: 'Fixed Pricing', icon: Tag, allowedRoles: ['OPERATIONS_ADMIN', 'FINANCE_ADMIN'] },
    { id: 'service-changes', label: 'Service Changes', icon: GitPullRequestDraft, badge: pendingChangesCount, badgeColor: 'bg-rose-500', allowedRoles: ['OPERATIONS_ADMIN'] },
    { id: 'payments', label: 'Payments', icon: CreditCard, allowedRoles: ['FINANCE_ADMIN'] },
    { id: 'refunds', label: 'Refunds', icon: RotateCcw, allowedRoles: ['FINANCE_ADMIN', 'SUPPORT_ADMIN'] },
    { id: 'payouts', label: 'Partner Payouts', icon: Wallet, allowedRoles: ['FINANCE_ADMIN'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, allowedRoles: ['OPERATIONS_ADMIN', 'SUPPORT_ADMIN'] },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, allowedRoles: ['FINANCE_ADMIN', 'OPERATIONS_ADMIN'] },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText, allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN'] },
    { id: 'security', label: 'Security Center', icon: ShieldAlert, badge: openAlertsCount, badgeColor: 'bg-red-600', allowedRoles: ['SUPER_ADMIN'] },
    { id: 'admin-users', label: 'Admin Users', icon: UserCog, allowedRoles: ['SUPER_ADMIN'] },
    { id: 'settings', label: 'Settings', icon: Settings, allowedRoles: ['SUPER_ADMIN'] },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 text-lg">
            C
          </div>
          <div>
            <div className="font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>Cleankr</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400">admin.cleankr.co.in</p>
          </div>
        </div>
        <button
          onClick={() => syncWithFirebase()}
          disabled={isSyncing}
          title="Force Sync with cleankr-724ce"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Backend connection pill */}
      <div 
        title={firebaseDiagnostics.errorMessage || `Verified: ${firebaseDiagnostics.state}`}
        className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-[11px]"
      >
        <div className="flex items-center gap-2 text-slate-300">
          <span className={`w-2 h-2 rounded-full ${
            firebaseDiagnostics.state === 'CONNECTED_LIVE' ? 'bg-emerald-400 animate-pulse' :
            firebaseDiagnostics.state === 'PERMISSION_DENIED' ? 'bg-rose-400' :
            firebaseDiagnostics.state === 'CONFIGURATION_REQUIRED' ? 'bg-purple-400' :
            'bg-amber-400'
          }`} />
          <span className="font-mono text-[11px] truncate">cleankr-724ce</span>
        </div>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
          firebaseDiagnostics.state === 'CONNECTED_LIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
          firebaseDiagnostics.state === 'PERMISSION_DENIED' ? 'bg-rose-950 text-rose-300 border border-rose-800/60' :
          'bg-slate-800 text-slate-300'
        }`}>
          {firebaseDiagnostics.state === 'CONNECTED_LIVE' ? 'LIVE' :
           firebaseDiagnostics.state === 'PERMISSION_DENIED' ? 'SECURED' : 'SYNCED'}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
        {navItems.map((item) => {
          const isAllowed = !item.allowedRoles || hasRole(item.allowedRoles);
          if (!isAllowed) return null;

          const isActive = currentTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold text-white ${item.badgeColor || 'bg-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Role Switcher for Testing RBAC Guardrails */}
      <div className="p-3 mx-3 mb-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            Active Role
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">RBAC</span>
        </div>
        <select
          value={currentAdmin?.role || 'SUPER_ADMIN'}
          onChange={(e) => switchRole(e.target.value as AdminRole)}
          aria-label="Active Administrative Role"
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
          <option value="OPERATIONS_ADMIN">OPERATIONS_ADMIN</option>
          <option value="FINANCE_ADMIN">FINANCE_ADMIN</option>
          <option value="SUPPORT_ADMIN">SUPPORT_ADMIN</option>
          <option value="READ_ONLY_ADMIN">READ_ONLY_ADMIN</option>
        </select>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-medium text-slate-300 text-xs shrink-0">
            {currentAdmin?.displayName?.charAt(0) || 'A'}
          </div>
          <div className="truncate">
            <p className="text-xs font-medium text-slate-200 truncate">{currentAdmin?.displayName || 'Admin'}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentAdmin?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
