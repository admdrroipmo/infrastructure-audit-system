"use client";
import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 10);
    }
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onLocationSelect, setMarkerPosition }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      // Immediately send coordinates
      onLocationSelect({
        lat,
        lng,
        fullLocation: "",
        region: "",
        province: "",
        city: "",
        lgu: "",
      });
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`,
        );
        const data = await response.json();
        const address = data.address || {};
        console.log("Address object:", address);

        const fullLocation = data.display_name || "";
        const region = address.state || address.region || "";
        const province =
          address.province || address.state || address.state_district || "";
        const city =
          address.city ||
          address.town ||
          address.municipality ||
          address.village ||
          "";
        const lgu =
          address.county ||
          address.suburb ||
          address.city ||
          address.town ||
          address.municipality ||
          "";

        onLocationSelect({
          lat,
          lng,
          fullLocation,
          region,
          province,
          city,
          lgu,
        });
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    },
  });
  return null;
}

export default function AuditMap({ onLocationSelect, initialLocation = null }) {
  const [position, setPosition] = useState(
    initialLocation
      ? [initialLocation.lat, initialLocation.lng]
      : [14.5995, 120.9842],
  );
  const [zoom, setZoom] = useState(initialLocation ? 12 : 6);
  const [markerPosition, setMarkerPosition] = useState(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null,
  );
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (initialLocation) {
      setPosition([initialLocation.lat, initialLocation.lng]);
      setZoom(12);
      setMarkerPosition([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&limit=1&accept-language=en`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setPosition([lat, lng]);
        setZoom(12);
        setMarkerPosition([lat, lng]);

        const address = result.address || {};
        console.log("Search address object:", address);

        const fullLocation = result.display_name || "";
        const region = address.state || address.region || "";
        const province = address.province || address.state_district || "";
        const city =
          address.city ||
          address.town ||
          address.municipality ||
          address.village ||
          "";
        const lgu =
          address.county ||
          address.suburb ||
          address.city ||
          address.town ||
          address.municipality ||
          "";

        onLocationSelect({
          lat,
          lng,
          fullLocation,
          region,
          province,
          city,
          lgu,
        });
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching location. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          ref={searchInputRef}
          type="text"
          className="input-field flex-1"
          placeholder="Type a location (e.g., 'Manila', 'Cebu', 'Davao')"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button type="button" onClick={handleSearch} className="btn-primary">
          Search
        </button>
        <button
          type="button"
          onClick={() => {
            setMarkerPosition(null);
            setSearchText("");
            onLocationSelect({
              lat: null,
              lng: null,
              fullLocation: "",
              region: "",
              province: "",
              city: "",
              lgu: "",
            });
          }}
          className="btn-secondary"
        >
          Clear
        </button>
      </div>

      <div className="h-64 w-full rounded-lg overflow-hidden border border-slate-200 shadow-sm">
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPosition && (
            <Marker position={markerPosition} draggable={true}>
              <Popup>
                <strong>Selected Location</strong>
                <br />
                You can drag this marker to fine-tune.
              </Popup>
            </Marker>
          )}
          <MapClickHandler
            onLocationSelect={onLocationSelect}
            setMarkerPosition={setMarkerPosition}
          />
          <ChangeView center={position} zoom={zoom} />
        </MapContainer>
      </div>

      <p className="text-sm text-slate-500">
        Click on the map, or type a location above to search. You can also drag
        the marker to adjust.
      </p>
    </div>
  );
}
