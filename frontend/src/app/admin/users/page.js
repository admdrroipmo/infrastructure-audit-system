"use client"; 
import { useState, useEffect } from "react"; 
import Link from "next/link"; 
 
export default function UserManagement() { 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
 
  useEffect(() =
    fetchUsers(); 
  }, []); 
 
  const fetchUsers = async () =
    try { 
      const res = await fetch("http://localhost:5000/api/v1/admin/users"); 
      const data = await res.json(); 
      setUsers(data); 
      setLoading(false); 
    } catch (error) { 
      console.error("Error fetching users:", error); 
      setLoading(false); 
    } 
  }; 
 
  const handleDelete = async (userId, userName) =
    if (confirm(`Are you sure you want to delete ${userName}?`)) { 
      return; 
    } 
    try { 
      const res = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}`, { 
        method: "DELETE", 
      }); 
      if (res.ok) fetchUsers(); 
    } catch (error) { 
      alert("Error deleting user: " + error.message); 
    } 
  }; 
 
  if (loading) { 
    return <div className="text-center py-12">Loading users...</div>; 
  } 
 
  return ( 
    <div className="page-container"> 
      <div className="flex justify-between items-center mb-6"> 
        <h1 className="text-2xl font-bold text-blue-600">User Management</h1> 
        <Link href="/admin/users/create" className="btn-primary"> 
          Add New User 
        </Link> 
      </div> 
      <div className="glass-card overflow-hidden"> 
        <table className="w-full"> 
          <thead className="bg-slate-50"> 
            <tr> 
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th> 
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th> 
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Access Level</th> 
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">PSGC</th> 
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th> 
            </tr> 
          </thead> 
          <tbody className="divide-y divide-slate-200"> 
            {users.map((user) =
              <tr key={user.id}> 
                <td className="px-6 py-4">{user.fullName}</td> 
                <td className="px-6 py-4">{user.email}</td> 
                <td className="px-6 py-4"> 
                  <span className="badge-safe">{user.accessLevel}</span> 
                </td> 
                <td className="px-6 py-4"> 
                  <button className="text-blue-600 hover:text-blue-800">Edit</button> 
