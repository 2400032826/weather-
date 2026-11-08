import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import { KADLUR_COORDS } from '../lib/weatherService';

interface KadlurGeographyCardProps {
  currentLang: Language;
}

export const KadlurGeographyCard: React.FC<KadlurGeographyCardProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
            Verified Kadlur Village Location
          </h2>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Exclusive Village Focus
        </span>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Strict Project Scope Requirement</span>
        </div>
        <p className="leading-relaxed">
          {t.strictScopeNotice} Raichur City is situated <strong>22.5 km away</strong> towards the south-southeast.
          Because Deccan convective rainfall is hyper-localized, weather in Raichur City frequently differs from Kadlur.
          All forecasts, Doppler radar sweeps, and nowcast rings target exclusively <strong>{KADLUR_COORDS.latitude}° N, {KADLUR_COORDS.longitude}° E</strong>.
        </p>
      </div>

      {/* Coordinate & Administrative Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Centroid Latitude</span>
          <strong className="text-slate-900 font-mono text-sm">{KADLUR_COORDS.latitude}° N</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Centroid Longitude</span>
          <strong className="text-slate-900 font-mono text-sm">{KADLUR_COORDS.longitude}° E</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Ground Elevation</span>
          <strong className="text-slate-900 text-sm">{KADLUR_COORDS.elevationMeters}m MSL</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Gram Panchayat</span>
          <strong className="text-slate-900 text-sm">{KADLUR_COORDS.gramPanchayat}</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Postal PIN Code</span>
          <strong className="text-slate-900 text-sm">{KADLUR_COORDS.pincode}</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Census 2011 Code</span>
          <strong className="text-slate-900 text-sm">{KADLUR_COORDS.censusCode}</strong>
        </div>
      </div>
    </section>
  );
};
