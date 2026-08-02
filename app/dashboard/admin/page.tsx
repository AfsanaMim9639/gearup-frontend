"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  useAdminUsers,
  useUpdateUserStatus,
  useAdminGear,
  useAdminRentals,
} from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api-client";

const PAGE_SIZE = 8;

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: gearItems } = useAdminGear();
  const { data: rentals } = useAdminRentals();
  const updateStatus = useUpdateUserStatus();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredUsers = (users ?? []).filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(Math.ceil(filteredUsers.length / PAGE_SIZE), 1);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleToggleStatus = async (id: string, currentStatus?: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast.success(`User ${newStatus === "active" ? "activated" : "suspended"}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome, {user?.name ?? "Guest"}
          </p>
        </div>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{users?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Gear Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{gearItems?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{rentals?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <div className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
        </div>

        {usersLoading && (
          <p className="mt-4 text-muted-foreground">Loading users...</p>
        )}

        {!usersLoading && (
          <div className="mt-4 overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {u.status === "active" ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="destructive">Suspended</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={u.status === "active" ? "destructive" : "default"}
                        disabled={updateStatus.isPending}
                        onClick={() => handleToggleStatus(u.id, u.status)}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}