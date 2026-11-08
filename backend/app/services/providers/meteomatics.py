import httpx
from datetime import datetime
from typing import Dict, Any, Optional
from app.services.providers.base import BaseWeatherProvider
from app.core.config import settings

class MeteomaticsProvider(BaseWeatherProvider):
    """
    Meteomatics Weather API Adapter (Commercial Provider)
    
    API Availability & Coverage Documentation:
    - Base URL: api.meteomatics.com
    - Authentication: HTTP Basic Auth (Username + Password).
    - Pricing: Commercial enterprise tiers (starts approx €300 - €1,000/mo; 14-day trial available).
    - Indian Coverage Assessment:
      * Standard parameters (Temp, Precip, Wind, Humidity) are available via ECMWF/GFS blending.
      * Radar-based nowcasting over Kadlur (16.3768° N, 77.2870° E) relies on satellite precipitation
        estimates (INSAT-3D/Meteosat) combined with numerical model assimilation, rather than direct
        10-minute ground Doppler radar nowcasting.
    - Status: If credentials are not set, cleanly reports 'Commercial credentials required'.
    """
    provider_id: str = "meteomatics"
    display_name: str = "Meteomatics (High-Precision Commercial Weather API)"
    is_free: bool = False
    requires_key: bool = True
    
    BASE_URL: str = "https://api.meteomatics.com"

    def __init__(self, username: Optional[str] = None, password: Optional[str] = None):
        self.username = username or settings.METEOMATICS_USERNAME
        self.password = password or settings.METEOMATICS_PASSWORD

    async def fetch_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        if not self.username or not self.password:
            return {
                "source_name": self.provider_id,
                "display_name": self.display_name,
                "data_status": "pending_credentials",
                "message": "Meteomatics credentials not configured. Commercial API account required.",
                "is_actual_observation": False,
                "observation_time": None
            }
        
        now_iso = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        url = f"{self.BASE_URL}/{now_iso}/t_2m:C,precip_1h:mm,wind_speed_10m:kmh/{lat},{lon}/json"
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, auth=(self.username, self.password))
                resp.raise_for_status()
                data = resp.json()
                return {
                    "source_name": self.provider_id,
                    "display_name": self.display_name,
                    "data_status": "active",
                    "observation_time": datetime.utcnow(),
                    "raw_data": data,
                    "is_actual_observation": False
                }
        except Exception as e:
            return {
                "source_name": self.provider_id,
                "display_name": self.display_name,
                "data_status": "error",
                "message": f"Meteomatics error: {str(e)}",
                "is_actual_observation": False
            }

    async def check_health(self) -> Dict[str, Any]:
        if not self.username or not self.password:
            return {
                "status": "PENDING_CREDENTIALS",
                "message": "Commercial credentials required. Set METEOMATICS_USERNAME & METEOMATICS_PASSWORD.",
                "is_configured": False
            }
        return {
            "status": "CONFIGURED",
            "message": "Credentials configured in backend.",
            "is_configured": True
        }
