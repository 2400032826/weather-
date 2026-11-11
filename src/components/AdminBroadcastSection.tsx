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
  ShieldCheck,
  Lock
} from 'lucide-react';
import { 
  sendAdminBroadcastTest, 
  fetchAdminSubscribersCount, 
  checkDeviceSubscriptionStatus,
  registerPushNotification,
  type AdminBroadcastResult,
  type DeviceSubscriptionInfo
} from '../lib/weatherService';

export const AdminBroadcastSection: React.FC = () => {
  const [adminKey, setAdminKey] = useState<string>('kadlur_admin_secret_2026');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [counts, setCounts] = useState<{ active_subscribers: number; total_registered: number; inactive_or_expired: number } | null>(null);
  const [loadingCounts, setLoadingCounts] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceSubscriptionInfo | null>(null);
  const [isCheckingDevice, setIsCheckingDevice] = useState<boolean>(false);
  const [isRegisteringDevice, setIsRegisteringDevice] = useState<boolean>(false);
  const [deviceRegisterMsg, setDeviceRegisterMsg] = useState<string | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [result, setResult] = useState<AdminBroadcastResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Check current device subscription status in database
  const refreshDeviceStatus = async () => {
    setIsCheckingDevice(true);
    setDeviceRegisterMsg(null);
    try {
      const info = await checkDeviceSubscriptionStatus('te', false);
      setDeviceInfo(info);
    } catch (e: any) {
      console.warn('Device status check note:', e);
    } finally {
      setIsCheckingDevice(false);
    }
  };

  // Load subscriber counts from production database
  const refreshCounts = async () => {
    setLoadingCounts(true);
    try {
      const data = await fetchAdminSubscribersCount(adminKey);
      setCounts(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    refreshCounts();
    refreshDeviceStatus();
  }, [adminKey]);

  // Handle immediate registration of this device with database confirmation
  const handleRegisterThisDevice = async () => {
    setIsRegisteringDevice(true);
    setDeviceRegisterMsg('Requesting permission and registering in database...');
    try {
      const res = await registerPushNotification('te', (step) => {
        setDeviceRegisterMsg(step);
      });
      setDeviceRegisterMsg(res.message);
      await refreshCounts();
      await refreshDeviceStatus();
    } catch (err: any) {
      setDeviceRegisterMsg(`Registration error: ${err.message || 'Failed'}`);
    } finally {
      setIsRegisteringDevice(false);
    }
  };

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  const handleBroadcast = async () => {
    setShowConfirmModal(false);
    setIsSending(true);
    setErrorMsg(null);
    try {
      const res = await sendAdminBroadcastTest(adminKey);
      setResult(res);
      setCooldownSeconds(60);
      refreshCounts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch test notification broadcast');
      if (err.message && err.message.includes('Cooldown active')) {
        setCooldownSeconds(60);
      }
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
              Safe testing of Web Push delivery across mobile devices (locked, closed, background)
            </p>
          </div>
        </div>

        {/* Subscriber counter badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { refreshCounts(); refreshDeviceStatus(); }}
            disabled={loadingCounts || isCheckingDevice}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition"
            title="Refresh subscriber count and device status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingCounts || isCheckingDevice ? 'animate-spin' : ''}`} />
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

      {/* 1. Device Subscription Verification Card */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-slate-700" />
            <strong className="text-xs text-slate-900">Your Current Device Status</strong>
          </div>
          <button
            onClick={refreshDeviceStatus}
            disabled={isCheckingDevice}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline font-medium"
          >
            {isCheckingDevice ? 'Checking database...' : 'Verify Status'}
          </button>
        </div>

        <div className="text-[11px]">
          {deviceInfo?.databaseVerified ? (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">✓ This device is subscribed and verified in the production database.</p>
                <p className="text-[10px] text-emerald-700 font-mono break-all mt-0.5">
                  Endpoint: {deviceInfo.endpoint ? `${deviceInfo.endpoint.slice(0, 45)}...` : 'Active'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Current Device Not Confirmed in Database</p>
                  <p className="text-[10.5px] text-amber-800 mt-0.5">
                    {deviceInfo?.message || 'Push subscription has not been saved or verified in the database.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRegisterThisDevice}
                disabled={isRegisteringDevice}
                className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                {isRegisteringDevice ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Registering with Database...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Subscribe &amp; Confirm This Device Now</span>
                  </>
                )}
              </button>
            </div>
          )}

          {deviceRegisterMsg && (
            <p className="text-[11px] font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-2">
              {deviceRegisterMsg}
            </p>
          )}
        </div>
      </div>

      {/* Admin Key Toggle & Configuration */}
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>Admin Protection: <strong className="text-emerald-700">Authenticated (X-Admin-Key)</strong></span>
        <button 
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="text-emerald-600 hover:underline font-semibold"
        >
          {showKeyInput ? 'Hide Secret Key' : 'Configure Secret Key'}
        </button>
      </div>

      {showKeyInput && (
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
          <label className="block text-[11px] font-semibold text-slate-700">
            Admin API Secret Key:
          </label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="kadlur_admin_secret_2026"
          />
        </div>
      )}

      {/* 2. Main Broadcast Trigger Action */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800 text-xs">
              Push Notification Broadcast Test
            </p>
            <p className="text-[11px] text-slate-500">
              Sends exactly one non-rain test notification using standard OS sound.
            </p>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={!hasSubscribers || isSending || cooldownSeconds > 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
              !hasSubscribers
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                : 'bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white'
            }`}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : cooldownSeconds > 0 ? (
              <>
                <Clock className="w-4 h-4" />
                <span>Cooldown ({cooldownSeconds}s)</span>
              </>
            ) : !hasSubscribers ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Broadcast Locked (0 Subscribers)</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Test Notification to All Subscribers</span>
              </>
            )}
          </button>
        </div>

        {/* Database verification lock explanation */}
        {!hasSubscribers && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Broadcast is locked:</strong> The production database currently has <strong>0 active subscribers</strong>. Please click "Subscribe &amp; Confirm This Device Now" above to register your Android device in the database before broadcasting.
            </p>
          </div>
        )}
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Broadcast Failed</p>
            <p className="text-[11px] text-rose-700 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Dispatch Results Panel */}
      {result && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Test Notification Broadcast Dispatched Successfully
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {new Date(result.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-center">
              <span className="text-[10px] text-slate-500 block">Active Subscribers</span>
              <span className="text-base font-extrabold text-slate-800">{result.total_subscribers}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-center">
              <span className="text-[10px] text-slate-500 block">Accepted by FCM/Apple</span>
              <span className="text-base font-extrabold text-emerald-700">{result.accepted}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-center">
              <span className="text-[10px] text-slate-500 block">Failed Dispatches</span>
              <span className="text-base font-extrabold text-amber-700">{result.failed}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-center">
              <span className="text-[10px] text-slate-500 block">Expired Deactivated</span>
              <span className="text-base font-extrabold text-slate-600">{result.expired}</span>
            </div>
          </div>

          {/* Clarification Note */}
          <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-lg border border-emerald-100/60 leading-relaxed">
            <strong className="text-emerald-900">Push Gateway Delivery Notice:</strong> An HTTP 200/201 response confirms that Google FCM, Apple APNs, or Mozilla Autopush accepted the encrypted VAPID payload for delivery. Delivery to the device screen depends on active network connectivity and the device's battery optimization settings.
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center gap-2.5 text-amber-600">
              <div className="p-2 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">Confirm Test Broadcast</h4>
                <p className="text-[11px] text-slate-500">Developer / Admin Push Verification</p>
              </div>
            </div>

            {/* Exact Required Prompt Text */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-950 leading-relaxed font-medium">
              "This will send one test notification to all users who have enabled Raithu Alert notifications. It is NOT a real rain warning."
            </div>

            {/* Notification Payload Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
              <div className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Notification Preview</div>
              <div className="font-bold text-slate-900">Title: Raithu Alert — Test Notification</div>
              <div className="text-slate-700">Body: This is a test notification. Your Raithu Alert notification system is working.</div>
              <div className="text-slate-500 text-[10px] pt-1">Sound: Standard OS notification chime (Non-emergency)</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Confirm &amp; Send Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
