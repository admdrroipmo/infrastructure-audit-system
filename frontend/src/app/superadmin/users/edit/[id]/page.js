"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditUserPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    psgcId: "",
    accessLevel: "ENCODER",
    userType: "",
    locationType: "",
  });
  const [psgcLocations, setPsgcLocations] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchPsgcLocations();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/users/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch user: ${res.status}`);
      }
      const data = await res.json();
      console.log("User data fetched:", data); // ← Check the console
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        psgcId: data.psgcId || "",
        accessLevel: data.accessLevel || "ENCODER",
        userType: data.userType || "",
        locationType: data.locationType || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  const fetchPsgcLocations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/admin/psgc");
      const data = await res.json();
      setPsgcLocations(data);
    } catch (error) {
      console.error("Error fetching PSGC locations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/admin/users/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (res.ok) {
        router.push("/superadmin/users");
      } else {
        const error = await res.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-4">
        <Link
          href="/superadmin/users"
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to User Management
        </Link>
      </div>

      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Edit User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              PSGC Location
            </label>
            <select
              className="input-field"
              value={formData.psgcId}
              onChange={(e) =>
                setFormData({ ...formData, psgcId: e.target.value })
              }
              required
            >
              <option value="">Select PSGC Location</option>
              {psgcLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.psgcCode} - {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Access Level
            </label>
            <select
              className="input-field"
              value={formData.accessLevel}
              onChange={(e) =>
                setFormData({ ...formData, accessLevel: e.target.value })
              }
              required
            >
              <option value="ENCODER">Encoder</option>
              <option value="ADMIN">Admin</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              User Type
            </label>
            <select
              className="input-field"
              value={formData.userType}
              onChange={(e) =>
                setFormData({ ...formData, userType: e.target.value })
              }
              required
            >
              <option value="">Select User Type</option>
              <option value="LIAT">LIAT (Region)</option>
              <option value="LILHUB">LILhub (Local)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location Type
            </label>
            <select
              className="input-field"
              value={formData.locationType}
              onChange={(e) =>
                setFormData({ ...formData, locationType: e.target.value })
              }
              required
            >
              <option value="">Select Location Type</option>
              <option value="REGION">Region</option>
              <option value="PROVINCE">Province / HUC</option>
              <option value="CITY">City</option>
              <option value="MUNICIPALITY">Municipality</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              Update User
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={() => router.push("/superadmin/users")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
