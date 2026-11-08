import React from 'react';
import {
  Wind,
  CloudRain,
  Sun,
  Clock,
  AlertCircle,
  Droplets,
  HelpCircle,
  Radio,
  CheckCircle2,
  XCircle,
  Compass
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

  // Helper answers for the 5 Core Mobile Questions
  const isRainingNow = weather.currentRainfall > 0.1;
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
    <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-5 overflow-hidden">
      {/* Delayed notice banner if data is not fresh */}
      {isDelayed && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-900 flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t.dataDelayedNotice}</span>
        </div>
      )}

      {/* Distinction Header: Model Forecast Badge vs Ground Sensor */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm sm:text-base font-black text-slate-900">
            {t.currentWeather}
          </h2>
        </div>

        {/* Clear Model Estimate Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
          <Radio className="w-3 h-3 text-sky-600" />
          <span>{t.modelEstimateBadge}</span>
          <span className="text-slate-400 font-normal">| Open-Meteo</span>
        </div>
      </div>

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

        {/* Condition Badge & Sun/Rain Icon */}
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-sm">
            {isRainingNow ? (
              <CloudRain className="w-6 h-6 text-sky-600 shrink-0 animate-bounce" />
            ) : (
              <Sun className="w-6 h-6 text-amber-500 shrink-0" />
            )}
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

      {/* 5 CRITICAL QUESTIONS STRIP (Farmer-First First-Screen Clarity) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-200/80">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>కడ్లూరు తక్షణ స్థితి (Quick 5 Answers)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1 text-xs">
          {/* Q1: Is it raining now? */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <span className="text-slate-500 font-semibold">{t.q1RainNow}</span>
            <div className="flex items-center gap-1.5 font-black text-sm">
              {isRainingNow ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-600">{currentLang === 'te' ? 'అవును' : currentLang === 'kn' ? 'ಹೌದು' : 'YES'}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{currentLang === 'te' ? 'లేదు (వర్షం లేదు)' : currentLang === 'kn' ? 'ಇಲ್ಲ (ಮಳೆ ಇಲ್ಲ)' : 'NO (Dry)'}</span>
                </>
              )}
            </div>
          </div>

          {/* Q2: Is rain coming? */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <span className="text-slate-500 font-semibold">{t.q2RainComing}</span>
            <div className="flex items-center gap-1.5 font-black text-sm">
              {isRainComing ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-600">{currentLang === 'te' ? 'వస్తోంది' : currentLang === 'kn' ? 'ಬರುತ್ತಿದೆ' : 'APPROACHING'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">{currentLang === 'te' ? 'రావట్లేదు' : currentLang === 'kn' ? 'ಬರುತ್ತಿಲ್ಲ' : 'NO'}</span>
                </>
              )}
            </div>
          </div>

          {/* Q3: How far is the rain? */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <span className="text-slate-500 font-semibold">{t.q3RainDistance}</span>
            <span className="font-black text-sm text-slate-900">{rainDistanceText}</span>
          </div>

          {/* Q4: When will it reach Kadlur? */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <span className="text-slate-500 font-semibold">{t.q4RainArrival}</span>
            <span className="font-black text-sm text-slate-900">{rainArrivalText}</span>
          </div>

          {/* Q5: How fresh is this data? */}
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between sm:flex-col sm:items-start gap-1 sm:col-span-2 lg:col-span-1">
            <span className="text-slate-500 font-semibold">{t.q5DataFreshness}</span>
            <span className="font-mono font-bold text-xs text-emerald-700">{freshnessLabel}</span>
          </div>
        </div>
      </div>

      {/* Farmer Metrics Grid: Rainfall, Wind, Humidity, Cloud Cover */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
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
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-600" />
            <span>{getCompassDirection(weather.windDirection)} ({weather.windDirection}°)</span>
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
