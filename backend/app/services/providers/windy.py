import httpx
from datetime import datetime
from typing import Dict, Any, Optional
from app.services.providers.base import BaseWeatherProvider
from app.core.config import settings

class WindyProvider(BaseWeatherProvider):
    """
    Windy API Adapter
    
    API Availability & Licensing Assessment:
    - Point Forecast API: Requires valid API Key from api.windy.com.
    - Supported Models: ECMWF, GFS, ICON-EU.
    - Radar & Satellite Layers: Available through Windy Map Forecast API / Leaflet Plugin.
    - Commercial Terms: Tiered commercial pricing. Non-commercial trials exist.
    - Status: If WINDY_API_KEY is unset in environment, reports status accurately as
      'API key pending configuration'.
    """
    provider_id: str = "windy"
    display_name: str = "Windy Point Forecast & Map Models"
    is_free: bool = False
    requires_key: bool = True
    
    BASE_URL: str = "https://api.windy.com/api/point-forecast/v2"

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.WINDY_API_KEY

    async def fetch_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "source_name": self.provider_id,
                "display_name": self.display_name,
                "data_status": "pending_credentials",
                "message": "Windy API key not configured. Set WINDY_API_KEY in backend environment.",
                "is_actual_observation": False,
                "observation_time": None
            }
            
        payload = {
            "lat": lat,
            "lon": lon,
            "model": "ecmwf",
            "parameters": ["temp", "precip", "wind", "rh"],
            "levels": ["surface"],
            "key": self.api_key
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(self.BASE_URL, json=payload)
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
                "message": f"Windy API call failed: {str(e)}",
                "is_actual_observation": False
            }

    async def check_health(self) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "status": "PENDING_KEY",
                "message": "Windy API key required. Add WINDY_API_KEY to backend .env.",
                "is_configured": False
            }
        return {
            "status": "CONFIGURED",
            "message": "Windy API key is configured.",
            "is_configured": True
        }
