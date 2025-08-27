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
    deviceId: String, // NEW: Unique device identifier
    deviceFingerprint: String, // NEW: Device fingerprint hash
    deviceType: String, // iPhone, Android, Windows, Mac, etc.
    os: String, // Operating system version
    browser: String, // Browser version
    userAgent: String, // Full user agent string
    platform: String, // Platform info
    language: String, // Browser language
    languages: [String], // All supported languages
    screen: {
      width: Number,
      height: Number,
      availWidth: Number,
      availHeight: Number,
      colorDepth: Number,
      pixelDepth: Number,
    },
    viewport: {
      width: Number,
      height: Number,
    },
    timezone: String,
    timezoneOffset: Number,
    online: Boolean,
    cookiesEnabled: Boolean,
    touchSupport: Boolean,
    maxTouchPoints: Number,
    hardwareConcurrency: Number,
    deviceMemory: Number,
    connection: mongoose.Schema.Types.Mixed, // Network connection info
    storage: mongoose.Schema.Types.Mixed, // Storage capabilities
    plugins: [String], // Browser plugins
    webgl: mongoose.Schema.Types.Mixed, // WebGL info
    capabilities: mongoose.Schema.Types.Mixed, // Legacy field
  },

  // Network details
  network: mongoose.Schema.Types.Mixed,

  // System metadata
  system: mongoose.Schema.Types.Mixed,
  receivedAt: String,

  // Application metadata
  appName: String,
});

export const Feedback = mongoose.model("Feedback", FeedbackSchema);

// Location Schema
const LocationSchema = new mongoose.Schema({
  userId: String,
  lat: Number,
  lng: Number,
  accuracy: Number,
  timestamp: String,
  device: {
    deviceId: String, // NEW: Device identifier for location tracking
    deviceFingerprint: String, // NEW: Device fingerprint
    userAgent: String,
    platform: String,
    timezone: String,
    hardwareConcurrency: Number,
    deviceMemory: Number,
    touchSupport: Boolean,
    // Store full device info as mixed for flexibility
    fullDeviceInfo: mongoose.Schema.Types.Mixed,
  },
  network: mongoose.Schema.Types.Mixed,
  receivedAt: String,

  // Application metadata
  appName: String,
});

export const Location = mongoose.model("Location", LocationSchema);

// Geofence Alert Schema
const GeofenceAlertSchema = new mongoose.Schema({
  userId: String,
  geofenceId: String,
  geofenceName: String,
  action: String, // ENTER or EXIT
  lat: Number,
  lng: Number,
  distance: Number,
  timestamp: String,
  device: {
    deviceId: String, // NEW: Device identifier for geofence tracking
    deviceFingerprint: String, // NEW: Device fingerprint
    userAgent: String,
    platform: String,
    timezone: String,
    // Store full device info as mixed for flexibility
    fullDeviceInfo: mongoose.Schema.Types.Mixed,
  },
  network: mongoose.Schema.Types.Mixed,
  receivedAt: String,

  // Application metadata
  appName: String,
});

export const GeofenceAlert = mongoose.model(
  "GeofenceAlert",
  GeofenceAlertSchema
);

// Digital Experience Feedback Schema (NEW)
const DigitalFeedbackSchema = new mongoose.Schema({
  timestamp: String,
  sessionId: String,

  // Digital experience feedback content
  digitalFeedback: {
    websiteCrmImprovements: String,
    likesDislikesDigital: String,
    overallExperience: String,
    priorityImprovements: String,
    additionalComments: String,
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

  // Device information (same structure as other schemas)
  device: {
    deviceId: String,
    deviceFingerprint: String,
    deviceType: String,
    os: String,
    browser: String,
    userAgent: String,
    platform: String,
    language: String,
    languages: [String],
    screen: {
      width: Number,
      height: Number,
      availWidth: Number,
      availHeight: Number,
      colorDepth: Number,
      pixelDepth: Number,
    },
    viewport: {
      width: Number,
      height: Number,
    },
    timezone: String,
    timezoneOffset: Number,
    online: Boolean,
    cookiesEnabled: Boolean,
    touchSupport: Boolean,
    maxTouchPoints: Number,
    hardwareConcurrency: Number,
    deviceMemory: Number,
    connection: mongoose.Schema.Types.Mixed,
    storage: mongoose.Schema.Types.Mixed,
    plugins: [String],
    webgl: mongoose.Schema.Types.Mixed,
  },

  // Network details
  network: mongoose.Schema.Types.Mixed,

  // System metadata
  system: mongoose.Schema.Types.Mixed,
  receivedAt: String,

  // Application metadata
  appName: String,
});

export const DigitalFeedback = mongoose.model(
  "DigitalFeedback",
  DigitalFeedbackSchema
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
