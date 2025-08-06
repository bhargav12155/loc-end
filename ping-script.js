// ping-script.js
// Keeps your Render app awake by pinging it every 5 minutes
const https = require("https");

const RENDER_URL = "https://loc-end.onrender.com"; // <-- Replace with your actual Render URL

function pingService() {
  console.log("Pinging service at: " + new Date().toISOString());
  https
    .get(RENDER_URL, (res) => {
      console.log("Response status:", res.statusCode);
    })
    .on("error", (err) => {
      console.error("Error pinging service:", err.message);
    });
}

// Ping every 5 minutes (300000 ms)
setInterval(pingService, 300000);
pingService(); // Initial ping
