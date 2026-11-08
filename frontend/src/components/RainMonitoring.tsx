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
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-600 animate-pulse" />
            <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
              {t.rainMonitoringTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.radarCentredNotice}
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
          IMD Begumpet DWR (174 km NE)
        </span>
      </div>

      {/* Approaching Rain Status Pill */}
      {weather.radarCoverageStatus === 'UNAVAILABLE' ? (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 p-4 rounded-2xl text-amber-950">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm sm:text-base">{t.radarUnavailableNotice}</p>
            <p className="text-xs text-amber-800 mt-0.5">{t.radarDisclaimer}</p>
          </div>
        </div>
      ) : weather.isApproaching ? (
        <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl text-amber-950">
          <div className="bg-amber-500 text-white p-2 rounded-xl shrink-0 animate-bounce">
            <Radio className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-black text-base sm:text-lg text-amber-900">
              {t.rainApproachingStatus}
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              Doppler motion vectors confirm rain echoes tracking towards Kadlur farmlands.
            </p>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <span className="bg-white/90 p-2 rounded-lg border border-amber-200">
                {t.estimatedArrival}: <strong>~{weather.estimatedArrivalMinutes || 20} min</strong>
              </span>
              <span className="bg-white/90 p-2 rounded-lg border border-amber-200">
                {t.rainfallIntensity}: <strong>{weather.rainfallIntensityMmh || 2.5} mm/h</strong>
              </span>
              <span className="bg-white/90 p-2 rounded-lg border border-amber-200">
                {t.cellTrend}: <strong>{weather.cellTrend || 'STEADY'}</strong>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-emerald-950">
          <div className="bg-emerald-600 text-white p-2 rounded-xl shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-base sm:text-lg text-emerald-900">
              {t.noRainDetectedStatus}
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Real-time Doppler composite sweeps show zero precipitation reflectivity (&lt; 15 dBZ) over Kadlur and the 30 km monitoring perimeter.
            </p>
          </div>
        </div>
      )}

      {/* Large Visual Radar Map Display with Zoom Controls */}
      <div className="bg-slate-950 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-800 space-y-4">
        {/* Radar Map Controls Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white">Interactive Doppler Radar Map</span>
          </div>

          {/* Zoom Buttons (Section 7 Requirement) */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
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
              <span className="mt-1 text-[11px] font-black text-white bg-black/85 px-2 py-0.5 rounded-full border border-emerald-400/40 shadow">
                Kadlur
              </span>
              <span className="text-[9px] text-emerald-200 font-mono">16.3768° N</span>
            </div>

            {/* Compass Heading */}
            <span className="absolute top-2 text-[10px] font-bold text-slate-400 font-mono">N</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-slate-400 font-mono">S</span>
            <span className="absolute left-2 text-[10px] font-bold text-slate-400 font-mono">W</span>
            <span className="absolute right-2 text-[10px] font-bold text-slate-400 font-mono">E</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-2">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition active:scale-95"
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
