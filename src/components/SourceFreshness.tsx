import React from 'react';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Key,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState, ProviderFreshnessItem } from '../lib/weatherService';

interface SourceFreshnessProps {
  weather: KadlurWeatherState;
  currentLang: Language;
}

export const SourceFreshness: React.FC<SourceFreshnessProps> = ({ weather, currentLang }) => {
  const t = translations[currentLang];
  const providers: ProviderFreshnessItem[] = weather.providers || [];

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
            {t.dataFreshnessTitle}
          </h2>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          5 Providers Monitored
        </span>
      </div>

      {/* Freshness Rule Alert Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.sourceIntegrityNotice} Radar sweeps &gt; 15 min are marked <strong>Delayed</strong>; &gt; 30 min are marked <strong>Stale</strong>. Stale radar data is never presented as live.
        </p>
      </div>

      {/* List of Providers with Freshness Metrics */}
      <div className="space-y-3">
        {providers.map((p) => {
          const isFresh = p.freshnessStatus === 'Live / Fresh';
          const isDelayed = p.freshnessStatus === 'Delayed';
          const isStale = p.freshnessStatus === 'Stale';
          const isUnavailable = p.freshnessStatus === 'Unavailable';

          return (
            <div
              key={p.providerId}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 transition hover:shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {p.displayName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 text-[11px]">
                      {p.providerId}
                    </span>
                    <span>• Sweep: every {p.updateFrequencyMinutes} min</span>
                    <span>• {p.isFree ? 'Free Access' : 'Commercial Key'}</span>
                  </div>
                </div>

                {/* Freshness Badge */}
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    isFresh
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : isDelayed
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : isStale
                      ? 'bg-orange-100 text-orange-900 border-orange-300'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {isFresh ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isUnavailable ? (
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {p.freshnessStatus}
                </span>
              </div>

              {/* Status Message / Telemetry */}
              <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                {p.statusMessage}
              </p>

              {/* Data Delay and Coverage Strip */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2 pt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Data Age / Delay: <strong>{p.dataDelayMinutes !== undefined && p.dataDelayMinutes !== null ? `${p.dataDelayMinutes} min` : 'N/A'}</strong>
                </span>
                <span>Coverage: <strong>{p.coverageDetails || 'Kadlur grid'}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
