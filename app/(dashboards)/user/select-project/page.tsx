"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader, BrandCard, NextArrow } from "@/components/dashboard/ui";

export default function SelectProjectPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col">
      <SectionHeader title="Select Project" backHref="/user" />

      <div className="flex flex-1 items-center justify-center">
        <BrandCard className="w-full max-w-md">
          <div className="flex flex-col gap-4 py-8 sm:py-12">
            <Button asChild variant="pill" size="xl" className="w-full">
              <Link href="/user/tasks?type=read">Read Speech</Link>
            </Button>
            <Button asChild variant="pill" size="xl" className="w-full">
              <Link href="/user/tasks?type=spontaneous">
                Spontaneous Speech
              </Link>
            </Button>
          </div>
        </BrandCard>
      </div>

      <div className="mt-6 flex justify-end">
        <NextArrow href="/user/tasks" label="Go to tasks" />
      </div>
    </div>
  );
}
