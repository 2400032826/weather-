import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Radio,
  Zap,
  Bell,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';

interface WeatherAlertsProps {
  weather: KadlurWeatherState;
  currentLang: Language;
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ weather, currentLang }) => {
  const t = translations[currentLang];
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const alert = weather.activeAlert;

  const handleEnableAlerts = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('Raithu Alert - Kadlur Village', {
            body: 'Weather & rain alerts enabled for Kadlur.',
          });
        }
      } catch (e) {
        console.warn('Notification permission error:', e);
      }
    }
    setSubscribed(true);
  };

  const alertCatalog = [
    {
      category: 'NO_SIGNIFICANT_RAIN',
      severity: 'INFO',
      title: t.noRainDetectedStatus,
      descEn: 'Conditions dry and stable within 30 km radius of Kadlur.',
      descTe: 'కడ్లూరు చుట్టూ 30 కి.మీ లోపు వర్షపు మేఘాలు లేవు. వాతావరణం పొడిగా ఉంది.',
      descKn: 'ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತಲಿನ 30 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಮಳೆ ಮೋಡಗಳಿಲ್ಲ.',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      category: 'RAIN_APPROACHING',
      severity: 'WATCH',
      title: t.rainApproachingStatus,
      descEn: 'Active rain cell detected tracking within 15 km towards Kadlur.',
      descTe: 'కడ్లూరు వైపు వర్షపు మేఘాలు కదులుతున్నాయి (15 కి.మీ సమీపంలో).',
      descKn: 'ಕಡ್ಲೂರು ಗ್ರಾಮದ ಕಡೆಗೆ ಮಳೆ ಮೋಡಗಳು ಬರುತ್ತಿವೆ (15 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ).',
      icon: Radio,
      style: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      category: 'RAIN_DETECTED',
      severity: 'ADVISORY',
      title: t.rainDetectedNearbyStatus,
      descEn: 'Active rainfall detected within 5 km immediate vicinity of Kadlur.',
      descTe: 'కడ్లూరు సమీపంలో వర్షం కురుస్తోంది (5 కి.మీ లోపు).',
      descKn: 'ಕಡ್ಲೂರು ಗ್ರಾಮದ 5 ಕಿ.ಮೀ ಆಸುಪಾಸಿನಲ್ಲಿ ಮಳೆಯಾಗುತ್ತಿದೆ.',
      icon: Droplets,
      style: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      category: 'HEAVY_RAINFALL',
      severity: 'CRITICAL',
      title: t.heavyRainWarningStatus,
      descEn: 'Intense rain (>15 mm/h). Protect open crops, drying paddy, and cotton.',
      descTe: 'భారీ వర్షపు హెచ్చరిక (>15 మి.మీ/గం). కళ్లాల్లోని ధాన్యం, పత్తిని భద్రపరచండి.',
      descKn: 'ಭಾರೀ ಮಳೆಯ ಎಚ್ಚರಿಕೆ (>15 ಮಿಮೀ/ಗಂ). ಕಣದಲ್ಲಿರುವ ಧಾನ್ಯ ಮತ್ತು ಬೆಳೆಗಳನ್ನು ರಕ್ಷಿಸಿ.',
      icon: AlertTriangle,
      style: 'bg-rose-50 text-rose-800 border-rose-300',
    },
    {
      category: 'THUNDERSTORM',
      severity: 'WARNING',
      title: t.thunderstormWarningStatus,
      descEn: 'Convective thunderstorm & gusty winds. Avoid open fields & solitary trees.',
      descTe: 'ఉరుములు, ఈదురు గాలుల ప్రమాదం. పొలాల్లో ఉన్నవారు చెట్ల కింద ఉండకండి.',
      descKn: 'ಗುಡುಗು ಸಹಿತ ಬಿರುಗಾಳಿ. ಹೊಲದಲ್ಲಿರುವ ರೈತರು ಮರಗಳ ಕೆಳಗೆ ನಿಲ್ಲಬೇಡಿ.',
      icon: Zap,
      style: 'bg-amber-50 text-amber-900 border-amber-300',
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BellRing className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
            {t.alertsTitle}
          </h2>
        </div>
        <button
          onClick={handleEnableAlerts}
          disabled={subscribed}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 flex items-center gap-1.5 ${
            subscribed
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{subscribed ? t.alertsSubscribed : t.enableAlerts}</span>
        </button>
      </div>

      {/* Active Alert Banner */}
      <div className="p-4 rounded-2xl border bg-emerald-50/70 border-emerald-200 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-extrabold text-base text-emerald-950">
              {currentLang === 'te'
                ? alert.title
                : currentLang === 'kn'
                ? alert.title
                : alert.title}
            </span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900 border border-emerald-300">
            {alert.severity}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-emerald-900 font-medium">
          {currentLang === 'te'
            ? alert.descriptionTe
            : currentLang === 'kn'
            ? alert.descriptionKn
            : alert.description}
        </p>

        {/* Secondary languages shown for community clarity */}
        {currentLang !== 'te' && (
          <p className="text-xs text-slate-600 pt-1 border-t border-emerald-100">
            <strong>తెలుగు:</strong> {alert.descriptionTe}
          </p>
        )}
        {currentLang !== 'kn' && (
          <p className="text-xs text-slate-600 pt-1 border-t border-emerald-100">
            <strong>ಕನ್ನಡ:</strong> {alert.descriptionKn}
          </p>
        )}
      </div>

      {/* Standard 5 Alert Categories Required by Scope */}
      <div className="space-y-2.5 pt-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Standard Alert Protocol Categories
        </h3>
        {alertCatalog.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex items-start gap-3 transition ${item.style}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{item.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700">
                    {item.severity}
                  </span>
                </div>
                <p className="text-slate-700 mt-1">
                  {currentLang === 'te' ? item.descTe : currentLang === 'kn' ? item.descKn : item.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
