"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeader, NextArrow } from "@/components/dashboard/ui";

type ReviewStep = "comment" | "decision" | "submitted";

export default function ProjectReviewPage() {
  const params = useParams();
  const type = params.type as string;
  const [step, setStep] = useState<ReviewStep>("comment");
  const [comment, setComment] = useState("");

  const isRead = type === "read";
  const title = isRead ? "Read Speech" : "Spontaneous Speech";

  const handleNext = () => {
    if (step === "comment") {
      setStep("decision");
    }
  };

  const handleApprove = () => {
    setStep("submitted");
  };

  const handleReject = () => {
    setStep("submitted");
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <SectionHeader
        title="Review"
        subtitle={title}
        backHref={`/reviewer/project/${type}`}
        italicSubtitle={true}
      />

      {step === "comment" && (
        <>
          <div className="mb-8">
            <h2 className="mb-6 text-center text-xl font-semibold text-foreground">
              Leave a Comment
            </h2>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add notes about this submission..."
              className="w-full rounded-2xl bg-surface p-6 text-surface-foreground placeholder-surface-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary min-h-64"
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              variant="default"
              size="xl"
              className="w-full max-w-md cursor-pointer"
            >
              Submit
            </Button>
          </div>

          <div className="mt-6 flex justify-end">
            <NextArrow onClick={handleNext} disabled={false} label="Next" />
          </div>
        </>
      )}

      {step === "decision" && (
        <>
          <div className="mb-12 items-center flex flex-col gap-4">
            <Button
              onClick={handleApprove}
              variant="default"
              size="xl"
              className="w-full cursor-pointer"
            >
              Approve
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              size="xl"
              className="w-full cursor-pointer"
            >
              Reject
            </Button>
          </div>

          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href={`/reviewer/project/${type}`}>Back</Link>
            </Button>
          </div>

          <div className="mt-6 flex justify-end">
            <NextArrow disabled={true} label="Next" />
          </div>
        </>
      )}

      {step === "submitted" && (
        <>
          <div className="mb-12 flex flex-col items-center gap-6 rounded-3xl bg-primary p-12 text-primary-foreground">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/20">
              <Check className="h-8 w-8" />
            </div>
            <p className="text-center text-xl font-semibold">
              Review Submitted
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/reviewer">Back to Dashboard</Link>
            </Button>
          </div>

          <div className="mt-6 flex justify-end">
            <NextArrow href="/reviewer" label="Finish" />
          </div>
        </>
      )}
    </div>
  );
}
