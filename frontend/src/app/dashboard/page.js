"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Settings, FormInput, MapPin } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="page-container text-center py-12">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
        <div className="text-sm text-slate-500">
          👤 {user?.accessLevel || "User"}
        </div>
      </div>

      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {user?.fullName || "User"}!
        </h2>
        <p className="text-slate-600">
          This is the Infrastructure Audit System Dashboard. Use the cards below
          to manage the system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.accessLevel === "SUPER_ADMIN" && (
          <>
            <Link
              href="/admin/users"
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-lg">User Management</h3>
              <p className="text-sm text-slate-500">
                Manage users and permissions
              </p>
            </Link>

            <Link
              href="/admin/formulas"
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Settings className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-lg">Formula Configuration</h3>
              <p className="text-sm text-slate-500">
                Configure scoring thresholds and weights
              </p>
            </Link>

            <Link
              href="/admin/formBuilder"
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <FormInput className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-lg">Form Builder</h3>
              <p className="text-sm text-slate-500">
                Build and configure audit forms
              </p>
            </Link>

            <Link
              href="/admin/psgc"
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <MapPin className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-lg">PSGC Hierarchy</h3>
              <p className="text-sm text-slate-500">
                View and manage PSGC locations
              </p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
