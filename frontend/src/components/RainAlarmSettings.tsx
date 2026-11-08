import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, AlertTriangle, Play, Square, Check } from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import { rainAlarmPlayer } from '../lib/rainAlarmSound';

interface RainAlarmSettingsProps {
  currentLang: Language;
}

export const RainAlarmSettings: React.FC<RainAlarmSettingsProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('raithu_alarm_enabled');
      if (savedEnabled !== null) {
        setAlarmEnabled(savedEnabled === 'true');
      }
      const savedVol = localStorage.getItem('raithu_alarm_volume');
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!isNaN(v) && v >= 0.1 && v <= 1.0) {
          setVolume(v);
        }
      }
    }
  }, []);

  const handleToggle = () => {
    const nextState = !alarmEnabled;
    setAlarmEnabled(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('raithu_alarm_enabled', String(nextState));
    }
    // Also unlock audio context on toggle click
    rainAlarmPlayer.unlockAudio();
    if (!nextState && isPlaying) {
      rainAlarmPlayer.stopAlarm();
      setIsPlaying(false);
      setCountdown(0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (typeof window !== 'undefined') {
      localStorage.setItem('raithu_alarm_volume', String(v));
    }
  };

  const handleTestSound = async () => {
    if (isPlaying) {
      rainAlarmPlayer.stopAlarm();
      setIsPlaying(false);
      setCountdown(0);
      return;
    }

    setIsPlaying(true);
    setCountdown(5);

    const started = await rainAlarmPlayer.playAlarm(
      volume,
      (secondsLeft) => {
        setCountdown(secondsLeft);
      },
      () => {
        setIsPlaying(false);
        setCountdown(0);
      }
    );

    if (!started) {
      setIsPlaying(false);
      setCountdown(0);
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header with Rapido-style pulse icon */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {t.soundAlarmTitle}
              </h3>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase border border-amber-300">
                Rapido 5s
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
              {t.soundAlarmSubtitle}
            </p>
          </div>
        </div>

        {/* Master ON/OFF Switch Button (Min 48px touch target) */}
        <button
          onClick={handleToggle}
          className={`min-h-[48px] px-5 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition active:scale-95 shadow-sm ${
            alarmEnabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300'
          }`}
          aria-label={alarmEnabled ? t.soundAlarmToggleOn : t.soundAlarmToggleOff}
        >
          {alarmEnabled ? (
            <>
              <Check className="w-5 h-5 text-emerald-200" />
              <span>{t.soundAlarmToggleOn}</span>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 text-slate-500" />
              <span>{t.soundAlarmToggleOff}</span>
            </>
          )}
        </button>
      </div>

      {/* Control Strip: Test Alarm Button & Volume Slider */}
      <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Test Button with Animated Countdown */}
        <button
          onClick={handleTestSound}
          className={`w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2.5 transition active:scale-95 shadow-md ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-600'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>
                {t.testingSoundBadge} {countdown}s ({t.stopSoundBtn})
              </span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{t.testSoundBtn}</span>
            </>
          )}
        </button>

        {/* Volume Slider Control */}
        <div className="w-full sm:w-64 flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>{t.alarmVolume}</span>
              <span className="font-mono text-amber-800">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              aria-label={t.alarmVolume}
            />
          </div>
        </div>
      </div>

      {/* Farmer Guidance Note */}
      <div className="flex items-start gap-2 bg-amber-100/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-snug">{t.soundAlarmFarmerNote}</p>
      </div>
    </section>
  );
};
