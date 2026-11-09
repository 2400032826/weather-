import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Radio,
  CloudRain,
  MapPin,
  Clock,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { KadlurWeatherState } from '../lib/weatherService';

interface RainWarningStatusProps {
  weather: KadlurWeatherState;
  currentLang: Language;
  onNavigateToRadar: () => void;
}

export const RainWarningStatus: React.FC<RainWarningStatusProps> = ({
  weather,
  currentLang,
  onNavigateToRadar,
}) => {
  const t = translations[currentLang];
  const alert = weather.activeAlert;
  const level = alert.level || 'GREEN';

  // Config based strictly on the 4 visual warning levels
  const levelConfig = {
    GREEN: {
      bg: 'bg-emerald-600',
      cardBg: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-400',
      title: t.bigAlertGreen,
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      sublabel: 'GREEN • NORMAL',
      descTe: 'కడ్లూరు గ్రామం చుట్టూ 30 కి.మీ పరిధిలో వర్షం లేదు. వాతావరణం అనుకూలంగా ఉంది.',
      descKn: 'ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತಲಿನ 30 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಮಳೆ ಇಲ್ಲ. ಹವಾಮಾನವು ಸಾಮಾನ್ಯವಾಗಿರುತ್ತದೆ.',
      descEn: 'Doppler radar and atmospheric scans confirm dry, clear weather across Kadlur fields.',
    },
    YELLOW: {
      bg: 'bg-amber-500',
      cardBg: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      border: 'border-amber-400',
      title: t.bigAlertYellow,
      text: 'text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Radio,
      sublabel: 'YELLOW • ADVISORY',
      descTe: 'కడ్లూరు పరిసరాల్లో (15-30 కి.మీ) వర్షపు మేఘాలు కనిపించాయి. వర్షం వచ్చే అవకాశం ఉంది.',
      descKn: 'ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತಲಿನ (15-30 ಕಿ.ಮೀ) ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಮಳೆ ಮೋಡಗಳು ಕಾಣಿಸಿಕೊಂಡಿವೆ.',
      descEn: 'Rain clouds developing in outer 15-30 km tracking zone. Watch crops and paddy drying yards.',
    },
    ORANGE: {
      bg: 'bg-orange-500',
      cardBg: 'bg-orange-500',
      lightBg: 'bg-orange-50',
      border: 'border-orange-400',
      title: t.bigAlertOrange,
      text: 'text-orange-950',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      icon: CloudRain,
      sublabel: 'ORANGE • WATCH',
      descTe: 'కడ్లూరు సమీపంలో (5-15 కి.మీ) వర్షం ప్రారంభమై గ్రామం వైపు వస్తోంది. త్వరలోనే వర్షం పడవచ్చు.',
      descKn: 'ಕಡ್ಲೂರು ಸಮೀಪದಲ್ಲಿ (5-15 ಕಿ.ಮೀ) ಮಳೆ ಆರಂಭವಾಗಿ ಗ್ರಾಮದ ಕಡೆಗೆ ಬರುತ್ತಿದೆ. ಶೀಘ್ರದಲ್ಲೇ ಮಳೆ ಬೀಳಬಹುದು.',
      descEn: 'Precipitation detected within 5-15 km and tracking towards Kadlur. Expected in 15-30 minutes.',
    },
    RED: {
      bg: 'bg-rose-600',
      cardBg: 'bg-rose-600',
      lightBg: 'bg-rose-50',
      border: 'border-rose-400',
      title: t.bigAlertRed,
      text: 'text-rose-950',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: AlertTriangle,
      sublabel: 'RED • CRITICAL WARNING',
      descTe: 'భారీ వర్షం లేదా ఉరుములు, ఈదురు గాలుల ప్రమాదం ఉంది. కళ్లాల్లోని ధాన్యాన్ని సురక్షిత ప్రాంతాలకు చేర్చండి.',
      descKn: 'ಭಾರೀ ಮಳೆ ಅಥವಾ ಗುಡುಗು, ಬಿರುಗಾಳಿಯ ಮುನ್ನೆಚ್ಚರಿಕೆ. ಕಣದಲ್ಲಿರುವ ಧಾನ್ಯಗಳನ್ನು ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ಸಾಗಿಸಿ.',
      descEn: 'Heavy rainfall (>15 mm/h) or thunderstorm registered. Protect harvested produce immediately.',
    },
    GREY: {
      bg: 'bg-slate-500',
      cardBg: 'bg-slate-500',
      lightBg: 'bg-slate-100',
      border: 'border-slate-300',
      title: t.bigAlertGrey,
      text: 'text-slate-900',
      badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
      icon: Radio,
      sublabel: 'GREY • MONITORING UNAVAILABLE',
      descTe: 'ధృవీకరించబడిన రాడార్ సమాచారం అందుబాటులో లేనందున వర్షపు హెచ్చరిక అందుబాటులో లేదు.',
      descKn: 'ದೃಢೀಕರಿಸಿದ ರಾಡಾರ್ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ ಮಳೆ ಎಚ್ಚರಿಕೆ ಲಭ್ಯವಿಲ್ಲ.',
      descEn: 'Rain warning unavailable — insufficient verified radar data.',
    },
  };

  const currentConfig = (levelConfig as any)[level] || levelConfig.GREEN;
  const Icon = currentConfig.icon;

  const getExplanation = () => {
    // Critical safety guard: NEVER display dry weather text for a RED or ORANGE alert!
    if (['RED', 'ORANGE'].includes(level)) {
      const desc = currentLang === 'te' ? alert.descriptionTe : currentLang === 'kn' ? alert.descriptionKn : alert.description;
      const descLower = (desc || '').toLowerCase();
      if (desc && !descLower.includes('dry') && !descLower.includes('stable') && !desc.includes('వర్షం లేదు') && !desc.includes('మಳೆ ಇಲ್ಲ')) {
        return desc;
      }
      return currentConfig[`desc${currentLang === 'te' ? 'Te' : currentLang === 'kn' ? 'Kn' : 'En'}`];
    }
    if (currentLang === 'te') return alert.descriptionTe || currentConfig.descTe;
    if (currentLang === 'kn') return alert.descriptionKn || currentConfig.descKn;
    return alert.description || currentConfig.descEn;
  };

  return (
    <section className="space-y-2">
      {/* Large Colourful Card per Section 2.B */}
      <div
        onClick={onNavigateToRadar}
        className={`cursor-pointer rounded-3xl p-5 sm:p-6 border-2 ${currentConfig.border} ${currentConfig.lightBg} transition transform hover:scale-[1.01] active:scale-[0.99] space-y-4 shadow-sm`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${currentConfig.badgeBg}`}>
            {currentConfig.sublabel}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Kadlur Village, Raichur
          </span>
        </div>

        {/* Main Alert Banner */}
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl text-white ${currentConfig.bg} shrink-0 shadow-md ${level !== 'GREEN' ? 'animate-pulse' : ''}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className={`font-black text-xl sm:text-2xl leading-tight ${currentConfig.text}`}>
              {currentConfig.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-800 mt-2 font-medium leading-relaxed">
              {getExplanation()}
            </p>
          </div>
        </div>

        {/* Simple Farmer Action Strip (Only when rain is present/approaching) */}
        {(alert.distanceKm || alert.estimatedArrivalMinutes) && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
            {alert.distanceKm && (
              <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">దూరం / Distance</span>
                  <strong className="text-slate-900 text-sm font-black">{alert.distanceKm} km</strong>
                </div>
              </div>
            )}
            {alert.estimatedArrivalMinutes && (
              <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">రాక సమయం / ETA</span>
                  <strong className="text-slate-900 text-sm font-black">~{alert.estimatedArrivalMinutes} min</strong>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
