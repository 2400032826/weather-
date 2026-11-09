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
    <section className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 space-y-3">
      {/* Title & Range Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-700" />
          <h2 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
            {t.hourlyTitle}
          </h2>
        </div>

        {/* 24h / 48h / 10d Switcher */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveRange('24h')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeRange === '24h'
                ? 'bg-emerald-800 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view24h}
          </button>
          <button
            onClick={() => setActiveRange('48h')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeRange === '48h'
                ? 'bg-emerald-800 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view48h}
          </button>
          <button
            onClick={() => setActiveRange('10d')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              activeRange === '10d'
                ? 'bg-emerald-800 text-white font-black shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.view10d}
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline of Farmer Cards */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 pt-0.5 flex gap-2.5 scrollbar-thin scroll-smooth focus:outline-none">
          {timeline.map((hour, idx) => {
            const { hourLabel, dateLabel } = formatIstTime(hour.time);
            const isRain = hour.isRainHour || hour.precipitationMm >= 0.1 || (hour.precipitationProbability ?? 0) >= 40;
            const isCurrent = hour.isCurrentHour || idx === 0;
            const iconInfo = getWeatherIconInfo(hour.weatherCode, hour.conditionText, hour.time);
            const HourIcon = iconInfo.Icon;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between p-2.5 min-w-[95px] sm:min-w-[105px] rounded-xl border transition-all ${
                  isCurrent
                    ? 'ring-2 ring-emerald-600 bg-emerald-50/90 border-emerald-300 shadow-2xs'
                    : isRain
                    ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                    : 'bg-slate-50/80 border-slate-200/90 hover:bg-emerald-50/40'
                }`}
              >
                {/* Time & Now Badge */}
                <div className="text-center w-full">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-black text-slate-900">{hourLabel}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase">
                        {t.nowBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {dateLabel}
                  </span>
                </div>

                {/* Dynamic Weather Icon & Temperature */}
                <div className="my-2 text-center">
                  <div className="w-7 h-7 flex items-center justify-center mx-auto">
                    <HourIcon className={`w-6 h-6 ${iconInfo.colorClass}`} />
                  </div>
                  <span className="text-base font-black text-slate-900 block mt-0.5">
                    {Math.round(hour.temperature)}°C
                  </span>
                </div>

                {/* Rain Status: Probability & Expected mm */}
                <div className="w-full pt-1.5 border-t border-slate-200/70 text-center space-y-0.5">
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className={`w-3 h-3 ${isRain ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-black ${isRain ? 'text-amber-800' : 'text-slate-600'}`}>
                      {hour.precipitationProbability ?? 0}%
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1 py-0.2 rounded block truncate ${
                      isRain
                        ? 'bg-amber-200 text-amber-950 font-black'
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
      <div className="bg-slate-50 rounded-xl p-2 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-1.5 border border-slate-200/60">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t.forecastNotice}</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          {weather.lastUpdated}
        </div>
      </div>
    </section>
  );
};
