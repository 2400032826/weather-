import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, Volume2, VolumeX, Clock, Activity, RotateCw } from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  lastUpdated: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onReadAloud: () => void;
  isSpeaking: boolean;
  secondsSinceSync: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  lastUpdated,
  onRefresh,
  isRefreshing,
  onReadAloud,
  isSpeaking,
  secondsSinceSync,
}) => {
  const t = translations[currentLang];
  const [currentIstTime, setCurrentIstTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentIstTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 text-white shadow-lg border-b border-emerald-700/60">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        {/* Top Branding & Main Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Identity */}
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-600/90 p-2 rounded-2xl border border-emerald-400/30 shadow-inner flex items-center justify-center shrink-0">
              <CloudSun className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-xl tracking-tight text-white">
                  {t.appName}
                </h1>
                <span className="text-[10px] font-black uppercase bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Kadlur
                </span>
                {/* Live Auto-Updating Indicator Pill */}
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/70">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>{t.liveIndicator}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200 font-semibold tracking-wide">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Action Tools: Voice + Language Switcher + Refresh */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Voice Readout Button */}
            <button
              onClick={onReadAloud}
              className={`p-2 rounded-xl border text-xs font-bold transition active:scale-95 flex items-center gap-1 ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow animate-bounce'
                  : 'bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100 border-emerald-500/40'
              }`}
              title={isSpeaking ? t.stopVoice : t.readAloud}
              aria-label={t.readAloud}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-slate-950" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
              <span className="hidden sm:inline">{isSpeaking ? t.stopVoice : t.readAloud}</span>
            </button>

            {/* Language Selector: Telugu first! */}
            <div className="flex bg-black/40 p-0.5 sm:p-1 rounded-xl border border-emerald-700/60 text-xs font-bold">
              {(['te', 'kn', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all ${
                    currentLang === lang
                      ? 'bg-emerald-500 text-white shadow-sm font-black'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                  aria-label={`Switch language to ${lang}`}
                >
                  {lang === 'te' ? 'తెలుగు' : lang === 'kn' ? 'ಕನ್ನಡ' : 'EN'}
                </button>
              ))}
            </div>

            {/* Manual Refresh / Sync Status */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 bg-emerald-700/60 hover:bg-emerald-600 rounded-xl border border-emerald-500/40 transition active:scale-95 text-white disabled:opacity-50"
              title={isRefreshing ? t.syncingNow : t.refresh}
              aria-label={t.refresh}
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : 'text-emerald-200'}`} />
            </button>
          </div>
        </div>

        {/* 1. Digital Clock (IST Every Second) & Real-time Auto-Sync Bar */}
        <div className="mt-2 pt-2 border-t border-emerald-700/50 flex flex-wrap items-center justify-between text-xs text-emerald-100/90 gap-1.5">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="font-bold">{t.locationTitle}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px]">
            {/* Live IST Clock with Second-by-second ticker */}
            <span className="flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800 font-mono font-black text-amber-300 shadow-inner">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{currentIstTime || '06:00:00 PM IST'}</span>
            </span>

            {/* Auto-updating Live Status Badge */}
            <span className="hidden sm:flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/80 text-[10px] text-emerald-300">
              <Activity className="w-3 h-3 text-emerald-400 shrink-0" />
              {isRefreshing ? (
                <span className="text-amber-300 font-bold animate-pulse">{t.syncingNow}</span>
              ) : (
                <span>{t.autoUpdating} ({secondsSinceSync}s)</span>
              )}
            </span>

            {/* Last successful refresh */}
            <span className="bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800 font-mono text-[10px] text-emerald-300">
              {t.lastUpdated}: {lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
