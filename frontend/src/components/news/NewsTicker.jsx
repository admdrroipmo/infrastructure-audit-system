"use client";
export default function NewsTicker() {
  const news = [
    "AuditPH launches nationwide infrastructure assessment program",
    "New seismic hazard maps now available for public viewing",
    "Over 15,000 buildings audited across the Philippines",
    "DILG announces partnership with DPWH for structural evaluation",
  ];

  return (
    <div className="bg-blue-50 border-y border-blue-100 py-2 overflow-hidden">
      <div className="flex items-center gap-4 max-w-7xl mx-auto px-4">
        <span className="font-bold text-blue-600 whitespace-nowrap">
          📢 NEWS:
        </span>
        <div className="overflow-hidden relative flex-1">
          <div className="animate-marquee whitespace-nowrap">
            {news.map((item, index) => (
              <span key={index} className="mx-4 text-sm text-slate-700">
                {item}
                {index < news.length - 1 && " • "}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
