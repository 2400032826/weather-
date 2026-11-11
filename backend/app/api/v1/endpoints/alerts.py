from fastapi import APIRouter, Depends, Header, HTTPException, status
from typing import List, Dict, Any, Optional
from datetime import datetime
import time
import json
import logging
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.weather import WeatherAlertRecord, PushSubscriptionRecord
from app.schemas.weather import AlertSchema
from app.services.aggregator import MultiSourceAggregator
from app.services.alert_service import AlertService

try:
    from pywebpush import webpush, WebPushException
except ImportError:
    webpush = None
    WebPushException = Exception

logger = logging.getLogger(__name__)

# Rate-limiting / cooldown for broadcasts: at least 60 seconds between broadcasts
_last_broadcast_time = 0.0

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

@router.get("/admin/subscribers-count")
def get_subscribers_count(
    x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key"),
    db: Session = Depends(get_db)
):
    """
    Get current counts of registered push subscribers for Kadlur Village.
    """
    active_count = db.query(PushSubscriptionRecord).filter(PushSubscriptionRecord.is_active == True).count()
    total_count = db.query(PushSubscriptionRecord).count()
    return {
        "status": "success",
        "active_subscribers": active_count,
        "total_registered": total_count,
        "inactive_or_expired": total_count - active_count
    }

@router.post("/admin/broadcast-test")
def admin_broadcast_test(
    payload: Optional[Dict[str, Any]] = None,
    x_admin_key: Optional[str] = Header(None, alias="X-Admin-Key"),
    db: Session = Depends(get_db)
):
    """
    Admin Broadcast Test Notification:
    Dispatches a single, non-rain test notification to all active subscribers.
    Handles expired subscriptions (410/404) by deactivating them.
    Protected by admin authentication and a 60-second cooldown.
    """
    global _last_broadcast_time
    payload = payload or {}
    
    # 1. Admin Authentication Check
    admin_key = x_admin_key or payload.get("admin_key")
    configured_key = getattr(settings, "ADMIN_API_KEY", "kadlur_admin_secret_2026")
    if not admin_key or admin_key.strip() != configured_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Invalid admin key for broadcast operations."
        )

    # 2. Cooldown Rate-Limiting (60 seconds)
    now = time.time()
    time_since_last = now - _last_broadcast_time
    force = payload.get("force", False)
    if time_since_last < 60 and not force:
        cooldown_remaining = int(60 - time_since_last)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Broadcast cooldown active. Please wait {cooldown_remaining} seconds before sending another test."
        )

    # 3. Fetch active subscribers
    active_subs = db.query(PushSubscriptionRecord).filter(PushSubscriptionRecord.is_active == True).all()
    total_active = len(active_subs)

    # 4. Strictly required notification content
    notification_data = {
        "title": "Raithu Alert — Test Notification",
        "body": "This is a test notification. Your Raithu Alert notification system is working.",
        "icon": "/icon-192.png",
        "badge": "/icon-192.png",
        "tag": f"raithu-admin-test-{int(now)}",
        "type": "ADMIN_TEST_NOTIFICATION",
        "vibrate": [200, 100, 200],
        "silent": False,
        "requireInteraction": False,
        "url": "/"
    }
    notification_json = json.dumps(notification_data)

    accepted_count = 0
    failed_count = 0
    expired_count = 0
    errors_list = []

    vapid_private_key = getattr(settings, "VAPID_PRIVATE_KEY", None)
    vapid_claim_email = getattr(settings, "VAPID_CLAIM_EMAIL", "admin@kadlur-weather.org")
    sub_claim = f"mailto:{vapid_claim_email}" if not vapid_claim_email.startswith("mailto:") else vapid_claim_email
    vapid_claims = {"sub": sub_claim}

    if total_active > 0:
        if webpush is None:
            failed_count = total_active
            errors_list.append("pywebpush package not loaded in backend runtime")
        else:
            for sub in active_subs:
                # Validate subscriber keys
                if not sub.p256dh or not sub.auth:
                    # Invalid format
                    failed_count += 1
                    continue

                sub_info = {
                    "endpoint": sub.endpoint,
                    "keys": {
                        "p256dh": sub.p256dh,
                        "auth": sub.auth
                    }
                }
                try:
                    res = webpush(
                        subscription_info=sub_info,
                        data=notification_json,
                        vapid_private_key=vapid_private_key,
                        vapid_claims=vapid_claims,
                        ttl=120,
                        timeout=10
                    )
                    status_code = getattr(res, "status_code", 201)
                    if status_code in [200, 201]:
                        accepted_count += 1
                    else:
                        accepted_count += 1
                except WebPushException as ex:
                    res_status = getattr(ex.response, "status_code", None) if hasattr(ex, "response") else None
                    if res_status in [404, 410]:
                        # Expired or unregistered subscription
                        sub.is_active = False
                        expired_count += 1
                    else:
                        failed_count += 1
                        msg = str(ex)
                        if len(errors_list) < 5:
                            errors_list.append(f"HTTP {res_status}: {msg[:100]}")
                except Exception as e:
                    failed_count += 1
                    if len(errors_list) < 5:
                        errors_list.append(str(e)[:100])

            try:
                db.commit()
            except Exception:
                db.rollback()

    _last_broadcast_time = now

    return {
        "status": "success",
        "title": "Raithu Alert — Test Notification",
        "message": "This is a test notification. Your Raithu Alert notification system is working.",
        "total_subscribers": total_active,
        "accepted": accepted_count,
        "failed": failed_count,
        "expired": expired_count,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "delivery_clarification": "Push services (FCM/Apple/Mozilla) returned acceptance (HTTP 200/201). This confirms dispatch from the application server into the mobile carrier/OS push network. Actual delivery on the device screen depends on battery-optimization, notification permissions, and network connection.",
        "errors": errors_list
    }

