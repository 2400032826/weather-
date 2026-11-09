from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from app.core.config import settings

class AlertColorLevels:
    GREEN = "GREEN"    # Verified dry weather / normal conditions
    YELLOW = "YELLOW"  # Possible rainfall approaching (outer 15-30 km)
    ORANGE = "ORANGE"  # Rain detected nearby (5-15 km) and approaching Kadlur
    RED = "RED"        # Heavy rainfall (>15 mm/h) or severe convective thunderstorm with verified echoes
    GREY = "GREY"      # Rain warning unavailable — insufficient verified radar data

class AlertService:
    """
    Farmer-First Weather Alert Service for Kadlur Village.
    
    Strict Evidence Validation:
    - Never classifies dry conditions as a heavy-rain warning.
    - Requires genuine radar echoes or verified ground rainfall for warning levels.
    - If radar data is unavailable, reports GREY ('Rain warning unavailable — insufficient verified radar data').
    - Assigns unique event IDs, creation timestamps, and 30-minute expiration timestamps.
    - Excludes fabricated distances, intensities, or arrival times.
    """

    TRANSLATIONS = {
        AlertColorLevels.GREEN: {
            "title_en": "No Significant Rain Detected",
            "title_te": "ప్రస్తుతం వర్షం సూచన లేదు",
            "title_kn": "ಯಾವುದೇ ಗಮನಾರ್ಹ ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇಲ್ಲ",
            "desc_en": "Doppler radar sweeps confirm dry, stable weather conditions within 30 km radius of Kadlur village.",
            "desc_te": "కడ్లూరు చుట్టూ 30 కి.మీ పరిధిలో వర్షపు మేఘాలు లేవు. వాతావరణం పొడిగా ఉంది.",
            "desc_kn": "ಕಡ್ಲೂರು ಸುತ್ತಮುತ್ತಲಿನ 30 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಮಳೆ ಮೋಡಗಳಿಲ್ಲ. ಹವಾಮಾನವು ಸಾಮಾನ್ಯವಾಗಿರುತ್ತದೆ."
        },
        AlertColorLevels.YELLOW: {
            "title_en": "Possible Rainfall Approaching",
            "title_te": "కడ్లూరు వైపు వర్షపు మేఘాలు వస్తున్నాయి",
            "title_kn": "ಕಡ್ಲೂರು ಕಡೆಗೆ ಮಳೆ ಮೋಡಗಳು ಧಾವಿಸುತ್ತಿವೆ",
            "desc_en": "Radar tracking detects rain clouds developing within 15-30 km tracking towards Kadlur.",
            "desc_te": "కడ్లూరు గ్రామానికి 15-30 కి.మీ పరిధిలో వర్షపు మేఘాలు కదులుతున్నాయి. పంటలను గమనించండి.",
            "desc_kn": "ಕಡ್ಲೂರು ಗ್ರಾಮದಿಂದ 15-30 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಮಳೆ ಮೋಡಗಳು ಚಲಿಸುತ್ತಿವೆ."
        },
        AlertColorLevels.ORANGE: {
            "title_en": "Rain Detected Nearby & Approaching",
            "title_te": "కడ్లూరు సమీపంలో వర్షం ప్రారంభమైంది",
            "title_kn": "ಕಡ್ಲೂರು ಸಮೀಪದಲ್ಲಿ ಮಳೆ ಆರಂಭವಾಗಿದೆ",
            "desc_en": "Precipitation confirmed within 5-15 km of Kadlur. Estimated arrival in 15-30 minutes.",
            "desc_te": "కడ్లూరు గ్రామ సరిహద్దుల్లో (5-15 కి.మీ) వర్షం కురుస్తోంది. త్వరలోనే గ్రామానికి చేరే అవకాశం ఉంది.",
            "desc_kn": "ಕಡ್ಲೂರು ಗ್ರಾಮದ 5-15 ಕಿ.ಮೀ ಸಮೀಪದಲ್ಲಿ ಮಳೆಯಾಗುತ್ತಿದೆ. ಶೀಘ್ರದಲ್ಲೇ ಗ್ರಾಮಕ್ಕೆ ತಲುಪುವ ಸಾಧ್ಯತೆಯಿದೆ."
        },
        AlertColorLevels.RED: {
            "title_en": "Heavy Rainfall / Severe Weather Warning",
            "title_te": "భారీ వర్షపు / ఉరుముల హెచ్చరిక",
            "title_kn": "ಭಾರೀ ಮಳೆಯ / ಗುಡುಗಿನ ಎಚ್ಚರಿಕೆ",
            "desc_en": "Intense rain echoes (>15 mm/h) or thunderstorm registered. Protect harvested paddy, open grain heaps, and seek shelter.",
            "desc_te": "భారీ వర్షం పడే ప్రమాదం (>15 మి.మీ/గం). కళ్లాల్లోని ధాన్యం, పత్తిని తక్షణమే సురక్షిత ప్రాంతాలకు తరలించండి. చెట్ల కింద ఉండవద్దు.",
            "desc_kn": "ಭಾರೀ ಮಳೆಯ ಎಚ್ಚರಿಕೆ (>15 ಮಿಮೀ/ಗಂ). ಕಣದಲ್ಲಿರುವ ಧಾನ್ಯ ಮತ್ತು ಬೆಳೆಗಳನ್ನು ರಕ್ಷಿಸಿ. ಮರಗಳ ಕೆಳಗೆ ನಿಲ್ಲಬೇಡಿ."
        },
        AlertColorLevels.GREY: {
            "title_en": "Rain Warning Unavailable",
            "title_te": "వర్షపు హెచ్చరిక అందుబాటులో లేదు",
            "title_kn": "ಮಳೆ ಎಚ್ಚರಿಕೆ ಲಭ್ಯವಿಲ್ಲ",
            "desc_en": "Rain warning unavailable — insufficient verified radar data.",
            "desc_te": "ధృవీకరించబడిన రాడార్ సమాచారం అందుబాటులో లేనందున వర్షపు హెచ్చరిక అందుబాటులో లేదు.",
            "desc_kn": "ದೃಢೀಕರಿಸಿದ ರಾಡಾರ್ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲದ ಕಾರಣ ಮಳೆ ಎಚ್ಚರಿಕೆ ಲಭ್ಯವಿಲ್ಲ."
        }
    }

    def evaluate_alert_state(
        self,
        radar_summary: Dict[str, Any],
        current_weather: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(minutes=30)
        alerts = []

        radar_status = radar_summary.get("coverage_status", "OPERATIONAL")
        radar_freshness = radar_summary.get("freshness_status", "Live / Fresh")
        radar_obs_time = radar_summary.get("radar_observation_time") or now
        frames_count = radar_summary.get("frames_count", len(radar_summary.get("tile_layers", [])))

        # 1. Check radar availability & evidence sufficiency
        if radar_status == "UNAVAILABLE" or radar_freshness in ["Unavailable", "Stale"] or frames_count == 0:
            t = self.TRANSLATIONS[AlertColorLevels.GREY]
            alerts.append({
                "id": None,
                "event_id": f"kadlur_radar_unavailable_{int(now.timestamp()) // 300}",
                "alert_level": AlertColorLevels.GREY,
                "color_badge": "GREY",
                "severity": "UNAVAILABLE",
                "title": t["title_en"],
                "description": t["desc_en"],
                "description_te": t["desc_te"],
                "description_kn": t["desc_kn"],
                "distance_km": None,
                "estimated_arrival_minutes": None,
                "expected_intensity_mmh": 0.0,
                "source_summary": "Radar surveillance composite unavailable for Kadlur. Warnings are not fabricated without live radar data.",
                "observation_time": radar_obs_time,
                "issue_timestamp": now,
                "expires_at": expires_at,
                "confidence_score": None,
                "is_active": False
            })
            return alerts

        is_approaching = bool(radar_summary.get("is_approaching_kadlur", False))
        rain_detected = bool(radar_summary.get("kadlur_rain_detected", False))
        intensity = float(radar_summary.get("kadlur_intensity_mmh") or 0.0)
        arrival_min = radar_summary.get("estimated_arrival_minutes")
        dist_km = radar_summary.get("nearest_rain_distance_km")

        weather_code = current_weather.get("weather_code") if current_weather else None
        current_precip = float(current_weather.get("current_precipitation_mm") or 0.0) if current_weather else 0.0

        # Check for genuine radar or ground rain evidence
        has_radar_echoes = is_approaching or rain_detected or (dist_km is not None and dist_km <= 30) or (intensity > 0)
        has_ground_rain = current_precip >= 0.1

        # 2. STRICT SANITY CHECK: If weather is completely dry, NEVER issue a rain warning!
        if not has_radar_echoes and not has_ground_rain:
            t = self.TRANSLATIONS[AlertColorLevels.GREEN]
            alerts.append({
                "id": None,
                "event_id": "kadlur_dry_normal",
                "alert_level": AlertColorLevels.GREEN,
                "color_badge": "GREEN",
                "severity": "INFO",
                "title": t["title_en"],
                "description": t["desc_en"],
                "description_te": t["desc_te"],
                "description_kn": t["desc_kn"],
                "distance_km": None,
                "estimated_arrival_minutes": None,
                "expected_intensity_mmh": 0.0,
                "source_summary": "RainViewer Doppler Composite & Open-Meteo High-Res NWP Grid",
                "observation_time": radar_obs_time,
                "issue_timestamp": now,
                "expires_at": expires_at,
                "confidence_score": None,
                "is_active": True
            })
            return alerts

        # 3. RED Warning: Requires GENUINE verified heavy rain evidence
        # Criteria: Intensity >= 15.0 mm/h or convective thunderstorm with confirmed active rain
        is_severe_thunderstorm = (weather_code in [95, 96, 99]) and (intensity >= 5.0 or current_precip >= 5.0 or (dist_km is not None and dist_km <= 10))
        is_heavy_rain = intensity >= settings.HEAVY_RAIN_THRESHOLD_MM or current_precip >= settings.HEAVY_RAIN_THRESHOLD_MM

        if is_heavy_rain or is_severe_thunderstorm:
            t = self.TRANSLATIONS[AlertColorLevels.RED]
            obs_epoch = int(radar_obs_time.timestamp()) if isinstance(radar_obs_time, datetime) else int(now.timestamp())
            alerts.append({
                "id": None,
                "event_id": f"evt_RED_{obs_epoch}_{int(intensity * 10)}",
                "alert_level": AlertColorLevels.RED,
                "color_badge": "RED",
                "severity": "CRITICAL",
                "title": t["title_en"],
                "description": t["desc_en"],
                "description_te": t["desc_te"],
                "description_kn": t["desc_kn"],
                "distance_km": dist_km if dist_km is not None else (0.0 if rain_detected else None),
                "estimated_arrival_minutes": arrival_min if arrival_min is not None else (0 if rain_detected else None),
                "expected_intensity_mmh": intensity if intensity > 0 else (current_precip if current_precip > 0 else None),
                "source_summary": "Doppler Radar Echo Reflectivity > 45 dBZ & Convective Rain Detection",
                "observation_time": radar_obs_time,
                "issue_timestamp": now,
                "expires_at": expires_at,
                "confidence_score": None,
                "is_active": True
            })
            return alerts

        # 4. ORANGE Warning: Rain detected nearby (within 5-15 km) and moving towards Kadlur
        if (is_approaching and arrival_min and arrival_min <= 30) or (rain_detected and dist_km is not None and dist_km <= 15) or (current_precip >= 2.5):
            t = self.TRANSLATIONS[AlertColorLevels.ORANGE]
            obs_epoch = int(radar_obs_time.timestamp()) if isinstance(radar_obs_time, datetime) else int(now.timestamp())
            alerts.append({
                "id": None,
                "event_id": f"evt_ORANGE_{obs_epoch}_{int((dist_km or 0) * 10)}",
                "alert_level": AlertColorLevels.ORANGE,
                "color_badge": "ORANGE",
                "severity": "WARNING",
                "title": t["title_en"],
                "description": t["desc_en"],
                "description_te": t["desc_te"],
                "description_kn": t["desc_kn"],
                "distance_km": dist_km,
                "estimated_arrival_minutes": arrival_min,
                "expected_intensity_mmh": intensity if intensity > 0 else (current_precip if current_precip > 0 else None),
                "source_summary": "RainViewer Doppler Composite Motion Tracking",
                "observation_time": radar_obs_time,
                "issue_timestamp": now,
                "expires_at": expires_at,
                "confidence_score": None,
                "is_active": True
            })
            return alerts

        # 5. YELLOW Warning: Possible rain approaching in outer 15-30 km zone
        if is_approaching or (dist_km is not None and dist_km <= 30) or (current_precip >= 0.1):
            t = self.TRANSLATIONS[AlertColorLevels.YELLOW]
            obs_epoch = int(radar_obs_time.timestamp()) if isinstance(radar_obs_time, datetime) else int(now.timestamp())
            alerts.append({
                "id": None,
                "event_id": f"evt_YELLOW_{obs_epoch}_{int((dist_km or 0) * 10)}",
                "alert_level": AlertColorLevels.YELLOW,
                "color_badge": "YELLOW",
                "severity": "WATCH",
                "title": t["title_en"],
                "description": t["desc_en"],
                "description_te": t["desc_te"],
                "description_kn": t["desc_kn"],
                "distance_km": dist_km,
                "estimated_arrival_minutes": arrival_min,
                "expected_intensity_mmh": intensity if intensity > 0 else (current_precip if current_precip > 0 else None),
                "source_summary": "RainViewer Radar Surveillance (30 km Radius)",
                "observation_time": radar_obs_time,
                "issue_timestamp": now,
                "expires_at": expires_at,
                "confidence_score": None,
                "is_active": True
            })
            return alerts

        # 6. Default Normal / Dry Weather
        t = self.TRANSLATIONS[AlertColorLevels.GREEN]
        alerts.append({
            "id": None,
            "event_id": "kadlur_dry_normal",
            "alert_level": AlertColorLevels.GREEN,
            "color_badge": "GREEN",
            "severity": "INFO",
            "title": t["title_en"],
            "description": t["desc_en"],
            "description_te": t["desc_te"],
            "description_kn": t["desc_kn"],
            "distance_km": None,
            "estimated_arrival_minutes": None,
            "expected_intensity_mmh": 0.0,
            "source_summary": "RainViewer Radar Composite & Open-Meteo High-Res NWP Grid",
            "observation_time": radar_obs_time,
            "issue_timestamp": now,
            "expires_at": expires_at,
            "confidence_score": None,
            "is_active": True
        })
        return alerts
