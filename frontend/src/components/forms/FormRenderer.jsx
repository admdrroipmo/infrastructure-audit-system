"use client";
import { useState, useEffect } from "react";

export default function FormRenderer({ formType }) {
  const [elements, setElements] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElements();
  }, [formType]);

  const fetchElements = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/formBuilder/fields/${formType}`,
      );
      const data = await res.json();
      setElements(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching form elements:", error);
      setLoading(false);
    }
  };

  const handleChange = (fieldKey, value) => {
    setFormData({ ...formData, [fieldKey]: value });
  };

  const renderField = (element) => {
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
    const isTitle = element.elementType === "TITLE";
    const isSubtitle = element.elementType === "SUBTITLE";
    const isField = element.elementType === "FIELD";

    if (isTitle) {
      return (
        <div className="mt-6 mb-4">
          <h2 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2">
            {element.fieldLabel}
          </h2>
        </div>
      );
    }

    if (isSubtitle) {
      return (
        <div className="mt-4 mb-3">
          <h3 className="text-lg font-semibold text-purple-700">
            {element.fieldLabel}
          </h3>
        </div>
      );
    }

    if (isField) {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {element.fieldLabel}
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
        {elements.map((element, index) => (
          <div key={element.id}>{renderElement(element)}</div>
        ))}
        <div className="mt-6">
          <button type="button" className="btn-primary w-full">
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
}
