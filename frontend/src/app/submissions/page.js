"use client";
import { useState, useEffect } from "react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch(`http://localhost:5000/api/v1/workflow/submissions/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching submissions:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center py-12">Loading submissions...</div>;

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">My Submissions</h1>
      {submissions.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-slate-600">No submissions found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((building) => (
            <div key={building.id} className="glass-card p-4">
              <h3 className="font-semibold text-lg">{building.buildingName}</h3>
              <p className="text-sm text-slate-500">
                Status: {building.submissionStatus}
              </p>
              <p className="text-sm text-slate-500">
                Level: {building.currentLevel}
              </p>
              <p className="text-xs text-slate-400">
                Submitted: {new Date(building.submittedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
