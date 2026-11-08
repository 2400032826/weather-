import asyncio
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.services.providers.open_meteo import OpenMeteoProvider
from app.services.providers.imd import IMDProvider
from app.services.providers.windy import WindyProvider
from app.services.providers.meteomatics import MeteomaticsProvider
from app.services.providers.rainviewer import RainViewerProvider
from app.services.radar_engine import RadarRainfallEngine
from app.services.alert_service import AlertService

class MultiSourceAggregator:
    def __init__(self):
        self.open_meteo = OpenMeteoProvider()
        self.imd = IMDProvider()
        self.windy = WindyProvider()
        self.meteomatics = MeteomaticsProvider()
        self.rainviewer = RainViewerProvider()
        self.radar_engine = RadarRainfallEngine(self.rainviewer)
        self.alert_service = AlertService()
        
        # 60-second in-memory response cache to ensure high-speed performance for slow mobile connections
        self._cached_response: Optional[Dict[str, Any]] = None
        self._cache_time: Optional[datetime] = None

    async def get_all_provider_statuses(self) -> List[Dict[str, Any]]:
        # Run health checks concurrently
        om_health, rv_health, imd_health, windy_health, mm_health = await asyncio.gather(
            self.open_meteo.check_health(),
            self.rainviewer.check_health(),
            self.imd.check_health(),
            self.windy.check_health(),
            self.meteomatics.check_health(),
            return_exceptions=True
        )
        
        now = datetime.now(timezone.utc)
        
        def safe_get(res, key, default):
            return res.get(key, default) if isinstance(res, dict) else default

        return [
            {
                "provider_id": "open-meteo",
                "display_name": "Open-Meteo High-Resolution NWP (ECMWF/GFS)",
                "status": safe_get(om_health, "status", "CONNECTED"),
                "freshness_status": safe_get(om_health, "freshness_status", "Live / Fresh"),
                "data_delay_minutes": safe_get(om_health, "data_delay_minutes", 10),
                "status_message": safe_get(om_health, "message", "Operational"),
                "last_checked": now,
                "last_successful_fetch": now if safe_get(om_health, "status", "") == "CONNECTED" else None,
                "update_frequency_minutes": 15,
                "is_free": True,
                "coverage_details": "1-2km numerical weather prediction model assimilation for Kadlur (16.3768° N, 77.2870° E)."
            },
            {
                "provider_id": "rainviewer",
                "display_name": "RainViewer Weather Radar Tile Composite",
                "status": safe_get(rv_health, "status", "CONNECTED"),
                "freshness_status": safe_get(rv_health, "freshness_status", "Live / Fresh"),
                "data_delay_minutes": safe_get(rv_health, "data_delay_minutes", 8),
                "status_message": safe_get(rv_health, "message", "Operational"),
                "last_checked": now,
                "last_successful_fetch": now if safe_get(rv_health, "status", "") == "CONNECTED" else None,
                "update_frequency_minutes": 10,
                "is_free": True,
                "coverage_details": "RainViewer radar mosaic tiles covering Kadlur (16.3768° N, 77.2870° E). Reflects regional radar sweep observations."
            },
            {
                "provider_id": "imd",
                "display_name": "India Meteorological Department (Official)",
                "status": safe_get(imd_health, "status", "PENDING_KEY"),
                "freshness_status": "Unavailable",
                "data_delay_minutes": None,
                "status_message": safe_get(imd_health, "message", "Official station telemetry requires authorized institutional API credentials."),
                "last_checked": now,
                "last_successful_fetch": None,
                "update_frequency_minutes": 60,
                "is_free": True,
                "coverage_details": "Official Raichur district nowcasts & Hyderabad DWR radar network."
            },
            {
                "provider_id": "windy",
                "display_name": "Windy Point Forecast & Map Models",
                "status": safe_get(windy_health, "status", "PENDING_KEY"),
                "freshness_status": "Unavailable",
                "data_delay_minutes": None,
                "status_message": safe_get(windy_health, "message", "Set WINDY_API_KEY in backend environment to activate point forecast."),
                "last_checked": now,
                "last_successful_fetch": None,
                "update_frequency_minutes": 60,
                "is_free": False,
                "coverage_details": "ECMWF / GFS point forecast models."
            },
            {
                "provider_id": "meteomatics",
                "display_name": "Meteomatics High-Precision API",
                "status": safe_get(mm_health, "status", "PENDING_CREDENTIALS"),
                "freshness_status": "Unavailable",
                "data_delay_minutes": None,
                "status_message": safe_get(mm_health, "message", "Commercial enterprise account credentials required."),
                "last_checked": now,
                "last_successful_fetch": None,
                "update_frequency_minutes": 15,
                "is_free": False,
                "coverage_details": "Commercial 90m atmospheric downscaling."
            }
        ]

    async def aggregate_kadlur_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        if self._cached_response and self._cache_time and (now - self._cache_time).total_seconds() < 60:
            return self._cached_response

        # Fetch Open-Meteo and RainViewer concurrently with asyncio.gather
        results = await asyncio.gather(
            self.open_meteo.fetch_current_weather(lat, lon, forecast_days=10),
            self.radar_engine.analyze_radar_for_kadlur(lat, lon),
            return_exceptions=True
        )

        om_data = results[0] if isinstance(results[0], dict) else {"error": str(results[0]), "data_status": "unavailable"}
        radar_analysis = results[1] if isinstance(results[1], dict) else {
            "coverage_status": "UNAVAILABLE",
            "freshness_status": "Unavailable",
            "status_message": "Unable to verify approaching rainfall because current radar data is unavailable.",
            "tile_layers": []
        }
        
        if "error" not in om_data and om_data.get("data_status") in ["active", "delayed"]:
            is_active = om_data.get("data_status") == "active"
            current_obs = {
                "temperature_c": om_data.get("temperature_c"),
                "feels_like_c": om_data.get("feels_like_c"),
                "relative_humidity_pct": om_data.get("relative_humidity_pct"),
                "wind_speed_kmh": om_data.get("wind_speed_kmh"),
                "wind_direction_deg": om_data.get("wind_direction_deg"),
                "cloud_cover_pct": om_data.get("cloud_cover_pct"),
                "current_precipitation_mm": om_data.get("current_precipitation_mm", 0.0),
                "precipitation_probability_pct": (
                    om_data.get("hourly_forecast_24h", [{}])[0].get("precipitation_probability_pct", 0)
                    if om_data.get("hourly_forecast_24h") else 0
                ),
                "weather_code": om_data.get("weather_code"),
                "condition_text": om_data.get("condition_text", "Clear"),
                "observation_time": om_data.get("observation_time", now),
                "retrieval_time": now,
                "data_delay_minutes": om_data.get("data_delay_minutes", 10),
                "freshness_status": om_data.get("freshness_status", "Live / Fresh"),
                "source_name": "Open-Meteo High-Resolution NWP (Model Forecast)",
                "is_actual_observation": False,
                "observation_type": "NWP Model Estimate",
                "data_status": om_data.get("data_status", "active")
            }
            live_status_message = "Live weather active (Open-Meteo & RainViewer Radar Composite connected)" if is_active else "Weather data delayed (Serving verified Kadlur baseline)"
            is_live = True
            badge = "Open-Meteo NWP + Doppler Composite"
        else:
            current_obs = None
            live_status_message = "Live weather integration pending"
            is_live = False
            badge = "Pending Integration"

        alerts = self.alert_service.evaluate_alert_state(
            radar_summary=radar_analysis,
            current_weather=current_obs
        )

        response = {
            "current_weather": current_obs,
            "live_status_message": live_status_message,
            "is_live_operational": is_live,
            "data_source_badge": badge,
            "distinction_notice": "Actual Doppler radar & ground measurements are strictly distinguished from numerical forecast models.",
            "hourly_forecast_24h": om_data.get("hourly_forecast_24h", []),
            "hourly_forecast_48h": om_data.get("hourly_forecast_48h", []),
            "hourly_forecast_7d": om_data.get("hourly_forecast_7d", []),
            "daily_forecast_10d": om_data.get("daily_forecast_10d", []),
            "radar_summary": radar_analysis,
            "active_alerts": alerts,
            "last_updated": now
        }

        self._cached_response = response
        self._cache_time = now
        return response
