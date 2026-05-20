import { SectionHeader, NextArrow } from "@/components/dashboard/ui";
import { StatChip, SubmissionCard } from "@/components/dashboard/cards";
import {
  getSubmissions,
  getSubmissionStats,
} from "@/lib/mock/submissions";

export default function SubmissionsPage() {
  const stats = getSubmissionStats();
  const submissions = getSubmissions();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <SectionHeader title="My Submissions" />

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label={`${stats.total} Submissions`} />
        <StatChip label={`${stats.approved} Approved`} />
        <StatChip label={`${stats.pending} Pending`} />
        <StatChip label={`${stats.rejected} Rejected`} />
      </div>

      {submissions.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No submissions yet. Complete a task to see it here.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {submissions.map((s) => (
            <SubmissionCard key={s.id} submission={s} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <NextArrow href="/user/tasks" label="Go to tasks" />
      </div>
    </div>
  );
}
