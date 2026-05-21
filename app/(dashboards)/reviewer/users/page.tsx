"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/dashboard/ui";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock user data
const USERS = [
  {
    id: "u1",
    name: "Vivian Okechukwu",
    email: "vivian@example.com",
    dateJoined: "2024-01-15",
    status: "Active",
  },
  {
    id: "u2",
    name: "Chioma Nwosu",
    email: "chioma@example.com",
    dateJoined: "2024-02-20",
    status: "Active",
  },
  {
    id: "u3",
    name: "Tunde Akerele",
    email: "tunde@example.com",
    dateJoined: "2024-03-10",
    status: "Inactive",
  },
  {
    id: "u4",
    name: "Ada Okafor",
    email: "ada@example.com",
    dateJoined: "2024-01-25",
    status: "Active",
  },
  {
    id: "u5",
    name: "Emeka Igwe",
    email: "emeka@example.com",
    dateJoined: "2024-04-05",
    status: "Active",
  },
    {
    id: "u6",
    name: "Vivian Okechukwu",
    email: "vivian@example.com",
    dateJoined: "2024-01-15",
    status: "Active",
  },
      {
    id: "u7",
    name: "Alicia Ebbi",
    email: "vivian@example.com",
    dateJoined: "2024-01-15",
    status: "Active",
  },
      {
    id: "u8",
    name: "Oghenekevwe Omonode",
    email: "vivian@example.com",
    dateJoined: "2024-01-15",
    status: "Active",
  },
      {
    id: "u9",
    name: "Faizah Salisu",
    email: "vivian@example.com",
    dateJoined: "2024-01-15",
    status: "Active",
  },
    {
    id: "u10",
    name: "Tunde Akerele",
    email: "tunde@example.com",
    dateJoined: "2024-03-10",
    status: "Inactive",
  },
    {
    id: "u11",
    name: "Ada Okafor",
    email: "ada@example.com",
    dateJoined: "2024-01-25",
    status: "Active",
  },
    {
    id: "u12",
    name: "Chioma Nwosu",
    email: "chioma@example.com",
    dateJoined: "2024-02-20",
    status: "Active",
  },
    {
    id: "u13",
    name: "Tomiwa Gbadebo",
    email: "tomiwa@example.com",
    dateJoined: "2024-03-11",
    status: "Inactive",
  },    {
    id: "u14",
    name: "Temitope Olutunmida",
    email: "tomiwa@example.com",
    dateJoined: "2024-03-11",
    status: "Inactive",
  },
];

export default function UsersListPage() {
  const [users, setUsers] = useState(USERS);

  const handleDelete = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "text-green-700" : "text-muted-foreground";
  };

  const getStatusBg = (status: string) => {
    return status === "Active" ? "bg-green-500/20" : "bg-surface";
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <SectionHeader title="Users List" backHref="/reviewer" />

      {users.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    className="h-5 w-5 rounded border border-border accent-primary"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  Date Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-surface/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${user.name}`}
                      className="h-5 w-5 rounded border border-border accent-primary"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatDate(user.dateJoined)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-medium",
                        getStatusBg(user.status),
                        getStatusColor(user.status)
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(user.id)}
                      aria-label={`Delete ${user.name}`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}