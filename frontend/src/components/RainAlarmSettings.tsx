import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bell, AlertTriangle, Play, Square, Check, Smartphone, Info } from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import { rainAlarmPlayer } from '../lib/rainAlarmSound';

interface RainAlarmSettingsProps {
  currentLang: Language;
}

export const RainAlarmSettings: React.FC<RainAlarmSettingsProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [sirenEnabled, setSirenEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [showAndroidGuide, setShowAndroidGuide] = useState<boolean>(false);

  // Load preferences from localStorage (separate from push notifications)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSiren = localStorage.getItem('raithu_siren_enabled') ?? localStorage.getItem('raithu_alarm_enabled');
      if (savedSiren !== null) {
        setSirenEnabled(savedSiren === 'true');
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
    const nextState = !sirenEnabled;
    setSirenEnabled(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('raithu_siren_enabled', String(nextState));
      localStorage.setItem('raithu_alarm_enabled', String(nextState));
    }
    // Unlock AudioContext on user gesture
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
            sirenEnabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300'
          }`}
          aria-label={sirenEnabled ? t.soundAlarmToggleOn : t.soundAlarmToggleOff}
        >
          {sirenEnabled ? (
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
        {/* Test Button with Animated Countdown (also unlocks mobile audio) */}
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

      {/* Foreground vs Background Behavior Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-ping" />
          <div>
            <strong className="text-emerald-900 block font-bold">
              {currentLang === 'te' ? 'యాప్ ఓపెన్‌లో ఉన్నప్పుడు (Foreground):' : currentLang === 'kn' ? 'ಆ್ಯಪ್ ತೆರೆದಿದ್ದಾಗ (Foreground):' : 'When App is Open (Foreground):'}
            </strong>
            <span className="text-emerald-800 text-[11px] leading-tight block mt-0.5">
              {currentLang === 'te'
                ? 'కడ్లూరు వైపు వర్షం వస్తే 5 సెకన్ల పెద్ద సైరన్ శబ్దం ఆటోమేటిక్‌గా మోగుతుంది.'
                : currentLang === 'kn'
                ? 'ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಬಂದರೆ 5 ಸೆಕೆಂಡುಗಳ ದೊಡ್ಡ ಸೈರನ್ ಶಬ್ದ ಮೊಳಗುತ್ತದೆ.'
                : 'Custom 5-second dual-tone siren plays automatically when verified rain approaches.'}
            </span>
          </div>
        </div>

        <div className="bg-sky-50/90 border border-sky-200 rounded-xl p-2.5 flex items-start gap-2">
          <Smartphone className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sky-900 block font-bold">
              {currentLang === 'te' ? 'ఫోన్ లాక్ / బ్యాక్‌గ్రౌండ్‌లో (Locked/Background):' : currentLang === 'kn' ? 'ಫೋನ್ ಲಾಕ್ / ಹಿನ್ನೆಲೆಯಲ್ಲಿ (Locked):' : 'Phone Locked / Background:'}
            </strong>
            <span className="text-sky-800 text-[11px] leading-tight block mt-0.5">
              {currentLang === 'te'
                ? 'మొబైల్ సిస్టమ్ నోటిఫికేషన్ టోన్ మరియు వైబ్రేషన్ హెచ్చరిక వస్తుంది.'
                : currentLang === 'kn'
                ? 'ಮೊಬೈಲ್ ಸಿಸ್ಟಮ್ ನೋಟಿಫಿಕೇಶನ್ ಧ್ವನಿ ಮತ್ತು ಕಂಪನ ಎಚ್ಚರಿಕೆ ಬರುತ್ತದೆ.'
                : 'Operating system notification chime and high-priority vibration are triggered.'}
            </span>
          </div>
        </div>
      </div>

      {/* Farmer Guidance & Audio Unlock Note */}
      <div className="flex items-start justify-between gap-2 bg-amber-100/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 font-medium">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-snug">{t.soundAlarmFarmerNote}</p>
        </div>
        <button
          onClick={() => setShowAndroidGuide(!showAndroidGuide)}
          className="text-amber-800 hover:text-amber-950 underline font-bold shrink-0 text-[11px] flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{currentLang === 'te' ? 'వివరాలు' : currentLang === 'kn' ? 'ವಿವರ' : 'Details'}</span>
        </button>
      </div>

      {/* Expanded Technical Note for Android PWA vs Native APK */}
      {showAndroidGuide && (
        <div className="bg-white border border-amber-300 rounded-2xl p-4 text-xs text-slate-700 space-y-2 animate-in fade-in">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>PWA vs Native Android Audio Architecture</span>
          </h4>
          <p className="leading-relaxed">
            <strong>PWA (Web Push):</strong> Browsers do not permit background JavaScript execution of custom AudioContext synthesis while the phone is locked. Push alerts are routed to the Android OS Notification Channel which produces the system chime and vibration pattern.
          </p>
          <p className="leading-relaxed">
            <strong>Native Android APK (Optional):</strong> For custom 5-second siren audio playback while locked, an Android app uses a dedicated <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">NotificationChannel</code> with <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">.setSound(R.raw.rain_siren)</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">USAGE_ALARM</code>. (Full Kotlin helper code is included in documentation).
          </p>
        </div>
      )}
    </section>
  );
};
