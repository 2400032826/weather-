# Weather Provider Integration & Feasibility Analysis

**Application:** Raithu Alert  
**Village Target:** Kadlur Village, Raichur District, Karnataka, India (`16.3768° N, 77.2870° E`)  

---

## Provider Feasibility & Investigation Matrix

| Provider | Access & Licensing | Kadlur Coverage | Doppler Radar Nowcast | Update Rate | Current Status in Raithu Alert |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Open-Meteo** | Free & Open Access (No API key needed) | 100% (High-res 1-2km global NWP grid) | Hourly precipitation forecasts & probabilities | 15–60 min | **CONNECTED & ACTIVE** (Model assimilation) |
| **RainViewer** | Free Public Doppler Composite API | 100% (Mosaics IMD Hyderabad DWR at 174km) | **Yes**: 10-minute historical sweeps + 30-min nowcast | 10 min | **CONNECTED & ACTIVE** (Doppler Radar Engine) |
| **IMD (Official)** | Open bulletins on web; REST API requires official credentials/MOU | Raichur District Station (~22km) & DWR Hyderabad | Visual radar sweeps on Mausam; automated JSON API restricted | 10–180 min | **ADAPTER READY** (Status: `PENDING_KEY`) |
| **Windy** | Commercial API key required (`WINDY_API_KEY`) | Point forecast grid (ECMWF 9km, GFS 22km) | Radar map tile overlay (requires paid plan) | 60 min | **ADAPTER READY** (Status: `PENDING_KEY`) |
| **Meteomatics** | Commercial enterprise (~€300/mo minimum) | Global satellite and numerical blending | Satellite proxy nowcasting (no direct DWR) | 15–60 min | **ADAPTER READY** (Status: `PENDING_CREDENTIALS`) |

---

## Detailed Provider Analysis

### 1. Open-Meteo
- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **Method:** `GET`
- **Query Parameters:** `latitude=16.3768&longitude=77.2870&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=precipitation,precipitation_probability,temperature_2m,weather_code`
- **Strengths:** 
  - Free and fast response with zero rate-limiting hurdles for open community usage.
  - Returns high-resolution atmospheric metrics calibrated to Kadlur coordinates.
- **Distinction Integrity:** Marked explicitly in UI as **Numerical Forecast Model**, never masqueraded as a direct physical ground sensor.

### 2. RainViewer (Doppler Radar Composite)
- **Endpoint:** `https://api.rainviewer.com/public/weather-maps.json`
- **Method:** `GET`
- **Tile URL:** `https://tilecache.rainviewer.com{path}/256/7/{x}/{y}/2/1_1.png`
- **Strengths:**
  - Aggregates radar sweeps from national meteorological agencies worldwide. In India, it composites IMD Doppler Weather Radars (including Hyderabad Begumpet DWR, ~174 km NE of Kadlur).
  - Provides 10-minute past radar frames (past 2 hours) and nowcast extrapolation projections.
  - Powers the Raithu Alert Radar Rainfall Monitoring Engine without mock data.
- **Integrity Rule:** If radar sweeps show zero reflectivity (&lt; 15 dBZ), the system states "No significant rain detected". If frames are unavailable, it states "Radar monitoring currently unavailable".

### 3. India Meteorological Department (IMD)
- **Portal:** `mausam.imd.gov.in`
- **Doppler Radar Facility:** Hyderabad Begumpet S-Band DWR (~174 km away).
- **Public Access Reality:** While IMD provides public web pages with district nowcasts and radar imagery, an authenticated open JSON REST API for continuous automated station telemetry is restricted to government institutions and registered partners.
- **Adapter Design:** `IMDProvider` in `app/services/providers/imd.py` is configured with `IMD_CUSTOM_KEY`. When unconfigured, it reports status honestly as `PENDING_KEY` rather than simulating fake IMD readings.

### 4. Windy Point Forecast API
- **Endpoint:** `https://api.windy.com/api/point-forecast/v2`
- **Authentication:** `WINDY_API_KEY`
- **Licensing:** Free tier has strict limits; production use requires a paid subscription.
- **Adapter Design:** `WindyProvider` in `app/services/providers/windy.py` checks `settings.WINDY_API_KEY`. When unset, reports `PENDING_KEY`.

### 5. Meteomatics Weather API
- **Endpoint:** `https://api.meteomatics.com`
- **Authentication:** HTTP Basic Auth (`METEOMATICS_USERNAME`, `METEOMATICS_PASSWORD`).
- **Pricing:** Commercial plans start from €300/month.
- **Kadlur Assessment:** High-resolution atmospheric downscaling is excellent, but real-time Doppler radar nowcasting over rural India relies heavily on satellite assimilation proxies.
- **Adapter Design:** `MeteomaticsProvider` in `app/services/providers/meteomatics.py` reports `PENDING_CREDENTIALS` until enterprise credentials are provided.
