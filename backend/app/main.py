import asyncio
from datetime import datetime
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.weather import WeatherAlertRecord
import app.models.weather  # Ensure all SQLAlchemy models are registered
from app.services.aggregator import MultiSourceAggregator
from app.services.alert_service import AlertService
from app.api.v1.endpoints import dashboard, radar, sources, history, alerts, config

# Create database tables
Base.metadata.create_all(bind=engine)

background_aggregator = MultiSourceAggregator()
background_alert_service = AlertService()
last_recorded_alert_level: str = "GREEN"

async def background_weather_collector():
    """
    Scheduled background data collector & radar alert monitor for Kadlur Village.
    Runs every 45s without requiring farmers to refresh the page.
    Prevents duplicate notifications and records genuine rainfall alerts.
    """
    global last_recorded_alert_level
    await asyncio.sleep(2)
    while True:
        try:
            weather_data = await background_aggregator.aggregate_kadlur_weather(
                lat=settings.geo.LATITUDE,
                lon=settings.geo.LONGITUDE
            )
            radar = weather_data.get("radar_summary", {})
            curr = weather_data.get("current_weather", {})
            alerts_list = background_alert_service.evaluate_alert_state(
                radar_summary=radar,
                current_weather=curr
            )
            primary_alert = alerts_list[0] if alerts_list else None
            if primary_alert:
                lvl = primary_alert.get("alert_level", "GREEN")
                if lvl != "GREEN" and lvl != last_recorded_alert_level:
                    db = SessionLocal()
                    try:
                        obs_time = primary_alert.get("observation_time")
                        if not isinstance(obs_time, datetime):
                            obs_time = datetime.utcnow()
                        record = WeatherAlertRecord(
                            alert_category=f"{lvl}_ALERT_KADLUR",
                            severity=primary_alert.get("severity", "WARNING"),
                            title=primary_alert.get("title", ""),
                            description=primary_alert.get("description", ""),
                            description_te=primary_alert.get("description_te", ""),
                            description_kn=primary_alert.get("description_kn", ""),
                            data_observation_timestamp=obs_time,
                            source_summary=primary_alert.get("source_summary", "Radar & NWP"),
                            confidence_score=primary_alert.get("confidence_score", 0.9),
                            is_active=True
                        )
                        db.add(record)
                        db.commit()
                        last_recorded_alert_level = lvl
                    finally:
                        db.close()
                elif lvl == "GREEN":
                    last_recorded_alert_level = "GREEN"
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"[Raithu Alert] Background collector error: {e}")
        await asyncio.sleep(45)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    worker = asyncio.create_task(background_weather_collector())
    yield
    worker.cancel()
    try:
        await worker
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Dedicated Village-Specific Weather Monitoring & Radar-Based Rainfall Detection API for Kadlur Village, Raichur District, Karnataka, India.",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(dashboard.router, prefix=f"{settings.API_V1_PREFIX}/weather", tags=["Dashboard"])
app.include_router(radar.router, prefix=f"{settings.API_V1_PREFIX}/radar", tags=["Radar Nowcast"])
app.include_router(sources.router, prefix=f"{settings.API_V1_PREFIX}/sources", tags=["Weather Sources"])
app.include_router(history.router, prefix=f"{settings.API_V1_PREFIX}/history", tags=["History & Validation"])
app.include_router(alerts.router, prefix=f"{settings.API_V1_PREFIX}/alerts", tags=["Rain Alerts"])
app.include_router(config.router, prefix=f"{settings.API_V1_PREFIX}/config", tags=["Village Configuration"])

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "village": "Kadlur",
        "taluk": "Raichur",
        "district": "Raichur",
        "state": "Karnataka",
        "coordinates": {"lat": settings.geo.LATITUDE, "lon": settings.geo.LONGITUDE},
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Raithu Alert Kadlur Backend",
        "timestamp": settings.VERSION
    }
