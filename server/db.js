import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://bhargav12155:Mydatabase%4001@cluster0.ehhoqo6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export function connectDB() {
  return mongoose.connect(MONGO_URI);
}

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  timestamp: String,
  sessionId: String,

  // Primary feedback content (matches frontend propertyFeedback structure)
  propertyFeedback: {
    overall: String,
    positives: String,
    negatives: String,
    priceOpinion: String,
    referralPotential: String,
  },

  // Lead information
  contact: {
    name: String,
    email: String,
    phone: String,
  },

  // Location data
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    country: String,
    timezone: String,
    area: String,
  },

  // Device information
  device: {
    deviceType: String, // Renamed from 'type' to avoid MongoDB conflicts
    os: String,
    browser: String,
    screen: {
      width: Number,
      height: Number,
      colorDepth: Number,
    },
    capabilities: mongoose.Schema.Types.Mixed,
  },

  // Network details
  network: mongoose.Schema.Types.Mixed,

  // System metadata
  system: mongoose.Schema.Types.Mixed,
  receivedAt: String,
});

export const Feedback = mongoose.model("Feedback", FeedbackSchema);

// Location Schema
const LocationSchema = new mongoose.Schema({
  userId: String,
  lat: Number,
  lng: Number,
  accuracy: Number,
  timestamp: String,
  device: mongoose.Schema.Types.Mixed,
  network: mongoose.Schema.Types.Mixed, // <-- Add network info field
  receivedAt: String,
});

export const Location = mongoose.model("Location", LocationSchema);

// Geofence Alert Schema
const GeofenceAlertSchema = new mongoose.Schema({
  userId: String,
  geofenceId: String,
  geofenceName: String,
  action: String,
  lat: Number,
  lng: Number,
  distance: Number,
  timestamp: String,
  device: mongoose.Schema.Types.Mixed,
  network: mongoose.Schema.Types.Mixed, // <-- Add network info field
  receivedAt: String,
});

export const GeofenceAlert = mongoose.model(
  "GeofenceAlert",
  GeofenceAlertSchema
);

// Geofence Schema
const GeofenceSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  radius: Number,
  activeFrom: Date,
  activeTo: Date,
});

export const Geofence = mongoose.model("Geofence", GeofenceSchema);
