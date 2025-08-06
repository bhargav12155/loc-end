// Service Worker for Location Tracker PWA
const CACHE_NAME = "geofence-tracker-v1.0.0";
const urlsToCache = [
  "./",
  "./geofence-tracker.html",
  "./manifest.json",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js",
  "https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css",
  "https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js",
];

// Install event - cache resources
self.addEventListener("install", function (event) {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      const promises = urlsToCache.map(function (url) {
        return cache.add(url).catch(function (error) {
          console.error(`Failed to cache ${url}:`, error);
        });
      });
      return Promise.all(promises);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", function (event) {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Background sync for offline location updates
self.addEventListener("sync", function (event) {
  if (event.tag === "location-sync") {
    console.log("Background sync: location-sync");
    event.waitUntil(syncLocationData());
  }
});

// Handle push notifications for geofence alerts
self.addEventListener("push", function (event) {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: "/manifest-icon-192.png",
      badge: "/manifest-icon-96.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
      actions: [
        {
          action: "explore",
          title: "View Details",
          icon: "/images/checkmark.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/images/xmark.png",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification("Geofence Alert", options)
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "explore") {
    // Open the app
    event.waitUntil(clients.openWindow("/"));
  } else if (event.action === "close") {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Sync location data when back online
async function syncLocationData() {
  try {
    // Get stored location data from IndexedDB or localStorage
    const storedData = JSON.parse(
      localStorage.getItem("pendingLocationData") || "[]"
    );

    if (storedData.length > 0) {
      // Try to send each stored location update
      for (const data of storedData) {
        try {
          const response = await fetch(data.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data.payload),
          });

          if (response.ok) {
            console.log("Synced location data:", data);
          }
        } catch (err) {
          console.log("Failed to sync individual location data:", err);
        }
      }

      // Clear the stored data after attempting to sync
      localStorage.removeItem("pendingLocationData");
    }
  } catch (error) {
    console.error("Error syncing location data:", error);
  }
}
