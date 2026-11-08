import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  MapPin,
  CloudRain
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';

interface QuickFiveAnswersProps {
  weather: KadlurWeatherState;
  currentLang: Language;
}

export const QuickFiveAnswers: React.FC<QuickFiveAnswersProps> = ({ weather, currentLang }) => {
  const t = translations[currentLang];

  const isRainingNow = weather.currentRainfall > 0.1 || weather.rainDetected;
  const isRainComing = weather.isApproaching;

  const rainDistanceText = weather.nearestRainDistanceKm != null
    ? `${weather.nearestRainDistanceKm.toFixed(1)} km`
    : currentLang === 'te'
    ? '30 కి.మీ పరిధిలో లేదు'
    : currentLang === 'kn'
    ? '30 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿಲ್ಲ'
    : 'None within 30 km';

  const rainArrivalText = weather.estimatedArrivalMinutes
    ? `${weather.estimatedArrivalMinutes} min`
    : currentLang === 'te'
    ? 'వర్షం లేదు (స్పష్టం)'
    : currentLang === 'kn'
    ? 'ಮಳೆ ಇಲ್ಲ (ಸ್ಪಷ್ಟ)'
    : 'No rain (Clear)';

  const freshnessLabel = weather.dataDelayMinutes != null
    ? `${weather.lastUpdated} (${weather.dataDelayMinutes}m ago)`
    : weather.lastUpdated;

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {currentLang === 'te'
                ? 'క్షణపు తక్షణ స్థితి – కడ్లూరు 5 ముఖ్య సమాధానాలు'
                : currentLang === 'kn'
                ? 'ಕಡ್ಲೂರು 5 ಮುಖ್ಯ ಉತ್ತರಗಳು – ತಕ್ಷಣದ ಸ್ಥಿತಿ'
                : 'Quick 5 Answers — Kadlur At-A-Glance Status'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {currentLang === 'te'
                ? 'కడ్లూరు పొలాల కోసం వర్షం, దూరం మరియు సమయం తక్షణ వివరణ'
                : currentLang === 'kn'
                ? 'ಕಡ್ಲೂರು ಜಮೀನುಗಳಿಗಾಗಿ ಮಳೆ, ದೂರ ಮತ್ತು ಸಮಯದ ತಕ್ಷಣದ ಮಾಹಿತಿ'
                : 'Essential field-level answers before farm operations'}
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200">
          Kadlur Village • Live
        </span>
      </div>

      {/* 5 Critical Questions Grid (Clean, responsive layout on mobile & desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 text-xs">
        {/* Q1: Is it raining now? */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-[11px] leading-tight">
              {t.q1RainNow}
            </span>
            <CloudRain className="w-4 h-4 text-sky-600 shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 font-black text-sm pt-1">
            {isRainingNow ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-rose-600 font-black">
                  {currentLang === 'te' ? 'అవును (వర్షం)' : currentLang === 'kn' ? 'ಹೌದು (ಮಳೆ)' : 'YES (Rain)'}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-black">
                  {currentLang === 'te' ? 'లేదు (పొడిగా ఉంది)' : currentLang === 'kn' ? 'ಇಲ್ಲ (ಒಣ ಹವೆ)' : 'NO (Dry)'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Q2: Is rain coming? */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-[11px] leading-tight">
              {t.q2RainComing}
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 font-black text-sm pt-1">
            {isRainComing ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                <span className="text-amber-600 font-black">
                  {currentLang === 'te' ? 'వస్తోంది' : currentLang === 'kn' ? 'ಬರುತ್ತಿದೆ' : 'APPROACHING'}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 font-black">
                  {currentLang === 'te' ? 'రావట్లేదు' : currentLang === 'kn' ? 'ಬರುತ್ತಿಲ್ಲ' : 'NO (Clear)'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Q3: How far is the rain? */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-[11px] leading-tight">
              {t.q3RainDistance}
            </span>
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <span className="font-black text-sm text-slate-900 pt-1">
            {rainDistanceText}
          </span>
        </div>

        {/* Q4: When will it reach Kadlur? */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-[11px] leading-tight">
              {t.q4RainArrival}
            </span>
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <span className="font-black text-sm text-slate-900 pt-1">
            {rainArrivalText}
          </span>
        </div>

        {/* Q5: How fresh is this data? */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between gap-2 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold text-[11px] leading-tight">
              {t.q5DataFreshness}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </div>
          <span className="font-mono font-bold text-xs text-emerald-700 pt-1 truncate">
            {freshnessLabel}
          </span>
        </div>
      </div>
    </section>
  );
};
