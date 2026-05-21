"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader, FilterChips } from "@/components/dashboard/ui";
import { getSubmissions } from "@/lib/mock/submissions";

const CHIPS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export function ReviewQueueClient({
  initialStatus,
}: {
  initialStatus: string;
}) {
  const [filter, setFilter] = useState(
    initialStatus === "pending" ||
      initialStatus === "approved" ||
      initialStatus === "rejected"
      ? initialStatus
      : "all",
  );

  const submissions = useMemo(() => {
    const all = getSubmissions();
    return filter === "all" ? all : all.filter((s) => s.status === filter);
  }, [filter]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <SectionHeader
        title="Review Queue"
        subtitle="Audio submissions waiting for review"
        backHref="/reviewer"
      />

      <div className="mb-8">
        <FilterChips chips={CHIPS} value={filter} onChange={setFilter} />
      </div>

      {submissions.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No submissions for this filter. Check back soon.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Language
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Prompt
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b border-border hover:bg-surface/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {submission.language}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground capitalize">
                    {submission.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground truncate max-w-xs">
                    {submission.prompt}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {submission.durationSecs}s
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        submission.status === "pending"
                          ? "bg-accent text-foreground"
                          : submission.status === "approved"
                            ? "bg-green-500/20 text-green-700"
                            : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {submission.status.charAt(0).toUpperCase() +
                        submission.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
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
                      <span className="text-muted-foreground">—</span>
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

export default async function ReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  return <ReviewQueueClient initialStatus={params.status ?? "all"} />;
}
