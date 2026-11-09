export type Language = 'te' | 'kn' | 'en';

export interface Translations {
  appName: string;
  tagline: string;
  locationTitle: string;
  locationSubtitle: string;
  distFromCity: string;
  strictScopeNotice: string;
  
  // Real-time Clock & Auto-refresh
  digitalClockIst: string;
  liveIndicator: string;
  autoUpdating: string;
  syncingNow: string;
  dataDelayedNotice: string;
  nextRadarScanIn: string;

  // Current Weather
  currentWeather: string;
  temperature: string;
  feelsLike: string;
  humidity: string;
  windSpeed: string;
  windDirection: string;
  cloudCover: string;
  currentRainfall: string;
  rainProbability: string;
  condition: string;
  lastUpdated: string;
  refresh: string;
  refreshing: string;
  offlineBanner: string;

  // Big Rain Alert (Green, Yellow, Orange, Red, Grey)
  bigAlertGreen: string;
  bigAlertYellow: string;
  bigAlertOrange: string;
  bigAlertRed: string;
  bigAlertGrey: string;

  // Big Notification Button
  turnOnAlertsBtn: string;
  alertsOnBtn: string;
  alertsOffBtn: string;

  // Hourly Timeline
  hourlyTitle: string;
  hourlySubtitle: string;
  view24h: string;
  view48h: string;
  view10d: string;
  view7d: string;
  forecastNotice: string;
  dryHour: string;
  rainHour: string;
  nowBadge: string;

  // 10-Day Forecast
  tenDayTitle: string;
  tenDaySubtitle: string;
  maxTemp: string;
  minTemp: string;
  expectedRain: string;
  rainChance: string;
  tapForDetails: string;

  // Rain Monitoring / Radar
  rainMonitoringTitle: string;
  isRainApproaching: string;
  radarCentredNotice: string;
  rainApproachingStatus: string;
  noRainDetectedStatus: string;
  rainDetectedNearbyStatus: string;
  heavyRainWarningStatus: string;
  thunderstormWarningStatus: string;
  radarUnavailableNotice: string;
  estimatedArrival: string;
  rainfallIntensity: string;
  cellSpeed: string;
  cellTrend: string;
  radarPlay: string;
  radarPause: string;
  zoomIn: string;
  zoomOut: string;
  resetMap: string;
  radarDisclaimer: string;

  // Alerts
  alertsTitle: string;
  enableAlerts: string;
  disableAlerts: string;
  alertsSubscribed: string;
  sendTestAlert: string;
  testAlertSending: string;
  testAlertSuccess: string;
  notificationPermissionDenied: string;
  activeStatusBanner: string;
  readAloud: string;
  stopVoice: string;

  // Data Freshness
  dataFreshnessTitle: string;
  freshnessStatusLive: string;
  freshnessStatusDelayed: string;
  freshnessStatusStale: string;
  freshnessStatusUnavailable: string;
  sourceIntegrityNotice: string;

  // Badges & Tabs
  forecastModelBadge: string;
  actualObservationBadge: string;
  radius5km: string;
  radius15km: string;
  radius30km: string;
  radius50km: string;

  // Developer Diagnostics
  devDiagnosticsLink: string;
  closeDiagnostics: string;

  // Real-Time Rapido Rain Alarm Sound
  soundAlarmTitle: string;
  soundAlarmSubtitle: string;
  soundAlarmToggleOn: string;
  soundAlarmToggleOff: string;
  testSoundBtn: string;
  testingSoundBadge: string;
  stopSoundBtn: string;
  alarmVolume: string;
  soundAlarmFarmerNote: string;
  modelEstimateBadge: string;

  // 5 Core Mobile Farmer Questions
  q1RainNow: string;
  q2RainComing: string;
  q3RainDistance: string;
  q4RainArrival: string;
  q5DataFreshness: string;

  // PWA First-Time Installation
  installAppBtn: string;
  installAppSubtitle: string;
  iosInstallTitle: string;
  iosStep1: string;
  iosStep2: string;
  iHaveInstalled: string;
  closeGuide: string;

  // Cache & Live Auto-Update Indicators
  cachedDataNotice: string;
  staleDataWarning: string;
  syncingInBackground: string;

  // Developer Credit
  developerCredit: string;
}

export const translations: Record<Language, Translations> = {
  te: {
    appName: "రైతు అలర్ట్ (RAITHU ALERT)",
    tagline: "గ్రామ స్థాయి వాతావరణ పర్యవేక్షణ",
    locationTitle: "కడ్లూరు గ్రామం, రాయచూరు జిల్లా, కర్ణాటక",
    locationSubtitle: "శక్వాడి గ్రామ పంచాయతీ, రాయచూరు తాలూకా • 16.3768° N, 77.2870° E",
    distFromCity: "రాయచూరు నగరం నుండి 22.5 కి.మీ దూరం (ప్రత్యేక వాతావరణం)",
    strictScopeNotice: "పూర్తిగా కడ్లూరు గ్రామం కోసం మాత్రమే. రాయచూరు నగర సమాచారాన్ని ఉపయోగించము.",

    digitalClockIst: "కడ్లూరు స్థానిక సమయం (IST)",
    liveIndicator: "లైవ్",
    autoUpdating: "ప్రతి సెకనుకు ఆటో-అప్‌డేట్ అవుతోంది",
    syncingNow: "తాజా సమాచారం సేకరిస్తోంది...",
    dataDelayedNotice: "వాతావరణ సమాచారం ఆలస్యమైంది.",
    nextRadarScanIn: "తదుపరి రాడార్ స్కాన్",

    currentWeather: "ప్రస్తుత వాతావరణం",
    temperature: "ఉష్ణోగ్రత",
    feelsLike: "అనిపించే ఉష్ణోగ్రత",
    humidity: "గాలిలో తేమ",
    windSpeed: "గాలి వేగం",
    windDirection: "గాలి వీచే దిశ",
    cloudCover: "మేఘావృతం",
    currentRainfall: "ప్రస్తుత వర్షపాతం",
    rainProbability: "వర్షం పడే అవకాశం",
    condition: "వాతావరణ స్థితి",
    lastUpdated: "చివరి తాజాకరణ",
    refresh: "తాజా సమాచారం",
    refreshing: "సేకరిస్తున్నాము...",
    offlineBanner: "ఇంటర్నెట్ అందుబాటులో లేదు. చివరిగా సేకరించిన సమాచారం చూపబడుతోంది.",

    bigAlertGreen: "ప్రస్తుతం వర్షం సూచన లేదు",
    bigAlertYellow: "వర్షం పడే అవకాశం ఉంది",
    bigAlertOrange: "కడ్లూరు వైపు వర్షం వస్తోంది",
    bigAlertRed: "భారీ వర్షపు హెచ్చరిక",
    bigAlertGrey: "వర్షపు హెచ్చరిక అందుబాటులో లేదు (రాడార్ డేటా లేదు)",

    turnOnAlertsBtn: "🔔 వర్ష అలర్ట్‌లు ఆన్ చేయండి",
    alertsOnBtn: "వర్ష అలర్ట్‌లు ఆన్ (RAIN ALERTS ON)",
    alertsOffBtn: "వర్ష అలర్ట్‌లు ఆఫ్ (RAIN ALERTS OFF)",

    hourlyTitle: "గంటల వారీ వాతావరణం (Hourly)",
    hourlySubtitle: "కడ్లూరు పొలాల కోసం రాబోయే గంటల్లో వర్షం మరియు ఉష్ణోగ్రత అంచనా",
    view24h: "రాబోయే 24 గంటలు",
    view48h: "రాబోయే 48 గంటలు",
    view10d: "రాబోయే 10 రోజులు",
    view7d: "రాబోయే 7 రోజులు",
    forecastNotice: "ఇది వాతావరణ అంచనా మోడల్ (Open-Meteo). ప్రత్యక్ష రాడార్ పరిశీలన కాదు.",
    dryHour: "వర్షం లేదు",
    rainHour: "వర్షం పడే అవకాశం",
    nowBadge: "ఇప్పుడు",

    tenDayTitle: "10 రోజుల వాతావరణ అంచనా",
    tenDaySubtitle: "కడ్లూరు రైతుల కోసం రోజువారీ గరిష్ట/కనిష్ట ఉష్ణోగ్రత మరియు వర్షపాతం",
    maxTemp: "గరిష్ట",
    minTemp: "కనిష్ట",
    expectedRain: "వర్షం",
    rainChance: "వర్షం అవకాశం",
    tapForDetails: "మరిన్ని వివరాలకు రోజుపై నొక్కండి",

    rainMonitoringTitle: "డాప్లర్ రాడార్ లైవ్ వర్షపు పర్యవేక్షణ",
    isRainApproaching: "కడ్లూరు వైపు వర్షం వస్తోందా?",
    radarCentredNotice: "కడ్లూరు భౌగోళిక ప్రాంతంపై కేంద్రీకరించబడిన డాప్లర్ రాడార్ (16.3768° N)",
    rainApproachingStatus: "కడ్లూరు వైపు వర్షం వస్తోంది",
    noRainDetectedStatus: "ప్రస్తుతం వర్షం సూచన లేదు",
    rainDetectedNearbyStatus: "కడ్లూరు సమీపంలో వర్షం ప్రారంభమైంది",
    heavyRainWarningStatus: "భారీ వర్షపు హెచ్చరిక",
    thunderstormWarningStatus: "ఉరుములు, ఈదురు గాలుల హెచ్చరిక",
    radarUnavailableNotice: "ప్రస్తుతం రాడార్ సమాచారం అందుబాటులో లేనందున వర్షపు రాకను ధృవీకరించలేకపోతున్నాము.",
    estimatedArrival: "వర్షం చేరే సమయం",
    rainfallIntensity: "వర్షపు తీవ్రత",
    cellSpeed: "మేఘాల కదలిక వేగం",
    cellTrend: "తీవ్రత స్థితి",
    radarPlay: "రాడార్ లూప్ చూడండి",
    radarPause: "ఆపండి",
    zoomIn: "జూమ్ ఇన్ (+)",
    zoomOut: "జూమ్ అవుట్ (-)",
    resetMap: "మొదటి స్థానానికి",
    radarDisclaimer: "నిజమైన డాప్లర్ రాడార్ ఎకోల ఆధారంగా మాత్రమే వర్షపు అంచనాలు ఇవ్వబడతాయి. నకిలీ సమాచారం చూపబడదు.",

    alertsTitle: "కడ్లూరు వర్ష హెచ్చరికలు",
    enableAlerts: "వర్ష అలర్ట్‌లు ఆన్ చేయండి (TURN ON RAIN ALERTS)",
    disableAlerts: "వర్ష అలర్ట్‌లు ఆఫ్ చేయండి",
    alertsSubscribed: "✓ కడ్లూరు వర్ష అలర్ట్‌లు ఆన్‌లో ఉన్నాయి",
    sendTestAlert: "🔔 ఫోన్‌కి టెస్ట్ అలర్ట్ పంపండి",
    testAlertSending: "టెస్ట్ అలర్ట్ పంపుతున్నాము...",
    testAlertSuccess: "✓ టెస్ట్ అలర్ట్ పంపబడింది! ఫోన్ నోటిఫికేషన్ చూడండి.",
    notificationPermissionDenied: "నోటిఫికేషన్లు బ్లాక్ చేయబడ్డాయి. బ్రౌజర్ సెట్టింగ్స్‌లో ఆన్ చేయండి.",
    activeStatusBanner: "కడ్లూరు ప్రస్తుత హెచ్చరిక స్థితి",
    readAloud: "🔊 వాయిస్ వినండి",
    stopVoice: "⏹ ఆపండి",

    dataFreshnessTitle: "సమాచార ఖచ్చితత్వం మరియు తాజాదనం",
    freshnessStatusLive: "లైవ్ / తాజా (<15 నిమి)",
    freshnessStatusDelayed: "ఆలస్యం",
    freshnessStatusStale: "పాతది (>30 నిమి)",
    freshnessStatusUnavailable: "అందుబాటులో లేదు",
    sourceIntegrityNotice: "డాష్‌బోర్డ్ రిఫ్రెష్ అయినంత మాత్రాన రీడింగ్ తాజాదని కాదు. రాడార్ మరియు శాటిలైట్ సమాచారం విడివిడిగా ట్రాక్ చేయబడుతుంది.",

    forecastModelBadge: "వాతావరణ అంచనా మోడల్",
    actualObservationBadge: "ప్రత్యక్ష డాప్లర్ రాడార్ రీడింగ్",
    radius5km: "5 కి.మీ పొలాల పరిధి",
    radius15km: "15 కి.మీ చేరువ పరిధి",
    radius30km: "30 కి.మీ ప్రాంతీయ పరిధి",
    radius50km: "50 కి.మీ రాడార్ పరిధి",

    devDiagnosticsLink: "డెవలపర్ / సిస్టమ్ వివరాలు (Admin Diagnostics)",
    closeDiagnostics: "వివరాలు మూసివేయండి",

    soundAlarmTitle: "లైవ్ వర్షపు సైరన్ అలారం",
    soundAlarmSubtitle: "కడ్లూరు వైపు వర్షపు మేఘాలు వస్తే పెద్ద శబ్దంతో తక్షణ హెచ్చరిక (Rapido స్టైల్)",
    soundAlarmToggleOn: "🔊 వర్షపు సైరన్ అలారం: ఆన్",
    soundAlarmToggleOff: "🔇 వర్షపు సైరన్ అలారం: ఆఫ్",
    testSoundBtn: "🔊 అలారం సౌండ్ టెస్ట్ (5 సెకన్లు)",
    testingSoundBadge: "🚨 సైరన్ మోగుతోంది...",
    stopSoundBtn: "ఆపండి (STOP)",
    alarmVolume: "అలారం శబ్దం (వాల్యూమ్)",
    soundAlarmFarmerNote: "గమనిక: కడ్లూరు సమీపంలో వర్షం మొదలైనా లేదా మేఘాలు వేగంగా వస్తున్నా 5 సెకన్ల పాటు ఈ అలారం మోగుతుంది. మొబైల్ బ్రౌజర్ అనుమతి కోసం ఒక్కసారి 'సౌండ్ టెస్ట్' నొక్కండి.",
    modelEstimateBadge: "మోడల్ అంచనా (NWP Model)",

    q1RainNow: "కడ్లూరులో ఇప్పుడు వర్షం పడుతోందా?",
    q2RainComing: "కడ్లూరు వైపు వర్షం వస్తోందా?",
    q3RainDistance: "వర్షం ఎంత దూరంలో ఉంది?",
    q4RainArrival: "ఎప్పుడు చేరే అవకాశం ఉంది?",
    q5DataFreshness: "సమాచారం ఎంత తాజాది?",

    installAppBtn: "రైతు అలర్ట్ యాప్ ఇన్‌స్టాల్ చేయండి (INSTALL APP)",
    installAppSubtitle: "హోమ్ స్క్రీన్‌కు చేర్చి కడ్లూరు వర్ష సమాచారాన్ని ఒక్క క్లిక్‌తో త్వరగా చూడండి",
    iosInstallTitle: "iPhone లో యాప్ ఎలా ఇన్‌స్టాల్ చేయాలి?",
    iosStep1: "1. Safari బ్రౌజర్ దిగువన ఉన్న 'షేర్' (Share 📤) గుర్తును తాకండి.",
    iosStep2: "2. జాబితాలో కిందకు వెళ్లి 'హోమ్ స్క్రీన్‌కు జోడించండి' (Add to Home Screen ➕) నొక్కండి.",
    iHaveInstalled: "✓ నేను హోమ్ స్క్రీన్‌కు జోడించాను",
    closeGuide: "మూసివేయండి",

    cachedDataNotice: "గతంలో సేకరించిన సమాచారం చూపబడుతోంది (Cached)",
    staleDataWarning: "తాజా సమాచారం సేకరించలేకపోయాము. మునుపటి రికార్డు చూపబడుతోంది (Stale Data)",
    syncingInBackground: "తాజా సమాచారం సేకరిస్తున్నాము...",
    developerCredit: "Designed & Developed by Venkat"
  },

  kn: {
    appName: "ರೈತು ಅಲರ್ಟ್ (RAITHU ALERT)",
    tagline: "ಗ್ರಾಮ ಮಟ್ಟದ ಹವಾಮಾನ ಮೇಲ್ವಿಚಾರಣೆ",
    locationTitle: "ಕಡ್ಲೂರು ಗ್ರಾಮ, ರಾಯಚೂರು ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ",
    locationSubtitle: "ಶಕ್ವಾಡಿ ಗ್ರಾಮ ಪಂಚಾಯತ್, ರಾಯಚೂರು ತಾಲೂಕು • 16.3768° N, 77.2870° E",
    distFromCity: "ರಾಯಚೂರು ನಗರದಿಂದ 22.5 ಕಿ.ಮೀ ದೂರ (ಪ್ರತ್ಯೇಕ ಹವಾಮಾನ)",
    strictScopeNotice: "ಕೇವಲ ಕಡ್ಲೂರು ಗ್ರಾಮದ ಹವಾಮಾನ ಮಾತ್ರ. ರಾಯಚೂರು ನಗರದ ಮಾಹಿತಿ ಮಿಶ್ರಣ ಮಾಡುವುದಿಲ್ಲ.",

    digitalClockIst: "ಕಡ್ಲೂರು ಸ್ಥಳೀಯ ಸಮಯ (IST)",
    liveIndicator: "ಲೈವ್",
    autoUpdating: "ಪ್ರತಿ ಸೆಕೆಂಡಿಗೆ ಸ್ವಯಂಚಾಲಿತ ಅಪ್‌ಡೇಟ್",
    syncingNow: "ಹೊಸ ಮಾಹಿತಿ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    dataDelayedNotice: "ಹವಾಮಾನ ಮಾಹಿತಿ ವಿಳಂಬವಾಗಿದೆ.",
    nextRadarScanIn: "ಮುಂದಿನ ರೇಡಾರ್ ಸ್ಕ್ಯಾನ್",

    currentWeather: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
    temperature: "ತಾಪಮಾನ",
    feelsLike: "ಅನುಭವವಾಗುವ ತಾಪ",
    humidity: "ಗಾಳಿಯಲ್ಲಿನ ತೇವಾಂಶ",
    windSpeed: "ಗಾಳಿಯ ವೇಗ",
    windDirection: "ಗಾಳಿಯ ದಿಕ್ಕು",
    cloudCover: "ಮೋಡದ ಪ್ರಮಾಣ",
    currentRainfall: "ಪ್ರಸ್ತುತ ಮಳೆ",
    rainProbability: "ಮಳೆಯ ಸಂಭವನೀಯತೆ",
    condition: "ಹವಾಮಾನ ಸ್ಥಿತಿ",
    lastUpdated: "ಕೊನೆಯ ನವೀಕರಣ",
    refresh: "ನವೀಕರಿಸಿ",
    refreshing: "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    offlineBanner: "ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ಸಂಗ್ರಹಿಸಿದ ಹಳೆಯ ಮಾಹಿತಿ ತೋರಿಸಲಾಗುತ್ತಿದೆ.",

    bigAlertGreen: "ಸದ್ಯಕ್ಕೆ ಮಳೆ ಸಾಧ್ಯತೆ ಇಲ್ಲ",
    bigAlertYellow: "ಮಳೆ ಬೀಳುವ ಸಾಧ್ಯತೆಯಿದೆ",
    bigAlertOrange: "ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಬರುತ್ತಿದೆ",
    bigAlertRed: "ಭಾರೀ ಮಳೆಯ ಎಚ್ಚರಿಕೆ",
    bigAlertGrey: "ಮಳೆ ಎಚ್ಚರಿಕೆ ಲಭ್ಯವಿಲ್ಲ (ರಾಡಾರ್ ಮಾಹಿತಿ ಇಲ್ಲ)",

    turnOnAlertsBtn: "🔔 ಮಳೆ ಎಚ್ಚರಿಕೆ ಆನ್ ಮಾಡಿ",
    alertsOnBtn: "ಮಳೆ ಎಚ್ಚರಿಕೆ ಆನ್ (RAIN ALERTS ON)",
    alertsOffBtn: "ಮಳೆ ಎಚ್ಚರಿಕೆ ಆಫ್ (RAIN ALERTS OFF)",

    hourlyTitle: "ಗಂಟೆಗೊಮ್ಮೆ ಹವಾಮಾನ (Hourly)",
    hourlySubtitle: "ಕಡ್ಲೂರು ಜಮೀನುಗಳಿಗಾಗಿ ಪ್ರತಿ ಗಂಟೆಯ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    view24h: "ಮುಂದಿನ 24 ಗಂಟೆ",
    view48h: "ಮುಂದಿನ 48 ಗಂಟೆ",
    view10d: "ಮುಂದಿನ 10 ದಿನಗಳು",
    view7d: "ಮುಂದಿನ 7 ದಿನಗಳು",
    forecastNotice: "ಇದು ಸಂಖ್ಯಾತ್ಮಕ ಮುನ್ಸೂಚನೆ ಮಾದರಿ (Open-Meteo). ನೈಜ ಗ್ರೌಂಡ್ ಸೆನ್ಸಾರ್ ವೀಕ್ಷಣೆ ಅಲ್ಲ.",
    dryHour: "ಮಳೆ ಇಲ್ಲ",
    rainHour: "ಮಳೆ ಸಾಧ್ಯತೆ",
    nowBadge: "ಈಗ",

    tenDayTitle: "10 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    tenDaySubtitle: "ಕಡ್ಲೂರು ರೈತರಿಗಾಗಿ ದೈನಂದಿನ ಗರಿಷ್ಠ/ಕನಿಷ್ಠ ತಾಪಮಾನ ಮತ್ತು ಮಳೆ",
    maxTemp: "ಗರಿಷ್ಠ",
    minTemp: "ಕನಿಷ್ಠ",
    expectedRain: "ಮಳೆ",
    rainChance: "ಮಳೆಯ ಸಾಧ್ಯತೆ",
    tapForDetails: "ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ದಿನವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",

    rainMonitoringTitle: "ಡಾಪ್ಲರ್ ರಾಡಾರ್ ಲೈವ್ ಮಳೆ ಮೇಲ್ವಿಚಾರಣೆ",
    isRainApproaching: "ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
    radarCentredNotice: "ಕಡ್ಲೂರು ಭೌಗೋಳಿಕ ಕೇಂದ್ರಕ್ಕೆ ಜೋಡಿಸಲಾದ ಡಾಪ್ಲರ್ ರಾಡಾರ್ (16.3768° N)",
    rainApproachingStatus: "ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಮೋಡಗಳು ಬರುತ್ತಿವೆ",
    noRainDetectedStatus: "ಯಾವುದೇ ಗಮನಾರ್ಹ ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇಲ್ಲ",
    rainDetectedNearbyStatus: "ಕಡ್ಲೂರು ಸಮೀಪದಲ್ಲಿ ಮಳೆ ಆರಂಭವಾಗಿದೆ",
    heavyRainWarningStatus: "ಭಾರೀ ಮಳೆಯ ಮುನ್ನೆಚ್ಚರಿಕೆ",
    thunderstormWarningStatus: "ಗುಡುಗು ಸಹಿತ ಬಿರುಗಾಳಿಯ ಎಚ್ಚರಿಕೆ",
    radarUnavailableNotice: "ಪ್ರಸ್ತುತ ರಾಡಾರ್ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ ಮಳೆಯ ಆಗಮನವನ್ನು ಖಚಿತಪಡಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    estimatedArrival: "ಮಳೆ ತಲುಪುವ ಸಮಯ",
    rainfallIntensity: "ಮಳೆಯ ತೀವ್ರತೆ",
    cellSpeed: "ಮೋಡಗಳ ಚಲನೆಯ ವೇಗ",
    cellTrend: "ತೀವ್ರತೆ ಪ್ರವೃತ್ತಿ",
    radarPlay: "ರಾಡಾರ್ ಪ್ಲೇ ಮಾಡಿ",
    radarPause: "ವಿರಾಮ",
    zoomIn: "ಹಿಗ್ಗಿಸಿ (+)",
    zoomOut: "ಕುಗ್ಗಿಸಿ (-)",
    resetMap: "ಮರುಹೊಂದಿಸಿ",
    radarDisclaimer: "ನೈಜ ಡಾಪ್ಲರ್ ರಾಡಾರ್ ಮಾಹಿತಿಯ ಆಧಾರದಲ್ಲಿ ಮಾತ್ರ ಮಳೆ ಮುನ್ಸೂಚನೆ ನೀಡಲಾಗುತ್ತದೆ. ನಕಲಿ ಮಾಹಿತಿ ಇಲ್ಲ.",

    alertsTitle: "ಕಡ್ಲೂರು ಮಳೆ ಎಚ್ಚರಿಕೆಗಳು",
    enableAlerts: "ಮಳೆ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ (TURN ON RAIN ALERTS)",
    disableAlerts: "ಎಚ್ಚರಿಕೆ ನಿಲ್ಲಿಸಿ",
    alertsSubscribed: "✓ ಕಡ್ಲೂರು ಮಳೆ ಎಚ್ಚರಿಕೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ",
    sendTestAlert: "🔔 ಮೊಬೈಲ್‌ಗೆ ಟೆಸ್ಟ್ ಅಲರ್ಟ್ ಕಳುಹಿಸಿ",
    testAlertSending: "ಟೆಸ್ಟ್ ಅಲರ್ಟ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
    testAlertSuccess: "✓ ಟೆಸ್ಟ್ ಅಲರ್ಟ್ ಕಳುಹಿಸಲಾಗಿದೆ! ಮೊಬೈಲ್ ನೋಟಿಫಿಕೇಶನ್ ನೋಡಿ.",
    notificationPermissionDenied: "ನೋಟಿಫಿಕೇಶನ್‌ಗಳು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ.",
    activeStatusBanner: "ಕಡ್ಲೂರು ಪ್ರಸ್ತುತ ಎಚ್ಚರಿಕೆಯ ಸ್ಥಿತಿ",
    readAloud: "🔊 ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ",
    stopVoice: "⏹ ಆಪಿಸಿ",

    dataFreshnessTitle: "ಮಾಹಿತಿಯ ನಿಖರತೆ ಮತ್ತು ತಾಜಾತನ",
    freshnessStatusLive: "ಲೈವ್ / ತಾಜಾ (<15 ನಿಮಿ)",
    freshnessStatusDelayed: "ವಿಳಂಬ",
    freshnessStatusStale: "ಹಳೆಯದು (>30 ನಿಮಿ)",
    freshnessStatusUnavailable: "ಲಭ್ಯವಿಲ್ಲ",
    sourceIntegrityNotice: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನವೀಕರಣಗೊಂಡರೆ ಮಾಹಿತಿ ತಾಜಾ ಎಂದರ್ಥವಲ್ಲ. ರಾಡಾರ್ ಮತ್ತು ಇತರ ಮೂಲಗಳನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತದೆ.",

    forecastModelBadge: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮಾದರಿ",
    actualObservationBadge: "ನೈಜ ಡಾಪ್ಲರ್ ರಾಡಾರ್ ವೀಕ್ಷಣೆ",
    radius5km: "5 ಕಿ.ಮೀ ಜಮೀನುಗಳ ವ್ಯಾಪ್ತಿ",
    radius15km: "15 ಕಿ.ಮೀ ಸಮೀಪ ವ್ಯಾಪ್ತಿ",
    radius30km: "30 ಕಿ.ಮೀ ಪ್ರಾದೇಶಿಕ ವ್ಯಾಪ್ತಿ",
    radius50km: "50 ಕಿ.ಮೀ ರಾಡಾರ್ ವ್ಯಾಪ್ತಿ",

    devDiagnosticsLink: "ಡೆವಲಪರ್ ತಾಂತ್ರಿಕ ವಿವರಗಳು (Admin Diagnostics)",
    closeDiagnostics: "ವಿವರಗಳನ್ನು ಮುಚ್ಚಿ",

    soundAlarmTitle: "ಲೈವ್ ಮಳೆ ಸೈರನ್ ಅಲಾರ್ಮ್",
    soundAlarmSubtitle: "ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಮೋಡಗಳು ಬಂದರೆ ತಕ್ಷಣ ದೊಡ್ಡ ಶಬ್ದದ ಎಚ್ಚರಿಕೆ (Rapido ಶೈಲಿ)",
    soundAlarmToggleOn: "🔊 ಮಳೆ ಸೈರನ್ ಅಲಾರ್ಮ್: ಆನ್",
    soundAlarmToggleOff: "🔇 ಮಳೆ ಸೈರನ್ ಅಲಾರ್ಮ್: ಆಫ್",
    testSoundBtn: "🔊 ಅಲಾರ್ಮ್ ಧ್ವನಿ ಪರೀಕ್ಷೆ (5 ಸೆಕೆಂಡುಗಳು)",
    testingSoundBadge: "🚨 ಸೈರನ್ ಮೊಳಗುತ್ತಿದೆ...",
    stopSoundBtn: "ನಿಲ್ಲಿಸಿ (STOP)",
    alarmVolume: "ಅಲಾರ್ಮ್ ಧ್ವನಿ ಮಟ್ಟ (Volume)",
    soundAlarmFarmerNote: "ಸೂಚನೆ: ಕಡ್ಲೂರು ಸಮೀಪದಲ್ಲಿ ಮಳೆ ಆರಂಭವಾದರೆ 5 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಈ ಅಲಾರ್ಮ್ ಮೊಳಗುತ್ತದೆ. ಮೊಬೈಲ್ ಬ್ರೌಸರ್ ಅನುಮತಿಗಾಗಿ ಒಮ್ಮೆ 'ಧ್ವನಿ ಪರೀಕ್ಷೆ' ಒತ್ತಿರಿ.",
    modelEstimateBadge: "ಮಾದರಿ ಅಂದಾಜು (NWP Model)",

    q1RainNow: "ಕಡ್ಲೂರುನಲ್ಲಿ ಈಗ ಮಳೆಯಾಗುತ್ತಿದೆಯೇ?",
    q2RainComing: "ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಬರುತ್ತಿದೆಯೇ?",
    q3RainDistance: "ಮಳೆ ಎಷ್ಟು ದೂರದಲ್ಲಿದೆ?",
    q4RainArrival: "ಯಾವಾಗ ತಲುಪುವ ಸಾಧ್ಯತೆಯಿದೆ?",
    q5DataFreshness: "ಮಾಹಿತಿ ಎಷ್ಟು ತಾಜಾವಾಗಿದೆ?",

    installAppBtn: "ರೈತು ಅಲರ್ಟ್ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ (INSTALL APP)",
    installAppSubtitle: "ಮೊಬೈಲ್‌ನಲ್ಲಿ ವೇಗವಾಗಿ ತೆರೆಯಲು ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ",
    iosInstallTitle: "iPhone ನಲ್ಲಿ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡುವುದು ಹೇಗೆ?",
    iosStep1: "1. Safari ಕೆಳಭಾಗದಲ್ಲಿರುವ 'ಶೇರ್' (Share 📤) ಐಕಾನ್ ಟ್ಯಾಪ್ ಮಾಡಿ.",
    iosStep2: "2. ಪಟ್ಟಿಯಲ್ಲಿ ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ 'Add to Home Screen' (➕) ಆಯ್ಕೆಮಾಡಿ.",
    iHaveInstalled: "✓ ನಾನು ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿದ್ದೇನೆ",
    closeGuide: "ಮುಚ್ಚಿ",

    cachedDataNotice: "ಹಿಂದಿನ ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿ ತೋರಿಸಲಾಗುತ್ತಿದೆ (Cached)",
    staleDataWarning: "ತಾಜಾ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಹಿಂದಿನ ದಾಖಲೆ ತೋರಿಸಲಾಗುತ್ತಿದೆ (Stale Data)",
    syncingInBackground: "ಹೊಸ ಮಾಹಿತಿ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    developerCredit: "Designed & Developed by Venkat"
  },

  en: {
    appName: "RAITHU ALERT",
    tagline: "Village-Level Weather Monitoring",
    locationTitle: "Kadlur Village, Raichur District, Karnataka",
    locationSubtitle: "Shakwadi Gram Panchayat, Raichur Taluk • 16.3768° N, 77.2870° E",
    distFromCity: "22.5 km NNW of Raichur City (Distinct Microclimate)",
    strictScopeNotice: "Monitors exclusively Kadlur village. Raichur city coordinates are never substituted.",

    digitalClockIst: "Kadlur Local Time (IST)",
    liveIndicator: "LIVE",
    autoUpdating: "Auto-updating every second",
    syncingNow: "Syncing latest data...",
    dataDelayedNotice: "Weather information is delayed.",
    nextRadarScanIn: "Next radar scan in",

    currentWeather: "Current Weather",
    temperature: "Temperature",
    feelsLike: "Feels Like",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    windDirection: "Wind Direction",
    cloudCover: "Cloud Cover",
    currentRainfall: "Current Rain",
    rainProbability: "Rain Chance",
    condition: "Condition",
    lastUpdated: "Last Updated",
    refresh: "Refresh",
    refreshing: "Updating...",
    offlineBanner: "No Internet Connection. Showing last recorded observations.",

    bigAlertGreen: "NO RAIN EXPECTED RIGHT NOW",
    bigAlertYellow: "RAIN MAY COME",
    bigAlertOrange: "RAIN IS APPROACHING",
    bigAlertRed: "HEAVY RAIN WARNING",
    bigAlertGrey: "RAIN WARNING UNAVAILABLE (NO RADAR DATA)",

    turnOnAlertsBtn: "🔔 TURN ON RAIN ALERTS",
    alertsOnBtn: "RAIN ALERTS ON",
    alertsOffBtn: "RAIN ALERTS OFF",

    hourlyTitle: "Hourly Weather Forecast",
    hourlySubtitle: "Detailed precipitation and temperature forecast for Kadlur fields",
    view24h: "Next 24 Hours",
    view48h: "Next 48 Hours",
    view10d: "Next 10 Days",
    view7d: "Next 7 Days",
    forecastNotice: "Numerical weather prediction model (Open-Meteo). Not a direct ground observation.",
    dryHour: "No rain",
    rainHour: "Rain expected",
    nowBadge: "NOW",

    tenDayTitle: "10-Day Village Forecast",
    tenDaySubtitle: "Daily expected rainfall and temperature for farmers",
    maxTemp: "Max",
    minTemp: "Min",
    expectedRain: "Rain",
    rainChance: "Rain Chance",
    tapForDetails: "Tap day for hourly details",

    rainMonitoringTitle: "Doppler Radar Rain Monitoring",
    isRainApproaching: "Is Rain Approaching Kadlur?",
    radarCentredNotice: "Radar surveillance centered on Kadlur Village (16.3768° N, 77.2870° E)",
    rainApproachingStatus: "Rain Is Approaching Kadlur",
    noRainDetectedStatus: "No Significant Rain Detected",
    rainDetectedNearbyStatus: "Rain Detected Nearby Kadlur",
    heavyRainWarningStatus: "Heavy Rain Warning",
    thunderstormWarningStatus: "Thunderstorm Warning",
    radarUnavailableNotice: "Unable to verify approaching rainfall because current radar data is unavailable.",
    estimatedArrival: "Estimated Rain Arrival",
    rainfallIntensity: "Rainfall Intensity",
    cellSpeed: "Cloud Movement Speed",
    cellTrend: "Cell Trend",
    radarPlay: "Play Radar Loop",
    radarPause: "Pause",
    zoomIn: "Zoom In (+)",
    zoomOut: "Zoom Out (-)",
    resetMap: "Reset Center",
    radarDisclaimer: "Short-term nowcasting relies strictly on real-time Doppler radar echoes. Predictions are never fabricated when radar data is insufficient.",

    alertsTitle: "Kadlur Rain Alerts",
    enableAlerts: "ENABLE RAIN ALERTS",
    disableAlerts: "DISABLE ALERTS",
    alertsSubscribed: "✓ Rain Alerts Active for Kadlur",
    sendTestAlert: "🔔 Send Test Notification",
    testAlertSending: "Dispatching test notification...",
    testAlertSuccess: "✓ Test alert sent! Check your device notification tray.",
    notificationPermissionDenied: "Notifications blocked. Enable in your browser site permissions.",
    activeStatusBanner: "Current Alert Status for Kadlur",
    readAloud: "🔊 Read Aloud",
    stopVoice: "⏹ Stop Voice",

    dataFreshnessTitle: "Data Freshness & Integrity",
    freshnessStatusLive: "Live / Fresh (<15 min)",
    freshnessStatusDelayed: "Delayed",
    freshnessStatusStale: "Stale (>30 min)",
    freshnessStatusUnavailable: "Unavailable",
    sourceIntegrityNotice: "Dashboard updates do not imply reading freshness. Radar and satellite sources are tracked independently.",

    forecastModelBadge: "NWP Model Forecast",
    actualObservationBadge: "Direct Doppler Observation",
    radius5km: "5 km Field Perimeter",
    radius15km: "15 km Approach Zone",
    radius30km: "30 km Regional Tracking",
    radius50km: "50 km Radar Envelope",

    devDiagnosticsLink: "Developer & Admin Diagnostics",
    closeDiagnostics: "Close Diagnostics",

    soundAlarmTitle: "Live Rain Siren Alarm",
    soundAlarmSubtitle: "High-urgency 5-second dual-tone alert when rain approaches Kadlur (Rapido style)",
    soundAlarmToggleOn: "🔊 Rain Siren Alarm: ON",
    soundAlarmToggleOff: "🔇 Rain Siren Alarm: OFF",
    testSoundBtn: "🔊 Test Alarm Sound (5s)",
    testingSoundBadge: "🚨 Siren Playing...",
    stopSoundBtn: "STOP",
    alarmVolume: "Alarm Volume",
    soundAlarmFarmerNote: "Note: Siren sounds for 5 seconds when approaching rain clouds enter Kadlur perimeter. Click 'Test Alarm Sound' once to unlock audio on mobile browsers.",
    modelEstimateBadge: "NWP Model Estimate",

    q1RainNow: "Is it raining now in Kadlur?",
    q2RainComing: "Is rain approaching Kadlur?",
    q3RainDistance: "How far is the rain?",
    q4RainArrival: "When will it reach Kadlur?",
    q5DataFreshness: "How fresh is this data?",

    installAppBtn: "INSTALL RAITHU ALERT APP",
    installAppSubtitle: "Add to home screen for instant, 1-tap village weather monitoring",
    iosInstallTitle: "How to Install on iPhone / iPad",
    iosStep1: "1. Tap the Share button (Share 📤) at the bottom of Safari.",
    iosStep2: "2. Scroll down and tap 'Add to Home Screen' (➕).",
    iHaveInstalled: "✓ I have added to Home Screen",
    closeGuide: "Close",

    cachedDataNotice: "Showing last recorded observation (Cached)",
    staleDataWarning: "Live update unavailable. Showing last successful data (Stale Data)",
    syncingInBackground: "Syncing live weather data...",
    developerCredit: "Designed & Developed by Venkat"
  }
};
