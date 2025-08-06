import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://bhargav12155:Mydatabase%4001@cluster0.ehhoqo6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export function connectDB() {
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  timestamp: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  sessionId: String,
  feedback: {
    impressions: String,
    liked_most: String,
    liked_least: String,
    price_thoughts: String,
    potential_buyers: String,
  },
  contact: {
    name: String,
    email: String,
    phone: String,
  },
  device: mongoose.Schema.Types.Mixed,
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
  receivedAt: String,
});

export const GeofenceAlert = mongoose.model(
  "GeofenceAlert",
  GeofenceAlertSchema
);
