import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, NextArrow } from "@/components/dashboard/ui";
import { StatChip, SubmissionCard } from "@/components/dashboard/cards";
import {
  getRecentSubmissions,
  getSubmissionStats,
  CURRENT_USER,
} from "@/lib/mock/submissions";

export default function ContributorDashboardPage() {
  const stats = getSubmissionStats();
  const recent = getRecentSubmissions(2);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <SectionHeader
        title="Dashboard"
        subtitle={`Good morning, ${CURRENT_USER.firstName}`}
        italicSubtitle={false}
      />

      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip label={`${stats.total} Submissions`} />
        <StatChip label={`${stats.approved} Approved`} />
        <StatChip label={`${stats.pending} Pending`} />
        <StatChip label={`${stats.rejected} Rejected`} />
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          asChild
          variant="outline"
          size="xl"
          className="w-full max-w-md"
        >
          <Link href="/user/select-project">
            Start New Task <Plus className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <h2 className="mt-12 text-center text-xl font-semibold text-foreground">
        Recent Submissions
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recent.map((s) => (
          <SubmissionCard key={s.id} submission={s} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="default" size="xl" className="w-full max-w-md">
          <Link href="/user/submissions">See all</Link>
        </Button>
      </div>

      <div className="mt-6 flex justify-end">
        <NextArrow href="/user/tasks" label="Go to tasks" />
      </div>
    </div>
  );
}
