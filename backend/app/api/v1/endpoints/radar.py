from fastapi import APIRouter
from app.core.config import settings
from app.schemas.weather import RadarAnalysisSchema
from app.services.providers.rainviewer import RainViewerProvider
from app.services.radar_engine import RadarRainfallEngine

router = APIRouter()
rainviewer = RainViewerProvider()
radar_engine = RadarRainfallEngine(rainviewer)

@router.get("/live", response_model=RadarAnalysisSchema)
async def get_kadlur_radar():
    """
    Get live Doppler radar analysis for Kadlur Village.
    Analyzes composite sweeps (including IMD Hyderabad DWR).
    """
    analysis = await radar_engine.analyze_radar_for_kadlur(
        lat=settings.geo.LATITUDE,
        lon=settings.geo.LONGITUDE
    )
    return analysis
