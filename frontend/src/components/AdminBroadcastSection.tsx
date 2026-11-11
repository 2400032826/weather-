import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Smartphone, 
  Volume2, 
  Loader2, 
  RefreshCw, 
  Info, 
  KeyRound, 
  Lock, 
  X 
} from 'lucide-react';
import { 
  sendAdminBroadcastTest, 
  verifyAdminKey, 
  fetchAdminSubscribersCount, 
  type AdminBroadcastResult 
} from '../lib/weatherService';

export const AdminBroadcastSection: React.FC = () => {
  const [counts, setCounts] = useState<{ active_subscribers: number; total_registered: number; inactive_or_expired: number } | null>(null);
  const [loadingCounts, setLoadingCounts] = useState<boolean>(false);

  // Admin Key Modal state
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [enteredAdminKey, setEnteredAdminKey] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isKeyVerified, setIsKeyVerified] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Broadcast dispatch state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [result, setResult] = useState<AdminBroadcastResult | null>(null);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Load subscriber count without requiring any admin key
  const refreshCounts = async () => {
    setLoadingCounts(true);
    try {
      const data = await fetchAdminSubscribersCount();
      setCounts(data);
    } catch (e) {
      console.warn('Subscribers count note:', e);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Step 4: Verify Admin Key
  const handleVerifyKeyOnly = async () => {
    if (!enteredAdminKey.trim()) {
      setAuthError('Please enter the Render ADMIN_KEY.');
      return;
    }
    setIsVerifying(true);
    setAuthError(null);
    const res = await verifyAdminKey(enteredAdminKey);
    setIsVerifying(false);
    if (res.success) {
      setIsKeyVerified(true);
    } else {
      setIsKeyVerified(false);
      setAuthError(res.message);
    }
  };

  // Execute Broadcast after verifying key
  const handleExecuteBroadcast = async () => {
    if (!enteredAdminKey.trim()) {
      setAuthError('Please enter the Render ADMIN_KEY.');
      return;
    }

    setIsSending(true);
    setAuthError(null);
    setBroadcastError(null);

    try {
      const res = await sendAdminBroadcastTest(enteredAdminKey.trim());
      setResult(res);
      setCooldownSeconds(60);
      setShowAdminModal(false);
      // Reset sensitive key from memory
      setEnteredAdminKey('');
      setIsKeyVerified(false);
      refreshCounts();
    } catch (err: any) {
      setAuthError(err.message || 'Broadcast authorization rejected.');
      setBroadcastError(err.message || 'Broadcast authorization rejected.');
    } finally {
      setIsSending(false);
    }
  };

  const hasSubscribers = counts !== null && counts.active_subscribers > 0;

  return (
    <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Admin Push Notification Broadcast Test
            </h3>
            <p className="text-[11px] text-slate-500">
              Secure testing of Web Push delivery across mobile devices (locked, closed, background)
            </p>
          </div>
        </div>

        {/* Subscriber counter badge (Public Telemetry - No Admin Key Needed) */}
        <div className="flex items-center gap-2">
          <button
            onClick={refreshCounts}
            disabled={loadingCounts}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition"
            title="Refresh subscriber count"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingCounts ? 'animate-spin' : ''}`} />
          </button>
          <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1.5 font-mono text-[11px]">
            <span className={`w-2 h-2 rounded-full ${hasSubscribers ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
            <span className="text-slate-600">Active Subscribers:</span>
            <span className={`font-bold ${hasSubscribers ? 'text-emerald-700' : 'text-amber-800'}`}>
              {counts ? counts.active_subscribers : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Note about Home Screen Registration */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Individual mobile registration &amp; test notifications are active on the <strong>Home Screen</strong> (below Rain Warning Status).</span>
        </span>
      </div>

      {/* Main Broadcast Trigger Action (Opens Admin Key Popup) */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <p className="font-bold text-slate-800 text-xs">
                Admin Push Broadcast Authorization
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Requires Render ADMIN_KEY authentication before dispatching to all subscribers.
            </p>
          </div>

          <button
            onClick={() => {
              setAuthError(null);
              setBroadcastError(null);
              setShowAdminModal(true);
            }}
            disabled={cooldownSeconds > 0}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
          >
            {cooldownSeconds > 0 ? (
              <>
                <Clock className="w-4 h-4" />
                <span>Cooldown ({cooldownSeconds}s)</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Send Test Notification to All Subscribers</span>
              </>
            )}
          </button>
        </div>

        {/* Notice when subscribers count is zero */}
        {!hasSubscribers && counts !== null && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> The production database currently has <strong>0 active subscribers</strong>. If you send a test broadcast now, zero notifications will be sent. Register your device using the <strong>Stay Updated with Rain Alerts</strong> card on the home screen first.
            </p>
          </div>
        )}
      </div>

      {/* Broadcast Failure Notice */}
      {broadcastError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Broadcast Authorization Failed</p>
            <p className="text-[11px] text-rose-700 mt-0.5">{broadcastError}</p>
          </div>
        </div>
      )}

      {/* Dispatch Results Panel */}
      {result && (
        <div className={`p-4 rounded-xl border space-y-3 ${
          result.total_subscribers === 0 || result.status === 'zero_subscribers'
            ? 'bg-amber-50/80 border-amber-200'
            : 'bg-emerald-50/80 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className={`flex items-center gap-1.5 font-bold text-xs ${
              result.total_subscribers === 0 || result.status === 'zero_subscribers'
                ? 'text-amber-900'
                : 'text-emerald-900'
            }`}>
              {result.total_subscribers === 0 || result.status === 'zero_subscribers' ? (
                <>
                  <Info className="w-4 h-4 text-amber-600" />
                  Broadcast Complete — Zero Notifications Sent (0 Active Subscribers)
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Test Notification Broadcast Dispatched Successfully
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {new Date(result.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">Active Subscribers</span>
              <span className="text-base font-extrabold text-slate-800">{result.total_subscribers}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">Accepted by FCM/Apple</span>
              <span className={`text-base font-extrabold ${result.accepted > 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                {result.accepted}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">Failed Sends</span>
              <span className={`text-base font-extrabold ${result.failed > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                {result.failed}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block">Expired Deactivated</span>
              <span className="text-base font-extrabold text-slate-600">{result.expired}</span>
            </div>
          </div>

          {/* Clarification Note */}
          <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
            <strong className="text-slate-900">Delivery Status:</strong> {result.delivery_clarification}
          </div>
        </div>
      )}

      {/* Technical Reference: Mobile Behavior & Audio Conditions */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
          <Info className="w-4 h-4 text-sky-600" />
          <span>Mobile Device Delivery &amp; Sound Behavior Guide</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
          <div className="p-2 bg-slate-50 rounded-lg space-y-1">
            <strong className="text-slate-900 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-slate-700" />
              1. Website Closed or Minimized
            </strong>
            <p className="text-[10.5px] leading-relaxed">
              When the browser tab or PWA is closed, the device operating system receives the Web Push event via the background service worker (<code className="font-mono text-[9.5px] bg-slate-200 px-1 rounded">sw.js</code>) and posts it directly to the system notification tray.
            </p>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg space-y-1">
            <strong className="text-slate-900 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-slate-700" />
              2. Sound Limitations When Locked/Closed
            </strong>
            <p className="text-[10.5px] leading-relaxed">
              Web Push standards do not allow web apps to synthesize custom audio sirens or force 5-second alarms while the browser is closed or phone is locked. The notification plays the operating system's default notification tone or custom Android Notification Channel tone.
            </p>
          </div>
        </div>
      </div>

      {/* Dedicated Admin Key Input & Confirmation Popup */}
      {showAdminModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-300 text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <KeyRound className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">Admin Key Authentication</h4>
                  <p className="text-[11px] text-slate-500">Render ADMIN_KEY verification required</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAuthError(null);
                  setEnteredAdminKey('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exact Required Prompt Text */}
            <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-950 leading-relaxed font-medium">
              "This will send one test notification to all users who have enabled Raithu Alert notifications. It is NOT a real rain warning."
            </div>

            {/* Notification Payload Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
              <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Notification Content</div>
              <div className="font-bold text-slate-900">Title: Raithu Alert — Test Notification</div>
              <div className="text-slate-700">Body: This is a test notification. Your Raithu Alert notification system is working.</div>
              <div className="text-slate-500 text-[10px] pt-0.5">Sound: Standard OS notification chime (Non-emergency)</div>
            </div>

            {/* Admin Key Input Field */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-800">
                Enter Render ADMIN_KEY:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={enteredAdminKey}
                  onChange={(e) => {
                    setEnteredAdminKey(e.target.value);
                    setAuthError(null);
                    setIsKeyVerified(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExecuteBroadcast();
                  }}
                  placeholder="Paste your Render ADMIN_KEY"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  autoFocus
                />
              </div>
              <p className="text-[10.5px] text-slate-500">
                Validated securely on backend via Render environment variable <code className="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">ADMIN_KEY</code>.
              </p>
            </div>

            {/* Authentication Error Feedback */}
            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-900 text-xs font-semibold animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Key Verified Badge */}
            {isKeyVerified && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>✓ Admin key verified successfully. Ready to dispatch.</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setAuthError(null);
                  setEnteredAdminKey('');
                }}
                disabled={isSending || isVerifying}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyKeyOnly}
                disabled={isVerifying || isSending || !enteredAdminKey.trim()}
                className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition flex items-center gap-1.5"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify Key</span>
                )}
              </button>

              <button
                onClick={handleExecuteBroadcast}
                disabled={isSending || isVerifying || !enteredAdminKey.trim()}
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing &amp; Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Verify &amp; Send Broadcast</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
