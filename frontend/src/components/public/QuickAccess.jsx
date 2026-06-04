"use client";
import Link from "next/link";
import { FileText, HelpCircle, Download, Mail } from "lucide-react";

const quickLinks = [
  { title: "About Us", icon: FileText, href: "/about", color: "blue" },
  { title: "FAQs", icon: HelpCircle, href: "/faqs", color: "cyan" },
  { title: "Downloads", icon: Download, href: "/downloads", color: "green" },
  { title: "Contact", icon: Mail, href: "/contact", color: "red" },
];

export default function QuickAccess() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {quickLinks.map((link) => (
        <Link key={link.title} href={link.href}>
          <div className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
            <link.icon
              className={`w-8 h-8 text-${link.color}-600 mx-auto mb-2`}
            />
            <div className="font-medium">{link.title}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
