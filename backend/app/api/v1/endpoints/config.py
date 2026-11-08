from fastapi import APIRouter
from app.core.config import settings
from app.schemas.weather import KadlurLocationInfo

router = APIRouter()

@router.get("/kadlur", response_model=KadlurLocationInfo)
def get_kadlur_configuration():
    """
    Get verified geographical configuration and metadata for Kadlur Village.
    Shows exact coordinates, boundaries, and relationship to Raichur district HQ.
    """
    return KadlurLocationInfo(
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
