"use client";
import FormRenderer from "@/components/forms/FormRenderer";

console.log("✅ FORM 1 PAGE IS RENDERING - This is the correct file");

export default function Form1Page() {
  return (
    <div className="page-container">
      <FormRenderer formType="FORM1" />
    </div>
  );
}
