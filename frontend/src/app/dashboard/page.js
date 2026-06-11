"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Fetch submissions for this user
    fetchSubmissions(parsedUser.id);
  }, [router]);

  const fetchSubmissions = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/workflow/submissions/${userId}`,
      );
      const data = await res.json();
      setSubmissions(data);

      // Calculate stats
      const pending = data.filter(
        (s) => s.submissionStatus === "PENDING",
      ).length;
      const approved = data.filter(
        (s) => s.submissionStatus === "APPROVED",
      ).length;
      const rejected = data.filter(
        (s) => s.submissionStatus === "REJECTED",
      ).length;
      setStats({ pending, approved, rejected });
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge-pending">Pending</span>;
      case "APPROVED":
        return <span className="badge-safe">Approved</span>;
      case "REJECTED":
        return <span className="badge-critical">Rejected</span>;
      default:
        return <span className="badge-pending">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="page-container text-center py-12">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
        <div className="text-sm text-slate-500">
          👤 {user?.fullName} ({user?.userType || user?.accessLevel})
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.pending}</div>
          <div className="text-sm text-slate-500">Pending</div>
        </div>
        <div className="glass-card p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.approved}</div>
          <div className="text-sm text-slate-500">Approved</div>
        </div>
        <div className="glass-card p-4 text-center">
          <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold">{stats.rejected}</div>
          <div className="text-sm text-slate-500">Rejected</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/forms/form1"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Submission
          </Link>
          <Link
            href="/submissions"
            className="btn-secondary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View All Submissions
          </Link>
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
        {submissions.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-slate-600">
              No submissions found. Start by creating a new submission.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.slice(0, 5).map((sub) => (
              <div
                key={sub.id}
                className="glass-card p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{sub.buildingName}</h3>
                  <p className="text-sm text-slate-500">
                    {sub.psgc?.name} •{" "}
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(sub.submissionStatus)}
                  <Link
                    href={`/submissions/${sub.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
