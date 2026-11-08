import React from 'react';
import {
  Wind,
  CloudRain,
  Sun,
  Clock,
  AlertCircle,
  Droplets,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';

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

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      {/* Delayed notice banner if data is not fresh */}
      {isDelayed && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-900 flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t.dataDelayedNotice}</span>
        </div>
      )}

      {/* Main Temperature & Weather Condition */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight">
              {Math.round(weather.temperature)}
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-slate-400">°C</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {t.feelsLike}: <strong className="text-slate-800">{Math.round(weather.feelsLike)}°C</strong>
          </p>
        </div>

        {/* Condition Badge & Sun Icon */}
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl border border-emerald-200 shadow-sm">
            <Sun className="w-6 h-6 text-amber-500 shrink-0" />
            <span className="text-base sm:text-lg font-black">
              {weather.conditionText}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2 flex items-center justify-end gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.lastUpdated}:</span>
            <strong className="text-slate-700">{weather.lastUpdated}</strong>
          </p>
        </div>
      </div>

      {/* Farmer Metrics Grid: Rainfall, Wind, Humidity, Rain Probability */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {/* Rainfall */}
        <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
            <CloudRain className="w-4 h-4 text-sky-600" />
            <span>{t.currentRainfall}</span>
          </div>
          <p className="text-2xl font-black text-sky-950 mt-1">
            {weather.currentRainfall.toFixed(1)} <span className="text-xs font-normal">mm</span>
          </p>
          <span className="text-[11px] text-sky-700 font-semibold block mt-0.5">
            {t.rainProbability}: {weather.rainProbability}%
          </span>
        </div>

        {/* Wind */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>{t.windSpeed}</span>
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-1">
            {Math.round(weather.windSpeed)} <span className="text-xs font-normal">km/h</span>
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
            {t.windDirection}: {getCompassDirection(weather.windDirection)} ({weather.windDirection}°)
          </span>
        </div>

        {/* Humidity */}
        <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-teal-800 text-xs font-bold">
            <Droplets className="w-4 h-4 text-teal-600" />
            <span>{t.humidity}</span>
          </div>
          <p className="text-2xl font-black text-teal-950 mt-1">
            {weather.humidity}%
          </p>
          <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
            {weather.humidity < 40 ? 'Dry' : weather.humidity > 75 ? 'Humid' : 'Normal'}
          </span>
        </div>

        {/* Cloud Cover */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t.cloudCover}</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {weather.cloudCover}%
          </p>
          <span className="text-[11px] text-slate-600 font-semibold block mt-0.5">
            {weather.cloudCover > 60 ? 'Overcast' : weather.cloudCover > 20 ? 'Partly Cloudy' : 'Clear Sky'}
          </span>
        </div>
      </div>
    </section>
  );
};
