from fastapi import APIRouter
from typing import List
from app.schemas.weather import ProviderStatusSchema
from app.services.aggregator import MultiSourceAggregator

router = APIRouter()
aggregator = MultiSourceAggregator()

@router.get("/status", response_model=List[ProviderStatusSchema])
async def get_provider_status():
    """
    Get live health, availability, licensing status, and coverage metrics
    for all 5 investigated weather data providers:
    - Open-Meteo
    - RainViewer (Radar Mosaic / IMD DWR Begumpet)
    - India Meteorological Department (IMD)
    - Windy
    - Meteomatics
    """
    return await aggregator.get_all_provider_statuses()
