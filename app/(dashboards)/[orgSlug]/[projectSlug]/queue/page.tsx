"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { use } from "react";
import Link from "next/link";
import { useReviewQueue } from "@/lib/api/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  PlayCircle } from "lucide-react";

export default function ReviewQueuePage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const { orgSlug, projectSlug } = use(params);
  const { data: queue, isLoading, error } = useReviewQueue(projectSlug);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Review Queue</h1>
        <p className="text-muted-foreground mt-1">Pending submissions matched to your language proficiencies.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Contributor</th>
                <th className="px-6 py-4 font-semibold">Task</th>
                <th className="px-6 py-4 font-semibold">Language</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Submitted</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <LogoLoader className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-destructive">
                    Failed to load review queue.
                  </td>
                </tr>
              ) : !queue || queue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <PlayCircle className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    Queue is empty. All submissions have been reviewed.
                  </td>
                </tr>
              ) : (
                queue.map((submission: any) => {
                  const contributorName = submission.contributor?.firstName 
                    ? `${submission.contributor.firstName} ${submission.contributor.lastName}`
                    : "Unknown User";
                  const initial = contributorName.charAt(0).toUpperCase();

                  return (
                    <tr key={submission.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold">
                            {initial}
                          </div>
                          <span className="font-medium text-foreground">{contributorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground max-w-[200px] truncate" title={submission.task?.title}>
                          {submission.task?.title || "Unknown Task"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold bg-muted/50">
                          {submission.languageId?.substring(0, 8) || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">
                        {submission.audioDuration ? `${submission.audioDuration}s` : "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/${orgSlug}/${projectSlug}/queue/${submission.id}`}>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
