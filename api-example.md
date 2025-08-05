# Backend API Documentation for Location Tracker

This document describes the API endpoints that your backend server should implement to work with the Location Tracker frontend application.

## Overview

The Location Tracker sends data to three main endpoints:

1. **Location Updates** - Continuous location tracking
2. **Geofence Alerts** - Entry/exit notifications
3. **Feedback Submissions** - Visitor feedback data

## Authentication

Currently, the application doesn't implement authentication. You may want to add:

- API keys in headers
- Bearer tokens
- Basic authentication
- IP whitelisting

## Endpoints

### 1. Location Updates

**Endpoint:** `POST /api/location`

**Purpose:** Receives continuous location updates from visitors

**Request Body:**

```json
{
  "timestamp": "2025-08-05T10:30:00.000Z",
  "sessionId": "uuid-v4-string",
  "userId": "anonymous",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "accuracy": 10
  },
  "userAgent": "Mozilla/5.0...",
  "source": "geofence-tracker"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Location updated successfully",
  "locationId": "12345"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Invalid location data",
  "code": "INVALID_DATA"
}
```

### 2. Geofence Alerts

**Endpoint:** `POST /api/geofence-alert`

**Purpose:** Receives notifications when users enter or exit geofenced areas

**Request Body:**

```json
{
  "timestamp": "2025-08-05T10:35:00.000Z",
  "sessionId": "uuid-v4-string",
  "userId": "anonymous",
  "event": "enter", // or "exit"
  "geofence": {
    "id": "office",
    "name": "Office Building",
    "lat": 37.7749,
    "lng": -122.4194,
    "radius": 100
  },
  "location": {
    "latitude": 37.775,
    "longitude": -122.4195,
    "accuracy": 8
  },
  "source": "geofence-tracker"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Geofence alert recorded",
  "alertId": "67890"
}
```

### 3. Feedback Submissions

**Endpoint:** `POST /api/feedback`

**Purpose:** Receives visitor feedback form submissions

**Request Body:**

```json
{
  "timestamp": "2025-08-05T10:45:00.000Z",
  "sessionId": "uuid-v4-string",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "feedback": {
    "impressions": "The property looks great overall...",
    "liked_most": "The spacious layout and natural lighting",
    "liked_least": "The parking situation could be better",
    "price_thoughts": "Fair for the market, might negotiate slightly",
    "potential_buyers": "Young professionals or small families"
  },
  "contact": {
    "name": "John Doe", // optional
    "email": "john@example.com", // optional
    "phone": "+1234567890" // optional
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "feedbackId": "feedback-123"
}
```

## Implementation Examples

### Node.js/Express Example

```javascript
const express = require("express");
const app = express();

app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});

// Location updates
app.post("/api/location", (req, res) => {
  const { timestamp, sessionId, location } = req.body;

  // Save to database
  console.log("Location update:", req.body);

  res.json({
    success: true,
    message: "Location updated successfully",
    locationId: Date.now().toString(),
  });
});

// Geofence alerts
app.post("/api/geofence-alert", (req, res) => {
  const { event, geofence, location } = req.body;

  // Save to database and possibly send notifications
  console.log("Geofence alert:", req.body);

  res.json({
    success: true,
    message: "Geofence alert recorded",
    alertId: Date.now().toString(),
  });
});

// Feedback submissions
app.post("/api/feedback", (req, res) => {
  const { feedback, contact, location } = req.body;

  // Save to database
  console.log("Feedback received:", req.body);

  res.json({
    success: true,
    message: "Feedback submitted successfully",
    feedbackId: `feedback-${Date.now()}`,
  });
});

app.listen(3000, () => {
  console.log("API server running on port 3000");
});
```

### Python/Flask Example

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/api/location', methods=['POST'])
def location_update():
    data = request.get_json()

    # Save to database
    print(f"Location update: {data}")

    return jsonify({
        'success': True,
        'message': 'Location updated successfully',
        'locationId': str(int(datetime.datetime.now().timestamp()))
    })

@app.route('/api/geofence-alert', methods=['POST'])
def geofence_alert():
    data = request.get_json()

    # Save to database and send notifications
    print(f"Geofence alert: {data}")

    return jsonify({
        'success': True,
        'message': 'Geofence alert recorded',
        'alertId': str(int(datetime.datetime.now().timestamp()))
    })

@app.route('/api/feedback', methods=['POST'])
def feedback_submission():
    data = request.get_json()

    # Save to database
    print(f"Feedback received: {data}")

    return jsonify({
        'success': True,
        'message': 'Feedback submitted successfully',
        'feedbackId': f"feedback-{int(datetime.datetime.now().timestamp())}"
    })

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

## Database Schema Suggestions

### Location Updates Table

```sql
CREATE TABLE location_updates (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    accuracy FLOAT,
    timestamp TIMESTAMP,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Geofence Alerts Table

```sql
CREATE TABLE geofence_alerts (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    user_id VARCHAR(255),
    event VARCHAR(10), -- 'enter' or 'exit'
    geofence_id VARCHAR(255),
    geofence_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Feedback Table

```sql
CREATE TABLE feedback_submissions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    impressions TEXT,
    liked_most TEXT,
    liked_least TEXT,
    price_thoughts TEXT,
    potential_buyers TEXT,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255),
    timestamp TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

1. **Rate Limiting:** Implement rate limiting to prevent spam
2. **Input Validation:** Validate all incoming data
3. **HTTPS Only:** Use SSL certificates for production
4. **API Keys:** Consider implementing API authentication
5. **Data Sanitization:** Sanitize all text inputs
6. **CORS:** Configure CORS properly for your domain
7. **Logging:** Log all requests for monitoring and debugging

## Testing

You can test your API endpoints using curl:

```bash
# Test location update
curl -X POST http://localhost:3000/api/location \
  -H "Content-Type: application/json" \
  -d '{"timestamp":"2025-08-05T10:30:00.000Z","sessionId":"test-123","location":{"latitude":37.7749,"longitude":-122.4194}}'

# Test geofence alert
curl -X POST http://localhost:3000/api/geofence-alert \
  -H "Content-Type: application/json" \
  -d '{"event":"enter","geofence":{"id":"test","name":"Test Area"},"location":{"latitude":37.7749,"longitude":-122.4194}}'

# Test feedback
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"feedback":{"impressions":"Great!"},"contact":{"name":"Test User"}}'
```

## Configuration

Update the `CONFIG` object in `geofence-tracker.html`:

```javascript
const CONFIG = {
  API_ENDPOINT: "https://your-domain.com/api/location",
  GEOFENCE_ENDPOINT: "https://your-domain.com/api/geofence-alert",
  FEEDBACK_ENDPOINT: "https://your-domain.com/api/feedback",
  // ... rest of config
};
```

Remember to replace `https://your-domain.com` with your actual backend URL!
