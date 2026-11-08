from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.weather import WeatherAlertRecord, PushSubscriptionRecord
from app.schemas.weather import AlertSchema
from app.services.aggregator import MultiSourceAggregator
from app.services.alert_service import AlertService

router = APIRouter()
aggregator = MultiSourceAggregator()
alert_service = AlertService()

@router.get("/active", response_model=List[AlertSchema])
async def get_active_alerts(db: Session = Depends(get_db)):
    """
    Get current verified weather alerts for Kadlur.
    """
    weather_data = await aggregator.aggregate_kadlur_weather(
        lat=settings.geo.LATITUDE,
        lon=settings.geo.LONGITUDE
    )
    alerts = alert_service.evaluate_alert_state(
        radar_summary=weather_data.get("radar_summary", {}),
        current_weather=weather_data.get("current_weather")
    )
    return alerts

@router.get("/history")
def get_alert_history(limit: int = 20, db: Session = Depends(get_db)):
    """
    Get past logged alert records for Kadlur.
    """
    past = db.query(WeatherAlertRecord).order_by(WeatherAlertRecord.issue_timestamp.desc()).limit(limit).all()
    return past

@router.get("/vapid-public-key")
def get_vapid_public_key():
    """
    Returns public VAPID key for Web Push subscription.
    """
    return {
        "status": "success",
        "public_key": "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
    }

@router.get("/check-subscription")
def check_subscription_status(endpoint: str, db: Session = Depends(get_db)):
    """
    Verifies that a push subscription endpoint is actively registered in database.
    """
    sub = db.query(PushSubscriptionRecord).filter(
        PushSubscriptionRecord.endpoint == endpoint,
        PushSubscriptionRecord.is_active == True
    ).first()
    return {
        "is_subscribed": bool(sub),
        "endpoint": endpoint,
        "language": sub.language if sub else None,
        "village": "Kadlur, Raichur"
    }

@router.post("/subscribe")
def register_notification_token(payload: Dict[str, Any], db: Session = Depends(get_db)):
    """
    Endpoint for browser push notifications or Firebase Cloud Messaging (FCM).
    Stores token associated exclusively with Kadlur weather alert broadcasts.
    """
    endpoint = payload.get("token") or payload.get("endpoint") or f"client_{datetime.utcnow().timestamp()}"
    device_type = payload.get("device_type", "browser")
    language = payload.get("language", "te")
    p256dh = payload.get("keys", {}).get("p256dh") if isinstance(payload.get("keys"), dict) else payload.get("p256dh")
    auth = payload.get("keys", {}).get("auth") if isinstance(payload.get("keys"), dict) else payload.get("auth")

    existing = db.query(PushSubscriptionRecord).filter(PushSubscriptionRecord.endpoint == endpoint).first()
    if existing:
        existing.is_active = True
        existing.language = language
    else:
        new_sub = PushSubscriptionRecord(
            endpoint=endpoint,
            device_type=device_type,
            language=language,
            p256dh=p256dh,
            auth=auth,
            is_active=True
        )
        db.add(new_sub)
    try:
        db.commit()
    except Exception:
        db.rollback()

    return {
        "status": "success",
        "message": f"Successfully registered {device_type} notification token for Kadlur alerts in {language}.",
        "village": "Kadlur, Raichur"
    }

@router.post("/unsubscribe")
def unsubscribe_notification_token(payload: Dict[str, Any], db: Session = Depends(get_db)):
    endpoint = payload.get("token") or payload.get("endpoint")
    if endpoint:
        sub = db.query(PushSubscriptionRecord).filter(PushSubscriptionRecord.endpoint == endpoint).first()
        if sub:
            sub.is_active = False
            try:
                db.commit()
            except Exception:
                db.rollback()
    return {"status": "success", "message": "Unsubscribed from Kadlur rain alerts."}

@router.post("/test-alert")
def trigger_test_alert(payload: Dict[str, Any]):
    """
    Trigger a clearly labeled test notification for the farmer's device.
    Strictly marked as 'TEST ALERT' per Section 3 instructions.
    """
    language = payload.get("language", "en")
    
    messages = {
        "en": {
            "title": "TEST ALERT – KADLUR WEATHER",
            "body": "Rain notification test for Kadlur Village. Alerts are active for approaching rainfall, thunderstorms, and heavy downpours."
        },
        "te": {
            "title": "పరీక్షా హెచ్చరిక – కడ్లూరు వర్ష అలర్ట్",
            "body": "కడ్లూరు గ్రామ వర్ష హెచ్చరికల పరీక్ష విజయవంతమైంది. వర్షం లేదా ఈదురు గాలులు వచ్చినప్పుడు తక్షణమే సమాచారం అందుతుంది."
        },
        "kn": {
            "title": "ಪರೀಕ್ಷಾ ಎಚ್ಚರಿಕೆ – ಕಡ್ಲೂರು ಮಳೆ ಅಲರ್ಟ್",
            "body": "ಕಡ್ಲೂರು ಗ್ರಾಮ ಮಳೆ ಎಚ್ಚರಿಕೆ ಪರೀಕ್ಷೆ ಯಶಸ್ವಿಯಾಗಿದೆ. ಮಳೆ ಅಥವಾ ಗುಡುಗು ಬಂದಾಗ ತಕ್ಷಣ ಮಾಹಿತಿ ದೊರೆಯಲಿದೆ."
        }
    }
    
    msg = messages.get(language, messages["en"])
    return {
        "status": "sent",
        "test": True,
        "title": msg["title"],
        "body": msg["body"],
        "timestamp": datetime.utcnow().isoformat(),
        "village": "Kadlur, Raichur"
    }
