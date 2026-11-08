import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState, HourlyForecastItem } from '../lib/weatherService';
import { getWeatherIconInfo } from '../lib/weatherIconHelper';

interface HourlyTimelineProps {
  weather: KadlurWeatherState;
  currentLang: Language;
}

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({ weather, currentLang }) => {
  const t = translations[currentLang];
  const [activeRange, setActiveRange] = useState<'24h' | '48h' | '10d'>('24h');

  const getTimelineData = (): HourlyForecastItem[] => {
    if (activeRange === '48h') return weather.hourly48h || weather.hourly24h;
    if (activeRange === '10d') return weather.hourly7d || weather.hourly24h;
    return weather.hourly24h || [];
  };

  const timeline = getTimelineData();

  // Helper to format IST hour string (e.g. "6 PM", "7 PM")
  const formatIstTime = (isoString: string): { hourLabel: string; dateLabel: string } => {
    try {
      const d = new Date(isoString);
      const hourLabel = d.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        hour12: true,
      });
      const dateLabel = d.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: 'numeric',
      });
      return { hourLabel, dateLabel };
    } catch {
      return { hourLabel: isoString.slice(11, 16), dateLabel: '' };
    }
  };

  const getRainText = (hour: HourlyForecastItem) => {
    if (hour.precipitationMm >= 0.1) {
      return `${hour.precipitationMm.toFixed(1)} mm`;
    }
    if ((hour.precipitationProbability ?? 0) > 0) {
      return currentLang === 'te'
        ? `వర్షం ${hour.precipitationProbability}%`
        : currentLang === 'kn'
        ? `ಮಳೆ ${hour.precipitationProbability}%`
        : `Rain ${hour.precipitationProbability}%`;
    }
    return currentLang === 'te' ? 'వర్షం లేదు' : currentLang === 'kn' ? 'ಮಳೆ ಇಲ್ಲ' : 'No rain';
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      {/* Title & Range Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
            {t.hourlyTitle}
          </h2>
        </div>

        {/* 24h / 48h / 10d Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveRange('24h')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeRange === '24h'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view24h}
          </button>
          <button
            onClick={() => setActiveRange('48h')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeRange === '48h'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view48h}
          </button>
          <button
            onClick={() => setActiveRange('10d')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeRange === '10d'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view10d}
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline of Simple Farmer Cards */}
      <div className="relative">
        <div className="overflow-x-auto pb-3 pt-1 flex gap-2.5 scrollbar-thin scroll-smooth focus:outline-none">
          {timeline.map((hour, idx) => {
            const { hourLabel, dateLabel } = formatIstTime(hour.time);
            const isRain = hour.isRainHour;
            const isCurrent = hour.isCurrentHour || idx === 0;
            const iconInfo = getWeatherIconInfo(hour.weatherCode, hour.conditionText, hour.time);
            const HourIcon = iconInfo.Icon;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-3 min-w-[100px] rounded-2xl border transition-all ${
                  isCurrent
                    ? 'ring-2 ring-emerald-500 bg-emerald-50/70 border-emerald-300 shadow-sm'
                    : isRain
                    ? 'bg-orange-50 border-orange-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/30'
                }`}
              >
                {/* Time & Now Badge */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-black text-slate-800">{hourLabel}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                        {t.nowBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">
                    {dateLabel}
                  </span>
                </div>

                {/* Dynamic Weather Icon & Temperature */}
                <div className="my-2 text-center">
                  <div className="w-8 h-8 flex items-center justify-center mx-auto">
                    <HourIcon className={`w-6 h-6 ${iconInfo.colorClass} ${isRain ? 'animate-bounce' : ''}`} />
                  </div>
                  <span className="text-base font-black text-slate-900 block mt-1">
                    {Math.round(hour.temperature)}°C
                  </span>
                </div>

                {/* Rain Status Text: e.g. "6 PM – 29°C – No rain" or "Rain chance 60%" */}
                <div className="w-full pt-1.5 border-t border-slate-200/70 text-center">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md block truncate ${
                      isRain
                        ? 'bg-orange-500 text-white'
                        : 'text-slate-600 bg-slate-200/60'
                    }`}
                  >
                    {getRainText(hour)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast Label */}
      <div className="bg-slate-50 rounded-2xl p-2.5 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2 border border-slate-100">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.forecastNotice}</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Updated: {weather.lastUpdated}
        </div>
      </div>
    </section>
  );
};
