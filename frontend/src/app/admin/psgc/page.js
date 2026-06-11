"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PsgcPage() {
  return (
    <div className="page-container">
      <div className="mb-4">
        <Link href="/admin" className="btn-secondary flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-blue-600 mb-6">PSGC Hierarchy</h1>
      <div className="glass-card p-8 text-center">
        <p className="text-slate-500">This feature is coming soon.</p>
      </div>
    </div>
  );
}
