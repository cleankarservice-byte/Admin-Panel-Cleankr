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
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const NotificationsView: React.FC = () => {
  const { broadcastNotification } = useData();
  const [targetAudience, setTargetAudience] = useState<'ALL_CUSTOMERS' | 'ALL_PARTNERS' | 'ALL_USERS'>('ALL_CUSTOMERS');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [channel, setChannel] = useState<'PUSH_FCM' | 'SMS_PRIORITY' | 'IN_APP'>('PUSH_FCM');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setIsDispatching(true);
    const res = await broadcastNotification(targetAudience, title, body, channel);
    setIsDispatching(false);
    setDispatchResult(res);

    setTitle('');
    setBody('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          Notification Broadcast & Messaging Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Server-controlled Firebase Cloud Messaging (FCM) dispatch engine to Customer and Partner apps
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Broadcast Announcement</span>
            <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              FCM Gateway Active
            </span>
          </h2>

          {dispatchResult && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Notification successfully broadcasted to FCM topic ({dispatchResult.targetTopic})</span>
              </div>
              <p className="text-[11px] text-emerald-400/90 pl-6">
                Delivered to <strong>{dispatchResult.deliverySuccessCount}</strong> out of <strong>{dispatchResult.recipientCount}</strong> registered app terminals.
              </p>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Target App Segment</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL_CUSTOMERS">Cleankr Customer App Users (~2,450 users)</option>
                  <option value="ALL_PARTNERS">Cleankr Partner App Service Pros (~180 verified)</option>
                  <option value="ALL_USERS">All Marketplace Stakeholders (~2,630 users)</option>
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
                  <option value="SMS_PRIORITY">Emergency / SMS Fallback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Notification Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Festival Monsoon Deep Cleaning Special Offer"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Message Content</label>
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose the concise text body shown on the client notification tray..."
                className="w-full h-28 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> Dispatched via server-side FCM protocol
              </span>
              <button
                type="submit"
                disabled={isDispatching}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-1.5 transition shadow-lg shadow-cyan-600/20"
              >
                <Send className="w-4 h-4" />
                <span>{isDispatching ? 'Transmitting FCM Blast...' : 'Dispatch FCM Blast'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & System Info */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              Automated Transactional Triggers
            </h3>
            <p className="text-slate-400">
              The following notifications fire automatically via backend events without admin intervention:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
              <li>Booking confirmation to Customer</li>
              <li>New job broadcast to nearby Partners</li>
              <li>Partner "On The Way" & "Arrived" SMS/Push to Customer</li>
              <li>Service-change approved/rejected push alert to Partner</li>
              <li>Payout settlement confirmation to Partner</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
