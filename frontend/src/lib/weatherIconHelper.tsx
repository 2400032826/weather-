import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  CloudSnow,
  Moon,
  CloudMoon,
  HelpCircle,
} from 'lucide-react';

export interface WeatherIconResult {
  Icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  conditionText: string;
  isNight: boolean;
}

/**
 * Parses time string (e.g. "2026-11-08T21:00", "21:00", "2026-11-08 21:00")
 * and checks if it falls into nighttime hours (7 PM to 6 AM).
 */
export function isNightTime(timeStr?: string | null): boolean {
  if (!timeStr) return false;

  try {
    // Check if ISO format or string contains 'T' or space
    if (timeStr.includes('T')) {
      const parts = timeStr.split('T')[1];
      const hour = parseInt(parts.split(':')[0], 10);
      if (!isNaN(hour)) {
        return hour >= 19 || hour < 6;
      }
    } else if (timeStr.includes(':')) {
      const parts = timeStr.split(' ');
      const timePart = parts[parts.length - 1];
      const hour = parseInt(timePart.split(':')[0], 10);
      if (!isNaN(hour)) {
        return hour >= 19 || hour < 6;
      }
    }
  } catch (e) {}

  return false;
}

/**
 * Returns dynamic weather icon, colors, and verified condition label based on
 * WMO weather code and condition text.
 * Never defaults to Sun icon for unknown or cloudy/rainy conditions.
 */
export function getWeatherIconInfo(
  weatherCode?: number | null,
  conditionText?: string | null,
  timeStr?: string | null,
  isNightOverride?: boolean
): WeatherIconResult {
  const isNight = isNightOverride !== undefined ? isNightOverride : isNightTime(timeStr);
  const text = (conditionText || '').toLowerCase().trim();
  const code = weatherCode !== undefined && weatherCode !== null ? weatherCode : null;

  // 1. Thunderstorm / Convective with lightning or hail
  if (
    (code !== null && [95, 96, 99].includes(code)) ||
    text.includes('thunder') ||
    text.includes('lightning') ||
    text.includes('storm')
  ) {
    return {
      Icon: CloudLightning,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-100 text-amber-600',
      conditionText: conditionText || 'Thunderstorm',
      isNight,
    };
  }

  // 2. Heavy Rain / Violent Showers
  if (
    (code !== null && [65, 82].includes(code)) ||
    text.includes('heavy rain') ||
    text.includes('violent') ||
    text.includes('torrential')
  ) {
    return {
      Icon: CloudRain,
      colorClass: 'text-sky-700',
      bgClass: 'bg-sky-100 text-sky-700',
      conditionText: conditionText || 'Heavy rain',
      isNight,
    };
  }

  // 3. Moderate Rain / Showers
  if (
    (code !== null && [63, 81].includes(code)) ||
    text.includes('moderate rain') ||
    (text.includes('rain') && !text.includes('slight') && !text.includes('light') && !text.includes('drizzle') && !text.includes('no rain'))
  ) {
    return {
      Icon: CloudRain,
      colorClass: 'text-sky-600',
      bgClass: 'bg-sky-100 text-sky-600',
      conditionText: conditionText || 'Moderate rain',
      isNight,
    };
  }

  // 4. Light Rain / Drizzle / Slight Rain Showers
  if (
    (code !== null && [51, 53, 55, 56, 57, 61, 66, 67, 80].includes(code)) ||
    text.includes('drizzle') ||
    text.includes('light rain') ||
    text.includes('slight rain')
  ) {
    return {
      Icon: CloudDrizzle,
      colorClass: 'text-teal-600',
      bgClass: 'bg-teal-100 text-teal-700',
      conditionText: conditionText || 'Light rain',
      isNight,
    };
  }

  // 5. Snow / Sleet
  if (
    (code !== null && [71, 73, 75, 77, 85, 86].includes(code)) ||
    text.includes('snow') ||
    text.includes('sleet')
  ) {
    return {
      Icon: CloudSnow,
      colorClass: 'text-indigo-400',
      bgClass: 'bg-indigo-100 text-indigo-600',
      conditionText: conditionText || 'Snow',
      isNight,
    };
  }

  // 6. Fog / Mist / Depositing Rime Fog
  if (
    (code !== null && [45, 48].includes(code)) ||
    text.includes('fog') ||
    text.includes('mist') ||
    text.includes('haze')
  ) {
    return {
      Icon: CloudFog,
      colorClass: 'text-slate-500',
      bgClass: 'bg-slate-100 text-slate-600',
      conditionText: conditionText || 'Foggy',
      isNight,
    };
  }

  // 7. Overcast / Cloudy
  if (
    code === 3 ||
    text.includes('overcast') ||
    text === 'cloudy'
  ) {
    return {
      Icon: Cloud,
      colorClass: 'text-slate-500',
      bgClass: 'bg-slate-100 text-slate-600',
      conditionText: conditionText || 'Overcast',
      isNight,
    };
  }

  // 8. Partly Cloudy / Mainly Clear
  if (
    (code !== null && [1, 2].includes(code)) ||
    text.includes('partly') ||
    text.includes('mainly clear') ||
    text.includes('scattered')
  ) {
    if (isNight) {
      return {
        Icon: CloudMoon,
        colorClass: 'text-indigo-400',
        bgClass: 'bg-indigo-100 text-indigo-500',
        conditionText: conditionText || 'Partly cloudy (night)',
        isNight: true,
      };
    }
    return {
      Icon: CloudSun,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-100 text-amber-600',
      conditionText: conditionText || 'Partly cloudy',
      isNight: false,
    };
  }

  // 9. Clear Sky / Sunny
  if (
    code === 0 ||
    text.includes('clear sky') ||
    text === 'clear' ||
    text.includes('sunny')
  ) {
    if (isNight) {
      return {
        Icon: Moon,
        colorClass: 'text-indigo-400',
        bgClass: 'bg-indigo-100 text-indigo-500',
        conditionText: conditionText || 'Clear sky (night)',
        isNight: true,
      };
    }
    return {
      Icon: Sun,
      colorClass: 'text-amber-500',
      bgClass: 'bg-emerald-100 text-amber-500',
      conditionText: conditionText || 'Clear sky',
      isNight: false,
    };
  }

  // 10. Unknown / Missing condition fallback (Neutral icon, never misleading Sun)
  return {
    Icon: text.length > 0 ? Cloud : HelpCircle,
    colorClass: 'text-slate-400',
    bgClass: 'bg-slate-100 text-slate-500',
    conditionText: conditionText || 'Weather data unavailable',
    isNight,
  };
}
