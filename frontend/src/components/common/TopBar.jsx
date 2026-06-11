"use client";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-slate-900 text-white py-1 px-4 text-xs flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span>🇵🇭 Republic of the Philippines</span>
        <span className="hidden md:inline">|</span>
        <span className="hidden md:inline">
          Official Website of the Infrastructure Audit System
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/transparency" className="hover:text-blue-300">
          Transparency
        </Link>
        <Link href="/faqs" className="hover:text-blue-300">
          FAQs
        </Link>
        <Link href="/contact" className="hover:text-blue-300">
          Contact
        </Link>
      </div>
    </div>
  );
}
