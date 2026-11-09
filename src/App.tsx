import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { InstallAppBanner } from './components/InstallAppBanner';
import { CurrentWeather } from './components/CurrentWeather';
import { RainWarningStatus } from './components/RainWarningStatus';
import { NotificationControl } from './components/NotificationControl';
import { RainAlarmSettings } from './components/RainAlarmSettings';
import { HourlyTimeline } from './components/HourlyTimeline';
import { TenDayForecast } from './components/TenDayForecast';
import { RainMonitoring } from './components/RainMonitoring';
import { QuickFiveAnswers } from './components/QuickFiveAnswers';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import type { Language } from './lib/translations';
import { translations } from './lib/translations';
import type { KadlurWeatherState } from './lib/weatherService';
import { fetchLiveKadlurWeather, getCachedKadlurWeather } from './lib/weatherService';
import { rainAlarmPlayer } from './lib/rainAlarmSound';
import { WifiOff, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

export function App() {
  // Default language is Telugu ('te') for local Kadlur farmers per requirements
  const [currentLang, setCurrentLang] = useState<Language>('te');
  // Stale-While-Revalidate: Instant synchronous initialization from cache (<50ms)
  const [weatherState, setWeatherState] = useState<KadlurWeatherState | null>(() => getCachedKadlurWeather());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(() => !getCachedKadlurWeather());
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [secondsSinceSync, setSecondsSinceSync] = useState<number>(0);

  const isFetchingRef = useRef<boolean>(false);
  const lastSyncTimeRef = useRef<number>(Date.now());
  const isInitialMountRef = useRef<boolean>(true);

  // Monitor network online/offline state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }
  }, []);

  // Fetch weather data from backend (with automatic fallback to open-meteo & cache)
  const loadData = useCallback(async (isManual: boolean = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (isManual) setIsRefreshing(true);

    try {
      const data = await fetchLiveKadlurWeather();
      setWeatherState(data);
      lastSyncTimeRef.current = Date.now();
      setSecondsSinceSync(0);
    } catch (err) {
      console.warn('Weather fetch error:', err);
      // Fallback to cached state marked stale
      const cached = getCachedKadlurWeather();
      if (cached) {
        cached.isStale = true;
        setWeatherState(cached);
      }
    } finally {
      isFetchingRef.current = false;
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

  // 2. Automatic Scheduled Background Updates with Tab Visibility Management
  // Only polls when the browser tab is active to preserve farmer's phone battery & data
  useEffect(() => {
    loadData(false);

    // Tiered polling: Check every 60 seconds when tab is visible
    const bgSyncInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return; // Pause polling when tab is hidden or phone is asleep
      }
      loadData(false);
    }, 60000);

    // Resume polling and immediately refresh if farmer switches back to tab after >= 60s
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = (Date.now() - lastSyncTimeRef.current) / 1000;
        if (elapsed >= 60) {
          loadData(false);
        }
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      loadData(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(bgSyncInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadData]);

  // 3. Attention-Grabbing Rapido-Style Rain Alarm trigger strictly on verified approaching rain (YELLOW, ORANGE, RED)
  // Guaranteed: NEVER plays on initial load, refresh, dry weather, or previously alarmed events
  useEffect(() => {
    if (!weatherState?.activeAlert) return;
    const alert = weatherState.activeAlert;
    const eventId = alert.eventId || `${alert.level}_${alert.observationTime}`;

    // 1. NEVER trigger siren on initial page open or refresh
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (typeof window !== 'undefined' && eventId) {
        try {
          localStorage.setItem('raithu_last_alarmed_event_id', eventId);
        } catch (e) {}
      }
      return;
    }

    // 2. Never play siren for GREEN, GREY, or dry weather
    if (!['YELLOW', 'ORANGE', 'RED'].includes(alert.level)) {
      return;
    }

    // 3. STRICT EVIDENCE VALIDATION:
    // Requires genuine radar echoes tracking towards Kadlur or active ground rainfall
    const hasGenuineRainApproaching =
      weatherState.isApproaching ||
      weatherState.rainDetected ||
      weatherState.currentRainfall >= 1.0 ||
      (alert.level === 'YELLOW' && weatherState.nearestRainDistanceKm != null && weatherState.nearestRainDistanceKm <= 30);

    if (!hasGenuineRainApproaching) {
      return;
    }

    // 4. Reject contradictory dry descriptions
    const desc = (alert.description || '').toLowerCase();
    if (desc.includes('dry') || desc.includes('stable') || desc.includes('no significant rain')) {
      console.warn('Rejecting siren: Alert claims warning level but description indicates dry conditions.');
      return;
    }

    // 5. Check independent rain siren preference (separate from push notifications)
    const isSirenEnabled = typeof window !== 'undefined'
      ? (localStorage.getItem('raithu_siren_enabled') !== 'false' && localStorage.getItem('raithu_alarm_enabled') !== 'false')
      : true;

    // 6. Check persistent event deduplication (via localStorage in shouldTriggerForAlert)
    if (isSirenEnabled && rainAlarmPlayer.shouldTriggerForAlert(alert.level, eventId, alert.observationTime, false)) {
      const vol = parseFloat(localStorage.getItem('raithu_alarm_volume') || '0.8');
      rainAlarmPlayer.playAlarm(isNaN(vol) ? 0.8 : vol);
    }
  }, [
    weatherState?.activeAlert,
    weatherState?.isApproaching,
    weatherState?.rainDetected,
    weatherState?.currentRainfall,
    weatherState?.nearestRainDistanceKm
  ]);

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
        {/* First-Time Mobile PWA Install Banner (Automatically hidden once installed) */}
        <InstallAppBanner currentLang={currentLang} />

        {/* Stale / Cached Notice Banner when offline or using older stored data */}
        {weatherState?.isStale && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.staleDataWarning}</span>
            </div>
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition shrink-0 active:scale-95"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t.refresh}</span>
            </button>
          </div>
        )}

        {/* Cached Data Revalidating Indicator */}
        {weatherState?.isFromCache && !weatherState?.isStale && isRefreshing && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>{t.syncingInBackground}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-mono">IST Live Sync</span>
          </div>
        )}

        {isLoading && !weatherState ? (
          /* Structured Dashboard Skeleton for First-Time Visitors on Slow Connections */
          <DashboardSkeleton />
        ) : weatherState ? (
          <>
            {/* 1: CURRENT WEATHER (Immediately at the top: Large temperature, condition, rain, wind, humidity, cloud) */}
            <CurrentWeather
              weather={weatherState}
              currentLang={currentLang}
            />

            {/* 2: COMPACT RAIN STATUS CARD (Green, Amber, Red, Grey based on verified evidence) */}
            <RainWarningStatus
              weather={weatherState}
              currentLang={currentLang}
              onNavigateToRadar={() => {
                const el = document.getElementById('radar-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3: HOURLY WEATHER FORECAST (Directly after rain status with dynamic icons) */}
            <HourlyTimeline
              weather={weatherState}
              currentLang={currentLang}
            />

            {/* 4: 10-DAY FORECAST (Directly below hourly timeline) */}
            <TenDayForecast
              days={weatherState.daily10d || []}
              currentLang={currentLang}
            />

            {/* 5: RAIN ALERTS (Notification control) */}
            <NotificationControl
              currentLang={currentLang}
            />

            {/* 6: PWA INSTALL BANNER (Discreet, below primary weather) */}
            <InstallAppBanner
              currentLang={currentLang}
            />

            {/* 7: SIMPLE RADAR MAP & WINDY (Centered on Kadlur) */}
            <div id="radar-section">
              <RainMonitoring
                weather={weatherState}
                currentLang={currentLang}
              />
            </div>

            {/* 8: QUICK 5 ANSWERS (At-A-Glance Status) */}
            <QuickFiveAnswers
              weather={weatherState}
              currentLang={currentLang}
            />

            {/* 9: LIVE RAIN SIREN ALARM CONTROLS */}
            <RainAlarmSettings
              currentLang={currentLang}
            />
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
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              Designed &amp; Developed by <span className="text-emerald-400 font-bold">Venkat</span>
            </p>
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
              Auto-sync: 60s • Kadlur Coordinates: 16.3768° N, 77.2870° E
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
