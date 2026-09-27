import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  UserCheck, 
  CheckCircle, 
  AlertTriangle,
  Smartphone,
  Info,
  Radio,
  Sparkles,
  Building2,
  User,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const NotificationsView: React.FC = () => {
  const { 
    customers, 
    partners, 
    hubs, 
    broadcastNotification, 
    broadcastToHubCustomers, 
    sendCustomerNotification 
  } = useData();

  type TargetType = 'ALL_CUSTOMERS' | 'ALL_PARTNERS' | 'ALL_USERS' | 'INDIVIDUAL_CUSTOMER' | 'SELECTED_CUSTOMERS' | 'HUB_CUSTOMERS';

  const [targetAudience, setTargetAudience] = useState<TargetType>('ALL_CUSTOMERS');
  const [selectedIndividualCustomerId, setSelectedIndividualCustomerId] = useState('');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [selectedHubId, setSelectedHubId] = useState('');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [channel, setChannel] = useState<'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP'>('PUSH_FCM');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);

  const handleToggleCustomerSelect = (id: string) => {
    setSelectedCustomerIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setIsDispatching(true);

    if (targetAudience === 'INDIVIDUAL_CUSTOMER') {
      if (!selectedIndividualCustomerId) {
        setIsDispatching(false);
        return;
      }
      await sendCustomerNotification(selectedIndividualCustomerId, title, body, channel);
      const cust = customers.find(c => c.id === selectedIndividualCustomerId);
      setDispatchResult({
        targetTopic: `Customer: ${cust?.fullName || selectedIndividualCustomerId}`,
        deliverySuccessCount: 1,
        recipientCount: 1
      });
    } else if (targetAudience === 'SELECTED_CUSTOMERS') {
      if (selectedCustomerIds.length === 0) {
        setIsDispatching(false);
        return;
      }
      for (const cid of selectedCustomerIds) {
        await sendCustomerNotification(cid, title, body, channel);
      }
      setDispatchResult({
        targetTopic: `Selected (${selectedCustomerIds.length} customers)`,
        deliverySuccessCount: selectedCustomerIds.length,
        recipientCount: selectedCustomerIds.length
      });
    } else if (targetAudience === 'HUB_CUSTOMERS') {
      if (!selectedHubId) {
        setIsDispatching(false);
        return;
      }
      const count = await broadcastToHubCustomers(selectedHubId, title, body, channel);
      const hub = hubs.find(h => h.hubId === selectedHubId);
      setDispatchResult({
        targetTopic: `Hub: ${hub?.hubName || selectedHubId}`,
        deliverySuccessCount: count,
        recipientCount: count
      });
    } else {
      // Standard Broadcast
      const res = await broadcastNotification(targetAudience, title, body, channel);
      setDispatchResult(res);
    }

    setIsDispatching(false);
    setTitle('');
    setBody('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          Notification Dispatch & Messaging Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Server-controlled Firebase Cloud Messaging (FCM) & SMS dispatch engine targeting individual customers, territorial hubs, or marketplace broadcasts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Compose Notification</span>
            <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              FCM Gateway Live
            </span>
          </h2>

          {dispatchResult && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Dispatched to target: {dispatchResult.targetTopic}</span>
              </div>
              <p className="text-[11px] text-emerald-400/90 pl-6">
                Delivered to <strong>{dispatchResult.deliverySuccessCount}</strong> out of <strong>{dispatchResult.recipientCount}</strong> registered application endpoints.
              </p>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            {/* Target Audience Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Target Audience Group</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL_CUSTOMERS">All Customers (~2,450 accounts)</option>
                  <option value="INDIVIDUAL_CUSTOMER">Individual Customer</option>
                  <option value="SELECTED_CUSTOMERS">Selected Customers (Multi-select)</option>
                  <option value="HUB_CUSTOMERS">Hub Territory Customers</option>
                  <option value="ALL_PARTNERS">All Active Partners (~180 pros)</option>
                  <option value="ALL_USERS">Entire Marketplace (All Users)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Delivery Protocol</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="PUSH_FCM">Firebase Cloud Messaging (Instant Push)</option>
                  <option value="IN_APP">In-App Notification Feed</option>
                  <option value="SMS_PRIORITY">SMS Priority Dispatch</option>
                </select>
              </div>
            </div>

            {/* Dynamic Audience Selectors */}
            {targetAudience === 'INDIVIDUAL_CUSTOMER' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="text-slate-300 block font-medium">Choose Customer</label>
                <select
                  value={selectedIndividualCustomerId}
                  onChange={(e) => setSelectedIndividualCustomerId(e.target.value)}
                  required
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                >
                  <option value="">Select a customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName} ({c.phoneNumber}) - {c.email}</option>
                  ))}
                </select>
              </div>
            )}

            {targetAudience === 'SELECTED_CUSTOMERS' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 block font-medium">
                    Select Customers ({selectedCustomerIds.length} chosen)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomerIds(customers.map(c => c.id))}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCustomerIds([])}
                      className="text-[10px] text-slate-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {customers.map(c => {
                    const isChecked = selectedCustomerIds.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleToggleCustomerSelect(c.id)}
                        className={`p-2 rounded-lg border transition cursor-pointer flex items-center justify-between text-xs ${
                          isChecked ? 'bg-cyan-500/10 border-cyan-500/40 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <span className="font-semibold">{c.fullName}</span>
                          <span className="text-slate-400 text-[11px] ml-2">({c.phoneNumber})</span>
                        </div>
                        {isChecked && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {targetAudience === 'HUB_CUSTOMERS' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="text-slate-300 block font-medium">Select Serving Hub Territory</label>
                <select
                  value={selectedHubId}
                  onChange={(e) => setSelectedHubId(e.target.value)}
                  required
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                >
                  <option value="">Choose territory hub...</option>
                  {hubs.map(h => (
                    <option key={h.hubId} value={h.hubId}>
                      {h.hubName} ({h.city}) - Servicing {h.pincodes.length} pincodes
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Notification will be broadcasted to all customers with addresses or primary assignment matching this Hub.
                </p>
              </div>
            )}

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Notification Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cleankr Special: 20% off Bathroom Deep Clean"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Message Body *</label>
              <textarea
                rows={4}
                required
                placeholder="Write message content that appears on the device lockscreen..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isDispatching}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition"
              >
                <Send className="w-4 h-4" />
                {isDispatching ? 'Transmitting via FCM...' : 'Transmit Notification'}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              Lockscreen Push Preview
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-900">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-cyan-500 flex items-center justify-center font-bold text-white text-[9px]">
                    C
                  </div>
                  <span className="font-semibold text-slate-300">CLEANKR</span>
                </div>
                <span>Just Now</span>
              </div>

              <div>
                <h4 className="font-semibold text-white text-xs">
                  {title || 'Seasonal Deep Clean Special'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {body || 'Book verified expert cleaners for your home or kitchen today at guaranteed fixed rates.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
