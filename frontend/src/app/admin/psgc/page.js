"use client";
import { useState, useEffect } from "react";

export default function PsgcPage() {
  const [psgcLocations, setPsgcLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/admin/psgc")
      .then((res) => res.json())
      .then(setPsgcLocations)
      .catch(console.error);
  }, []);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">PSGC Hierarchy</h1>
      <div className="glass-card p-6">
        <ul className="space-y-2">
          {psgcLocations.map((loc) => (
            <li key={loc.id}>
              {loc.psgcCode} - {loc.name} ({loc.type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
