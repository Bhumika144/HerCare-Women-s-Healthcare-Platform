import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/Resources.css";

// Fix marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function Resources() {
  const [position, setPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState("hospital");

  // Get User Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
      },
      () => alert("Please enable location access.")
    );
  }, []);

  // Fetch Nearby Places
  useEffect(() => {
    if (!position) return;

    const [lat, lon] = position;

    let queryType = "";
    if (filter === "hospital")
      queryType = '["amenity"="hospital"]';
    if (filter === "gynecologist")
      queryType = '["healthcare:speciality"="gynaecology"]';
    if (filter === "mental")
      queryType = '["healthcare"="psychiatrist"]';

    const query = `
      [out:json];
      (
        node${queryType}(around:5000,${lat},${lon});
        way${queryType}(around:5000,${lat},${lon});
        relation${queryType}(around:5000,${lat},${lon});
      );
      out center;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data.elements || []);
      })
      .catch((err) => console.error(err));
  }, [filter, position]);

  return (
    <div className="resources-page">
      <h2 className="resources-title">Nearby Medical Support</h2>

      {/* Emergency */}
      <div className="emergency-section">
        <h3>🚨 Emergency Helplines</h3>
        <div className="helpline-grid">
          <a href="tel:112" className="helpline-card">112 – Emergency</a>
          <a href="tel:181" className="helpline-card">181 – Women Helpline</a>
          <a href="tel:1091" className="helpline-card">1091 – Women Police</a>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <button onClick={() => setFilter("hospital")} className={filter === "hospital" ? "active" : ""}>
          Hospitals
        </button>
        <button onClick={() => setFilter("gynecologist")} className={filter === "gynecologist" ? "active" : ""}>
          Gynecologist
        </button>
        <button onClick={() => setFilter("mental")} className={filter === "mental" ? "active" : ""}>
          Mental Health
        </button>
      </div>

      {/* Map */}
      {position && (
        <div className="map-container">
          <MapContainer center={position} zoom={13}>
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Marker */}
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Nearby Places */}
            {places.map((place, index) => {
              const lat = place.lat || place.center?.lat;
              const lon = place.lon || place.center?.lon;

              if (!lat || !lon) return null;

              return (
                <Marker key={index} position={[lat, lon]}>
                  <Popup>
                    <strong>{place.tags?.name || "Medical Center"}</strong>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
    </div>
  );
}