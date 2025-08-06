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

// Allow all origins
app.use(cors());
app.options("*", cors()); // Enable pre-flight for all routes

app.use(express.json());

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
    const networkInfo = getNetworkInfo(req);
    const feedback = new Feedback({
      ...req.body,
      network: networkInfo,
      receivedAt: networkInfo.serverReceivedAt,
    });
    await feedback.save();
    res.status(201).json({ message: "Feedback received", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving feedback", error: err.message });
  }
});

// Location endpoint
app.post("/api/location", async (req, res) => {
  try {
    const networkInfo = getNetworkInfo(req);
    // Log IP and network info for debugging
    console.log("[LOCATION] IP:", networkInfo.ip);
    console.log("[LOCATION] Network Info:", networkInfo);
    const location = new Location({
      ...req.body,
      network: networkInfo,
      receivedAt: networkInfo.serverReceivedAt,
    });
    await location.save();
    res.status(201).json({ message: "Location received", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving location", error: err.message });
  }
});

// Geofence alert endpoint
app.post("/api/geofence-alert", async (req, res) => {
  try {
    const networkInfo = getNetworkInfo(req);
    // Log IP and network info for debugging
    console.log("[GEOFENCE ALERT] IP:", networkInfo.ip);
    console.log("[GEOFENCE ALERT] Network Info:", networkInfo);
    const alert = new GeofenceAlert({
      ...req.body,
      network: networkInfo,
      receivedAt: networkInfo.serverReceivedAt,
    });
    await alert.save();
    res.status(201).json({ message: "Geofence alert received", success: true });
  } catch (err) {
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
