"use client";
import React, { useState } from "react";

export function UserManagement() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: 1,
      fullName: "Michael Rodriguez",
      email: "michael@profer.com",
      phone: "(512) 555-1234",
      role: "Admin",
      joined: "Mar 18, 2025",
      status: "Active",
    },
    {
      id: 2,
      fullName: "Sarah Johnson",
      email: "sarah@profer.com",
      phone: "(303) 555-9876",
      role: "Manager",
      joined: "Mar 17, 2025",
      status: "Pending",
    },
    {
      id: 3,
      fullName: "David Chen",
      email: "david@profer.com",
      phone: "(503) 555-4321",
      role: "User",
      joined: "Mar 16, 2025",
      status: "Active",
    },
    {
      id: 4,
      fullName: "Carlos Mendez",
      email: "carlos@profer.com",
      phone: "(305) 555-7890",
      role: "User",
      joined: "Mar 15, 2025",
      status: "Deactivated",
    },
    {
      id: 5,
      fullName: "Lisa Kim",
      email: "lisa@profer.com",
      phone: "(206) 555-2468",
      role: "Manager",
      joined: "Mar 15, 2025",
      status: "Pending",
    },
  ];

  const statusColors = {
    Active: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Deactivated: "bg-red-100 text-red-800",
  } as const;

  const filteredUsers = users.filter(
    (user) =>
      (filter === "All" || user.status === filter) &&
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
            + Add User
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-40"
          >
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Deactivated</option>
          </select>

          <input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">User Info</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-semibold">{user.fullName}</td>
                  <td className="px-4 py-4 whitespace-pre-line">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-blue-600 underline text-xs block"
                    >
                      {user.email}
                    </a>
                    <span className="text-xs text-gray-600">{user.phone}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{user.role}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{user.joined}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[user.status as keyof typeof statusColors]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 space-x-2">
                    <button className="border border-gray-300 text-gray-700 rounded-md px-3 py-1 text-xs hover:bg-gray-100">
                      View
                    </button>
                    <button className="bg-blue-500 text-white rounded-md px-3 py-1 text-xs hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
