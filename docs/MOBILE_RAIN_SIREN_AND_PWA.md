# Raithu Alert — Mobile Rain Siren & PWA Installation Guide

**Focus Location:** Kadlur Village, Raichur District, Karnataka, India (`16.3768° N, 77.2870° E`)

---

## 1. PWA vs Native Android Audio & Notification Capabilities

| Scenario | PWA (Web / Mobile Chrome / Safari) | Native Android App (APK / Kotlin) |
| :--- | :--- | :--- |
| **App is Open (Foreground)** | ✅ **Custom 5-second Rapido-style dual-tone siren** plays automatically using Web Audio API synthesis with zero network latency, haptic vibration, and volume control. | ✅ Custom siren plays via MediaPlayer / SoundPool. |
| **App in Background / Screen Off** | ✅ **High-Priority Web Push Notification** with urgent double-pulse vibration (`[500, 150, 500, 150, 800]`) and **operating system notification sound**. | ✅ **Custom background siren audio** plays directly from device storage via Android `NotificationChannel`. |
| **Phone Locked** | ✅ OS-level notification alert and persistent notification banner on lock screen. | ✅ Full-screen alarm intent (`setFullScreenIntent`) or high-priority audio alarm channel. |
| **Installation** | ✅ 1-tap **Add to Home Screen / Install App** prompt (no Play Store download needed, ~150 KB footprint). | 📦 Requires Play Store or APK sideloading. |

### Why PWA Cannot Play Arbitrary Background JavaScript Synthesizers When Locked
Modern mobile operating systems (Android 10+ and iOS 16+) strictly prohibit background web workers or service workers from keeping the CPU awake or executing arbitrary JavaScript Web Audio oscillators. This policy prevents malicious websites from silently draining mobile battery or playing unauthorized audio while locked.

Instead, the W3C Push API specification routes push notifications to the native system notification manager, utilizing high-urgency vibration patterns and system notification chimes.

---

## 2. PWA Installation Experience & Lifecycle

### First-Time Visitor Flow
1. **Detection:** When a user visits Raithu Alert for the first time, `pwaInstallManager.checkIsInstalled()` checks:
   - `window.matchMedia('(display-mode: standalone)').matches`
   - `navigator.standalone === true` (iOS)
   - `localStorage.getItem('raithu_pwa_installed') === 'true'`
2. **Prominent Banner:** If uninstalled, the **Install Raithu Alert App** banner appears at the top of the dashboard.
3. **Android Chrome:** Intercepts `beforeinstallprompt`. Tapping the button launches the native Android installation modal.
   - If user accepts: `appinstalled` event fires, `raithu_pwa_installed` is saved to `localStorage`, and the button disappears immediately.
   - If user cancels / dismisses: The app is **not** marked as installed.
4. **iPhone / iPad (Safari):** Shows step-by-step guidance:
   - Step 1: Tap Share (📤) in Safari.
   - Step 2: Tap **Add to Home Screen** (➕).
5. **Subsequent Visits:** Once installed or confirmed, the Install button is **completely hidden**. If reopened via the same URL or launched from the Home Screen icon, the button remains hidden.

---

## 3. Rain Siren vs General Notifications Separation

- **Independent Settings:**
  - `raithu_siren_enabled`: Controls the audible 5-second rain siren.
  - Push notification subscription: Controls background push alerts.
- **Strict Verification:** The rain siren **never** triggers for:
  - `GREEN` (dry weather) status.
  - Normal dashboard refreshes or background syncs.
  - Informational messages or test dry-weather pings.
- **Trigger Conditions:** Siren only triggers when:
  - Active alert level is `YELLOW`, `ORANGE`, or `RED`.
  - AND radar confirms rain is approaching Kadlur or detected within the monitoring perimeter.
  - AND the alert timestamp is new (event deduplication prevents looping).

---

## 4. Optional Native Android Implementation (For Locked-Screen Custom Siren)

If a standalone Android APK with custom siren audio while locked is required in the future, use the following Kotlin implementation:

```kotlin
// Android NotificationChannel with Custom Rain Siren (res/raw/rain_siren.mp3)
package com.raithualert.kadlur

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat

class RainSirenNotificationHelper(private val context: Context) {

    companion object {
        const val CHANNEL_ID = "kadlur_rain_siren_channel"
        const val CHANNEL_NAME = "Kadlur Rain Siren Alerts"
    }

    fun createRainSirenChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val soundUri = Uri.parse("android.resource://${context.packageName}/raw/rain_siren")
            
            val audioAttributes = AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build()

            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High urgency rain alerts for Kadlur Village"
                setSound(soundUri, audioAttributes)
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 150, 500, 150, 800)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }

            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }
}
```
