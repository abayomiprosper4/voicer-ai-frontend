"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader, NextArrow } from "@/components/dashboard/ui";
import { CircularPlayer } from "@/components/dashboard/CircularPlayer";
import type { Submission } from "@/lib/mock/submissions";

type ReviewState = "idle" | "approving" | "rejecting" | "completed";

interface ReviewSurfaceProps {
  submission: Submission;
  nextHref: string;
  nextLabel: string;
}

/**
 * Review surface for reviewers to listen to and evaluate submissions.
 *
 * States: idle → approving/rejecting → completed
 *
 * Displays submission info, audio player, and approval/rejection controls.
 */
export function ReviewSurface({
  submission,
  nextHref,
  nextLabel,
}: ReviewSurfaceProps) {
  const [state, setState] = useState<ReviewState>("idle");
  const [feedback, setFeedback] = useState("");

  const handleApprove = () => {
    setState("approving");
    // Simulate approval
    setTimeout(() => setState("completed"), 800);
  };

  const handleReject = () => {
    setState("rejecting");
    // Simulate rejection
    setTimeout(() => setState("completed"), 800);
  };

  const isReviewComplete = state === "completed";
  const isDeciding = state === "approving" || state === "rejecting";

  // Create a mock audio blob URL for playback (since we don't have real audio in mock)
  // In production, this would come from the submission object
  const mockAudioUrl = submission.id
    ? `data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==`
    : "";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <SectionHeader
        title={
          state === "completed"
            ? "Review Submitted"
            : state === "approving" || state === "rejecting"
              ? "Submitting Review"
              : "Review Submission"
        }
        backHref="/reviewer/queue"
      />

      {/* Submission Info */}
      <div className="mb-8 rounded-2xl bg-surface p-6 text-surface-foreground">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium opacity-70">Language</p>
            <p className="text-sm font-semibold">{submission.language}</p>
          </div>
          <div>
            <p className="text-xs font-medium opacity-70">Type</p>
            <p className="text-sm font-semibold capitalize">
              {submission.type}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium opacity-70">Duration</p>
            <p className="text-sm font-semibold">{submission.durationSecs}s</p>
          </div>
          <div>
            <p className="text-xs font-medium opacity-70">Submission</p>
            <p className="text-sm font-semibold">{submission.when}</p>
          </div>
        </div>
        <div className="mt-4 border-t border-surface pt-4">
          <p className="text-xs font-medium opacity-70">Prompt</p>
          <p className="mt-2 text-sm">{submission.prompt}</p>
        </div>
      </div>

      {/* Player */}
      <div className="mb-8 flex flex-col items-center gap-8">
        <CircularPlayer
          src={mockAudioUrl}
          fallbackSecs={submission.durationSecs}
        />
        <p className="text-center text-sm text-muted-foreground">
          Listen to the submission
        </p>
      </div>

      {/* Feedback Section */}
      {!isReviewComplete && !isDeciding && (
        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Feedback (optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add notes about this submission..."
            className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>
      )}

      {/* Action Buttons */}
      {!isReviewComplete && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleApprove}
            variant="default"
            size="xl"
            disabled={isDeciding}
            className="flex-1"
          >
            {state === "approving" ? (
              <>
                <Check className="h-5 w-5" />
                Approving...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                Approve
              </>
            )}
          </Button>
          <Button
            onClick={handleReject}
            variant="destructive"
            size="xl"
            disabled={isDeciding}
            className="flex-1"
          >
            {state === "rejecting" ? (
              <>
                <X className="h-5 w-5" />
                Rejecting...
              </>
            ) : (
              <>
                <X className="h-5 w-5" />
                Reject
              </>
            )}
          </Button>
        </div>
      )}

      {/* Completion State */}
      {isReviewComplete && (
        <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl bg-surface p-6 text-surface-foreground">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-6 w-6" />
          </div>
          <p className="text-center font-semibold">
            Review has been submitted successfully
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button asChild variant="outline" size="lg">
          <Link href="/reviewer/queue">Back to queue</Link>
        </Button>
        {isReviewComplete && <NextArrow href={nextHref} label={nextLabel} />}
      </div>
    </div>
  );
}
