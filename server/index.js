import express from "express";
import cors from "cors";
import { getNetworkInfo } from "./networkUtils.js";
import {
  connectDB,
  Feedback,
  Location,
  GeofenceAlert,
  Geofence,
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Allow all origins for maximum compatibility
app.use(cors());
app.options("*", cors()); // Enable pre-flight for all routes

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

// Feedback endpoint
app.post("/api/feedback", async (req, res) => {
  try {
    console.log("🔵 [FEEDBACK] === INCOMING REQUEST ===");
    console.log("🔵 [FEEDBACK] Headers:", JSON.stringify(req.headers, null, 2));
    console.log(
      "🔵 [FEEDBACK] Body received from UI:",
      JSON.stringify(req.body, null, 2)
    );

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

app.listen(PORT, () => {
  console.log(`Property Feedback server running on port ${PORT}`);
});
