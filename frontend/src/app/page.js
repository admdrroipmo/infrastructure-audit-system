import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import TopBar from "@/components/common/TopBar";
import StatsCounter from "@/components/public/StatsCounter";
import QuickAccess from "@/components/public/QuickAccess";
import NewsTicker from "@/components/news/NewsTicker";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopBar />
      <Navbar />
      <div className="page-container">
        <section className="text-center max-w-4xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            GovTech 2.0 • Infrastructure Audit System 2026
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Building a Safer Tomorrow
            <br />
            <span className="text-blue-600">
              Transparent Infrastructure Auditing
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            A data-driven, transparent national audit system for government and
            public buildings. Powered by real-time GIS mapping and automated
            risk assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center gap-2"
            >
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/map"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View Public Map
            </Link>
          </div>
        </section>
        <StatsCounter />
        <div className="my-8">
          <NewsTicker />
        </div>
        <QuickAccess />
        <section className="glass-card p-4 mt-8 h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-slate-500">Interactive Map Loading...</p>
              <p className="text-sm text-slate-400">
                Philippines with building pins
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
