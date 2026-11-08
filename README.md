# Raithu Alert (రైతు అలర్ట్ / ರೈತು ಅಲರ್ಟ್)
> **Accurate Village-Level Weather Monitoring & Early Rain Alerts for Kadlur Village**  
> *Kadlur Village, Raichur Taluk & District, Karnataka, India (16.3768° N, 77.2870° E)*

---

## 1. Project Overview

**Raithu Alert** is a dedicated, mobile-first weather monitoring and early rainfall warning web platform engineered specifically and exclusively for **Kadlur Village, Raichur District, Karnataka, India**.

The application monitors real atmospheric conditions over Kadlur, analyzes real-time Doppler weather radar sweeps from IMD Begumpet, detects approaching convective rain cells, and provides timely, actionable alerts to local farmers and residents before rainfall impacts crops and drying produce.

### Strict Scope & Identity
- **Exclusively Kadlur Village:** Focuses 100% on Kadlur (`16.3768° N, 77.2870° E`, 382m MSL).
- **No Village Switching:** Strictly monitors Kadlur fields.
- **Never Substitutes Raichur City:** Raichur city is located ~22.5 km away (`16.2008° N, 77.3556° E`) with a distinct microclimate. Raichur city weather is never presented as Kadlur's.
- **Zero Fabrication Policy:** Actual Doppler radar & ground measurements are strictly distinguished from numerical forecast models. No simulated live alerts or fake radar echoes.
- **Default Language:** Telugu (`te`) with instant Kannada (`kn`) and English (`en`) support.

---

## 2. Technologies Used

### Frontend
- **Framework:** Next.js 16 (App Router with Turbopack) & React 19
- **Languages:** TypeScript & JavaScript
- **Styling:** Tailwind CSS (Farmer-friendly, high-contrast, mobile-first)
- **Icons:** Lucide Icons
- **Service Worker:** Native PWA Service Worker for background Web Push notifications (`/sw.js`)

### Backend
- **Framework:** Python FastAPI (Asynchronous REST API)
- **Database:** PostgreSQL with PostGIS / SQLite local fallback
- **Engines:**
  - `RadarRainfallEngine`: Doppler composite rain cell tracking and time-to-arrival (ETA) calculator
  - `AlertService`: 4 visual warning levels (GREEN, YELLOW, ORANGE, RED)
  - `MultiSourceAggregator`: Responsible in-memory caching and background scheduled collection
  - `background_weather_collector`: Runs scheduled data collection every 45s without requiring manual user reloads

---

## 3. Local Development Instructions

### Prerequisites
- Node.js (v18+ or v20+)
- Python (v3.10+ or v3.11+)
- Git

### Running the Frontend (Next.js)
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The Next.js frontend will run at: `http://localhost:3000`

### Running the Root Vite Dev Server (Optional Preview)
```bash
# In the root repository directory
npm install
npm run dev
```
The Vite development server will run at: `http://localhost:5173`

### Running the Backend (FastAPI)
```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start development server with reload
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive API documentation (Swagger) will be available at: `http://127.0.0.1:8000/docs`

---

## 4. Environment Variable Setup

The application comes with `.env.example` templates across root, frontend, and backend.

### Frontend (`frontend/.env.local` or Vercel Environment Variables)
Copy `frontend/.env.example` to `frontend/.env.local`:
```bash
cp frontend/.env.example frontend/.env.local
```

| Variable | Required? | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Optional | URL of the deployed FastAPI backend. If empty, the app runs in client-side fallback mode using direct Open-Meteo & RainViewer APIs. | `https://raithu-alert-api.onrender.com` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Optional | Public VAPID key for browser PushManager subscription. | `BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U` |

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

| Variable | Required? | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Optional | SQLite default (`sqlite:///./kadlur_weather.db`) or PostgreSQL URL for Render. |
| `CORS_ORIGINS` | Recommended | Allowed frontend origins (e.g., `["https://raithu-alert.vercel.app"]`). |
| `VAPID_PUBLIC_KEY` | Optional | Public VAPID key for Web Push. |
| `VAPID_PRIVATE_KEY` | Optional | Private VAPID key for server push dispatch. |

---

## 5. Weather API Setup

### Essential Sources (100% Free - Zero Credentials Needed)
1. **Open-Meteo High-Resolution NWP:**
   - Provides 1-2 km hourly precipitation, temperature, wind, humidity, and 10-day daily forecast for Kadlur coordinates (`16.3768° N, 77.2870° E`).
   - Integrated and active out-of-the-box.
2. **RainViewer Doppler Radar Network:**
   - Composite Doppler radar reflectivity sweeps centered on Kadlur via IMD Hyderabad Begumpet DWR (~174 km NE).
   - Generates 10-minute historical and nowcast radar layers.
   - Integrated and active out-of-the-box.

### Optional Sources (Require Official / Commercial Credentials)
- **IMD (Official):** District nowcasts for Raichur. Automated AWS telemetry API requires official credentials (`IMD_CUSTOM_KEY`).
- **Windy:** ECMWF / GFS point forecast models (set `WINDY_API_KEY`).
- **Meteomatics:** 90m atmospheric downscaling API (set `METEOMATICS_USERNAME` and `METEOMATICS_PASSWORD`).

---

## 6. Notification System Setup

Raithu Alert includes a 6-step safe onboarding flow for push alerts:
1. Displays clear intent: *"Enable rain alerts to receive warnings when rain approaches Kadlur."*
2. Prompts browser notification permission with timeout guard.
3. Registers `/sw.js` (native Service Worker).
4. Subscribes device using `pushManager.subscribe()` with VAPID key.
5. Saves subscription securely in backend SQLite/PostgreSQL database via `POST /api/v1/alerts/subscribe`.
6. Reflects real-time state:
   - `OFF`: "వర్ష సూచనలను పొందడానికి ప్రారంభించండి" (TURN ON RAIN ALERTS)
   - `ACTIVATING`: "అలర్ట్‌లు సిద్ధం చేస్తున్నాము..." (SETTING UP ALERTS...)
   - `ON`: "✓ వర్ష అలర్ట్‌లు ఆన్" (RAIN ALERTS ON) with **Send Test Notification** and **Turn Off Alerts** buttons.
   - `DENIED`: Explains how to unblock via browser address bar (🔒).

---

## 7. GitHub Upload Instructions

Before committing, verify that `.env`, `.env.local`, and database `.db` files are ignored:
```bash
# 1. Check status
git status

# 2. Add files
git add .

# 3. Commit changes
git commit -m "Prepare Raithu Alert for Vercel deployment"

# 4. Push to your GitHub repository
git push origin main
```

---

## 8. Vercel Deployment Instructions (Step-by-Step)

Deploying the Next.js frontend to Vercel takes less than 2 minutes:

### Step 1: Import Project into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** $\to$ **Project**.
3. Select your GitHub repository (`raithu-alert`).

### Step 2: Configure Project Settings
- **Framework Preset:** `Next.js`
- **Root Directory:** Click **Edit** and select `frontend`.
- **Build Command:** `next build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Step 3: Add Environment Variables
In the **Environment Variables** section, add:
- `NEXT_PUBLIC_API_URL`: Your deployed FastAPI backend URL (e.g., `https://raithu-alert-api.onrender.com`), or leave empty for standalone client fallback.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`: `BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U`

### Step 4: Deploy
Click **Deploy**. Vercel will install dependencies, run the Next.js build, and assign your live production URL (e.g., `https://raithu-alert.vercel.app`).

---

## 9. FastAPI Backend Deployment (Render Instructions)

Because Vercel is optimized for frontend and serverless edge functions, the long-running Python background collector and SQLite/PostgreSQL database are deployed separately on [Render](https://render.com) (or Railway/Fly.io):

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\to$ **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service:
   - **Name:** `raithu-alert-api`
   - **Region:** Singapore / Frankfurt / Oregon
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `CORS_ORIGINS`: `["https://your-vercel-domain.vercel.app", "http://localhost:3000"]`
   - `DATABASE_URL`: `sqlite:///./kadlur_weather.db` (or attach a free Render PostgreSQL database)
6. Click **Create Web Service**.
7. Once deployed, copy your Render URL (e.g. `https://raithu-alert-api.onrender.com`) and paste it as `NEXT_PUBLIC_API_URL` in your Vercel project settings.
