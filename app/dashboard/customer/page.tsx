"use client";

import { useAuth } from "@/context/AuthContext";

export default function CustomerDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome, {user?.name ?? "Guest"} ({user?.role})
      </p>
      <button
        onClick={logout}
        className="mt-4 rounded-md bg-destructive px-4 py-2 text-sm text-white"
      >
        Logout
      </button>
    </div>
  );
}