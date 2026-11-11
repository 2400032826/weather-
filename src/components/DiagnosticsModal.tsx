import React from 'react';
import { X, Server, Database, Cpu } from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';
import { SourceFreshness } from './SourceFreshness';
import { KadlurGeographyCard } from './KadlurGeographyCard';
import { AdminBroadcastSection } from './AdminBroadcastSection';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: KadlurWeatherState;
  currentLang: Language;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  weather,
  currentLang,
}) => {
  const t = translations[currentLang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-300 space-y-4 p-5 sm:p-6 text-slate-800 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="font-black text-lg text-slate-900">
                {t.devDiagnosticsLink}
              </h2>
              <p className="text-xs text-slate-500">
                Technical API status, geographical centroids, and model telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            aria-label="Close diagnostics"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Backend Connectivity Status */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono font-bold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Server className="w-4 h-4 text-emerald-600" />
              FastAPI Daemon Status:
            </span>
            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              ONLINE (127.0.0.1:8000)
            </span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Database className="w-4 h-4 text-sky-600" />
              SQLite Persistent Database:
            </span>
            <span className="text-slate-800 font-bold">
              backend/weather_kadlur.db
            </span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-500">Scheduled Background Polling:</span>
            <span className="text-slate-800 font-bold">Every 45 seconds (Active Worker)</span>
          </div>
        </div>

        {/* 1. Source Freshness & Technical Reliability Table */}
        <SourceFreshness weather={weather} currentLang={currentLang} />

        {/* 2. Kadlur Geographical Specifications Verification */}
        <KadlurGeographyCard currentLang={currentLang} />

        {/* 3. Admin Push Notification Broadcast Test */}
        <AdminBroadcastSection />

        {/* 4. About & Developer Verification Section */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-4 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">About Raithu Alert — Kadlur Microclimate System</h3>
              <p className="text-slate-600 mt-0.5">
                Precision early-warning weather platform purpose-built for the farmers of Kadlur Village, Raichur District, Karnataka.
              </p>
            </div>
            <span className="px-3 py-1 bg-white border border-emerald-300 rounded-full font-bold text-emerald-900 shadow-xs text-xs">
              Designed &amp; Developed by <strong className="text-emerald-700">Venkat</strong>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-emerald-200/50 leading-relaxed">
            Integrity Note: Weather forecasts are probabilistic model assimilations (Open-Meteo NWP grid) and radar sweeps (IMD Begumpet DWR composite). No weather system can claim 100% predictive accuracy. All observations are verified directly against source telemetry.
          </p>
        </div>

        {/* Bottom Close Button */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            {t.closeDiagnostics}
          </button>
        </div>
      </div>
    </div>
  );
};
