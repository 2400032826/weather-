import React, { useState, useEffect } from 'react';
import { CloudSun, Volume2, VolumeX, RotateCw } from 'lucide-react';
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
  lastUpdated: _lastUpdated,
  onRefresh,
  isRefreshing,
  onReadAloud,
  isSpeaking,
  secondsSinceSync: _secondsSinceSync,
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
    <header className="sticky top-0 z-50 bg-[#092e1d] text-white shadow-sm border-b border-emerald-700/50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Logo, Title & Location Label */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="font-black text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                  RAITHU ALERT
                </span>
                <span className="text-[10px] font-black uppercase bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-400/40 whitespace-nowrap">
                  Kadlur
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/90 truncate flex items-center gap-1">
                <span>{currentLang === 'te' ? 'కడ్లూరు గ్రామం' : currentLang === 'kn' ? 'ಕಡ್ಲೂರು ಗ್ರಾಮ' : 'Kadlur Village'}</span>
                <span className="font-mono text-amber-300 font-bold">• {currentIstTime}</span>
              </p>
            </div>
          </div>

          {/* Action Tools: Voice + Language Switcher + Refresh */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Small Accessible Read-Aloud Icon Button */}
            <button
              onClick={onReadAloud}
              className={`p-1.5 rounded-lg border transition-all active:scale-95 flex items-center justify-center ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-800/60 hover:bg-emerald-700/80 text-amber-300 border-emerald-600/60'
              }`}
              title={isSpeaking ? t.stopVoice : t.readAloud}
              aria-label={t.readAloud}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-slate-950" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Language Selector: Compact accessible pills */}
            <div className="flex bg-black/40 p-0.5 rounded-lg border border-emerald-700/50 text-[11px] font-bold">
              {(['te', 'kn', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    currentLang === lang
                      ? 'bg-emerald-500 text-white font-black shadow-xs'
                      : 'text-emerald-200/80 hover:text-white'
                  }`}
                  aria-label={`Switch language to ${lang}`}
                >
                  {lang === 'te' ? 'తె' : lang === 'kn' ? 'ಕ' : 'EN'}
                </button>
              ))}
            </div>

            {/* Manual Refresh Icon */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 bg-emerald-800/60 hover:bg-emerald-700/80 rounded-lg border border-emerald-600/60 transition-all active:scale-95 text-white disabled:opacity-50 flex items-center justify-center"
              title={isRefreshing ? t.syncingNow : t.refresh}
              aria-label={t.refresh}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-300' : 'text-emerald-200'}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
