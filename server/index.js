import express from "express";
import cors from "cors";
import { getNetworkInfo } from "./networkUtils.js";
import {
  connectDB,
  Feedback,
  Location,
  GeofenceAlert,
  Geofence,
  DigitalFeedback,
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration for GitHub Pages
const corsOptions = {
  origin: [
    'https://bhargav12155.github.io',
    'http://localhost:8100',
    'http://localhost:4200',
    /\.onrender\.com$/ // Allow Render preview deployments
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// Health check endpoint for Render
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Log startup information (exclude health checks to reduce noise)
app.use((req, res, next) => {
  if (req.path !== '/api/health') {
    console.log(`📨 ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`);
  }
  next();
});

// Feedback endpoint
app.post("/api/feedback", async (req, res) => {
  try {
    console.log("🔵 [FEEDBACK] === INCOMING REQUEST ===");
    console.log("🔵 [FEEDBACK] Headers:", JSON.stringify(req.headers, null, 2));
    console.log(
      "🔵 [FEEDBACK] Body received from UI:",
      JSON.stringify(req.body, null, 2)
    );

    // Extract device info for logging
    const deviceInfo = req.body.device || {};
    console.log(
      "📱 [DEVICE] Device ID:",
      deviceInfo.deviceId || "❌ NOT PROVIDED"
    );
    console.log(
      "📱 [DEVICE] Fingerprint:",
      deviceInfo.deviceFingerprint || "❌ NOT PROVIDED"
    );
    console.log("📱 [DEVICE] Platform:", deviceInfo.platform || "Unknown");
    console.log("📱 [DEVICE] User Agent:", deviceInfo.userAgent || "Unknown");
    console.log(
      "📱 [DEVICE] Full Device Object Keys:",
      Object.keys(deviceInfo)
    );

    // Extract app name for logging
    console.log("📱 [APP] App Name:", req.body.appName || "❌ NOT PROVIDED");

    const networkInfo = getNetworkInfo(req);
    console.log(
      "🔵 [FEEDBACK] Network info:",
      JSON.stringify(networkInfo, null, 2)
    );

    const feedbackData = {
      ...req.body,
      network: networkInfo,
      receivedAt: networkInfo.serverReceivedAt,
    };

    console.log(
      "🔵 [FEEDBACK] Final data being saved to DB:",
      JSON.stringify(feedbackData, null, 2)
    );

    const feedback = new Feedback(feedbackData);
    await feedback.save();

    console.log("✅ [FEEDBACK] Successfully saved to database");
    res.status(201).json({ message: "Feedback received", success: true });
  } catch (err) {
    console.error("❌ [FEEDBACK] Error:", err.message);
    console.error("❌ [FEEDBACK] Full error:", err);
    res
      .status(500)
      .json({ message: "Error saving feedback", error: err.message });
  }
});

// Location endpoint
app.post("/api/location", async (req, res) => {
  try {
    console.log("🟡 [LOCATION] === INCOMING REQUEST ===");
    console.log("🟡 [LOCATION] Headers:", JSON.stringify(req.headers, null, 2));
    console.log(
      "🟡 [LOCATION] Body received from UI:",
      JSON.stringify(req.body, null, 2)
    );

    // Extract device info for logging
    const deviceInfo = req.body.device || {};
    console.log(
      "📱 [DEVICE] Device ID:",
      deviceInfo.deviceId || "Not provided"
    );
    console.log(
      "📱 [DEVICE] Fingerprint:",
      deviceInfo.deviceFingerprint || "Not provided"
    );
    console.log("📱 [DEVICE] User Agent:", deviceInfo.userAgent || "Unknown");
    console.log("📱 [DEVICE] Platform:", deviceInfo.platform || "Unknown");
    console.log("📱 [DEVICE] Language:", deviceInfo.language || "Unknown");
    console.log(
      "📱 [DEVICE] Hardware Concurrency:",
      deviceInfo.hardwareConcurrency || "Unknown"
    );

    // Extract app name for logging
    console.log("📱 [APP] App Name:", req.body.appName || "❌ NOT PROVIDED");

    // Log location data
    console.log("📍 [LOCATION] Lat:", req.body.lat || "Not provided");
    console.log("📍 [LOCATION] Lng:", req.body.lng || "Not provided");
    console.log("📍 [LOCATION] Accuracy:", req.body.accuracy || "Not provided");
    console.log("📍 [LOCATION] User ID:", req.body.userId || "Not provided");
    console.log(
      "📍 [LOCATION] Timestamp:",
      req.body.timestamp || "Not provided"
    );

    const networkInfo = getNetworkInfo(req);
    console.log(
      "🟡 [LOCATION] Network info:",
      JSON.stringify(networkInfo, null, 2)
    );

    const locationData = {
      ...req.body,
      network: networkInfo,
      receivedAt: networkInfo.serverReceivedAt,
    };

    console.log(
      "🟡 [LOCATION] Final data being saved to DB:",
      JSON.stringify(locationData, null, 2)
    );

    const location = new Location(locationData);
    await location.save();

    console.log("✅ [LOCATION] Successfully saved to database");
    res.status(201).json({ message: "Location received", success: true });
  } catch (err) {
    console.error("❌ [LOCATION] Error:", err.message);
    console.error("❌ [LOCATION] Full error:", err);
    res
      .status(500)
      .json({ message: "Error saving location", error: err.message });
  }
});

// Geofence alert endpoint
app.post("/api/geofence-alert", async (req, res) => {
  try {
    console.log("🔴 [GEOFENCE ALERT] === INCOMING REQUEST ===");
    console.log(
      "🔴 [GEOFENCE ALERT] Headers:",
      JSON.stringify(req.headers, null, 2)
    );
    console.log(
      "🔴 [GEOFENCE ALERT] Body received from UI:",
      JSON.stringify(req.body, null, 2)
    );

    // Extract app name for logging
    console.log("📱 [APP] App Name:", req.body.appName || "❌ NOT PROVIDED");

    const networkInfo = getNetworkInfo(req);
    console.log(
      "🔴 [GEOFENCE ALERT] Network info:",
      JSON.stringify(networkInfo, null, 2)
    );

    const alertData = {
      ...req.body,
      network: networkInfo,
      receivedAt: networkInfo.serverReceivedAt,
    };

    console.log(
      "🔴 [GEOFENCE ALERT] Final data being saved to DB:",
      JSON.stringify(alertData, null, 2)
    );

    const alert = new GeofenceAlert(alertData);
    await alert.save();

    console.log("✅ [GEOFENCE ALERT] Successfully saved to database");
    res.status(201).json({ message: "Geofence alert received", success: true });
  } catch (err) {
    console.error("❌ [GEOFENCE ALERT] Error:", err.message);
    console.error("❌ [GEOFENCE ALERT] Full error:", err);
    res
      .status(500)
      .json({ message: "Error saving geofence alert", error: err.message });
  }
});

// Digital Experience Feedback endpoint (NEW)
app.post("/api/digital-feedback", async (req, res) => {
  try {
    console.log("🟢 [DIGITAL-FEEDBACK] === INCOMING REQUEST ===");
    console.log(
      "🟢 [DIGITAL-FEEDBACK] Headers:",
      JSON.stringify(req.headers, null, 2)
    );
    console.log(
      "🟢 [DIGITAL-FEEDBACK] Body received from UI:",
      JSON.stringify(req.body, null, 2)
    );

    // Extract device info for logging
    const deviceInfo = req.body.device || {};
    console.log(
      "📱 [DEVICE] Device ID:",
      deviceInfo.deviceId || "❌ NOT PROVIDED"
    );
    console.log(
      "📱 [DEVICE] Fingerprint:",
      deviceInfo.deviceFingerprint || "❌ NOT PROVIDED"
    );
    console.log("📱 [DEVICE] Platform:", deviceInfo.platform || "Unknown");
    console.log("📱 [DEVICE] User Agent:", deviceInfo.userAgent || "Unknown");

    // Extract app name for logging
    console.log("📱 [APP] App Name:", req.body.appName || "❌ NOT PROVIDED");

    // Extract and log digital feedback content
    const digitalFeedbackContent =
      req.body.propertyFeedback || req.body.digitalFeedback || {};
    console.log(
      "💻 [DIGITAL-FEEDBACK] Content:",
      JSON.stringify(digitalFeedbackContent, null, 2)
    );
    console.log(
      "💻 [DIGITAL-FEEDBACK] Website/CRM Improvements:",
      digitalFeedbackContent.websiteCrmImprovements || "Not provided"
    );
    console.log(
      "💻 [DIGITAL-FEEDBACK] Likes/Dislikes:",
      digitalFeedbackContent.likesDislikesDigital || "Not provided"
    );
    console.log(
      "💻 [DIGITAL-FEEDBACK] Overall Experience:",
      digitalFeedbackContent.overallExperience || "Not provided"
    );

    const networkInfo = getNetworkInfo(req);
    console.log(
      "🟢 [DIGITAL-FEEDBACK] Network info:",
      JSON.stringify(networkInfo, null, 2)
    );

    // Map the data to match our new schema
    const digitalFeedbackData = {
      timestamp: req.body.timestamp,
      sessionId: req.body.sessionId,
      digitalFeedback: {
        websiteCrmImprovements: digitalFeedbackContent.websiteCrmImprovements,
        likesDislikesDigital: digitalFeedbackContent.likesDislikesDigital,
        overallExperience: digitalFeedbackContent.overallExperience,
        priorityImprovements: digitalFeedbackContent.priorityImprovements,
        additionalComments: digitalFeedbackContent.additionalComments,
      },
      contact: req.body.contact,
      location: req.body.location,
      device: req.body.device,
      network: networkInfo,
      system: req.body.system,
      receivedAt: networkInfo.serverReceivedAt,
      appName: req.body.appName,
    };

    console.log(
      "🟢 [DIGITAL-FEEDBACK] Final data being saved to DB:",
      JSON.stringify(digitalFeedbackData, null, 2)
    );

    const digitalFeedback = new DigitalFeedback(digitalFeedbackData);
    await digitalFeedback.save();

    console.log("✅ [DIGITAL-FEEDBACK] Successfully saved to database");
    res
      .status(201)
      .json({ message: "Digital feedback received", success: true });
  } catch (err) {
    console.error("❌ [DIGITAL-FEEDBACK] Error:", err.message);
    console.error("❌ [DIGITAL-FEEDBACK] Full error:", err);
    res
      .status(500)
      .json({ message: "Error saving digital feedback", error: err.message });
  }
});

// Create a new geofence
app.post("/api/geofence", async (req, res) => {
  try {
    const { name, lat, lng, radius, activeFrom, activeTo } = req.body;
    const geofence = new Geofence({
      name,
      lat,
      lng,
      radius,
      activeFrom: new Date(activeFrom),
      activeTo: new Date(activeTo),
    });
    await geofence.save();
    res.status(201).json({ message: "Geofence created", geofence });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating geofence", error: err.message });
  }
});

// Get all geofences
app.get("/api/geofence", async (req, res) => {
  try {
    const geofences = await Geofence.find();
    res.json(geofences);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching geofences", error: err.message });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ receivedAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching feedbacks", error: err.message });
  }
});

// NEW: Debug endpoint to show device data structure
app.get("/api/debug/device-data", async (req, res) => {
  try {
    // Get latest feedback with device info
    const latestFeedback = await Feedback.findOne().sort({ receivedAt: -1 });
    const latestLocation = await Location.findOne().sort({ receivedAt: -1 });
    const latestAlert = await GeofenceAlert.findOne().sort({ receivedAt: -1 });

    res.json({
      message: "Latest device data from all tables",
      feedback: {
        exists: !!latestFeedback,
        device: latestFeedback?.device || "No device data",
        network: latestFeedback?.network || "No network data",
        timestamp: latestFeedback?.receivedAt || "No timestamp",
      },
      location: {
        exists: !!latestLocation,
        device: latestLocation?.device || "No device data",
        network: latestLocation?.network || "No network data",
        timestamp: latestLocation?.receivedAt || "No timestamp",
      },
      geofenceAlert: {
        exists: !!latestAlert,
        device: latestAlert?.device || "No device data",
        network: latestAlert?.network || "No network data",
        timestamp: latestAlert?.receivedAt || "No timestamp",
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching device data",
      error: err.message,
    });
  }
});

// Get all locations (for admin/testing)
app.get("/api/location", async (req, res) => {
  try {
    const locations = await Location.find().sort({ receivedAt: -1 });
    res.json(locations);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching locations", error: err.message });
  }
});

// Get all geofence alerts (for admin/testing)
app.get("/api/geofence-alert", async (req, res) => {
  try {
    const alerts = await GeofenceAlert.find().sort({ receivedAt: -1 });
    res.json(alerts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching geofence alerts", error: err.message });
  }
});

// Get all digital feedback entries (for admin/testing)
app.get("/api/digital-feedback", async (req, res) => {
  try {
    const digitalFeedbacks = await DigitalFeedback.find().sort({
      receivedAt: -1,
    });
    res.json(digitalFeedbacks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching digital feedback", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Property Feedback server running on port ${PORT}`);
});
