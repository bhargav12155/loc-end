// ping-script.js
// Keeps your Render app awake by pinging it every 14 minutes
const https = require("https");

const RENDER_URL = "https://property-feedback.onrender.com"; // <-- Replace with your actual Render URL

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

// Ping every 14 minutes (840000 ms)
setInterval(pingService, 840000);
pingService(); // Initial ping
