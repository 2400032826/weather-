from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.schemas.weather import DashboardResponse, KadlurLocationInfo
from app.services.aggregator import MultiSourceAggregator
from app.services.alert_service import AlertService

router = APIRouter()
aggregator = MultiSourceAggregator()
alert_service = AlertService()

@router.get("/dashboard", response_model=DashboardResponse)
async def get_kadlur_dashboard(db: Session = Depends(get_db)):
    """
    Get live weather dashboard strictly for Kadlur Village (16.3768° N, 77.2870° E).
    Combines real atmospheric data, radar sweeps, and verified alert status.
    """
    weather_data = await aggregator.aggregate_kadlur_weather(
        lat=settings.geo.LATITUDE,
        lon=settings.geo.LONGITUDE
    )
    
    current_weather = weather_data.get("current_weather")
    radar_summary = weather_data.get("radar_summary", {})
    
    # Evaluate alerts
    active_alerts = alert_service.evaluate_alert_state(
        radar_summary=radar_summary,
        current_weather=current_weather
    )
    
    location_info = KadlurLocationInfo(
        village_name=settings.geo.VILLAGE_NAME,
        gram_panchayat=settings.geo.GRAM_PANCHAYAT,
        taluk=settings.geo.TALUK,
        district=settings.geo.DISTRICT,
        state=settings.geo.STATE,
        country=settings.geo.COUNTRY,
        pin_code=settings.geo.PIN_CODE,
        census_2011_code=settings.geo.CENSUS_2011_CODE,
        latitude=settings.geo.LATITUDE,
        longitude=settings.geo.LONGITUDE,
        alt_latitude=settings.geo.ALT_LATITUDE,
        alt_longitude=settings.geo.ALT_LONGITUDE,
        elevation_meters=settings.geo.ELEVATION_METERS,
        distance_to_raichur_city_km=settings.geo.DISTANCE_TO_RAICHUR_CITY_KM,
        monitoring_radii_km={
            "immediate": settings.geo.RADIUS_IMMEDIATE_KM,
            "approach": settings.geo.RADIUS_APPROACH_KM,
            "regional": settings.geo.RADIUS_REGIONAL_KM,
            "radar_scan": settings.geo.RADIUS_RADAR_SCAN_KM
        },
        nearest_radar=f"{settings.geo.NEAREST_DWR_NAME} ({settings.geo.NEAREST_DWR_DISTANCE_KM} km)"
    )
    
    return {
        "location": location_info,
        "current_weather": current_weather,
        "live_status_message": weather_data.get("live_status_message"),
        "is_live_operational": weather_data.get("is_live_operational"),
        "data_source_badge": weather_data.get("data_source_badge"),
        "distinction_notice": weather_data.get("distinction_notice"),
        "hourly_forecast_24h": weather_data.get("hourly_forecast_24h", []),
        "hourly_forecast_48h": weather_data.get("hourly_forecast_48h", []),
        "hourly_forecast_7d": weather_data.get("hourly_forecast_7d", []),
        "daily_forecast_10d": weather_data.get("daily_forecast_10d", []),
        "radar_summary": radar_summary,
        "active_alerts": active_alerts,
        "last_updated": weather_data.get("last_updated")
    }
