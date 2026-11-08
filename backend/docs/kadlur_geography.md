# Kadlur Village Geographical Verification & Specification

**Project:** Raithu Alert  
**Focus Settlement:** Kadlur Village, Raichur District, Karnataka, India  
**Tagline:** Accurate Weather Monitoring for Kadlur Village  

---

## 1. Geographical Identity & Verification

| Parameter | Official Value | Verification Source |
| :--- | :--- | :--- |
| **Settlement Name** | Kadlur (కడ్లూరు / ಕಡ್ಲೂರು) | Village Records & Postal Directory |
| **Primary Centroid Latitude** | `16.3768° N` (16° 22' 36.48" N) | Cadastral / Mapsofindia Village Centroid |
| **Primary Centroid Longitude** | `77.2870° E` (77° 17' 13.20" E) | Cadastral / Mapsofindia Village Centroid |
| **Settlement Node Latitude** | `16.3914° N` | OpenStreetMap Node `2500440264` |
| **Settlement Node Longitude** | `77.2907° E` | OpenStreetMap Node `2500440264` |
| **Gram Panchayat** | Shakwadi | Rural Development & Panchayat Raj, Karnataka |
| **Taluk / Tehsil** | Raichur | Revenue Department, Karnataka |
| **District** | Raichur | Government of Karnataka |
| **State** | Karnataka | India |
| **Postal PIN Code** | `584170` | India Post |
| **Census 2011 Village Code** | `600733` | Registrar General & Census Commissioner of India |
| **Mean Elevation** | ~382 meters above MSL | Digital Elevation Model (SRTM) |

---

## 2. Crucial Distinction: Kadlur vs Raichur City

A fundamental rule of Raithu Alert is that **Raichur city coordinates must NEVER be substituted for Kadlur village**.

- **Raichur City Coordinates:** `16.2008° N, 77.3556° E`
- **Kadlur Village Coordinates:** `16.3768° N, 77.2870° E`
- **Spatial Separation:** Approximately **22.5 km North-Northwest (NNW)** across the Krishna River basin corridor.

Convective rain showers in the Deccan Plateau during monsoon and pre-monsoon seasons frequently occur in localized cells of 3 to 10 km in diameter. Heavy downpours in Raichur city often miss Kadlur entirely, and vice-versa. Therefore, all atmospheric lookups, Doppler radar reflectivity queries, and movement vector calculations are bound specifically to Kadlur coordinates.

---

## 3. Tiered Monitoring Radii

Surveillance is structured into four concentric circles around Kadlur (`16.3768° N, 77.2870° E`):

1. **Immediate Village Vicinity (5.0 km radius):**
   - Covers core settlement and immediate farmlands/crops.
   - Triggers `RAIN_DETECTED_NEARBY` advisory.
2. **Inner Approach Detection Zone (15.0 km radius):**
   - Active tracking zone for advancing rain clouds.
   - Enables 10–25 minute nowcast warnings before rain reaches Kadlur.
3. **Regional Approach Tracking (30.0 km radius):**
   - Broad detection for convective cells forming across Raichur taluk.
   - Monitors velocity and bearing changes.
4. **Doppler Radar Composite Perimeter (50.0 km radius):**
   - Maximum fine-mesh resolution envelope covered by regional S-Band radar sweeps.

---

## 4. Nearest Doppler Weather Radar (DWR)

- **Radar Facility:** IMD Hyderabad Begumpet Doppler Weather Radar (DWR)
- **Radar Type:** S-Band (Operational surveillance radius: 250 km; Extended: 400 km)
- **Distance to Kadlur:** ~174 km North-East
- **Coverage Status:** Kadlur falls comfortably within the 250 km quantitative precipitation estimation (QPE) surveillance range of the Hyderabad DWR.
