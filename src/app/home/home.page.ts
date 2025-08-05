import { Component, OnInit, AfterViewInit } from "@angular/core";
import { LocationService } from "../services/location.service";

declare var L: any; // Leaflet library

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit, AfterViewInit {
  userLocation: { latitude: number; longitude: number } | null = null;
  map: any;
  userMarker: any;
  geofenceCircle: any;
  activityLog: string[] = [];

  geofence: { lat: number; lng: number; radius: number } = {
    lat: 0,
    lng: 0,
    radius: 100, // default radius in meters
  };

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.trackUserLocation();
    this.getCurrentLocationImmediately();
  }

  async getCurrentLocationImmediately() {
    try {
      const location = await this.locationService.getCurrentLocationOnce();
      if (location && location.latitude && location.longitude) {
        this.userLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
        };

        // Center map on user location if map is initialized
        if (this.map) {
          this.centerMapOnUser();
        }

        this.logActivity("Initial location acquired");
      }
    } catch (error) {
      console.error("Error getting initial location:", error);
      this.logActivity(
        "Unable to get location. Please enable location services."
      );
    }
  }

  ngAfterViewInit() {
    // Wait a bit for the view to be ready, then initialize map
    setTimeout(() => {
      this.initializeMap();
    }, 500);
  }

  initializeMap() {
    // Default center (will be updated when user location is available)
    const defaultLat = 37.7749;
    const defaultLng = -122.4194;

    // Initialize map
    this.map = L.map("map").setView([defaultLat, defaultLng], 13);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map);

    // If user location is already available, center the map on it
    if (this.userLocation) {
      this.centerMapOnUser();
    }
  }

  trackUserLocation() {
    this.locationService.getCurrentLocation().subscribe((location) => {
      if (location && location.latitude && location.longitude) {
        this.userLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
        };

        // Center map on user location if map is initialized
        if (this.map) {
          this.centerMapOnUser();
        }

        this.checkGeofence({
          lat: location.latitude,
          lng: location.longitude,
        });
      }
    });
  }

  centerMapOnUser() {
    if (this.userLocation && this.map) {
      const { latitude, longitude } = this.userLocation;

      // Center map on user location
      this.map.setView([latitude, longitude], 15);

      // Remove existing user marker if it exists
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      // Add new user marker
      this.userMarker = L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup("Your Current Location")
        .openPopup();

      this.logActivity(
        `Location updated: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      );
    }
  }

  setGeofenceAtCurrentLocation() {
    if (this.userLocation) {
      this.geofence.lat = this.userLocation.latitude;
      this.geofence.lng = this.userLocation.longitude;

      // Remove existing geofence circle if it exists
      if (this.geofenceCircle) {
        this.map.removeLayer(this.geofenceCircle);
      }

      // Add new geofence circle
      this.geofenceCircle = L.circle([this.geofence.lat, this.geofence.lng], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.3,
        radius: this.geofence.radius,
      }).addTo(this.map);

      this.logActivity(
        `Geofence set at current location with ${this.geofence.radius}m radius`
      );
    }
  }

  clearGeofence() {
    if (this.geofenceCircle) {
      this.map.removeLayer(this.geofenceCircle);
      this.geofenceCircle = null;
      this.logActivity("Geofence cleared");
    }
  }

  checkGeofence(location: { lat: number; lng: number }) {
    if (this.geofence.lat !== 0 && this.geofence.lng !== 0) {
      const distance = this.calculateDistance(location, this.geofence);
      if (distance <= this.geofence.radius) {
        this.logActivity("User entered geofence area");
      } else {
        this.logActivity("User is outside geofence area");
      }
    }
  }

  calculateDistance(
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ) {
    const R = 6371e3; // meters
    const φ1 = (loc1.lat * Math.PI) / 180;
    const φ2 = (loc2.lat * Math.PI) / 180;
    const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  }

  private logActivity(activity: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.activityLog.unshift(`[${timestamp}] ${activity}`);

    // Keep only last 10 activities
    if (this.activityLog.length > 10) {
      this.activityLog = this.activityLog.slice(0, 10);
    }
  }
}
