"use client";

import { use } from "react";
import { useReviewerHistory } from "@/lib/api/queries";
import { Card } from "@/components/ui/card";
import { Loader2, ClipboardCheck } from "lucide-react";

export default function ReviewerHistoryPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const { projectSlug } = use(params);
  const { data: history, isLoading, error } = useReviewerHistory(projectSlug);

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "EXCELLENT":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
      case "GOOD":
        return "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400";
      case "FAIR":
        return "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      case "POOR":
        return "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400";
      default:
        return "bg-muted/50 border-border text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Review History</h1>
        <p className="text-muted-foreground mt-1">Your past review decisions for this project.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Submission</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Feedback</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-destructive">
                    Failed to load review history.
                  </td>
                </tr>
              ) : !history || history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <ClipboardCheck className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    No reviews yet. Your completed reviews will appear here.
                  </td>
                </tr>
              ) : (
                history.map((review: any) => {
                  return (
                    <tr key={review.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground max-w-[200px] truncate" title={review.submission?.task?.title}>
                          {review.submission?.task?.title || review.submission?.id?.substring(0, 8) || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRatingBadge(review.rating)}`}>
                          {review.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${review.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-destructive'}`}></span>
                          <span className={`font-medium ${review.status === 'APPROVED' ? 'text-emerald-600 dark:text-emerald-500' : 'text-destructive'}`}>
                            {review.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-muted-foreground" title={review.feedback}>
                          {review.feedback || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
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
