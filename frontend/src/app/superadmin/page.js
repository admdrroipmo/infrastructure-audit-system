"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Settings,
  FileText,
  MapPin,
  BarChart3,
  LogOut,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.accessLevel !== "SUPER_ADMIN") {
      router.push("/dashboard");
      return;
    }
    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <div className="page-container text-center py-12">Loading...</div>;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">
          Super Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">👤 {user?.fullName}</span>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats / Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-slate-500">Total Users</div>
        </div>
        <div className="glass-card p-4 text-center">
          <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-slate-500">Total Submissions</div>
        </div>
        <div className="glass-card p-4 text-center">
          <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-slate-500">Pending Reviews</div>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <h2 className="text-xl font-semibold mb-4">Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/superadmin/users"
          className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <Users className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-semibold text-lg">User Management</h3>
          <p className="text-sm text-slate-500">
            Create, edit, and manage users
          </p>
        </Link>

        <Link
          href="/superadmin/formulas"
          className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <Settings className="w-8 h-8 text-purple-600 mb-2" />
          <h3 className="font-semibold text-lg">Formula Configuration</h3>
          <p className="text-sm text-slate-500">
            Configure scoring thresholds and weights
          </p>
        </Link>

        <Link
          href="/superadmin/formBuilder"
          className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <FileText className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-semibold text-lg">Form Builder</h3>
          <p className="text-sm text-slate-500">
            Build and configure audit forms
          </p>
        </Link>

        <Link
          href="/superadmin/psgc"
          className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <MapPin className="w-8 h-8 text-orange-600 mb-2" />
          <h3 className="font-semibold text-lg">PSGC Hierarchy</h3>
          <p className="text-sm text-slate-500">
            View and manage PSGC locations
          </p>
        </Link>

        <Link
          href="/superadmin/reports"
          className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <BarChart3 className="w-8 h-8 text-red-600 mb-2" />
          <h3 className="font-semibold text-lg">Reports & Analytics</h3>
          <p className="text-sm text-slate-500">
            Generate audit reports and analytics
          </p>
        </Link>

        <Link
          href="/superadmin/settings"
          className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <Settings className="w-8 h-8 text-gray-600 mb-2" />
          <h3 className="font-semibold text-lg">System Settings</h3>
          <p className="text-sm text-slate-500">Configure system parameters</p>
        </Link>
      </div>

      {/* Recent Activity (Placeholder) */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="glass-card p-6">
        <p className="text-slate-500">No recent activity to display.</p>
      </div>
    </div>
  );
}
