import Link from "next/link";
import {
  SectionHeader,
  BrandCard,
  NextArrow,
} from "@/components/dashboard/ui";

export default function AdminProjectsPage() {
  return (
    <div className="flex flex-col items-center gap-8">
      <SectionHeader title="Select Project" backHref="/admin" />

      {/* Centered brand card with two pill navigation links */}
      <BrandCard className="w-full max-w-md p-8 sm:p-10 md:p-12">
        <div className="mx-auto flex max-w-sm flex-col gap-4">
          <Link
            href="/admin/projects/create"
            className="rounded-full bg-card px-6 py-4 text-center text-lg font-semibold text-card-foreground shadow-sm transition-colors hover:bg-card/90"
          >
            Create New
          </Link>
          <Link
            href="/admin/projects/past"
            className="rounded-full bg-card px-6 py-4 text-center text-lg font-semibold text-card-foreground shadow-sm transition-colors hover:bg-card/90"
          >
            View Past
          </Link>
        </div>
      </BrandCard>

      {/* Bottom-right forward arrow */}
      <div className="flex w-full max-w-md justify-end">
        <NextArrow href="/admin/projects/create" label="Create new project" />
      </div>
    </div>
  );
}
