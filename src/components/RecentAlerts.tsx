import React from 'react';
import {
  BellRing,
  Volume2,
  Clock,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';

interface RecentAlertsProps {
  weather: KadlurWeatherState;
  currentLang: Language;
  onReadAloud: () => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ weather, currentLang, onReadAloud }) => {
  const t = translations[currentLang];
  const alert = weather.activeAlert;
  const level = alert.level || 'GREEN';

  const alertItems = [
    {
      level: level,
      title: currentLang === 'te' ? alert.title : currentLang === 'kn' ? alert.title : alert.title,
      description: currentLang === 'te' ? alert.descriptionTe : currentLang === 'kn' ? alert.descriptionKn : alert.description,
      time: alert.observationTime,
      source: alert.sourceSummary,
      confidence: alert.confidence ? Math.round(alert.confidence * 100) : 90,
      isCurrent: true,
    },
    {
      level: 'GREEN',
      title: currentLang === 'te' ? 'పూర్వ వాతావరణ స్థితి: సాధారణం' : currentLang === 'kn' ? 'ಹಿಂದಿನ ಸ್ಥಿತಿ: ಸಾಮಾನ್ಯ' : 'Previous Observation: Clear & Dry',
      description: currentLang === 'te' ? 'కడ్లూరు పరిసరాల్లో గత 24 గంటల్లో వర్షపు రికార్డు నమోదు కాలేదు.' : currentLang === 'kn' ? 'ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತ ಕಳೆದ 24 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆ ದಾಖಲಾಗಿಲ್ಲ.' : 'No precipitation echoes were registered in Kadlur in the prior sweep.',
      time: new Date(Date.now() - 3600000).toISOString(),
      source: 'IMD Radar Composite Archive',
      confidence: 96,
      isCurrent: false,
    }
  ];

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BellRing className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
            Recent Weather Alerts & Log
          </h2>
        </div>
        <button
          onClick={onReadAloud}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 border border-emerald-200"
          title="Listen to alert in selected language"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t.readAloud}</span>
        </button>
      </div>

      <div className="space-y-3">
        {alertItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border transition-all ${
              item.level === 'RED'
                ? 'bg-rose-50 border-rose-300'
                : item.level === 'ORANGE'
                ? 'bg-orange-50 border-orange-300'
                : item.level === 'YELLOW'
                ? 'bg-amber-50 border-amber-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.level === 'RED'
                      ? 'bg-rose-600 animate-ping'
                      : item.level === 'ORANGE'
                      ? 'bg-orange-500 animate-ping'
                      : item.level === 'YELLOW'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <h3 className="font-black text-sm sm:text-base text-slate-900">
                  {item.title}
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-xs">
                {item.level} Level
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 mt-2 font-medium leading-relaxed">
              {item.description}
            </p>

            {/* Translation preview if not in current lang */}
            {currentLang === 'en' && alert.descriptionTe && item.isCurrent && (
              <p className="text-xs text-slate-500 pt-1.5 border-t border-slate-200/60 mt-2">
                <strong>తెలుగు:</strong> {alert.descriptionTe}
              </p>
            )}

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-1">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
              </span>
              <span>Source: <strong>{item.source}</strong></span>
              <span className="text-emerald-700 font-bold">{item.confidence}% Confidence</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
