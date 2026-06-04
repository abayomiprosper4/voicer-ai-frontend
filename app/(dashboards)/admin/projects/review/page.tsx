import Link from "next/link";
import { SectionHeader, BrandCard, NextArrow } from "@/components/dashboard/ui";

export default function ReviewPage() {
  return (
    <div className="flex min-h-full flex-col gap-8 relative pb-16">
      <SectionHeader title="Review" backHref="/admin/projects/assign" />

      <div className="flex flex-1 flex-col items-center justify-center mt-12">
        <BrandCard className="w-full max-w-lg p-12 sm:p-16">
          <div className="flex flex-col gap-6">
            <Link
              href="/admin/projects/publish"
              className="w-full rounded-full bg-card py-4 text-center text-lg font-semibold text-card-foreground shadow-sm transition-colors hover:bg-card/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Publish Project
            </Link>
            <Link
              href="/admin/projects/assign"
              className="w-full rounded-full bg-card py-4 text-center text-lg font-semibold text-card-foreground shadow-sm transition-colors hover:bg-card/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Return to previous page
            </Link>
          </div>
        </BrandCard>
      </div>

      <div className="absolute bottom-0 right-0">
        <NextArrow href="/admin/projects/publish" />
      </div>
    </div>
  );
}
