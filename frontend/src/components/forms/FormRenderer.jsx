"use client";
import { useState, useEffect } from "react";
import AuditMap from "../map/AuditMap";

export default function FormRenderer({ formType }) {
  const [elements, setElements] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchElements();
  }, [formType]);

  const fetchElements = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/formBuilder/fields/${formType}`,
      );
      const data = await res.json();
      console.log("🔍 Fetched elements:", data);
      setElements(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching form elements:", error);
      setLoading(false);
    }
  };

  const handleChange = (fieldKey, value) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to submit.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/form1/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData, userId: user.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit form.");
      }

      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.message);
    }
  };

  // ─── Auto-zoom to user's assigned location ──────────────────────
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.userType === "LILHUB" && storedUser.psgcId) {
      fetch(`http://localhost:5000/api/v1/psgc/location/${storedUser.psgcId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            // Set region, province, city based on the user's location type
            if (data.type === "REGION") {
              handleChange("region", data.name);
            } else if (data.type === "PROVINCE" || data.type === "HUC") {
              handleChange("province", data.name);
              if (data.parent) {
                handleChange("region", data.parent.name);
              }
            } else if (data.type === "CITY" || data.type === "MUNICIPALITY") {
              handleChange("city", data.name);
              if (data.parent) {
                handleChange("province", data.parent.name);
                if (data.parent.parent) {
                  handleChange("region", data.parent.parent.name);
                }
              }
            }
          }
        })
        .catch(console.error);
    }
  }, []);

  const renderField = (element) => {
    // ─── Skip Location Package (handled in renderElement) ──────────
    if (element.elementType === "LOCATION_PACKAGE") return null;

    switch (element.fieldType) {
      case "TEXT":
        return (
          <input
            type="text"
            className="input-field"
            value={formData[element.fieldKey] || ""}
            onChange={(e) => handleChange(element.fieldKey, e.target.value)}
            required={element.validation?.required}
          />
        );
      case "NUMBER":
        return (
          <input
            type="number"
            className="input-field"
            value={formData[element.fieldKey] || ""}
            onChange={(e) =>
              handleChange(element.fieldKey, parseFloat(e.target.value))
            }
            required={element.validation?.required}
          />
        );
      case "SELECT":
        return (
          <select
            className="input-field"
            value={formData[element.fieldKey] || ""}
            onChange={(e) => handleChange(element.fieldKey, e.target.value)}
            required={element.validation?.required}
          >
            <option value="">Select...</option>
            {element.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "CHECKBOX":
        return (
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={formData[element.fieldKey] || false}
            onChange={(e) => handleChange(element.fieldKey, e.target.checked)}
          />
        );
      case "DATE":
        return (
          <input
            type="date"
            className="input-field"
            value={formData[element.fieldKey] || ""}
            onChange={(e) => handleChange(element.fieldKey, e.target.value)}
            required={element.validation?.required}
          />
        );
      case "BOOLEAN":
        return (
          <select
            className="input-field"
            value={formData[element.fieldKey] || ""}
            onChange={(e) => handleChange(element.fieldKey, e.target.value)}
            required={element.validation?.required}
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      default:
        return (
          <p className="text-red-500">
            Unknown field type: {element.fieldType}
          </p>
        );
    }
  };

  const renderElement = (element) => {
    // ─── Location Package ──────────────────────────────────────────
    if (element.elementType === "LOCATION_PACKAGE") {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {element.fieldLabel}
          </h3>
          <AuditMap
            onLocationSelect={(location) => {
              handleChange(
                "coordinates",
                location.lat && location.lng
                  ? `${location.lat}, ${location.lng}`
                  : "",
              );
              handleChange("region", location.region || "");
              handleChange("province", location.province || "");
              handleChange("city", location.city || "");
              handleChange("full_location", location.fullLocation || "");
            }}
            initialLocation={
              formData.coordinates && formData.coordinates.includes(",")
                ? (() => {
                    const [lat, lng] = formData.coordinates
                      .split(",")
                      .map(Number);
                    return { lat, lng };
                  })()
                : null
            }
            userLocation={userLocation}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Coordinates
              </label>
              <input
                type="text"
                className="input-field bg-slate-50"
                value={formData.coordinates || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Region
              </label>
              <input
                type="text"
                className="input-field bg-slate-50"
                value={formData.region || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Province / HUC
              </label>
              <input
                type="text"
                className="input-field bg-slate-50"
                value={formData.province || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                City / Municipality
              </label>
              <input
                type="text"
                className="input-field bg-slate-50"
                value={formData.city || ""}
                readOnly
              />
            </div>
          </div>
        </div>
      );
    }

    const isTitle = element.elementType === "TITLE";
    const isSubtitle = element.elementType === "SUBTITLE";
    const isField = element.elementType === "FIELD";

    if (isTitle) {
      return (
        <div className="mt-6 mb-4">
          <h2 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2">
            {element.fieldLabel || element.fieldKey || "Untitled"}
          </h2>
        </div>
      );
    }

    if (isSubtitle) {
      return (
        <div className="mt-4 mb-3">
          <h3 className="text-lg font-semibold text-purple-700">
            {element.fieldLabel || element.fieldKey || "Untitled"}
          </h3>
        </div>
      );
    }

    if (isField) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {element.fieldLabel || element.fieldKey || "Untitled"}
            {element.validation?.required && (
              <span className="text-red-500"> *</span>
            )}
          </label>
          {renderField(element)}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <div className="text-center py-12">Loading form...</div>;
  }

  return (
    <div className="glass-card p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        {formType === "FORM1"
          ? "Form 1 - Building Prioritization"
          : formType === "FORM2A"
            ? "Form 2A - Rapid Visual Screening"
            : "Form 2B - Detailed Building Inspection"}
      </h1>
      <form className="space-y-2">
        {elements.map((element) => (
          <div key={element.id}>{renderElement(element)}</div>
        ))}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary w-full"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
}
