import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  PowerOff,
  ShieldCheck,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { NotificationButtonState } from '../lib/weatherService';
import {
  registerPushNotification,
  unsubscribePushNotification,
  sendTestNotification,
  checkDeviceSubscriptionStatus,
} from '../lib/weatherService';

interface NotificationControlProps {
  currentLang: Language;
}

export const NotificationControl: React.FC<NotificationControlProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [buttonState, setButtonState] = useState<NotificationButtonState>('OFF');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [isCheckingDb, setIsCheckingDb] = useState<boolean>(false);

  // Initialize and verify database subscription safely on mount
  useEffect(() => {
    let isMounted = true;
    if (typeof window === 'undefined') return;

    if (!('Notification' in window)) {
      setButtonState('OFF');
      return;
    }

    if (Notification.permission === 'denied') {
      setButtonState('DENIED');
      return;
    }

    setIsCheckingDb(true);
    checkDeviceSubscriptionStatus(currentLang, true)
      .then((info) => {
        if (!isMounted) return;
        setIsCheckingDb(false);
        if (info.databaseVerified && info.isSubscribed) {
          setButtonState('ON');
          setStatusMessage('✓ Active: Registered and verified in production database');
        } else if (Notification.permission === 'granted') {
          setButtonState('OFF');
          setStatusMessage(info.message);
        } else {
          setButtonState('OFF');
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsCheckingDb(false);
          setButtonState('OFF');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentLang]);

  // Main Action: Turn On Alerts (Step 1 to Step 6)
  const handleTurnOnAlerts = async () => {
    setButtonState('ACTIVATING');
    setStatusMessage(null);
    setTestSentMessage(null);

    const result = await registerPushNotification(currentLang, (stepMsg) => {
      setStatusMessage(stepMsg);
    });

    setButtonState(result.state);
    setStatusMessage(result.message);

    if (result.state === 'ERROR') {
      setTimeout(() => {
        // Allow user to try again easily
        setButtonState('OFF');
      }, 5000);
    }
  };

  // Turn Off Alerts
  const handleTurnOffAlerts = async () => {
    setButtonState('ACTIVATING');
    setStatusMessage('Unsubscribing...');
    const result = await unsubscribePushNotification();
    setButtonState(result.state);
    setStatusMessage(
      currentLang === 'te'
        ? 'వర్ష అలర్ట్‌లు ఆఫ్ చేయబడ్డాయి.'
        : currentLang === 'kn'
        ? 'ಮಳೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಆಫ್ ಮಾಡಲಾಗಿದೆ.'
        : 'Rain alerts turned off.'
    );
    setTestSentMessage(null);
  };

  // Test Notification Dispatch
  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestSentMessage(
      currentLang === 'te'
        ? 'పరీక్షా నోటిఫికేషన్ పంపుతున్నాము...'
        : currentLang === 'kn'
        ? 'ಪರೀಕ್ಷಾ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...'
        : 'Dispatching test notification...'
    );

    const res = await sendTestNotification(currentLang);
    setIsSendingTest(false);
    setTestSentMessage(res.message);

    setTimeout(() => {
      setTestSentMessage(null);
    }, 6000);
  };

  // Farmer-friendly onboarding helper text
  const getOnboardingIntro = () => {
    if (currentLang === 'te') {
      return 'కడ్లూరు వైపు వర్షం వచ్చినప్పుడు హెచ్చరికలు పొందడానికి అలర్ట్‌లను ప్రారంభించండి.';
    }
    if (currentLang === 'kn') {
      return 'ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಬಂದಾಗ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಲು ಅಲರ್ಟ್‌ಗಳನ್ನು ಪ್ರಾರಂಭಿಸಿ.';
    }
    return 'Enable rain alerts to receive warnings when rain approaches Kadlur.';
  };

  // Button Label by State
  const getButtonLabel = () => {
    switch (buttonState) {
      case 'ACTIVATING':
        return currentLang === 'te'
          ? 'అలర్ట్‌లు సిద్ధం చేస్తున్నాము...'
          : currentLang === 'kn'
          ? 'ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...'
          : 'SETTING UP ALERTS...';

      case 'ON':
        return currentLang === 'te'
          ? '✓ వర్ష అలర్ట్‌లు ఆన్ (RAIN ALERTS ON)'
          : currentLang === 'kn'
          ? '✓ ಮಳೆ ಎಚ್ಚರಿಕೆ ಆನ್ (RAIN ALERTS ON)'
          : '✓ RAIN ALERTS ON';

      case 'DENIED':
        return currentLang === 'te'
          ? 'నోటిఫికేషన్లు బ్లాక్ చేయబడ్డాయి'
          : currentLang === 'kn'
          ? 'ನೋಟಿಫಿಕೇಶನ್‌ಗಳು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ'
          : 'NOTIFICATIONS BLOCKED';

      case 'ERROR':
        return currentLang === 'te'
          ? 'విఫలమైంది – మళ్లీ ప్రయత్నించండి'
          : currentLang === 'kn'
          ? 'ವಿಫಲವಾಗಿದೆ – ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'
          : 'SETUP FAILED – TRY AGAIN';

      case 'OFF':
      default:
        return currentLang === 'te'
          ? 'వర్ష సూచనలను పొందడానికి ప్రారంభించండి'
          : currentLang === 'kn'
          ? 'ಮಳೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಲು ಪ್ರಾರಂಭಿಸಿ'
          : 'TURN ON RAIN ALERTS';
    }
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 space-y-4">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2.5 rounded-2xl transition ${
              buttonState === 'ON'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {buttonState === 'ON' ? (
              <BellRing className="w-6 h-6 animate-bounce" />
            ) : (
              <Bell className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-base sm:text-lg">
              {t.alertsTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {getOnboardingIntro()}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <span
          className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 uppercase transition ${
            buttonState === 'ON'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : buttonState === 'DENIED'
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : buttonState === 'ERROR'
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-slate-100 text-slate-600 border-slate-300'
          }`}
        >
          {buttonState === 'ON' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          {buttonState === 'ACTIVATING' && <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />}
          {isCheckingDb && buttonState !== 'ACTIVATING' && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />}
          {buttonState === 'DENIED' && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
          {buttonState === 'ERROR' && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
          <span>
            {buttonState === 'ON'
              ? t.alertsOnBtn
              : buttonState === 'DENIED'
              ? 'BLOCKED'
              : buttonState === 'ACTIVATING'
              ? 'ACTIVATING'
              : buttonState === 'ERROR'
              ? 'ERROR'
              : t.alertsOffBtn}
          </span>
        </span>
      </div>

      {/* Main Single Action Button */}
      <div>
        {buttonState === 'ON' ? (
          /* When ON: Large Green Button */
          <div className="space-y-3">
            <div className="w-full py-4 px-6 rounded-2xl font-black text-lg sm:text-xl tracking-wide shadow-lg bg-emerald-600 text-white flex items-center justify-center gap-3">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <span>{getButtonLabel()}</span>
            </div>

            {/* Actions Strip: Send Test + Turn Off */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              {/* Send Test Notification Button */}
              <button
                onClick={handleSendTest}
                disabled={isSendingTest}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition active:scale-95 shadow flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSendingTest
                    ? '...'
                    : currentLang === 'te'
                    ? '🔔 పరీక్షా నోటిఫికేషన్ పంపండి'
                    : currentLang === 'kn'
                    ? '🔔 ಟೆಸ್ಟ್ ನೋಟಿಫಿಕೇಶನ್ ಕಳುಹಿಸಿ'
                    : '🔔 SEND TEST NOTIFICATION'}
                </span>
              </button>

              {/* Turn Off Button */}
              <button
                onClick={handleTurnOffAlerts}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-300 transition flex items-center gap-1.5"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'te'
                    ? 'అలర్ట్‌లు ఆఫ్ చేయండి'
                    : currentLang === 'kn'
                    ? 'ಎಚ್ಚರಿಕೆಗಳನ್ನು ಆಫ್ ಮಾಡಿ'
                    : 'Turn Off Alerts'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* When OFF, ACTIVATING, DENIED, or ERROR */
          <button
            onClick={buttonState === 'DENIED' ? undefined : handleTurnOnAlerts}
            disabled={buttonState === 'ACTIVATING'}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg tracking-wide transition active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 ${
              buttonState === 'ACTIVATING'
                ? 'bg-amber-400 text-slate-950 cursor-wait'
                : buttonState === 'DENIED'
                ? 'bg-rose-100 text-rose-800 border-2 border-rose-300 cursor-not-allowed'
                : buttonState === 'ERROR'
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-400'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-slate-300 shadow-slate-300/40'
            }`}
          >
            {buttonState === 'ACTIVATING' ? (
              <Loader2 className="w-6 h-6 animate-spin shrink-0" />
            ) : buttonState === 'DENIED' || buttonState === 'ERROR' ? (
              <AlertCircle className="w-6 h-6 shrink-0" />
            ) : (
              <Bell className="w-6 h-6 shrink-0 text-slate-600" />
            )}
            <span>{getButtonLabel()}</span>
          </button>
        )}
      </div>

      {/* Denied Permission Helper Message */}
      {buttonState === 'DENIED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-900 flex items-start gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">
              {currentLang === 'te'
                ? 'నోటిఫికేషన్లు బ్రౌజర్‌లో బ్లాక్ చేయబడ్డాయి.'
                : currentLang === 'kn'
                ? 'ಬ್ರೌಸರ್‌ನಲ್ಲಿ ನೋಟಿಫಿಕೇಶನ್‌ಗಳನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.'
                : 'Notifications are blocked in your browser.'}
            </strong>
            <span className="text-slate-600 mt-0.5 block">
              {currentLang === 'te'
                ? 'దయచేసి బ్రౌజర్ అడ్రస్ బార్‌లోని లాక్ (🔒) చిహ్నాన్ని నొక్కి, నోటిఫికేషన్లను "Allow" చేయండి.'
                : currentLang === 'kn'
                ? 'ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಅಡ್ರೆಸ್ ಬಾರ್‌ನಲ್ಲಿರುವ ಲಾಕ್ (🔒) ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ, ನೋಟಿಫಿಕೇಶನ್ "Allow" ಮಾಡಿ.'
                : 'Please tap the lock (🔒) icon in the browser URL bar and set Notifications to "Allow".'}
            </span>
          </div>
        </div>
      )}

      {/* Progress / Status Message feedback */}
      {statusMessage && (
        <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          {statusMessage}
        </p>
      )}

      {/* Test Notification confirmation message */}
      {testSentMessage && (
        <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-300 animate-pulse">
          {testSentMessage}
        </p>
      )}
    </section>
  );
};
