"use client"; 
import Link from "next/link"; 
import { useEffect, useState } from "react"; 
 
export default function AdminDashboard() { 
  const [user, setUser] = useState(null); 
 
  useEffect(() =
    const stored = localStorage.getItem("user"); 
    if (stored) setUser(JSON.parse(stored)); 
  }, []); 
 
  return ( 
    <div className="page-container"> 
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Super Admin Dashboard</h1> 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
        <div className="glass-card p-6"> 
          <h2 className="text-xl font-semibold mb-4">User Management</h2> 
          <Link href="/admin/users" className="btn-primary w-full text-center"> 
            Manage Users 
          </Link> 
        </div> 
        <div className="glass-card p-6"> 
          <h2 className="text-xl font-semibold mb-4">Formula Configuration</h2> 
          <Link href="/admin/formulas" className="btn-primary w-full text-center"> 
            Configure Formulas 
          </Link> 
        </div> 
        <div className="glass-card p-6"> 
          <h2 className="text-xl font-semibold mb-4">Form Builder</h2> 
          <Link href="/admin/formBuilder" className="btn-primary w-full text-center"> 
            Build Forms 
          </Link> 
        </div> 
        <div className="glass-card p-6"> 
          <h2 className="text-xl font-semibold mb-4">PSGC Hierarchy</h2> 
          <Link href="/admin/psgc" className="btn-primary w-full text-center"> 
            View PSGC Tree 
          </Link> 
        </div> 
      </div> 
    </div> 
  ); 
} 
