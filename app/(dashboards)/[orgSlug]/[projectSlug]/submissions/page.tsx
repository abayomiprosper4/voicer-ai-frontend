"use client";
import { LogoLoader } from "@/components/ui/logo-loader";
import { use, useState } from "react";
import { useContributorHistory } from "@/lib/api/queries";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  ClipboardCheck } from "lucide-react";

export default function SubmissionsHistoryPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectSlug: string }>;
}) {
  const { projectSlug } = use(params);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: submissions, isLoading, error } = useContributorHistory(
    projectSlug,
    statusFilter || undefined
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return { label: "Pending Review", dotClass: "bg-amber-500", textClass: "text-amber-600 dark:text-amber-500" };
      case "APPROVED":
        return { label: "Approved", dotClass: "bg-emerald-500", textClass: "text-emerald-600 dark:text-emerald-500" };
      case "REJECTED":
        return { label: "Rejected", dotClass: "bg-destructive", textClass: "text-destructive" };
      case "NEEDS_REVISION":
        return { label: "Needs Revision", dotClass: "bg-amber-600", textClass: "text-amber-700 dark:text-amber-600" };
      default:
        return { label: status, dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Submissions</h1>
          <p className="text-muted-foreground mt-1">Track your recording submissions and their review status.</p>
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="NEEDS_REVISION">Needs Revision</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Task</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <LogoLoader className="h-6 w-6 text-muted-foreground mx-auto" />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-destructive">
                    Failed to load submissions.
                  </td>
                </tr>
              ) : !submissions || submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <ClipboardCheck className="h-8 w-8 mx-auto mb-3 opacity-20" />
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((submission: any) => {
                  const statusConfig = getStatusConfig(submission.status);
                  
                  return (
                    <tr key={submission.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {submission.task?.title || "Unknown Task"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">
                        {submission.audioDuration ? `${submission.audioDuration}s` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${statusConfig.dotClass}`}></span>
                          <span className={`font-medium ${statusConfig.textClass}`}>
                            {statusConfig.label}
                          </span>
                        </div>
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
