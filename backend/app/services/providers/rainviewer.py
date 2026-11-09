import math
import time
import httpx
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.services.providers.base import BaseWeatherProvider
from app.core.config import settings

class RainViewerProvider(BaseWeatherProvider):
    provider_id: str = "rainviewer"
    display_name: str = "RainViewer Weather Radar Tile Composite"
    is_free: bool = True
    requires_key: bool = False
    
    API_URL: str = "https://api.rainviewer.com/public/weather-maps.json"
    _cached_metadata: Optional[Dict[str, Any]] = None
    _cached_at: Optional[float] = None
    _cache_ttl_sec: float = 180.0  # 3-minute in-memory cache for high-speed delivery

    @staticmethod
    def lat_lon_to_tile(lat: float, lon: float, zoom: int) -> tuple[int, int]:
        lat_rad = math.radians(lat)
        n = 2.0 ** zoom
        xtile = int((lon + 180.0) / 360.0 * n)
        ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
        return (xtile, ytile)

    async def fetch_radar_metadata(self) -> Dict[str, Any]:
        now = time.time()
        if self._cached_metadata and self._cached_at and (now - self._cached_at) < self._cache_ttl_sec:
            return self._cached_metadata

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(self.API_URL)
                resp.raise_for_status()
                data = resp.json()
                self._cached_metadata = data
                self._cached_at = now
                return data
        except Exception as e:
            # Stale-while-revalidate: return last known good metadata on network blip
            if self._cached_metadata:
                return self._cached_metadata
            return {"error": str(e), "status": "unavailable"}

    async def fetch_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        meta = await self.fetch_radar_metadata()
        if "error" in meta or not meta.get("radar"):
            return {
                "source_name": self.provider_id,
                "display_name": self.display_name,
                "data_status": "unavailable",
                "freshness_status": "Unavailable",
                "message": "Unable to verify approaching rainfall because current radar data is unavailable.",
                "is_actual_observation": True,
                "observation_time": None,
                "data_delay_minutes": None
            }
            
        radar_past = meta.get("radar", {}).get("past", [])
        host = meta.get("host", "https://tilecache.rainviewer.com")
        
        last_frame = radar_past[-1] if radar_past else None
        now_epoch = time.time()
        last_epoch = last_frame["time"] if last_frame else now_epoch
        obs_time = datetime.fromtimestamp(last_epoch, tz=timezone.utc)
        data_delay_min = max(0, int((now_epoch - last_epoch) / 60))
        
        # Freshness determination
        if data_delay_min <= 15:
            freshness = "Live / Fresh"
        elif data_delay_min <= 30:
            freshness = "Delayed"
        else:
            freshness = "Stale"

        tile_z7 = self.lat_lon_to_tile(lat, lon, 7)
        tile_z8 = self.lat_lon_to_tile(lat, lon, 8)
        
        latest_tile_url = None
        if last_frame:
            latest_tile_url = f"{host}{last_frame['path']}/256/7/{tile_z7[0]}/{tile_z7[1]}/2/1_1.png"
            
        return {
            "source_name": self.provider_id,
            "display_name": self.display_name,
            "data_status": "active",
            "freshness_status": freshness,
            "data_delay_minutes": data_delay_min,
            "host": host,
            "past_frames": radar_past,
            "nowcast_frames": meta.get("radar", {}).get("nowcast", []),
            "latest_tile_url": latest_tile_url,
            "observation_time": obs_time,
            "kadlur_tile_z7": tile_z7,
            "kadlur_tile_z8": tile_z8,
            "is_actual_observation": True
        }

    async def check_health(self) -> Dict[str, Any]:
        try:
            meta = await self.fetch_radar_metadata()
            if "radar" in meta:
                past = meta.get("radar", {}).get("past", [])
                last_time = past[-1]["time"] if past else None
                delay = max(0, int((time.time() - last_time) / 60)) if last_time else 0
                return {
                    "status": "CONNECTED",
                    "freshness_status": "Live / Fresh" if delay <= 15 else ("Delayed" if delay <= 30 else "Stale"),
                    "message": f"Doppler composite online ({len(past)} recent sweeps available)",
                    "data_delay_minutes": delay,
                    "update_frequency_minutes": 10
                }
            return {
                "status": "UNAVAILABLE",
                "freshness_status": "Unavailable",
                "message": "Unable to verify approaching rainfall because current radar data is unavailable."
            }
        except Exception as e:
            return {"status": "ERROR", "freshness_status": "Unavailable", "message": str(e)}
