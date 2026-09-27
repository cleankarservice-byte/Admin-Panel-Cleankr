import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { CustomersView } from './views/CustomersView';
import { PartnersView } from './views/PartnersView';
import { HubsView } from './views/HubsView';
import { BookingsView } from './views/BookingsView';
import { ServicesAndPricingView } from './views/ServicesAndPricingView';
import { ServiceChangesView } from './views/ServiceChangesView';
import { FinanceView } from './views/FinanceView';
import { AuditLogsView } from './views/AuditLogsView';
import { SecurityView } from './views/SecurityView';
import { AdminUsersView } from './views/AdminUsersView';
import { NotificationsView } from './views/NotificationsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';
import { Search, Bell, Shield, ShieldCheck, LogOut, Lock } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, currentAdmin, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentTab} />;
      case 'customers':
        return <CustomersView />;
      case 'partners':
        return <PartnersView />;
      case 'hubs':
        return <HubsView />;
      case 'bookings':
        return <BookingsView />;
      case 'services':
        return <ServicesAndPricingView initialMode="catalog" />;
      case 'pricing':
        return <ServicesAndPricingView initialMode="pricing" />;
      case 'service-changes':
        return <ServiceChangesView />;
      case 'payments':
        return <FinanceView initialSubTab="payments" />;
      case 'refunds':
        return <FinanceView initialSubTab="refunds" />;
      case 'payouts':
        return <FinanceView initialSubTab="payouts" />;
      case 'notifications':
        return <NotificationsView />;
      case 'reports':
        return <ReportsView />;
      case 'audit-logs':
        return <AuditLogsView />;
      case 'security':
        return <SecurityView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Permanent Navigation Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between shrink-0 select-none z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Environment:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold tracking-wide uppercase">
              Production • cleankr-724ce
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Authenticated:</span>
              <span className="font-medium text-white">{currentAdmin?.displayName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                {currentAdmin?.role}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden md:block">
              admin.cleankr.co.in
            </div>

            <button
              onClick={logout}
              title="Lock Admin Control & Sign Out"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock / Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AdminLayout />
      </DataProvider>
    </AuthProvider>
  );
}
