from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field

class KadlurGeoConfig:
    """
    Verified geographical coordinates and administrative identifiers for Kadlur Village,
    Raichur District, Karnataka, India.
    
    Coordinate Verification Sources:
    - Primary Village Centroid (Cadastral & Mapsofindia): 16.3768° N, 77.2870° E
    - OpenStreetMap Village Settlement Node (Node 2500440264): 16.3914° N, 77.2907° E
    - District: Raichur (District HQ coordinates: 16.2008° N, 77.3556° E, approx 22.5 km away)
    - State: Karnataka
    - Gram Panchayat: Shakwadi
    - PIN Code: 584170
    - Census 2011 Village Code: 600733
    - Elevation: ~382 meters above mean sea level
    """
    VILLAGE_NAME: str = "Kadlur"
    GRAM_PANCHAYAT: str = "Shakwadi"
    TALUK: str = "Raichur"
    DISTRICT: str = "Raichur"
    STATE: str = "Karnataka"
    COUNTRY: str = "India"
    PIN_CODE: str = "584170"
    CENSUS_2011_CODE: str = "600733"
    
    # Official coordinates used across all provider requests
    LATITUDE: float = 16.3768
    LONGITUDE: float = 77.2870
    ALT_LATITUDE: float = 16.3914
    ALT_LONGITUDE: float = 77.2907
    ELEVATION_METERS: float = 382.0
    
    # Raichur City reference (demonstrating why City coordinates must NOT be used for Kadlur)
    RAICHUR_CITY_LATITUDE: float = 16.2008
    RAICHUR_CITY_LONGITUDE: float = 77.3556
    DISTANCE_TO_RAICHUR_CITY_KM: float = 22.5

    # Monitoring Radii in Kilometers
    RADIUS_IMMEDIATE_KM: float = 5.0
    RADIUS_APPROACH_KM: float = 15.0
    RADIUS_REGIONAL_KM: float = 30.0
    RADIUS_RADAR_SCAN_KM: float = 50.0

    # Nearest IMD Doppler Weather Radar (DWR)
    NEAREST_DWR_NAME: str = "IMD Hyderabad Begumpet DWR"
    NEAREST_DWR_DISTANCE_KM: float = 174.0
    NEAREST_DWR_BAND: str = "S-Band (250km - 400km range coverage)"


class Settings(BaseSettings):
    PROJECT_NAME: str = "Raithu Alert - Kadlur Weather Monitoring"
    TAGLINE: str = "Accurate Weather Monitoring for Kadlur Village"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Kadlur Geography
    geo: KadlurGeoConfig = KadlurGeoConfig()
    
    # Database
    DATABASE_URL: str = "sqlite:///./kadlur_weather.db"
    POSTGIS_DATABASE_URL: Optional[str] = None
    
    # API Credentials & Configuration
    OPEN_METEO_API_URL: str = "https://api.open-meteo.com/v1"
    RAINVIEWER_API_URL: str = "https://api.rainviewer.com/public/weather-maps.json"
    
    # Optional Commercial / Restricted Provider Keys
    WINDY_API_KEY: Optional[str] = None
    METEOMATICS_USERNAME: Optional[str] = None
    METEOMATICS_PASSWORD: Optional[str] = None
    IMD_CUSTOM_KEY: Optional[str] = None
    
    # Data Polling Intervals (seconds)
    POLL_INTERVAL_OBSERVATIONS_SEC: int = 300  # 5 minutes
    POLL_INTERVAL_RADAR_SEC: int = 600         # 10 minutes (matching standard radar sweeps)
    
    # Thresholds for rainfall detection
    RAIN_DETECTION_MIN_MM: float = 0.1         # >= 0.1 mm/h is considered detectable rain
    HEAVY_RAIN_THRESHOLD_MM: float = 15.0      # >= 15 mm/h considered heavy rain (IMD criteria)
    VERY_HEAVY_RAIN_THRESHOLD_MM: float = 35.0
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
