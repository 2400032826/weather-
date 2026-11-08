from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime

class BaseWeatherProvider(ABC):
    """
    Abstract interface for weather providers.
    All providers must report Kadlur-specific readings with source integrity,
    observation timestamps, and distinct labels for actual vs forecast observations.
    """
    provider_id: str
    display_name: str
    is_free: bool
    requires_key: bool
    
    @abstractmethod
    async def fetch_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Fetch current weather metrics for Kadlur.
        Must clearly specify is_actual_observation (True for direct sensor/radar, False for model).
        """
        pass

    @abstractmethod
    async def check_health(self) -> Dict[str, Any]:
        """
        Verify provider accessibility, credentials, and update freshness.
        """
        pass
