import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Radio,
  CloudRain,
  ChevronRight
} from 'lucide-react';
import type { Language } from '../lib/translations';
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
  const alert = weather.activeAlert;
  const level = alert.level || 'GREEN';

  // Compact config strictly adhering to verified evidence levels
  const levelConfig = {
    GREEN: {
      bg: 'bg-emerald-600',
      lightBg: 'bg-emerald-50/90',
      border: 'border-emerald-300',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      titleEn: 'No verified rain threat',
      titleTe: 'వర్షపు ముప్పు లేదు (పొడిగా ఉంది)',
      titleKn: 'ಮಳೆ ಸಾಧ್ಯತೆ ಇಲ್ಲ (ಒಣ ಹವೆ)',
      descEn: 'Doppler radar sweeps confirm dry, clear weather across Kadlur fields.',
      descTe: 'కడ్లూరు చుట్టూ 30 కి.మీ పరిధిలో వర్షం లేదు. వాతావరణం అనుకూలంగా ఉంది.',
      descKn: 'ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತಲಿನ 30 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಮಳೆ ಇಲ್ಲ.',
    },
    YELLOW: {
      bg: 'bg-amber-500',
      lightBg: 'bg-amber-50/90',
      border: 'border-amber-300',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Radio,
      titleEn: 'Rain monitoring — evidence developing',
      titleTe: 'వర్ష పర్యవేక్షణ — మేఘాలు పరిశీలనలో ఉన్నాయి',
      titleKn: 'ಮಳೆ ಮೇಲ್ವಿಚಾರಣೆ — ಮೋಡಗಳ ಪರಿಶೀಲನೆ',
      descEn: 'Rain clouds developing in outer 15-30 km tracking zone.',
      descTe: 'కడ్లూరు పరిసరాల్లో (15-30 కి.మీ) వర్షపు మేఘాలు కనిపించాయి.',
      descKn: 'ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತಲಿನ (15-30 ಕಿ.ಮೀ) ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಮಳೆ ಮೋಡಗಳು ಕಾಣಿಸಿಕೊಂಡಿವೆ.',
    },
    ORANGE: {
      bg: 'bg-orange-500',
      lightBg: 'bg-orange-50/90',
      border: 'border-orange-300',
      text: 'text-orange-950',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      icon: CloudRain,
      titleEn: 'Verified approaching rain',
      titleTe: 'కడ్లూరు వైపు వర్షం వస్తోంది',
      titleKn: 'ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಬರುತ್ತಿದೆ',
      descEn: 'Precipitation detected within 5-15 km tracking towards Kadlur.',
      descTe: 'కడ్లూరు సమీపంలో (5-15 కి.మీ) వర్షం గ్రామం వైపు వస్తోంది.',
      descKn: 'ಕಡ್ಲೂರು ಸಮೀಪದಲ್ಲಿ (5-15 ಕಿ.ಮೀ) ಮಳೆ ಗ್ರಾಮದ ಕಡೆಗೆ ಬರುತ್ತಿದೆ.',
    },
    RED: {
      bg: 'bg-rose-600',
      lightBg: 'bg-rose-50/90',
      border: 'border-rose-300',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: AlertTriangle,
      titleEn: 'Verified heavy rain warning',
      titleTe: 'భారీ వర్షపు హెచ్చరిక',
      titleKn: 'ಭಾರೀ ಮಳೆಯ ಎಚ್ಚರಿಕೆ',
      descEn: 'Heavy rainfall (>15 mm/h) registered. Protect produce immediately.',
      descTe: 'భారీ వర్షం లేదా ఈదురు గాలుల ప్రమాదం ఉంది. ధాన్యాన్ని కవర్ చేయండి.',
      descKn: 'ಭಾರೀ ಮಳೆ ಅಥವಾ ಬಿರುಗಾಳಿಯ ಮುನ್ನೆಚ್ಚರಿಕೆ. ಧಾನ್ಯಗಳನ್ನು ರಕ್ಷಿಸಿ.',
    },
    GREY: {
      bg: 'bg-slate-500',
      lightBg: 'bg-slate-100',
      border: 'border-slate-300',
      text: 'text-slate-900',
      badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
      icon: Radio,
      titleEn: 'Radar data unavailable',
      titleTe: 'రాడార్ సమాచారం అందుబాటులో లేదు',
      titleKn: 'ರಾಡಾರ್ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
      descEn: 'Rain warning unavailable — insufficient verified radar data.',
      descTe: 'ధృవీకరించబడిన రాడార్ సమాచారం అందుబాటులో లేదు.',
      descKn: 'ದೃಢೀಕರಿಸಿದ ರಾಡಾರ್ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.',
    },
  };

  const currentConfig = (levelConfig as any)[level] || levelConfig.GREEN;
  const Icon = currentConfig.icon;

  const getTitle = () => {
    if (currentLang === 'te') return currentConfig.titleTe;
    if (currentLang === 'kn') return currentConfig.titleKn;
    return currentConfig.titleEn;
  };

  const getDesc = () => {
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
    <section>
      {/* Compact Rain Status Card */}
      <div
        onClick={onNavigateToRadar}
        className={`cursor-pointer rounded-2xl p-3 sm:p-4 border-2 ${currentConfig.border} ${currentConfig.lightBg} transition active:scale-[0.99] shadow-2xs hover:shadow-xs`}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Icon + Title + Short Desc */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className={`p-2 rounded-xl text-white ${currentConfig.bg} shrink-0 shadow-2xs ${level !== 'GREEN' && level !== 'GREY' ? 'animate-pulse' : ''}`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-black text-sm sm:text-base leading-tight tracking-tight ${currentConfig.text}`}>
                  {getTitle()}
                </h3>
                <span className={`text-[10px] font-black px-2 py-0.2 rounded-full uppercase border ${currentConfig.badgeBg}`}>
                  {level}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium truncate sm:whitespace-normal mt-0.5">
                {getDesc()}
              </p>
            </div>
          </div>

          {/* Right: Distance / ETA or Radar Link */}
          <div className="flex items-center gap-1 text-slate-500 hover:text-slate-900 shrink-0 text-xs font-bold pl-1">
            {alert.distanceKm != null ? (
              <span className="bg-white/95 px-2 py-1 rounded-lg border border-slate-200 text-slate-900 text-xs font-black">
                {alert.distanceKm} km
              </span>
            ) : null}
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </section>
  );
};
