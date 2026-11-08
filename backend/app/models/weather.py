from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text, Index
from app.core.database import Base

class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_name = Column(String(50), nullable=False, index=True)
    observation_time = Column(DateTime, nullable=False, index=True)
    retrieval_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Readings
    temperature_c = Column(Float, nullable=True)
    feels_like_c = Column(Float, nullable=True)
    relative_humidity_pct = Column(Float, nullable=True)
    wind_speed_kmh = Column(Float, nullable=True)
    wind_direction_deg = Column(Float, nullable=True)
    cloud_cover_pct = Column(Float, nullable=True)
    current_precipitation_mm = Column(Float, default=0.0)
    precipitation_probability_pct = Column(Float, nullable=True)
    weather_code = Column(Integer, nullable=True)
    condition_text = Column(String(100), nullable=True)
    
    # Metadata & Truthfulness distinction
    is_actual_observation = Column(Boolean, default=False)  # True = actual sensor reading; False = model forecast
    data_status = Column(String(20), default="active")       # active, delayed, unavailable, simulated_forbidden

    __table_args__ = (
        Index("idx_obs_source_time", "source_name", "observation_time"),
    )


class RadarSnapshot(Base):
    __tablename__ = "radar_snapshots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_name = Column(String(50), nullable=False, default="rainviewer_composite")
    observation_time = Column(DateTime, nullable=False, index=True)
    retrieval_time = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Detection results strictly over Kadlur coordinates & monitoring radius
    kadlur_rain_detected = Column(Boolean, default=False)
    kadlur_intensity_mmh = Column(Float, default=0.0)
    nearest_rain_distance_km = Column(Float, nullable=True)
    rain_bearing_deg = Column(Float, nullable=True)
    estimated_motion_direction = Column(String(30), nullable=True)
    estimated_motion_speed_kmh = Column(Float, nullable=True)
    is_approaching_kadlur = Column(Boolean, default=False)
    estimated_arrival_minutes = Column(Integer, nullable=True)
    
    # Coverage verification
    coverage_status = Column(String(30), default="OPERATIONAL")  # OPERATIONAL, NO_COVERAGE, DEGRADED
    confidence_score = Column(Float, default=0.0)                # 0.0 to 1.0
    radar_frame_timestamp = Column(Integer, nullable=True)       # Unix epoch of radar scan
    raw_tile_url = Column(Text, nullable=True)


class WeatherAlertRecord(Base):
    __tablename__ = "weather_alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alert_category = Column(String(50), nullable=False, index=True) 
    # e.g., NO_SIGNIFICANT_RAIN, RAIN_APPROACHING, RAIN_DETECTED_NEARBY, RAIN_EXPECTED_SOON,
    # HEAVY_RAINFALL_WARNING, THUNDERSTORM_WARNING, LIGHTNING_WARNING
    
    severity = Column(String(20), default="INFO")  # INFO, ADVISORY, WATCH, WARNING, CRITICAL
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    description_te = Column(Text, nullable=True)   # Telugu translation
    description_kn = Column(Text, nullable=True)   # Kannada translation
    
    issue_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    data_observation_timestamp = Column(DateTime, nullable=False)
    estimated_arrival_time = Column(DateTime, nullable=True)
    expected_rainfall_intensity_mmh = Column(Float, nullable=True)
    source_summary = Column(String(200), nullable=False)
    confidence_score = Column(Float, default=0.0)  # 0.0 to 1.0
    is_active = Column(Boolean, default=True)


class ValidationRecord(Base):
    __tablename__ = "validation_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    provider_name = Column(String(50), nullable=False, index=True)
    prediction_timestamp = Column(DateTime, nullable=False)
    target_timestamp = Column(DateTime, nullable=False, index=True)
    
    predicted_rain = Column(Boolean, nullable=False)
    predicted_intensity_mmh = Column(Float, nullable=True)
    
    actual_observed_rain = Column(Boolean, nullable=True)
    actual_intensity_mmh = Column(Float, nullable=True)
    validation_status = Column(String(30), default="PENDING")  
    # PENDING, TRUE_POSITIVE, TRUE_NEGATIVE, FALSE_POSITIVE, FALSE_NEGATIVE
    
    arrival_time_error_minutes = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)


class ProviderStatus(Base):
    __tablename__ = "provider_statuses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    provider_id = Column(String(50), unique=True, nullable=False, index=True)
    display_name = Column(String(100), nullable=False)
    status = Column(String(30), nullable=False)  # CONNECTED, PENDING_KEY, UNAVAILABLE, ERROR
    status_message = Column(Text, nullable=True)
    last_checked = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_successful_fetch = Column(DateTime, nullable=True)
    update_frequency_minutes = Column(Integer, default=10)
    is_free = Column(Boolean, default=True)
    coverage_details = Column(Text, nullable=True)


class PushSubscriptionRecord(Base):
    __tablename__ = "push_subscriptions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    endpoint = Column(Text, nullable=False, unique=True)
    device_type = Column(String(50), default="browser")
    language = Column(String(10), default="te")
    p256dh = Column(Text, nullable=True)
    auth = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True)
