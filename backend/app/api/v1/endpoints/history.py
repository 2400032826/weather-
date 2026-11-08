from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.weather import WeatherObservation, ValidationRecord
from app.schemas.weather import ValidationMetricsSchema
from app.services.validation_service import ValidationService

router = APIRouter()

@router.get("/observations")
def get_historical_observations(limit: int = 50, db: Session = Depends(get_db)):
    """
    Get recent historical weather readings logged for Kadlur.
    """
    records = db.query(WeatherObservation).order_by(WeatherObservation.observation_time.desc()).limit(limit).all()
    return records

@router.get("/validation", response_model=ValidationMetricsSchema)
def get_validation_accuracy(db: Session = Depends(get_db)):
    """
    Get factual historical validation metrics:
    - Rain detection accuracy %
    - False alarm rate %
    - Missed rainfall events %
    - Arrival-time prediction error (minutes)
    """
    return ValidationService.calculate_validation_metrics(db)
