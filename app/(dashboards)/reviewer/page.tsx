"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader, FilterChips } from "@/components/dashboard/ui";
import { CURRENT_USER, getSubmissions } from "@/lib/mock/submissions";
import { cn } from "@/lib/utils";

const FILTER_CHIPS = [
  { label: "Pending", value: "pending" },
  { label: "Approved Today", value: "approved" },
  { label: "Language", value: "language" },
  { label: "Task Type", value: "task_type" },
];

export default function ReviewerDashboardPage() {
  const [filter, setFilter] = useState("pending");

  const submissions = useMemo(() => {
    const all = getSubmissions();
    if (filter === "pending") {
      return all.filter((s) => s.status === "pending");
    } else if (filter === "approved") {
      return all.filter((s) => s.status === "approved");
    }
    return all;
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-700";
      case "rejected":
        return "text-destructive";
      case "pending":
        return "text-accent";
      default:
        return "text-foreground";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-destructive";
      case "pending":
        return "bg-accent";
      default:
        return "bg-foreground";
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <SectionHeader
        title="Dashboard"
        subtitle={`Welcome back, ${CURRENT_USER.firstName}`}
        italicSubtitle={true}
      />

      <div className="mb-8">
        <FilterChips chips={FILTER_CHIPS} value={filter} onChange={setFilter} />
      </div>

      {submissions.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No submissions for this filter. Check back soon.
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
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  Language
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-surface-foreground">
                  Task
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
              {submissions.map((submission, idx) => (
                <tr
                  key={submission.id}
                  className="border-b border-border hover:bg-surface/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${submission.id}`}
                      className="h-5 w-5 rounded border border-border accent-primary"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {submission.speakerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {submission.language}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground capitalize">
                    {submission.type === "read" ? "Read Speech" : "Spontaneous Speech"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={cn("inline-flex items-center gap-2 font-medium", getStatusColor(submission.status))}>
                      <span className={cn("h-2 w-2 rounded-full", getStatusDot(submission.status))} />
                      {submission.status.charAt(0).toUpperCase() +
                        submission.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {submission.status === "pending" ? (
                      <Button
                        asChild
                        variant="default"
                        size="sm"
                        className="h-8"
                      >
                        <Link href={`/reviewer/review/${submission.id}`}>
                          Review
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        Delete
                      </Button>
                    )}
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