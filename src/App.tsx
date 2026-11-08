import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { RainWarningStatus } from './components/RainWarningStatus';
import { NotificationControl } from './components/NotificationControl';
import { RainAlarmSettings } from './components/RainAlarmSettings';
import { HourlyTimeline } from './components/HourlyTimeline';
import { TenDayForecast } from './components/TenDayForecast';
import { RainMonitoring } from './components/RainMonitoring';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import type { Language } from './lib/translations';
import { translations } from './lib/translations';
import type { KadlurWeatherState } from './lib/weatherService';
import { fetchLiveKadlurWeather } from './lib/weatherService';
import { rainAlarmPlayer } from './lib/rainAlarmSound';
import { WifiOff, Cpu } from 'lucide-react';

export function App() {
  // Default language is Telugu ('te') for local Kadlur farmers per requirements
  const [currentLang, setCurrentLang] = useState<Language>('te');
  const [weatherState, setWeatherState] = useState<KadlurWeatherState | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [secondsSinceSync, setSecondsSinceSync] = useState<number>(0);

  const lastSyncTimeRef = useRef<number>(Date.now());

  // Monitor network online/offline state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Fetch weather data from backend (with fallback)
  const loadData = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await fetchLiveKadlurWeather();
      setWeatherState(data);
      lastSyncTimeRef.current = Date.now();
      setSecondsSinceSync(0);
    } catch (err) {
      console.warn('Weather fetch error:', err);
      // Try restore from localStorage cache if offline
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('raithu_alert_cache');
        if (cached) {
          try {
            setWeatherState(JSON.parse(cached));
          } catch (e) {}
        }
      }
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  // 1. Digital Clock & Second-by-Second Timer Ticker
  useEffect(() => {
    const secondTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastSyncTimeRef.current) / 1000);
      setSecondsSinceSync(elapsed);
    }, 1000);
    return () => clearInterval(secondTimer);
  }, []);

  // 2. Automatic Scheduled Background Updates without manual page reload
  // Checks backend cache every 35 seconds quietly
  useEffect(() => {
    loadData(false);
    const bgSyncInterval = setInterval(() => {
      loadData(false);
    }, 35000);
    return () => clearInterval(bgSyncInterval);
  }, [loadData]);

  // 3. Attention-Grabbing Rapido-Style Rain Alarm trigger on escalated warning (YELLOW, ORANGE, RED)
  useEffect(() => {
    if (!weatherState?.activeAlert) return;
    const alert = weatherState.activeAlert;
    if (['YELLOW', 'ORANGE', 'RED'].includes(alert.level)) {
      const isAlarmEnabled = typeof window !== 'undefined'
        ? localStorage.getItem('raithu_alarm_enabled') !== 'false'
        : true;
      if (isAlarmEnabled && rainAlarmPlayer.shouldTriggerForAlert(alert.level, alert.observationTime)) {
        const vol = parseFloat(localStorage.getItem('raithu_alarm_volume') || '0.8');
        rainAlarmPlayer.playAlarm(isNaN(vol) ? 0.8 : vol);
      }
    }
  }, [weatherState?.activeAlert]);

  // Persist language selection
  useEffect(() => {
    const saved = localStorage.getItem('raithu_alert_lang') as Language;
    if (saved && ['te', 'kn', 'en'].includes(saved)) {
      setCurrentLang(saved);
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('raithu_alert_lang', lang);
    if (isSpeaking && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Text-To-Speech (Voice readout for farmers in Telugu, Kannada, or English)
  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !weatherState) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    let speechLang = 'te-IN';

    if (currentLang === 'te') {
      speechLang = 'te-IN';
      speechText = `రైతు అలర్ట్ కడ్లూరు. ప్రస్తుతం ఉష్ణోగ్రత ${Math.round(weatherState.temperature)} డిగ్రీలు. వాతావరణం ${weatherState.conditionText}. ${weatherState.activeAlert.descriptionTe || 'ప్రస్తుతం వర్షం సూచన లేదు.'}`;
    } else if (currentLang === 'kn') {
      speechLang = 'kn-IN';
      speechText = `ರೈತು ಅಲರ್ಟ್ ಕಡ್ಲೂರು. ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${Math.round(weatherState.temperature)} ಡಿಗ್ರಿ. ಹವಾಮಾನ ${weatherState.conditionText}. ${weatherState.activeAlert.descriptionKn || 'ಸದ್ಯಕ್ಕೆ ಮಳೆ ಸಾಧ್ಯತೆ ಇಲ್ಲ.'}`;
    } else {
      speechLang = 'en-IN';
      speechText = `Raithu Alert Kadlur Village. Current temperature is ${Math.round(weatherState.temperature)} degrees Celsius. Weather condition is ${weatherState.conditionText}. ${weatherState.activeAlert.description}`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = speechLang;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const t = translations[currentLang];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      {/* 1. Header (Kadlur location, 1-second IST Clock, Live indicator, Voice, Language) */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        lastUpdated={weatherState?.lastUpdated || '--'}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
        onReadAloud={handleReadAloud}
        isSpeaking={isSpeaking}
        secondsSinceSync={secondsSinceSync}
      />

      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t.offlineBanner}</span>
        </div>
      )}

      {/* Main Content Area - Strictly Simplified for Farmers */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 space-y-5">
        {isLoading && !weatherState ? (
          /* Loading Skeleton for Slow Mobile Connections */
          <div className="space-y-4 animate-pulse">
            <div className="h-44 bg-slate-200 rounded-3xl" />
            <div className="h-32 bg-slate-200 rounded-3xl" />
            <div className="h-20 bg-slate-200 rounded-3xl" />
            <div className="h-48 bg-slate-200 rounded-3xl" />
            <div className="h-64 bg-slate-200 rounded-3xl" />
          </div>
        ) : weatherState ? (
          <>
            {/* 2.A: CURRENT WEATHER (Temperature, condition, rainfall, wind, last updated) */}
            <CurrentWeather
              weather={weatherState}
              currentLang={currentLang}
            />

            {/* 2.B: BIG RAIN ALERT (Large Colourful Cards: GREEN, YELLOW, ORANGE, RED) */}
            <RainWarningStatus
              weather={weatherState}
              currentLang={currentLang}
              onNavigateToRadar={() => {
                const el = document.getElementById('radar-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2.C: NOTIFICATION BUTTON (🔔 TURN ON RAIN ALERTS / RAIN ALERTS ON) */}
            <NotificationControl
              currentLang={currentLang}
            />

            {/* 2.D: RAPIDO-STYLE RAIN ALARM SOUND SETTINGS (5s Siren + Test Alarm + Volume) */}
            <RainAlarmSettings
              currentLang={currentLang}
            />

            {/* 3: HOURLY WEATHER (Next 24h, 48h, 10d in simple cards, orange for rain) */}
            <HourlyTimeline
              weather={weatherState}
              currentLang={currentLang}
            />

            {/* 4: SIMPLE 10-DAY FORECAST (Day/date, max/min, rain probability, mm, icons, tappable) */}
            <TenDayForecast
              days={weatherState.daily10d || []}
              currentLang={currentLang}
            />

            {/* 5: SIMPLE RADAR MAP (Centered on Kadlur, distance rings, rain clouds) */}
            <div id="radar-section">
              <RainMonitoring
                weather={weatherState}
                currentLang={currentLang}
              />
            </div>
          </>
        ) : null}
      </main>

      {/* Farmer Footer with Link to Technical Diagnostics */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-7 mt-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <p className="font-black text-white text-base tracking-tight">{t.appName}</p>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-700">
                Kadlur Village
              </span>
            </div>
            <p className="text-slate-400 mt-0.5">{t.tagline} • Raichur District, Karnataka</p>
          </div>

          {/* Discreet Diagnostics Link */}
          <div className="flex flex-col items-center sm:items-end gap-1.5">
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition active:scale-95 shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.devDiagnosticsLink}</span>
            </button>
            <p className="text-[10px] text-slate-500 font-mono">
              Auto-sync: 35s • Kadlur Coordinates: 16.3768° N, 77.2870° E
            </p>
          </div>
        </div>
      </footer>

      {/* Developer & Admin Diagnostics Modal (Hidden from main farmer view) */}
      {weatherState && (
        <DiagnosticsModal
          isOpen={isDiagnosticsOpen}
          onClose={() => setIsDiagnosticsOpen(false)}
          weather={weatherState}
          currentLang={currentLang}
        />
      )}
    </div>
  );
}

export default App;
