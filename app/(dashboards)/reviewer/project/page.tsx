"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader, BrandCard, NextArrow } from "@/components/dashboard/ui";

export default function SelectProjectPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col">
      <SectionHeader title="Select Project" backHref="/reviewer" />

      <div className="flex flex-1 items-center mt-20 justify-center">
        <BrandCard className="w-full max-w-lg">
          <div className="flex flex-col gap-8 py-8 sm:py-16">
            <Button asChild variant="pill" size="xl" className="w-full">
              <Link href="/reviewer/project/read">Read Speech</Link>
            </Button>
            <Button asChild variant="pill" size="xl" className="w-full">
              <Link href="/reviewer/project/spontaneous">
                Spontaneous Speech
              </Link>
            </Button>
          </div>
        </BrandCard>
      </div>

      <div className="mt-6 flex justify-end">
        <NextArrow href="/reviewer" label="Back to dashboard" />
      </div>
    </div>
  );
}