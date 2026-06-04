"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">AuditPH</h3>
            <p className="text-sm text-slate-400">
              Building a Safer Tomorrow through Transparent Infrastructure
              Auditing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white">
                  News
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-white">
                  Public Map
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Partner Agencies</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://dilg.gov.ph"
                  target="_blank"
                  className="hover:text-white"
                >
                  DILG
                </a>
              </li>
              <li>
                <a
                  href="https://dpwh.gov.ph"
                  target="_blank"
                  className="hover:text-white"
                >
                  DPWH
                </a>
              </li>
              <li>
                <a
                  href="https://psa.gov.ph"
                  target="_blank"
                  className="hover:text-white"
                >
                  PSA
                </a>
              </li>
              <li>
                <a
                  href="https://phivolcs.dost.gov.ph"
                  target="_blank"
                  className="hover:text-white"
                >
                  PHIVOLCS
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>📞 (02) 1234-5678</li>
              <li>✉️ audit@dilg.gov.ph</li>
              <li>📍 DILG Building, Quezon City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-sm text-slate-500 text-center">
          <p>© 2026 Infrastructure Audit System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
