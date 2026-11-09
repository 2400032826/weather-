import React from 'react';
import {
  Wind,
  CloudRain,
  Clock,
  AlertCircle,
  Droplets,
  Compass,
  Sun
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';
import { getWeatherIconInfo } from '../lib/weatherIconHelper';

interface CurrentWeatherProps {
  weather: KadlurWeatherState;
  currentLang: Language;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, currentLang }) => {
  const t = translations[currentLang];
  const isDelayed = (weather.dataDelayMinutes ?? 0) > 30 || weather.freshnessStatus === 'Delayed' || weather.freshnessStatus === 'Stale';

  const getCompassDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(deg / 45) % 8;
    return `${directions[idx]}`;
  };

  // Dynamic Weather Icon based on live WMO weather code & condition
  const iconInfo = getWeatherIconInfo(
    weather.weatherCode,
    weather.conditionText,
    weather.lastUpdated
  );
  const ConditionIcon = iconInfo.Icon;

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs border border-slate-200/90 space-y-3">
      {/* Delayed notice banner if data is not fresh */}
      {isDelayed && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-xs text-amber-900 flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t.dataDelayedNotice}</span>
        </div>
      )}

      {/* Main Temperature & Weather Condition with Dynamic Icon */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none">
              {Math.round(weather.temperature)}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-400">°C</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            {t.feelsLike}: <strong className="text-slate-900">{Math.round(weather.feelsLike)}°C</strong>
          </p>
        </div>

        {/* Dynamic Condition Badge & Updated Time */}
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200/80">
            <ConditionIcon className={`w-5 h-5 ${iconInfo.colorClass} shrink-0`} />
            <span className="text-sm sm:text-base font-black tracking-tight">
              {weather.conditionText}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-end gap-1 font-mono">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{weather.lastUpdated}</span>
            {weather.isFromCache && (
              <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-sans font-bold border border-amber-300 ml-1">
                {t.cachedDataNotice || 'కాష్'}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 4 Essential Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
        {/* Rainfall & Rain Chance */}
        <div className="bg-sky-50/80 border border-sky-200/90 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-1.5 text-sky-800 text-[11px] font-bold">
            <CloudRain className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>{t.currentRainfall}</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-sky-950 mt-1 leading-none">
            {weather.currentRainfall.toFixed(1)} <span className="text-xs font-normal text-sky-800">mm</span>
          </p>
          <span className="text-[10px] text-sky-800 font-semibold block mt-1">
            {t.rainProbability}: <strong className="text-sky-950">{weather.rainProbability}%</strong>
          </span>
        </div>

        {/* Wind Speed & Direction */}
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
            <Wind className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{t.windSpeed}</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 leading-none">
            {Math.round(weather.windSpeed)} <span className="text-xs font-normal text-emerald-800">km/h</span>
          </p>
          <span className="text-[10px] text-emerald-800 font-semibold block mt-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-700 shrink-0" />
            <span>{getCompassDirection(weather.windDirection)} ({weather.windDirection}°)</span>
          </span>
        </div>

        {/* Humidity */}
        <div className="bg-teal-50/80 border border-teal-200/90 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-1.5 text-teal-800 text-[11px] font-bold">
            <Droplets className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{t.humidity}</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-teal-950 mt-1 leading-none">
            {weather.humidity}%
          </p>
          <span className="text-[10px] text-teal-800 font-semibold block mt-1">
            {weather.humidity < 40 ? 'Dry (పొడిగా)' : weather.humidity > 75 ? 'Humid (తేమగా)' : 'Normal (సాధారణం)'}
          </span>
        </div>

        {/* Cloud Cover */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 sm:p-3">
          <div className="flex items-center gap-1.5 text-slate-700 text-[11px] font-bold">
            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{t.cloudCover}</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-none">
            {weather.cloudCover}%
          </p>
          <span className="text-[10px] text-slate-600 font-semibold block mt-1">
            {weather.cloudCover > 60 ? 'Overcast (పూర్తిగా)' : weather.cloudCover > 20 ? 'Partly Cloudy' : 'Clear Sky'}
          </span>
        </div>
      </div>
    </section>
  );
};
