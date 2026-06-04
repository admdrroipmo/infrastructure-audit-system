"use client";
import { useState, useEffect } from "react";
import { Database, MapPin, Activity, Building2 } from "lucide-react";

export default function StatsCounter() {
  const [stats, setStats] = useState({
    buildings: 0,
    regions: 0,
    compliance: 0,
    risk: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        buildings: 15234,
        regions: 17,
        compliance: 87.3,
        risk: 342,
      });
    }, 500);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <div className="glass-card p-4 text-center">
        <Database className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <div className="text-2xl font-bold">
          {stats.buildings.toLocaleString()}
        </div>
        <div className="text-xs text-slate-500">Buildings Audited</div>
      </div>
      <div className="glass-card p-4 text-center">
        <MapPin className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
        <div className="text-2xl font-bold">{stats.regions}/17</div>
        <div className="text-xs text-slate-500">Regions Covered</div>
      </div>
      <div className="glass-card p-4 text-center">
        <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <div className="text-2xl font-bold">{stats.compliance}%</div>
        <div className="text-xs text-slate-500">Compliance Rate</div>
      </div>
      <div className="glass-card p-4 text-center">
        <Building2 className="w-6 h-6 text-red-600 mx-auto mb-2" />
        <div className="text-2xl font-bold">{stats.risk}</div>
        <div className="text-xs text-slate-500">High-Risk Identified</div>
      </div>
    </div>
  );
}
