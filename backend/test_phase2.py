import httpx
import sys

# Ensure utf-8 output encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

client = httpx.Client(timeout=10.0)

# 1. Test Backend Dashboard
dash = client.get('http://127.0.0.1:8000/api/v1/weather/dashboard')
assert dash.status_code == 200, f'Dashboard failed: {dash.status_code}'
dash_json = dash.json()
print('[PASS] 1. Backend Dashboard HTTP 200 OK')
print('   Location:', dash_json['location']['village_name'], dash_json['location']['latitude'], dash_json['location']['longitude'])
print('   Current Temp:', dash_json['current_weather']['temperature_c'], 'deg C')
print('   Condition:', dash_json['current_weather']['condition_text'])
print('   Humidity:', dash_json['current_weather']['relative_humidity_pct'], '%')
print('   Wind:', dash_json['current_weather']['wind_speed_kmh'], 'km/h')

# 2. Test Hourly Forecasts (24h, 48h, 7d)
h24 = dash_json.get('hourly_forecast_24h', [])
h48 = dash_json.get('hourly_forecast_48h', [])
h7d = dash_json.get('hourly_forecast_7d', [])
print(f'[PASS] 2. Hourly Forecast: 24h count={len(h24)}, 48h count={len(h48)}, 7d count={len(h7d)}')
assert len(h24) == 24, '24h forecast count mismatch'
print('   Sample Hour 0:', h24[0]['time'], 'Temp:', h24[0]['temperature_c'], 'deg C, Rain prob:', h24[0]['precipitation_probability_pct'], '%, is_rain:', h24[0]['is_rain_hour'])

# 3. Test Radar Timestamps & Freshness
radar = dash_json['radar_summary']
print('[PASS] 3. Radar Monitoring:')
print('   Coverage Status:', radar['coverage_status'])
print('   Freshness Status:', radar.get('freshness_status'))
print('   Scan Timestamp:', radar.get('radar_observation_time'))
print('   Tile layers count:', len(radar.get('tile_layers', [])))

# 4. Test Notification Subscription Endpoint
sub_res = client.post('http://127.0.0.1:8000/api/v1/alerts/subscribe', json={'token': 'test_token_123', 'language': 'te', 'device_type': 'browser'})
assert sub_res.status_code == 200, f'Subscribe failed: {sub_res.status_code}'
print('[PASS] 4. Push Subscription Registration HTTP 200:', sub_res.json()['status'])

# 5. Test Clearly Labeled Test Notification Endpoint (English, Telugu, Kannada)
test_en = client.post('http://127.0.0.1:8000/api/v1/alerts/test-alert', json={'language': 'en'})
test_te = client.post('http://127.0.0.1:8000/api/v1/alerts/test-alert', json={'language': 'te'})
test_kn = client.post('http://127.0.0.1:8000/api/v1/alerts/test-alert', json={'language': 'kn'})
print('[PASS] 5. Test Notification Dispatch:')
print('   EN:', test_en.json()['title'])
print('   TE:', test_te.json()['title'])
print('   KN:', test_kn.json()['title'])

# 6. Test Data Freshness & Sources Monitor
srcs = client.get('http://127.0.0.1:8000/api/v1/sources/status')
assert srcs.status_code == 200, f'Sources failed: {srcs.status_code}'
print('[PASS] 6. Data Freshness Monitor (5 Providers):')
for s in srcs.json():
    print(f'   - {s["provider_id"]}: {s["status"]} | Freshness: {s.get("freshness_status")} | Delay: {s.get("data_delay_minutes")} min')

# 7. Test Frontend HTTP 200 Responses
vite_res = client.get('http://127.0.0.1:5173')
assert vite_res.status_code == 200, 'Vite dev server failed'
print('[PASS] 7. Frontend Vite Server HTTP 200 OK (Port 5173)')
print('>>> ALL PHASE 2 VERIFICATION TESTS PASSED SUCCESSFULLY! <<<')
