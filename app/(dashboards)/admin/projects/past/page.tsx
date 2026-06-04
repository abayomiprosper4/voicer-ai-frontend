"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/ui";
import { getPastProjectsPaginated } from "@/lib/mock/admin";
import { cn } from "@/lib/utils";

export default function PastProjectsPage() {
  const [page, setPage] = useState(1);
  const { data, totalPages } = getPastProjectsPaginated(page, 10);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Past Projects" subtitle="English" backHref="/admin/projects" />

      <div className="w-full overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[800px] text-left text-sm text-foreground">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              <th className="w-12 px-4 py-3 text-center font-semibold rounded-tl-xl">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 font-semibold">Reviewer</th>
              <th className="px-4 py-3 font-semibold">Projects</th>
              <th className="px-4 py-3 font-semibold">Date created</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold rounded-tr-xl">Action</th>
            </tr>
          </thead>
          <tbody className="bg-card">
            {data.map((project, index) => {
              const isApproved = project.status === "approved";
              const isPending = project.status === "pending";
              const isRejected = project.status === "rejected";

              return (
                <tr
                  key={project.id}
                  className={cn(
                    "border-b border-border transition-colors hover:bg-secondary/50",
                    index === data.length - 1 && "border-none"
                  )}
                >
                  <td className="w-12 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                      aria-label={`Select project ${project.id}`}
                    />
                  </td>
                  <td className="px-4 py-3">{project.reviewer}</td>
                  <td className="px-4 py-3">{project.project}</td>
                  <td className="px-4 py-3">{project.dateCreated}</td>
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
                          "capitalize font-medium",
                          isApproved && "text-emerald-600",
                          isPending && "text-amber-500",
                          isRejected && "text-red-500"
                        )}
                      >
                        {project.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                      aria-label={`Delete project ${project.id}`}
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

      <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
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
