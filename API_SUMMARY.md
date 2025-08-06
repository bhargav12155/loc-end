# API Summary for Property Feedback App

## Backend Base URLs

- Local: `http://localhost:3000/api`
- Production: `https://loc-end.onrender.com/api`

---

## 1. Geofence APIs

### Fetch All Geofences

- **Endpoint:** `GET /api/geofence`
- **Description:** Returns all geofences in the database.
- **Curl:**

```
curl -X GET https://loc-end.onrender.com/api/geofence
```

---

## 2. Feedback API

### Submit Feedback

- **Endpoint:** `POST /api/feedback`
- **Description:** Submit property feedback with device, location, and contact info.
- **Curl:**

```
curl -X POST https://loc-end.onrender.com/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "propertyFeedback": { ... },
    "contact": { ... },
    "location": { ... },
    "device": { ... },
    "network": { ... },
    "system": { ... }
  }'
```

---

## 3. Location API

### Send Location Update

- **Endpoint:** `POST /api/location`
- **Description:** Send user/device location and metadata.
- **Curl:**

```
curl -X POST https://loc-end.onrender.com/api/location \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "...",
    "lat": ...,
    "lng": ...,
    "accuracy": ...,
    "timestamp": "...",
    "device": { ... }
  }'
```

---

## 4. Geofence Alert API

### Send Geofence Alert (Entry/Exit)

- **Endpoint:** `POST /api/geofence-alert`
- **Description:** Notify backend when user enters/exits a geofence.
- **Curl:**

```
curl -X POST https://loc-end.onrender.com/api/geofence-alert \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "...",
    "geofenceId": "...",
    "geofenceName": "...",
    "action": "ENTER"|"EXIT",
    "lat": ...,
    "lng": ...,
    "distance": ...,
    "timestamp": "..."
  }'
```

---

## Notes

- Replace `https://loc-end.onrender.com/api` with `http://localhost:3000/api` for local development.
- All endpoints accept and return JSON.
- For feedback/location/geofence-alert POSTs, see frontend code for full payload structure.
