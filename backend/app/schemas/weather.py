from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class KadlurLocationInfo(BaseModel):
    village_name: str = "Kadlur"
    gram_panchayat: str = "Shakwadi"
    taluk: str = "Raichur"
    district: str = "Raichur"
    state: str = "Karnataka"
    country: str = "India"
    pin_code: str = "584170"
    census_2011_code: str = "600733"
    latitude: float = 16.3768
    longitude: float = 77.2870
    alt_latitude: float = 16.3914
    alt_longitude: float = 77.2907
    elevation_meters: float = 382.0
    distance_to_raichur_city_km: float = 22.5
    monitoring_radii_km: Dict[str, float] = {
        "immediate": 5.0,
        "approach": 15.0,
        "regional": 30.0,
        "radar_scan": 50.0
    }
    nearest_radar: str = "IMD Hyderabad Begumpet DWR (~174 km NE)"


class WeatherObservationSchema(BaseModel):
    temperature_c: Optional[float] = None
    feels_like_c: Optional[float] = None
    relative_humidity_pct: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    cloud_cover_pct: Optional[float] = None
    current_precipitation_mm: float = 0.0
    precipitation_probability_pct: Optional[float] = None
    weather_code: Optional[int] = None
    condition_text: Optional[str] = "Clear"
    
    observation_time: datetime
    retrieval_time: datetime
    data_delay_minutes: Optional[int] = None
    freshness_status: Optional[str] = "Live / Fresh"
    source_name: str
    is_actual_observation: bool = False
    data_status: str = "active"


class HourlyForecastItem(BaseModel):
    time: str
    temperature_c: Optional[float] = None
    precipitation_mm: float
    precipitation_probability_pct: Optional[float] = None
    weather_code: Optional[int] = None
    condition_text: Optional[str] = None
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    is_rain_hour: bool = False
    is_current_hour: bool = False


class DailyForecastItem(BaseModel):
    date: str
    temperature_max_c: float
    temperature_min_c: float
    precipitation_mm: float
    precipitation_probability_pct: int
    weather_code: Optional[int] = 0
    condition_text: Optional[str] = "Clear sky"


class RadarTileLayerItem(BaseModel):
    type: str
    timestamp: int
    time_iso: str
    url: str


class RadarAnalysisSchema(BaseModel):
    coverage_status: str = "OPERATIONAL"
    freshness_status: Optional[str] = "Live / Fresh"
    status_message: str = "Radar monitoring currently unavailable"
    kadlur_rain_detected: bool = False
    kadlur_intensity_mmh: float = 0.0
    is_approaching_kadlur: bool = False
    estimated_arrival_minutes: Optional[int] = None
    estimated_direction: Optional[str] = None
    estimated_speed_kmh: Optional[float] = None
    nearest_rain_distance_km: Optional[float] = None
    cell_trend: Optional[str] = "STEADY"
    confidence_score: float = 0.0
    radar_observation_time: Optional[datetime] = None
    data_delay_minutes: Optional[int] = None
    frames_count: int = 0
    tile_layers: List[RadarTileLayerItem] = []
    nearest_radar: Optional[str] = None
    disclaimer: str = "Short-term nowcasting relies strictly on real-time Doppler radar echoes. Predictions are never fabricated when radar data is insufficient."


class AlertSchema(BaseModel):
    id: Optional[int] = None
    alert_level: Optional[str] = "GREEN"
    color_badge: Optional[str] = "GREEN"
    severity: str
    title: str
    description: str
    description_te: Optional[str] = None
    description_kn: Optional[str] = None
    distance_km: Optional[float] = None
    estimated_arrival_minutes: Optional[int] = None
    expected_intensity_mmh: Optional[float] = None
    source_summary: str
    observation_time: Optional[datetime] = None
    issue_timestamp: datetime
    confidence_score: float = 0.0
    is_active: bool = True


class DashboardResponse(BaseModel):
    location: KadlurLocationInfo
    current_weather: Optional[WeatherObservationSchema] = None
    live_status_message: str
    is_live_operational: bool
    data_source_badge: str
    distinction_notice: str = "Actual Doppler radar & ground measurements are strictly distinguished from numerical forecast models."
    hourly_forecast_24h: List[HourlyForecastItem] = []
    hourly_forecast_48h: List[HourlyForecastItem] = []
    hourly_forecast_7d: List[HourlyForecastItem] = []
    daily_forecast_10d: List[DailyForecastItem] = []
    radar_summary: RadarAnalysisSchema
    active_alerts: List[AlertSchema] = []
    last_updated: datetime


class ProviderStatusSchema(BaseModel):
    provider_id: str
    display_name: str
    status: str
    freshness_status: Optional[str] = "Live / Fresh"
    data_delay_minutes: Optional[int] = None
    status_message: str
    last_checked: datetime
    last_successful_fetch: Optional[datetime] = None
    update_frequency_minutes: int
    is_free: bool
    coverage_details: Optional[str] = None


class ValidationMetricsSchema(BaseModel):
    total_predictions_evaluated: int
    rain_detection_accuracy_pct: Optional[float] = None
    false_alarm_rate_pct: Optional[float] = None
    missed_rainfall_rate_pct: Optional[float] = None
    mean_arrival_error_minutes: Optional[float] = None
    provider_evaluations: Dict[str, Dict[str, Any]] = {}
    validation_notice: str = "Historical verification metrics are computed strictly from recorded actual ground vs predicted events. No fabricated accuracy claims."
