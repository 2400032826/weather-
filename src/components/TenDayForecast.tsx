import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Droplets,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { DailyForecastItem } from '../lib/weatherService';
import { getWeatherIconInfo } from '../lib/weatherIconHelper';

interface TenDayForecastProps {
  days: DailyForecastItem[];
  currentLang: Language;
}

export const TenDayForecast: React.FC<TenDayForecastProps> = ({ days, currentLang }) => {
  const t = translations[currentLang];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const formatDayName = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return currentLang === 'te' ? 'ఈ రోజు' : currentLang === 'kn' ? 'ಇಂದು' : 'Today';
      }
      return d.toLocaleDateString(currentLang === 'te' ? 'te-IN' : currentLang === 'kn' ? 'kn-IN' : 'en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const toggleDay = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  if (!days || days.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <div>
            <h2 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
              {t.tenDayTitle}
            </h2>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          {t.tapForDetails}
        </span>
      </div>

      {/* 10-Day Cards List */}
      <div className="space-y-2">
        {days.map((day, idx) => {
          const isRain = day.precipitationMm >= 0.1 || day.precipitationProbability >= 40;
          const isExpanded = expandedIndex === idx;
          const iconInfo = getWeatherIconInfo(day.weatherCode, day.conditionText, day.date);
          const DayIcon = iconInfo.Icon;

          const getDayAdvice = () => {
            if (day.precipitationMm >= 5.0) {
              return currentLang === 'te'
                ? 'భారీ వర్ష సూచన! కళ్లాల్లోని ధాన్యాన్ని సురక్షిత ప్రాంతాలకు చేర్చండి.'
                : currentLang === 'kn'
                ? 'ಭಾರೀ ಮಳೆ ಸಾಧ್ಯತೆ! ಕಣದಲ್ಲಿರುವ ಧಾನ್ಯವನ್ನು ತಕ್ಷಣ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ಸಾಗಿಸಿ.'
                : 'Heavy rain expected! Secure harvested produce immediately.';
            }
            if (isRain) {
              return currentLang === 'te'
                ? 'వర్షపు జల్లులు పడే అవకాశం ఉంది. టార్పాలిన్లు సిద్ధంగా ఉంచుకోండి.'
                : currentLang === 'kn'
                ? 'ಮಳೆ ಬೀಳುವ ಸಾಧ್ಯತೆಯಿದೆ. ಟಾರ್ಪಲಿನ್‌ಗಳನ್ನು ಸಿದ್ಧವಾಗಿಟ್ಟುಕೊಳ್ಳಿ.'
                : 'Rain showers likely. Keep tarpaulins ready in drying yards.';
            }
            return currentLang === 'te'
              ? 'పొడి వాతావరణం. ధాన్యం ఆరబెట్టుకోవడానికి మరియు ఎరువులు వేయడానికి అనుకూలం.'
              : currentLang === 'kn'
              ? 'ಒಣ ಹವೆ. ಧಾನ್ಯ ಒಣಗಿಸಲು ಮತ್ತು ಗೊಬ್ಬರ ಹಾಕಲು ಉತ್ತಮ ಸಮಯ.'
              : 'Dry conditions. Ideal for drying paddy and field operations.';
          };

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isRain
                  ? 'border-amber-200/90 bg-amber-50/40 hover:border-amber-300'
                  : 'border-slate-200/90 bg-slate-50/60 hover:border-emerald-300 hover:bg-slate-50'
              } shadow-2xs`}
            >
              <div
                onClick={() => toggleDay(idx)}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Day & Date with Dynamic Weather Icon */}
                <div className="flex items-center gap-3 min-w-[130px]">
                  <div className={`p-2.5 rounded-xl ${iconInfo.bgClass} shadow-2xs`}>
                    <DayIcon className={`w-5 h-5 ${iconInfo.colorClass}`} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">
                      {formatDayName(day.date)}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {day.conditionText}
                    </p>
                  </div>
                </div>

                {/* Rain probability & Expected mm */}
                <div className="text-center min-w-[85px]">
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className={`w-3.5 h-3.5 ${isRain ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-black ${isRain ? 'text-amber-800' : 'text-slate-600'}`}>
                      {day.precipitationProbability}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono font-medium block">
                    {day.precipitationMm > 0 ? `${day.precipitationMm.toFixed(1)} mm` : '0 mm'}
                  </span>
                </div>

                {/* Temperature (Max / Min) */}
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="font-black text-slate-900">
                    {Math.round(day.temperatureMaxC)}°
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-500">
                    {Math.round(day.temperatureMinC)}°
                  </span>
                </div>

                {/* Expand / Collapse Icon */}
                <div className="text-slate-400 p-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded agricultural details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200/60 bg-white/90 text-xs space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 font-medium">
                    <strong className="font-black text-emerald-900 mr-1">
                      {currentLang === 'te' ? 'రైతు సలహా:' : currentLang === 'kn' ? 'ರೈತರ ಸಲಹೆ:' : 'Field Advice:'}
                    </strong>
                    {getDayAdvice()}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block">{t.maxTemp}</span>
                      <strong className="text-slate-900 text-sm font-black">{Math.round(day.temperatureMaxC)}°C</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block">{t.minTemp}</span>
                      <strong className="text-slate-900 text-sm font-black">{Math.round(day.temperatureMinC)}°C</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block">{t.expectedRain}</span>
                      <strong className="text-slate-900 text-sm font-black">{day.precipitationMm.toFixed(1)} mm</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block">{t.rainChance}</span>
                      <strong className="text-emerald-700 text-sm font-black">{day.precipitationProbability}%</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
