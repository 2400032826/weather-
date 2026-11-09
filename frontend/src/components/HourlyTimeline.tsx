import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  Droplets
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

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 space-y-4">
      {/* Title & Range Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
              {t.hourlyTitle}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.hourlySubtitle}
            </p>
          </div>
        </div>

        {/* 24h / 48h / 10d Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-inner">
          <button
            onClick={() => setActiveRange('24h')}
            className={`min-h-[34px] px-3.5 py-1.5 rounded-xl transition-all ${
              activeRange === '24h'
                ? 'bg-emerald-800 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view24h}
          </button>
          <button
            onClick={() => setActiveRange('48h')}
            className={`min-h-[34px] px-3.5 py-1.5 rounded-xl transition-all ${
              activeRange === '48h'
                ? 'bg-emerald-800 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view48h}
          </button>
          <button
            onClick={() => setActiveRange('10d')}
            className={`min-h-[34px] px-3.5 py-1.5 rounded-xl transition-all ${
              activeRange === '10d'
                ? 'bg-emerald-800 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view10d}
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline of Farmer Cards */}
      <div className="relative">
        <div className="overflow-x-auto pb-3 pt-1 flex gap-3 scrollbar-thin scroll-smooth focus:outline-none">
          {timeline.map((hour, idx) => {
            const { hourLabel, dateLabel } = formatIstTime(hour.time);
            const isRain = hour.isRainHour || hour.precipitationMm >= 0.1 || (hour.precipitationProbability ?? 0) >= 40;
            const isCurrent = hour.isCurrentHour || idx === 0;
            const iconInfo = getWeatherIconInfo(hour.weatherCode, hour.conditionText, hour.time);
            const HourIcon = iconInfo.Icon;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-3.5 min-w-[110px] sm:min-w-[120px] rounded-2xl border transition-all ${
                  isCurrent
                    ? 'ring-2 ring-emerald-600 bg-emerald-50/90 border-emerald-300 shadow-sm'
                    : isRain
                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200/90 hover:bg-emerald-50/40'
                }`}
              >
                {/* Time & Now Badge */}
                <div className="text-center w-full">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-black text-slate-900">{hourLabel}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {t.nowBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                    {dateLabel}
                  </span>
                </div>

                {/* Dynamic Weather Icon & Temperature */}
                <div className="my-2.5 text-center">
                  <div className="w-9 h-9 flex items-center justify-center mx-auto">
                    <HourIcon className={`w-7 h-7 ${iconInfo.colorClass} ${isRain ? 'animate-bounce' : ''}`} />
                  </div>
                  <span className="text-base sm:text-lg font-black text-slate-900 block mt-1">
                    {Math.round(hour.temperature)}°C
                  </span>
                </div>

                {/* Rain Status: Probability & Expected mm */}
                <div className="w-full pt-2 border-t border-slate-200/70 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className={`w-3 h-3 ${isRain ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-black ${isRain ? 'text-amber-800' : 'text-slate-600'}`}>
                      {hour.precipitationProbability ?? 0}%
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md block truncate ${
                      isRain
                        ? 'bg-amber-200/80 text-amber-950 font-black'
                        : 'text-slate-500 bg-slate-200/50'
                    }`}
                  >
                    {hour.precipitationMm >= 0.1 ? `${hour.precipitationMm.toFixed(1)} mm` : (currentLang === 'te' ? 'వర్షం లేదు' : currentLang === 'kn' ? 'ಮಳೆ ಇಲ್ಲ' : 'No rain')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast Attribution Notice */}
      <div className="bg-slate-50 rounded-2xl p-3 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2 border border-slate-200/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.forecastNotice}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Last refreshed: {weather.lastUpdated}
        </div>
      </div>
    </section>
  );
};
