"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Type,
  List,
  Edit2,
  X,
  ChevronRight,
} from "lucide-react";

export default function FormBuilder() {
  const [formType, setFormType] = useState("FORM1");
  const [elements, setElements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "TITLE", "SUBTITLE", "FIELD"
  const [editingElement, setEditingElement] = useState(null);
  const [newElement, setNewElement] = useState({
    titleName: "",
    fieldKey: "",
    fieldLabel: "",
    fieldType: "TEXT",
    options: "",
    scoreConfig: "",
    required: false,
    parentId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchElements();
  }, [formType]);

  const fetchElements = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/formBuilder/fields/${formType}`,
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch elements: ${res.status}`);
      }

      const data = await res.json();
      setElements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching elements:", error);
      setError("Failed to load elements. Please try again.");
      setElements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddElement = async () => {
    try {
      let options = null;
      let scoreConfig = null;

      if (modalType === "FIELD" && newElement.fieldType === "SELECT") {
        options = newElement.options.split(",").map((opt) => opt.trim());
        if (newElement.scoreConfig) {
          try {
            scoreConfig = JSON.parse(newElement.scoreConfig);
          } catch (e) {
            alert(
              "Invalid JSON format for score configuration. Please check your syntax.",
            );
            return;
          }
        }
      }

      const elementData = {
        formType,
        elementType: modalType,
        fieldKey: modalType === "FIELD" ? newElement.fieldKey : null,
        fieldLabel:
          modalType === "FIELD" ? newElement.fieldLabel : newElement.titleName,
        fieldType: modalType === "FIELD" ? newElement.fieldType : null,
        options: options,
        validation:
          modalType === "FIELD" ? { required: newElement.required } : null,
        order: elements.length,
        parentId: newElement.parentId || null,
      };

      const res = await fetch(
        "http://localhost:5000/api/v1/formBuilder/fields",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(elementData),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add element");
      }

      setShowModal(false);
      setModalType("");
      setNewElement({
        titleName: "",
        fieldKey: "",
        fieldLabel: "",
        fieldType: "TEXT",
        options: "",
        scoreConfig: "",
        required: false,
        parentId: null,
      });
      fetchElements();
    } catch (error) {
      console.error("Error adding element:", error);
      alert(error.message);
    }
  };

  const handleEditElement = async () => {
    try {
      let options = null;
      let scoreConfig = null;

      if (editingElement.fieldType === "SELECT") {
        if (newElement.options) {
          options = newElement.options.split(",").map((opt) => opt.trim());
        }
        if (newElement.scoreConfig) {
          try {
            scoreConfig = JSON.parse(newElement.scoreConfig);
          } catch (e) {
            alert(
              "Invalid JSON format for score configuration. Please check your syntax.",
            );
            return;
          }
        }
      }

      const elementData = {
        fieldLabel:
          editingElement.elementType === "FIELD"
            ? newElement.fieldLabel
            : newElement.titleName,
        fieldKey:
          editingElement.elementType === "FIELD" ? newElement.fieldKey : null,
        fieldType:
          editingElement.elementType === "FIELD" ? newElement.fieldType : null,
        options: options,
        validation:
          editingElement.elementType === "FIELD"
            ? { required: newElement.required }
            : null,
        parentId: newElement.parentId || null,
      };

      const res = await fetch(
        `http://localhost:5000/api/v1/formBuilder/fields/${editingElement.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(elementData),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update element");
      }

      setShowModal(false);
      setEditingElement(null);
      setNewElement({
        titleName: "",
        fieldKey: "",
        fieldLabel: "",
        fieldType: "TEXT",
        options: "",
        scoreConfig: "",
        required: false,
        parentId: null,
      });
      fetchElements();
    } catch (error) {
      console.error("Error updating element:", error);
      alert(error.message);
    }
  };

  const handleDeleteElement = async (id) => {
    if (!confirm("Are you sure you want to delete this element?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/formBuilder/fields/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to delete element");
      }
      fetchElements();
    } catch (error) {
      console.error("Error deleting element:", error);
      alert(error.message);
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newElements = [...elements];
    [newElements[index], newElements[index - 1]] = [
      newElements[index - 1],
      newElements[index],
    ];
    for (let i = 0; i < newElements.length; i++) {
      await fetch(
        `http://localhost:5000/api/v1/formBuilder/fields/${newElements[i].id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        },
      );
    }
    fetchElements();
  };

  const handleMoveDown = async (index) => {
    if (index === elements.length - 1) return;
    const newElements = [...elements];
    [newElements[index], newElements[index + 1]] = [
      newElements[index + 1],
      newElements[index],
    ];
    for (let i = 0; i < newElements.length; i++) {
      await fetch(
        `http://localhost:5000/api/v1/formBuilder/fields/${newElements[i].id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: i }),
        },
      );
    }
    fetchElements();
  };

  const openAddModal = (type) => {
    setModalType(type);
    setEditingElement(null);
    setNewElement({
      titleName: "",
      fieldKey: "",
      fieldLabel: "",
      fieldType: "TEXT",
      options: "",
      scoreConfig: "",
      required: false,
      parentId: null,
    });
    setShowModal(true);
  };

  const openEditModal = (element) => {
    setEditingElement(element);
    setModalType(element.elementType);
    if (element.elementType === "FIELD") {
      setNewElement({
        fieldKey: element.fieldKey || "",
        fieldLabel: element.fieldLabel || "",
        fieldType: element.fieldType || "TEXT",
        options: element.options?.join(",") || "",
        scoreConfig: "",
        required: element.validation?.required || false,
        parentId: element.parentId || null,
      });
    } else {
      setNewElement({
        titleName: element.fieldLabel || "",
        fieldKey: "",
        fieldLabel: "",
        fieldType: "TEXT",
        options: "",
        scoreConfig: "",
        required: false,
        parentId: element.parentId || null,
      });
    }
    setShowModal(true);
  };

  const getElementIcon = (type) => {
    switch (type) {
      case "TITLE":
        return <Type className="w-4 h-4 text-blue-600" />;
      case "SUBTITLE":
        return <Edit2 className="w-4 h-4 text-purple-600" />;
      case "FIELD":
        return <List className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getElementIndent = (element) => {
    if (element.elementType === "TITLE") return "ml-0";
    if (element.elementType === "SUBTITLE") return "ml-4";
    if (element.elementType === "FIELD") return "ml-8";
    return "ml-0";
  };

  const renderElement = (element, index) => {
    const isTitle = element.elementType === "TITLE";
    const isSubtitle = element.elementType === "SUBTITLE";
    const isField = element.elementType === "FIELD";

    return (
      <div
        key={element.id}
        className={`flex items-center justify-between p-3 rounded-lg ${isTitle ? "bg-blue-50" : isSubtitle ? "bg-purple-50" : "bg-slate-50"} ${getElementIndent(element)}`}
      >
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-medium text-slate-500">
            {index + 1}.
          </span>
          {getElementIcon(element.elementType)}
          <span
            className={`font-medium ${isTitle ? "text-blue-700" : isSubtitle ? "text-purple-700" : "text-slate-700"}`}
          >
            {element.fieldLabel || element.titleName}
          </span>
          <span className="text-xs text-slate-500">
            {isTitle
              ? "(Title)"
              : isSubtitle
                ? "(Subtitle)"
                : `(${element.fieldType})`}
          </span>
          {isField && element.validation?.required && (
            <span className="text-xs text-red-500">*Required</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMoveUp(index)}
            className="p-1 hover:bg-slate-200 rounded"
            disabled={index === 0}
          >
            <MoveUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleMoveDown(index)}
            className="p-1 hover:bg-slate-200 rounded"
            disabled={index === elements.length - 1}
          >
            <MoveDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(element)}
            className="p-1 hover:bg-blue-100 rounded text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteElement(element.id)}
            className="p-1 hover:bg-red-100 rounded text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="text-center py-12">Loading form elements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center py-12 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Form Builder</h1>
        <div className="flex items-center gap-4">
          <select
            className="input-field w-48"
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
          >
            <option value="FORM1">Form 1 - Inventory</option>
            <option value="FORM2A">Form 2A - RVS</option>
            <option value="FORM2B">Form 2B - Detailed</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => openAddModal("TITLE")}
              className="btn-secondary flex items-center gap-1"
            >
              <Type className="w-4 h-4" />
              Add Title
            </button>
            <button
              onClick={() => openAddModal("SUBTITLE")}
              className="btn-secondary flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Add Subtitle
            </button>
            <button
              onClick={() => openAddModal("FIELD")}
              className="btn-primary flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        {elements.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No elements yet. Add a Title, Subtitle, or Field to start building
            your form.
          </div>
        ) : (
          <div className="space-y-2">
            {elements.map((element, index) => renderElement(element, index))}
          </div>
        )}
      </div>

      {/* Add/Edit Element Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">
                {editingElement ? "Edit" : "Add"}{" "}
                {modalType === "TITLE"
                  ? "Title"
                  : modalType === "SUBTITLE"
                    ? "Subtitle"
                    : "Field"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {(modalType === "TITLE" || modalType === "SUBTITLE") && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {modalType === "TITLE" ? "Title Name" : "Subtitle Name"}
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newElement.titleName}
                    onChange={(e) =>
                      setNewElement({
                        ...newElement,
                        titleName: e.target.value,
                      })
                    }
                    placeholder={
                      modalType === "TITLE"
                        ? "e.g., Screener Information"
                        : "e.g., Personal Details"
                    }
                  />
                </div>
              )}
              {modalType === "FIELD" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Field Key
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newElement.fieldKey}
                      onChange={(e) =>
                        setNewElement({
                          ...newElement,
                          fieldKey: e.target.value,
                        })
                      }
                      placeholder="e.g., building_name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Field Label
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={newElement.fieldLabel}
                      onChange={(e) =>
                        setNewElement({
                          ...newElement,
                          fieldLabel: e.target.value,
                        })
                      }
                      placeholder="e.g., Building Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Field Type
                    </label>
                    <select
                      className="input-field"
                      value={newElement.fieldType}
                      onChange={(e) =>
                        setNewElement({
                          ...newElement,
                          fieldType: e.target.value,
                        })
                      }
                    >
                      <option value="TEXT">Text</option>
                      <option value="NUMBER">Number</option>
                      <option value="SELECT">Select</option>
                      <option value="CHECKBOX">Checkbox</option>
                      <option value="DATE">Date</option>
                      <option value="BOOLEAN">Boolean</option>
                    </select>
                  </div>
                  {newElement.fieldType === "SELECT" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Options (comma-separated)
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={newElement.options}
                          onChange={(e) =>
                            setNewElement({
                              ...newElement,
                              options: e.target.value,
                            })
                          }
                          placeholder="Option1,Option2,Option3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Score Configuration (JSON)
                        </label>
                        <textarea
                          className="input-field"
                          rows="4"
                          value={newElement.scoreConfig}
                          onChange={(e) =>
                            setNewElement({
                              ...newElement,
                              scoreConfig: e.target.value,
                            })
                          }
                          placeholder='{"Option1": 1, "Option2": 2, "Option3": 3}'
                        />
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="required"
                      checked={newElement.required}
                      onChange={(e) =>
                        setNewElement({
                          ...newElement,
                          required: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="required"
                      className="text-sm text-slate-700"
                    >
                      Required
                    </label>
                  </div>
                </>
              )}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={
                    editingElement ? handleEditElement : handleAddElement
                  }
                  className="btn-primary flex-1"
                >
                  {editingElement ? "Update" : "Add"} Element
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
