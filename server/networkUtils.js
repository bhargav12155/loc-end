import geoip from "geoip-lite";
import requestIp from "request-ip";

export function getNetworkInfo(req) {
  // Get IP address
  const ip = requestIp.getClientIp(req);
  // Get GeoIP info
  const geo = geoip.lookup(ip) || {};
  return {
    ip,
    geo,
    headers: req.headers,
    serverReceivedAt: new Date().toISOString(),
  };
}
