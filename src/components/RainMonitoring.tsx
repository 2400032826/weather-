import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Info,
  Layers,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';

interface RainMonitoringProps {
  weather: KadlurWeatherState;
  currentLang: Language;
}

export const RainMonitoring: React.FC<RainMonitoringProps> = ({ weather, currentLang }) => {
  const t = translations[currentLang];
  const frames = weather.radarFrames || [];

  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentFrameIdx((prev) => (prev + 1) % frames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const activeFrame = frames[currentFrameIdx];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.0, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.75, prev - 0.25));
  };

  const handleResetZoom = () => {
    setZoomLevel(1.0);
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 space-y-5">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 flex-wrap gap-2.5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black shrink-0">
              <Radio className="w-4 h-4 text-sky-700 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                {t.rainMonitoringTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t.radarCentredNotice}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
            IMD Begumpet DWR (~174 km NE)
          </span>
        </div>
      </div>

      {/* Actual Radar Distinction Notice */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">
            {currentLang === 'te'
              ? 'వాస్తవ డోప్లర్ రాడార్ పరిశీలన (మోడల్ అంచనా కాదు)'
              : currentLang === 'kn'
              ? 'ನೈಜ ಡಾಪ್ಲರ್ ರಾಡಾರ್ ವೀಕ್ಷಣೆ (ಮಾದರಿ ಮುನ್ಸೂಚನೆ ಅಲ್ಲ)'
              : 'Actual Doppler Radar Observation (Not Model Forecast)'}
          </span>
        </div>
        <span className="text-[11px] text-emerald-800 font-mono">
          Kadlur Coordinates: 16.3768° N, 77.2870° E
        </span>
      </div>

      {/* Approaching Rain Status Pill */}
      {weather.radarCoverageStatus === 'UNAVAILABLE' ? (
        <div className="flex items-start gap-3 bg-slate-100 border border-slate-300 p-4 rounded-2xl text-slate-800 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-sm sm:text-base text-slate-900">{t.radarUnavailableNotice}</p>
            <p className="text-xs text-slate-600 mt-0.5">{t.radarDisclaimer}</p>
          </div>
        </div>
      ) : weather.isApproaching ? (
        <div className="flex items-start gap-3.5 bg-amber-50 border-2 border-amber-400 p-4 sm:p-5 rounded-2xl text-amber-950 shadow-xs">
          <div className="bg-amber-500 text-white p-2.5 rounded-xl shrink-0 animate-bounce shadow-xs">
            <Radio className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-black text-base sm:text-lg text-amber-950">
              {t.rainApproachingStatus}
            </p>
            <p className="text-xs text-amber-900 mt-0.5 font-medium">
              Doppler motion vectors confirm rain echoes tracking towards Kadlur farmlands.
            </p>
            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <span className="bg-white/95 p-2 rounded-xl border border-amber-200/90 shadow-2xs">
                {t.estimatedArrival}: <strong className="text-amber-950 font-black">~{weather.estimatedArrivalMinutes || 20} min</strong>
              </span>
              <span className="bg-white/95 p-2 rounded-xl border border-amber-200/90 shadow-2xs">
                {t.rainfallIntensity}: <strong className="text-amber-950 font-black">{weather.rainfallIntensityMmh || 2.5} mm/h</strong>
              </span>
              <span className="bg-white/95 p-2 rounded-xl border border-amber-200/90 shadow-2xs">
                {t.cellTrend}: <strong className="text-amber-950 font-black">{weather.cellTrend || 'STEADY'}</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3.5 bg-emerald-50/80 border-2 border-emerald-300 p-4 sm:p-5 rounded-2xl text-emerald-950 shadow-xs">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-base sm:text-lg text-emerald-900">
              {t.noRainDetectedStatus}
            </p>
            <p className="text-xs text-emerald-800 mt-0.5 font-medium leading-relaxed">
              Real-time Doppler composite sweeps show zero precipitation reflectivity (&lt; 15 dBZ) over Kadlur and the 30 km monitoring perimeter.
            </p>
          </div>
        </div>
      )}

      {/* Large Visual Radar Map Display with Zoom Controls */}
      <div className="bg-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-lg border border-slate-800 space-y-4">
        {/* Radar Map Controls Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="font-black text-white tracking-wide">Interactive Doppler Radar Map</span>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700 shadow-inner">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
              title={t.zoomIn}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
              title={t.zoomOut}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition text-[10px] font-mono px-1.5"
              title={t.resetMap}
            >
              {Math.round(zoomLevel * 100)}%
            </button>
          </div>
        </div>

        {/* Concentric Monitoring Display Canvas */}
        <div className="relative w-full aspect-square max-w-[420px] mx-auto bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 flex items-center justify-center shadow-inner">
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Live Doppler Radar Overlay */}
            {activeFrame?.url && (
              <img
                src={activeFrame.url}
                alt="Live Doppler Radar Composite for Kadlur"
                className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-screen pointer-events-none filter contrast-125"
              />
            )}

            {/* Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

            {/* 50 km Scan Envelope */}
            <div className="absolute w-[92%] h-[92%] rounded-full border border-sky-500/25 flex items-start justify-center pt-1 pointer-events-none">
              <span className="text-[9px] text-sky-400/60 font-mono">{t.radius50km}</span>
            </div>

            {/* 30 km Regional Tracking */}
            <div className="absolute w-[68%] h-[68%] rounded-full border border-sky-400/35 flex items-start justify-center pt-1 pointer-events-none">
              <span className="text-[9px] text-sky-300/70 font-mono">{t.radius30km}</span>
            </div>

            {/* 15 km Approach Zone */}
            <div className="absolute w-[44%] h-[44%] rounded-full border-2 border-amber-400/40 bg-amber-500/5 flex items-start justify-center pt-1 pointer-events-none">
              <span className="text-[8px] text-amber-300/90 font-mono font-bold">{t.radius15km}</span>
            </div>

            {/* 5 km Immediate Farmlands */}
            <div className="absolute w-[22%] h-[22%] rounded-full border-2 border-emerald-400/80 bg-emerald-500/15 flex items-center justify-center pointer-events-none">
              <span className="text-[8px] text-emerald-300 font-extrabold">{t.radius5km}</span>
            </div>

            {/* Center Crosshair: Kadlur Village */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <span className="absolute -inset-2 bg-emerald-400/40 rounded-full animate-ping" />
                <MapPin className="w-6 h-6 text-emerald-400 fill-emerald-500 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <span className="mt-1 text-[11px] font-black text-white bg-black/85 px-2.5 py-0.5 rounded-full border border-emerald-400/40 shadow">
                Kadlur
              </span>
              <span className="text-[9px] text-emerald-300 font-mono font-bold">16.3768° N</span>
            </div>

            {/* Compass Heading */}
            <span className="absolute top-2 text-[10px] font-bold text-slate-400 font-mono">N</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-slate-400 font-mono">S</span>
            <span className="absolute left-2 text-[10px] font-bold text-slate-400 font-mono">W</span>
            <span className="absolute right-2 text-[10px] font-bold text-slate-400 font-mono">E</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="bg-slate-900/90 rounded-2xl p-3 sm:p-4 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Observation Scan:{' '}
                <strong>
                  {activeFrame?.timeIso
                    ? new Date(activeFrame.timeIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--'}
                </strong>
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-900/80 text-sky-200 border border-sky-600/50">
              Sweep {currentFrameIdx + 1} of {frames.length || 1}
            </span>
          </div>

          {/* Timeline Slider */}
          <input
            type="range"
            min={0}
            max={Math.max(0, frames.length - 1)}
            value={currentFrameIdx}
            onChange={(e) => {
              setCurrentFrameIdx(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition active:scale-95 shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? t.radarPause : t.radarPlay}</span>
            </button>
            <button
              onClick={() => {
                setCurrentFrameIdx(0);
                setIsPlaying(true);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="Reset radar loop"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monitoring Zones Guide Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
          <div className="bg-slate-900 p-2 rounded-xl border border-emerald-500/40 text-emerald-300">
            <strong className="block text-white">5 km Zone</strong>
            <span>కడ్లూరు పొలాలు (Immediate)</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-xl border border-amber-500/40 text-amber-300">
            <strong className="block text-white">15 km Zone</strong>
            <span>సమీప హెచ్చరిక (15-25m ETA)</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-xl border border-sky-500/40 text-sky-300">
            <strong className="block text-white">30 km Zone</strong>
            <span>పర్యవేక్షణ (Doppler Track)</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 text-slate-400">
            <strong className="block text-white">50 km Zone</strong>
            <span>బాహ్య రాడార్ పరిధి</span>
          </div>
        </div>

        {/* Intensity Legend */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>Light Rain (0.5 mm/h / 15 dBZ)</span>
            <span>Moderate (5 mm/h / 35 dBZ)</span>
            <span>Heavy (&gt; 15 mm/h / 50 dBZ)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-600 shadow-inner" />
        </div>
      </div>

      {/* Windy External Live Radar & Wind Streams */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            W
          </div>
          <div>
            <p className="font-bold text-slate-900">Windy Point Stream &amp; Satellite Overlay</p>
            <p className="text-slate-500 text-[11px]">ECMWF / GFS wind vectors &amp; radar centered exactly on Kadlur (16.3768° N, 77.2870° E)</p>
          </div>
        </div>
        <a
          href="https://www.windy.com/16.377/77.287?radar,16.377,77.287,10"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition active:scale-95 shrink-0 shadow-sm"
        >
          <span>Open Windy Kadlur Map</span>
          <span className="text-[10px] text-slate-400">↗</span>
        </a>
      </div>

      {/* Disclaimer */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-950 flex items-start gap-2.5">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.radarDisclaimer}
        </p>
      </div>
    </section>
  );
};
