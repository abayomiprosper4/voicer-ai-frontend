"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/ui";
import { getUsersPaginated } from "@/lib/mock/admin";
import { cn } from "@/lib/utils";

export default function UsersListPage() {
  const [page, setPage] = useState(1);
  const { data, totalPages } = getUsersPaginated(page, 10);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Users List" subtitle="English" />

      <div className="w-full overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[800px] text-left text-sm text-foreground">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              <th className="w-12 rounded-tl-xl px-4 py-3 text-center font-semibold">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email address</th>
              <th className="px-4 py-3 font-semibold">Date Joined</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="rounded-tr-xl px-4 py-3 font-semibold">Delete User</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {data.map((user, index) => {
              const isApproved = user.status === "approved";
              const isPending = user.status === "pending";
              const isRejected = user.status === "rejected";

              return (
                <tr
                  key={user.id}
                  className={cn(
                    "border-b border-border transition-colors hover:bg-secondary/50",
                    index % 2 === 0 ? "bg-secondary/30" : "bg-card",
                    index === data.length - 1 && "border-none"
                  )}
                >
                  <td className="w-12 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
                      aria-label={`Select user ${user.id}`}
                    />
                  </td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.dateJoined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full",
                          isApproved && "bg-emerald-500",
                          isPending && "bg-amber-400",
                          isRejected && "bg-red-500"
                        )}
                      />
                      <span
                        className={cn(
                          "font-medium capitalize",
                          isApproved && "text-emerald-600",
                          isPending && "text-amber-500",
                          isRejected && "text-red-500"
                        )}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="ml-4 rounded-md text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Delete user ${user.id}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                  page === p
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
                aria-label={`Page ${p}`}
              >
                {p}
              </button>
            )
          )}

          {totalPages > 3 && (
            <>
              <span className="flex h-8 w-8 items-center justify-center text-sm text-foreground">
                ...
              </span>
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                  page === totalPages
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
                aria-label={`Page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
}
