import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  PowerOff,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import type { Language } from '../lib/translations';
import {
  registerPushNotification,
  unsubscribePushNotification,
  checkDeviceSubscriptionStatus,
  sendTestNotificationToThisDevice,
  type DeviceTestPushResult,
  type DeviceSubscriptionInfo
} from '../lib/weatherService';

interface NotificationControlProps {
  currentLang: Language;
}

export type RegistrationStatus = 
  | 'NOT_REGISTERED' 
  | 'REGISTERING' 
  | 'VERIFIED' 
  | 'PERMISSION_DENIED' 
  | 'REGISTRATION_FAILED';

export const NotificationControl: React.FC<NotificationControlProps> = ({ currentLang }) => {
  const [status, setStatus] = useState<RegistrationStatus>('NOT_REGISTERED');
  const [statusDetail, setStatusDetail] = useState<string>('');
  const [deviceInfo, setDeviceInfo] = useState<DeviceSubscriptionInfo | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Test Notification state
  const [isSendingDeviceTest, setIsSendingDeviceTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<DeviceTestPushResult | null>(null);

  // Troubleshooting collapsible toggle
  const [showTroubleshooting, setShowTroubleshooting] = useState<boolean>(false);

  // Check subscription status from the backend database on initial mount
  const checkStatusFromDatabase = async (autoSync: boolean = false) => {
    setIsChecking(true);
    setStatusDetail('');
    try {
      const info = await checkDeviceSubscriptionStatus(currentLang, autoSync);
      setDeviceInfo(info);

      if (info.permission === 'denied') {
        setStatus('PERMISSION_DENIED');
        setStatusDetail(
          currentLang === 'te'
            ? 'నోటిఫికేషన్లు బ్లాక్ చేయబడ్డాయి. బ్రౌజర్ సెట్టింగ్‌లలో ప్రారంభించండి.'
            : currentLang === 'kn'
            ? 'ನೋಟಿಫಿಕೇಶನ್‌ಗಳು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ.'
            : 'Notifications are blocked. Enable them in your browser settings.'
        );
      } else if (info.databaseVerified && info.isSubscribed) {
        setStatus('VERIFIED');
        setStatusDetail(
          currentLang === 'te'
            ? 'మీ మొబైల్ వర్ష అలర్ట్‌ల కోసం విజయవంతంగా నమోదైంది.'
            : currentLang === 'kn'
            ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಮಳೆ ಎಚ್ಚರಿಕೆಗಳಿಗಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.'
            : 'Your mobile is successfully registered for rain alerts.'
        );
      } else {
        setStatus('NOT_REGISTERED');
        setStatusDetail(
          currentLang === 'te'
            ? 'మీ మొబైల్ వర్ష అలర్ట్‌ల కోసం నమోదు చేయబడలేదు.'
            : currentLang === 'kn'
            ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಮಳೆ ಎಚ್ಚರಿಕೆಗಳಿಗಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿಲ್ಲ.'
            : 'Your mobile is not registered for rain alerts.'
        );
      }
    } catch (err: any) {
      setStatus('NOT_REGISTERED');
      setStatusDetail(err?.message || 'Status check failed.');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatusFromDatabase(true);
  }, [currentLang]);

  // Main Action: Turn On Rain Alerts (Strict 8-Step Flow with Database Verification)
  const handleTurnOnAlerts = async () => {
    setStatus('REGISTERING');
    setStatusDetail(
      currentLang === 'te'
        ? 'మీ మొబైల్‌ను నమోదు చేస్తున్నాము. దయచేసి వేచి ఉండండి...'
        : currentLang === 'kn'
        ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಕಾಯಿರಿ...'
        : 'Registering your mobile. Please wait...'
    );
    setTestResult(null);

    const result = await registerPushNotification(currentLang, (stepMsg) => {
      setStatusDetail(stepMsg);
    });

    if (result.success && result.state === 'ON') {
      setStatus('VERIFIED');
      setStatusDetail(
        currentLang === 'te'
          ? 'మీ మొబైల్ వర్ష అలర్ట్‌ల కోసం విజయవంతంగా నమోదైంది.'
          : currentLang === 'kn'
          ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಮಳೆ ಎಚ್ಚರಿಕೆಗಳಿಗಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.'
          : 'Your mobile is successfully registered for rain alerts.'
      );
      await checkStatusFromDatabase(false);
    } else if (result.state === 'DENIED') {
      setStatus('PERMISSION_DENIED');
      setStatusDetail(
        currentLang === 'te'
          ? 'నోటిఫికేషన్లు బ్లాక్ చేయబడ్డాయి. దయచేసి బ్రౌజర్ సెట్టింగ్‌లలో ప్రారంభించండి.'
          : currentLang === 'kn'
          ? 'ನೋಟಿಫಿಕೇಶನ್‌ಗಳು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ.'
          : 'Notifications are blocked. Enable them in your browser settings.'
      );
    } else {
      setStatus('REGISTRATION_FAILED');
      setStatusDetail(result.message || 'Registration failed. Please check connection and retry.');
    }
  };

  // Turn Off Alerts
  const handleTurnOffAlerts = async () => {
    setStatus('REGISTERING');
    setStatusDetail('Unsubscribing...');
    await unsubscribePushNotification();
    setStatus('NOT_REGISTERED');
    setStatusDetail(
      currentLang === 'te'
        ? 'మీ మొబైల్ వర్ష అలర్ట్‌ల కోసం నమోదు చేయబడలేదు.'
        : currentLang === 'kn'
        ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಮಳೆ ಎಚ್ಚರಿಕೆಗಳಿಗಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿಲ್ಲ.'
        : 'Your mobile is not registered for rain alerts.'
    );
    setTestResult(null);
    await checkStatusFromDatabase(false);
  };

  // Send Test Notification to THIS device only
  const handleTestThisDevice = async () => {
    setIsSendingDeviceTest(true);
    setTestResult(null);

    try {
      const res = await sendTestNotificationToThisDevice(currentLang);
      setTestResult(res);
      if (res.status === 'subscription_expired' || res.status === 'device_not_registered') {
        setStatus('NOT_REGISTERED');
      }
    } catch (err: any) {
      setTestResult({
        status: 'failed',
        message: `Test notification failed: ${err.message || 'Network error'}`
      });
    } finally {
      setIsSendingDeviceTest(false);
    }
  };

  // Farmer-friendly Multilingual Texts
  const cardTitle = 
    currentLang === 'te'
      ? 'వర్ష అలర్ట్‌లతో అప్రమత్తంగా ఉండండి'
      : currentLang === 'kn'
      ? 'ಮಳೆ ಎಚ್ಚರಿಕೆಗಳೊಂದಿಗೆ ಮಾಹಿತಿಯಲ್ಲಿರಿ'
      : 'Stay Updated with Rain Alerts';

  const cardSubtitle =
    currentLang === 'te'
      ? 'కడ్లూరు కోసం ముఖ్యమైన వర్ష హెచ్చరికలను పొందడానికి మీ మొబైల్‌ను నమోదు చేసుకోండి.'
      : currentLang === 'kn'
      ? 'ಕಡ್ಲೂರು ಗ್ರಾಮಕ್ಕೆ ಪ್ರಮುಖ ಮಳೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಮೊಬೈಲ್ ನೋಂದಾಯಿಸಿ.'
      : 'Register your mobile to receive important rain warnings for Kadlur.';

  const turnOnLabel =
    currentLang === 'te'
      ? 'వర్ష అలర్ట్‌లను ఆన్ చేయండి'
      : currentLang === 'kn'
      ? 'ಮಳೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಆನ್ ಮಾಡಿ'
      : 'TURN ON RAIN ALERTS';

  const testMyDeviceLabel =
    currentLang === 'te'
      ? 'నా మొబైల్‌లో టెస్ట్ నోటిఫికేషన్'
      : currentLang === 'kn'
      ? 'ನನ್ನ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಟೆಸ್ಟ್ ನೋಟಿಫಿಕೇಶನ್'
      : 'TEST NOTIFICATION ON MY MOBILE';

  const registrationNote =
    currentLang === 'te'
      ? 'మీ మొబైల్ నమోదైంది. ధృవీకరించబడిన వర్ష హెచ్చరిక వచ్చినప్పుడు మాత్రమే మీకు నోటిఫికేషన్ అందుతుంది.'
      : currentLang === 'kn'
      ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ನೋಂದಾಯಿಸಲಾಗಿದೆ. ಪರಿಶೀಲಿಸಿದ ಮಳೆ ಎಚ್ಚರಿಕೆ ಬಂದಾಗ ಮಾತ್ರ ನಿಮಗೆ ಸಂದೇಶ ಬರುತ್ತದೆ.'
      : 'Your mobile is registered. You will receive notifications when a verified rain warning is generated.';

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/90 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl transition ${
            status === 'VERIFIED'
              ? 'bg-emerald-100 text-emerald-800'
              : status === 'PERMISSION_DENIED'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-emerald-50 text-emerald-700'
          }`}>
            {status === 'VERIFIED' ? (
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            ) : (
              <Smartphone className="w-6 h-6 text-emerald-700" />
            )}
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-base sm:text-lg">
              {cardTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {cardSubtitle}
            </p>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => checkStatusFromDatabase(false)}
            disabled={isChecking}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
            title="Re-check database registration"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
          <span className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 transition ${
            status === 'VERIFIED'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : status === 'REGISTERING'
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : status === 'PERMISSION_DENIED'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : status === 'REGISTRATION_FAILED'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {status === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {status === 'REGISTERING' && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />}
            {status === 'PERMISSION_DENIED' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
            {status === 'REGISTRATION_FAILED' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
            <span>
              {status === 'VERIFIED'
                ? 'VERIFIED'
                : status === 'REGISTERING'
                ? 'REGISTERING'
                : status === 'PERMISSION_DENIED'
                ? 'BLOCKED'
                : status === 'REGISTRATION_FAILED'
                ? 'FAILED'
                : 'NOT REGISTERED'}
            </span>
          </span>
        </div>
      </div>

      {/* Status Description Box */}
      <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
        status === 'VERIFIED'
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : status === 'PERMISSION_DENIED'
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : status === 'REGISTRATION_FAILED'
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : status === 'REGISTERING'
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <p className="font-bold flex items-center gap-1.5">
          {status === 'VERIFIED' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {status === 'REGISTERING' && <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />}
          {status === 'PERMISSION_DENIED' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          {status === 'REGISTRATION_FAILED' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
          {status === 'NOT_REGISTERED' && <Info className="w-4 h-4 text-slate-500 shrink-0" />}
          <span>
            {status === 'NOT_REGISTERED' && 'Your mobile is not registered for rain alerts.'}
            {status === 'REGISTERING' && 'Registering your mobile. Please wait...'}
            {status === 'VERIFIED' && 'Your mobile is successfully registered for rain alerts.'}
            {status === 'PERMISSION_DENIED' && 'Notifications are blocked. Enable them in your browser settings.'}
            {status === 'REGISTRATION_FAILED' && `Registration error: ${statusDetail}`}
          </span>
        </p>

        {status === 'VERIFIED' && (
          <p className="text-[11px] text-emerald-800 mt-1 font-medium">
            {registrationNote}
          </p>
        )}
      </div>

      {/* Main Buttons Area */}
      <div className="space-y-3">
        {status === 'VERIFIED' ? (
          /* When Verified: Test Notification Button + Turn Off Option */
          <div className="space-y-3">
            {/* 1. Large Button: TEST NOTIFICATION ON MY MOBILE */}
            <button
              onClick={handleTestThisDevice}
              disabled={isSendingDeviceTest}
              className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wide shadow-md bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 transition flex items-center justify-center gap-2.5"
            >
              {isSendingDeviceTest ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Checking push gateway...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{testMyDeviceLabel}</span>
                </>
              )}
            </button>

            {/* Test Notification Result Banner */}
            {testResult && (
              <div className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                testResult.status === 'accepted'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {testResult.status === 'accepted' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    {testResult.status === 'accepted' && 'Test notification request accepted by push service.'}
                    {testResult.status === 'failed' && (testResult.message || 'Test notification failed.')}
                    {testResult.status === 'subscription_expired' && 'Device subscription expired. Please re-register.'}
                    {testResult.status === 'permission_denied' && 'Notification permission denied in browser.'}
                    {testResult.status === 'device_not_registered' && 'Device not registered.'}
                  </span>
                </div>
                {testResult.delivery_clarification && (
                  <p className="text-[10.5px] text-slate-600 pt-0.5 leading-relaxed">
                    <strong>Notice:</strong> {testResult.delivery_clarification}
                  </p>
                )}
              </div>
            )}

            {/* Turn Off Alerts Option */}
            <div className="flex justify-end pt-1">
              <button
                onClick={handleTurnOffAlerts}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition flex items-center gap-1.5"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'te'
                    ? 'అలర్ట్‌లు ఆఫ్ చేయండి'
                    : currentLang === 'kn'
                    ? 'ಎಚ್ಚರಿಕೆಗಳನ್ನು ಆಫ್ ಮಾಡಿ'
                    : 'Turn Off Rain Alerts'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* When NOT registered or failed */
          <div className="space-y-2">
            <button
              onClick={status === 'PERMISSION_DENIED' ? undefined : handleTurnOnAlerts}
              disabled={status === 'REGISTERING'}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg tracking-wide transition active:scale-[0.98] shadow-md flex items-center justify-center gap-3 ${
                status === 'REGISTERING'
                  ? 'bg-amber-400 text-slate-950 cursor-wait'
                  : status === 'PERMISSION_DENIED'
                  ? 'bg-rose-100 text-rose-800 border-2 border-rose-300 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {status === 'REGISTERING' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin shrink-0" />
                  <span>Registering...</span>
                </>
              ) : status === 'PERMISSION_DENIED' ? (
                <>
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                  <span>NOTIFICATIONS BLOCKED</span>
                </>
              ) : (
                <>
                  <Bell className="w-6 h-6 shrink-0" />
                  <span>{turnOnLabel}</span>
                </>
              )}
            </button>

            {/* Retry Button if registration failed */}
            {status === 'REGISTRATION_FAILED' && (
              <div className="flex justify-center pt-1">
                <button
                  onClick={handleTurnOnAlerts}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Registration</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Troubleshooting for Farmers Collapsible */}
      <div className="border-t border-slate-100 pt-3">
        <button
          onClick={() => setShowTroubleshooting(!showTroubleshooting)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 py-1 transition"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            <span>
              {currentLang === 'te'
                ? 'నోటిఫికేషన్ సమస్యలా? (సహాయం / ట్రబుల్షూటింగ్)'
                : currentLang === 'kn'
                ? 'ಸಂದೇಶ ಬರುತ್ತಿಲ್ಲವೇ? (ಸಮಸ್ಯೆ ಪರಿಹಾರ)'
                : 'Not receiving notifications? (Troubleshooting for Farmers)'}
            </span>
          </span>
          {showTroubleshooting ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showTroubleshooting && (
          <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2.5 animate-in fade-in">
            <p className="font-bold text-slate-900">
              {currentLang === 'te'
                ? 'నోటిఫికేషన్ రానిచో క్రింది విషయాలు సరిచూడండి:'
                : currentLang === 'kn'
                ? 'ಸಂದೇಶ ಬಾರದಿದ್ದರೆ ಈ ಕೆಳಗಿನವುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ:'
                : 'Follow this simple checklist if notifications are not arriving:'}
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-[11px] text-slate-600">
              <li>
                <strong>Browser Permission:</strong> Ensure notifications are set to "Allow" in your browser address bar (tap the 🔒 icon).
              </li>
              <li>
                <strong>Internet Connection:</strong> Ensure your phone has active mobile data or Wi-Fi connectivity.
              </li>
              <li>
                <strong>Service Worker:</strong> Raithu Alert background worker (<code className="font-mono text-[10px] bg-slate-200 px-1 rounded">/sw.js</code>) must be installed.
              </li>
              <li>
                <strong>Database Subscription:</strong> Your device must show <strong className="text-emerald-700">VERIFIED</strong> status above.
              </li>
              <li>
                <strong>Push Gateway:</strong> The push service (Google FCM) must accept the message request.
              </li>
            </ul>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 font-mono">
                Endpoint: {deviceInfo?.endpoint ? `${deviceInfo.endpoint.slice(0, 35)}...` : 'Not saved'}
              </span>
              <button
                onClick={() => checkStatusFromDatabase(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-800 font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Check Status</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
