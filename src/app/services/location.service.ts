import { Injectable } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Geofence } from "@ionic-native/geofence/ngx";
import { Platform } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  private currentLocation = new BehaviorSubject<any>(null);
  private geofenceRegion = {
    id: "geofence1",
    latitude: 37.7749, // Example latitude
    longitude: -122.4194, // Example longitude
    radius: 100, // Radius in meters
    transitionType: 3, // 1: Enter, 2: Exit, 3: Both
  };

  constructor(
    private geolocation: Geolocation,
    private geofence: Geofence,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.initializeGeofence();
      this.trackLocation();
    });
  }

  private initializeGeofence() {
    this.geofence
      .addOrUpdate(this.geofenceRegion)
      .then(() => {
        console.log("Geofence added");
      })
      .catch((error) => {
        console.error("Error adding geofence", error);
      });

    this.geofence.onTransition(this.geofenceRegion.id).subscribe((data) => {
      console.log("Geofence transition detected", data);
      // Log activity based on geofence transition
    });
  }

  private trackLocation() {
    this.geolocation
      .watchPosition({ enableHighAccuracy: true })
      .subscribe((position) => {
        if (position && position.coords) {
          this.currentLocation.next(position.coords);
          console.log("Current location:", position.coords);
        }
      });
  }

  getCurrentLocation() {
    return this.currentLocation.asObservable();
  }

  // Get current location immediately (one-time request)
  async getCurrentLocationOnce() {
    try {
      const position = await this.geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      if (position && position.coords) {
        this.currentLocation.next(position.coords);
        return position.coords;
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      // Fallback to browser geolocation API
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              };
              this.currentLocation.next(coords);
              resolve(coords);
            },
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          );
        } else {
          reject(new Error("Geolocation is not supported"));
        }
      });
    }
  }
}
