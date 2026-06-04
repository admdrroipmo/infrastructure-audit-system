"use client";
import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              Audit<span className="text-blue-600">PH</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/map"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              Map
            </Link>
            <Link
              href="/news"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              News
            </Link>
            <Link
              href="/about"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              About
            </Link>
            <Link href="/login" className="btn-primary text-sm">
              Sign In
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden border-t border-white/20 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm text-slate-600 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/map"
              className="block text-sm text-slate-600 hover:text-blue-600"
            >
              Map
            </Link>
            <Link
              href="/news"
              className="block text-sm text-slate-600 hover:text-blue-600"
            >
              News
            </Link>
            <Link
              href="/about"
              className="block text-sm text-slate-600 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              href="/login"
              className="btn-primary text-sm w-full text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
