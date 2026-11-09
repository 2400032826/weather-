import React, { useState } from 'react';
import {
  Wind,
  CloudRain,
  Clock,
  AlertCircle,
  Droplets,
  Radio,
  Compass,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck
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
  const [isSpeakingSummary, setIsSpeakingSummary] = useState<boolean>(false);
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

  // Real-time truthful agricultural weather summary derived strictly from live API metrics
  const getFarmerSummaryText = () => {
    const isRain = weather.currentRainfall >= 0.5 || weather.rainDetected;
    const isApproaching = weather.isApproaching;
    const rainProb = weather.rainProbability || 0;
    const temp = Math.round(weather.temperature);
    const feelsLike = Math.round(weather.feelsLike);
    const wind = Math.round(weather.windSpeed);

    if (currentLang === 'te') {
      if (isRain) {
        return `ప్రస్తుతం కడ్లూరులో వర్షం పడుతోంది (${weather.currentRainfall.toFixed(1)} mm). ఉష్ణోగ్రత ${temp}°C. కళ్లాల్లో ఉన్న ధాన్యంపై వెంటనే టార్పాలిన్లు కప్పండి మరియు నీరు నిలవకుండా జాగ్రత్తలు తీసుకోండి.`;
      }
      if (isApproaching) {
        return `కడ్లూరు పరిసరాల్లో వర్షపు మేఘాలు కదులుతున్నాయి. వర్షం వచ్చే అవకాశం ${rainProb}%. ఉష్ణోగ్రత ${temp}°C, గాలి వేగం ${wind} km/h. ధాన్యం ఆరబోసే రైతులు జాగ్రత్తగా ఉండాలి.`;
      }
      if (rainProb >= 40) {
        return `కడ్లూరులో ప్రస్తుతం వర్షం లేదు, కానీ రాబోయే సమయాల్లో ${rainProb}% వర్షం పడే అవకాశం ఉంది. ఉష్ణోగ్రత ${temp}°C, గాలిలో తేమ ${weather.humidity}%. పంట పనుల వద్ద అప్రమత్తంగా ఉండండి.`;
      }
      return `ప్రస్తుతం కడ్లూరులో వాతావరణం పొడిగా, అనుకూలంగా ఉంది. ఉష్ణోగ్రత ${temp}°C (అనిపించేది ${feelsLike}°C), వర్షం అవకాశం ${rainProb}%. కళ్లాల్లో ధాన్యం ఆరబెట్టుకోవడానికి మరియు వ్యవసాయ పనులకు అనువైన సమయం.`;
    } else if (currentLang === 'kn') {
      if (isRain) {
        return `ಕಡ್ಲೂರುನಲ್ಲಿ ಪ್ರಸ್ತುತ ಮಳೆಯಾಗುತ್ತಿದೆ (${weather.currentRainfall.toFixed(1)} mm). ತಾಪಮಾನ ${temp}°C. ಕಣದಲ್ಲಿರುವ ಧಾನ್ಯವನ್ನು ತಕ್ಷಣ ಸುರಕ್ಷಿತವಾಗಿ ಮುಚ್ಚಿ.`;
      }
      if (isApproaching) {
        return `ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತ ಮಳೆ ಮೋಡಗಳು ಬರುತ್ತಿವೆ. ಮಳೆಯ ಸಾಧ್ಯತೆ ${rainProb}%. ತಾಪಮಾನ ${temp}°C, ಗಾಳಿಯ ವೇಗ ${wind} km/h. ರೈತರು ಎಚ್ಚರಿಕೆಯಿಂದ ಇರಬೇಕು.`;
      }
      if (rainProb >= 40) {
        return `ಕಡ್ಲೂರುನಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ಮಳೆ ಇಲ್ಲ, ಆದರೆ ಮುಂದಿನ ಅವಧಿಯಲ್ಲಿ ${rainProb}% ಮಳೆ ಸಾಧ್ಯತೆಯಿದೆ. ತಾಪಮಾನ ${temp}°C. ಕೃಷಿ ಕೆಲಸಗಳ ವೇಳೆ ಎಚ್ಚರವಿರಲಿ.`;
      }
      return `ಪ್ರಸ್ತುತ ಕಡ್ಲೂರುನಲ್ಲಿ ಹವಾಮಾನವು ಒಣ ಹಾಗೂ ಅನುಕೂಲಕರವಾಗಿದೆ. ತಾಪಮಾನ ${temp}°C (ಅನಿಸಿಕೆ ${feelsLike}°C), ಮಳೆಯ ಸಾಧ್ಯತೆ ${rainProb}%. ಧಾನ್ಯ ಒಣಗಿಸಲು ಮತ್ತು ಕೃಷಿ ಕೆಲಸಗಳಿಗೆ ಉತ್ತಮ ಸಮಯ.`;
    } else {
      if (isRain) {
        return `Rain is currently falling in Kadlur (${weather.currentRainfall.toFixed(1)} mm). Temperature ${temp}°C. Protect open grain yards and cover harvested paddy immediately.`;
      }
      if (isApproaching) {
        return `Rain clouds are tracking towards Kadlur. Rain probability is ${rainProb}%. Wind speed ${wind} km/h. Keep tarpaulins ready in drying yards.`;
      }
      if (rainProb >= 40) {
        return `Currently dry in Kadlur, but rainfall probability is elevated at ${rainProb}%. Temperature ${temp}°C, humidity ${weather.humidity}%. Monitor field conditions.`;
      }
      return `Weather in Kadlur is currently dry and stable. Temperature is ${temp}°C (feels like ${feelsLike}°C) with ${rainProb}% rain probability. Ideal for paddy drying and field operations.`;
    }
  };

  const handleSpeakSummary = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeakingSummary) {
      window.speechSynthesis.cancel();
      setIsSpeakingSummary(false);
      return;
    }

    const text = getFarmerSummaryText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'te' ? 'te-IN' : currentLang === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.rate = 0.9;

    utterance.onend = () => setIsSpeakingSummary(false);
    utterance.onerror = () => setIsSpeakingSummary(false);

    window.speechSynthesis.cancel();
    setIsSpeakingSummary(true);
    window.speechSynthesis.speak(utterance);
  };

  const summaryText = getFarmerSummaryText();

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 space-y-6 overflow-hidden">
      {/* Delayed notice banner if data is not fresh */}
      {isDelayed && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 text-xs text-amber-900 flex items-center gap-2.5 font-bold shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{t.dataDelayedNotice}</span>
        </div>
      )}

      {/* Distinction Header: Model Forecast Badge vs Ground Sensor */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3.5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {t.currentWeather}
          </h2>
          <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
            • Kadlur Village (16.3768° N, 77.2870° E)
          </span>
        </div>

        {/* Clear Model Estimate Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs">
          <Radio className="w-3.5 h-3.5 text-emerald-700" />
          <span>{t.modelEstimateBadge}</span>
          <span className="text-emerald-700/70 font-normal">| Open-Meteo High-Res</span>
        </div>
      </div>

      {/* 1. Farmer-Friendly Weather Summary Card */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-slate-50 border-2 border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              {currentLang === 'te'
                ? 'కడ్లూరు రైతు వాతావరణ సారాంశం (ఈ రోజు)'
                : currentLang === 'kn'
                ? 'ಕಡ್ಲೂರು ರೈತರ ಹವಾಮಾನ ಸಾರಾಂಶ (ಇಂದು)'
                : "Kadlur Farmer Weather Summary (Today)"}
            </h3>
          </div>

          {/* Voice Readout of Summary */}
          <button
            onClick={handleSpeakSummary}
            className={`min-h-[36px] px-3 py-1 rounded-xl border text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs ${
              isSpeakingSummary
                ? 'bg-amber-400 text-slate-950 border-amber-400 animate-pulse'
                : 'bg-white hover:bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
            title={isSpeakingSummary ? t.stopVoice : t.readAloud}
            aria-label={t.readAloud}
          >
            {isSpeakingSummary ? <VolumeX className="w-4 h-4 text-slate-950" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            <span>{isSpeakingSummary ? (currentLang === 'te' ? 'ఆపండి' : 'Stop') : (currentLang === 'te' ? 'వినండి' : currentLang === 'kn' ? 'ಕೇಳಿ' : 'Listen')}</span>
          </button>
        </div>

        <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
          {summaryText}
        </p>
      </div>

      {/* Main Temperature & Weather Condition with Dynamic Icon */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight">
              {Math.round(weather.temperature)}
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-slate-400">°C</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            {t.feelsLike}: <strong className="text-slate-900">{Math.round(weather.feelsLike)}°C</strong>
          </p>
        </div>

        {/* Dynamic Condition Badge & Weather Icon */}
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2.5 bg-white text-emerald-900 px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-sm">
            <ConditionIcon className={`w-7 h-7 ${iconInfo.colorClass} shrink-0`} />
            <span className="text-base sm:text-lg font-black tracking-tight">
              {weather.conditionText}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2.5 flex items-center justify-end gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.lastUpdated}:</span>
            <strong className="text-slate-800">{weather.lastUpdated}</strong>
            {weather.isFromCache && (
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-sans font-bold border border-amber-300 ml-1">
                {t.cachedDataNotice || 'కాష్'}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Farmer Metrics Grid: Rainfall, Wind, Humidity, Cloud Cover */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1">
        {/* Rainfall */}
        <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
            <CloudRain className="w-4 h-4 text-sky-600" />
            <span>{t.currentRainfall}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-sky-950 mt-1.5">
            {weather.currentRainfall.toFixed(1)} <span className="text-xs font-normal text-sky-800">mm</span>
          </p>
          <span className="text-[11px] text-sky-800 font-semibold block mt-1">
            {t.rainProbability}: <strong className="text-sky-950">{weather.rainProbability}%</strong>
          </span>
        </div>

        {/* Wind */}
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
            <Wind className="w-4 h-4 text-emerald-600" />
            <span>{t.windSpeed}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1.5">
            {Math.round(weather.windSpeed)} <span className="text-xs font-normal text-emerald-800">km/h</span>
          </p>
          <span className="text-[11px] text-emerald-800 font-semibold block mt-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>{getCompassDirection(weather.windDirection)} ({weather.windDirection}°)</span>
          </span>
        </div>

        {/* Humidity */}
        <div className="bg-teal-50/90 border border-teal-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-teal-800 text-xs font-bold">
            <Droplets className="w-4 h-4 text-teal-600" />
            <span>{t.humidity}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-teal-950 mt-1.5">
            {weather.humidity}%
          </p>
          <span className="text-[11px] text-teal-800 font-semibold block mt-1">
            {weather.humidity < 40 ? 'Dry (పొడిగా)' : weather.humidity > 75 ? 'Humid (తేమగా)' : 'Comfortable (సాధారణం)'}
          </span>
        </div>

        {/* Cloud Cover */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t.cloudCover}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">
            {weather.cloudCover}%
          </p>
          <span className="text-[11px] text-slate-600 font-semibold block mt-1">
            {weather.cloudCover > 60 ? 'Overcast (పూర్తిగా)' : weather.cloudCover > 20 ? 'Partly Cloudy (కొద్దిగా)' : 'Clear Sky (నిర్మలంగా)'}
          </span>
        </div>
      </div>

      {/* Truthful Source & Integrity Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Source: Open-Meteo High-Res NWP Grid (16.3768° N, 77.2870° E)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
            Kadlur Microclimate
          </span>
        </div>
      </div>
    </section>
  );
};
